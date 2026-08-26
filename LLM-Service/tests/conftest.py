import os
from pathlib import Path

from dotenv import load_dotenv

_ENV_PATH = Path(__file__).resolve().parent.parent / ".env"

if _ENV_PATH.exists():
    load_dotenv(_ENV_PATH)
else:
    os.environ.setdefault("OPENROUTER_API_KEY", "test-key")