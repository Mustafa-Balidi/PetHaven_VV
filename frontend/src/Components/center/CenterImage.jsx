import { useState } from "react";

export default function CenterImage({ src, alt, className, fallback }) {
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) return fallback ?? null;

  return <img src={src} alt={alt} className={className} onError={() => setFailedSrc(src)} />;
}
