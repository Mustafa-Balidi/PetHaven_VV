#!/usr/bin/env python3
"""Download the CrossEncoder reranker into a local folder, with plain HTTP.

Why this exists
---------------
`huggingface_hub`'s default transfer path (Xet) stalls at 0 bytes on some
networks — including the machine this was developed on — and a stall inside a
lazy model load is worse than a crash: it hangs the first `/ask` request
instead of degrading. Fetching the snapshot ahead of time over ordinary HTTPS
removes that failure mode entirely, and the reranker then loads from disk with
no network access at all.

Usage:
    PYTHONPATH=. python scripts/fetch_reranker_model.py
    PYTHONPATH=. python scripts/fetch_reranker_model.py --repo cross-encoder/... --force
"""
from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path

import requests

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from RAG_System.config import settings  # noqa: E402

# Everything a CrossEncoder needs: weights, config, tokenizer.
FILES = (
    "config.json",
    "model.safetensors",
    "tokenizer.json",
    "tokenizer_config.json",
    "special_tokens_map.json",
    "vocab.txt",
)

BASE = "https://huggingface.co/{repo}/resolve/main/{name}"


MAX_ATTEMPTS = 20


def _expected_size(url: str) -> int:
    head = requests.head(url, allow_redirects=True, timeout=30)
    head.raise_for_status()
    return int(head.headers.get("content-length") or 0)


def _stream_once(url: str, partial: Path, total: int) -> int:
    """Append one HTTP range request to `partial`. Returns bytes on disk."""
    have = partial.stat().st_size if partial.exists() else 0

    if total and have >= total:
        return have

    headers = {"Range": f"bytes={have}-"} if have else {}

    with requests.get(url, stream=True, timeout=60, headers=headers) as response:
        # 416 means the server thinks we already have all of it.
        if response.status_code == 416:
            return have
        response.raise_for_status()

        # A server that ignores Range restarts the file from zero.
        mode = "ab" if response.status_code == 206 else "wb"
        if mode == "wb":
            have = 0

        start = time.monotonic()
        session_bytes = 0
        last_report = 0.0

        with partial.open(mode) as handle:
            for chunk in response.iter_content(1 << 16):
                handle.write(chunk)
                session_bytes += len(chunk)

                now = time.monotonic()
                if total and now - last_report > 10:
                    last_report = now
                    done = have + session_bytes
                    rate = session_bytes / 1024 / max(now - start, 1e-6)
                    print(
                        f"  ...    {100 * done / total:5.1f}% "
                        f"({done:,}/{total:,}) {rate:,.0f} KB/s",
                        flush=True,
                    )

    return have + session_bytes


def download(repo: str, name: str, target: Path, force: bool) -> None:
    """Fetch one file, resuming across dropped connections.

    This network drops the 90 MB weight stream partway through, so a single
    `requests.get` is not enough: each attempt resumes with a Range request
    from whatever is already on disk instead of starting over.
    """
    if target.exists() and target.stat().st_size > 0 and not force:
        print(f"  skip   {name} ({target.stat().st_size:,} bytes already on disk)")
        return

    url = BASE.format(repo=repo, name=name)
    partial = target.with_suffix(target.suffix + ".partial")

    if force and partial.exists():
        partial.unlink()

    total = _expected_size(url)
    started = time.monotonic()

    for attempt in range(1, MAX_ATTEMPTS + 1):
        try:
            done = _stream_once(url, partial, total)
        except requests.RequestException as exc:
            done = partial.stat().st_size if partial.exists() else 0
            print(f"  retry  {name} attempt {attempt}: {exc} (have {done:,})", flush=True)
            time.sleep(min(2 * attempt, 15))
            continue

        if not total or done >= total:
            partial.replace(target)
            print(
                f"  ok     {name} ({done:,} bytes in "
                f"{time.monotonic() - started:.1f}s, {attempt} attempt(s))",
                flush=True,
            )
            return

        print(
            f"  resume {name} attempt {attempt}: {done:,}/{total:,}",
            flush=True,
        )
        time.sleep(1)

    raise RuntimeError(
        f"{name}: gave up after {MAX_ATTEMPTS} attempts "
        f"({partial.stat().st_size:,}/{total:,} bytes)"
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--repo", default=settings.RERANKER_MODEL)
    parser.add_argument("--out", default=str(settings.RERANKER_MODEL_PATH))
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    print(f"Fetching {args.repo} -> {out}")
    for name in FILES:
        download(args.repo, name, out / name, args.force)

    print(f"\nDone. Reranker will load from {out}")


if __name__ == "__main__":
    main()
