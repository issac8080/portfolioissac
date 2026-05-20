/**
 * Default: Syn Cole — Feel Good (NCS) MP3 placed in `public/`.
 * Override with `NEXT_PUBLIC_AMBIENT_MUSIC_PATH` (e.g. `/audio/feel-good.mp3`).
 */
const DEFAULT_PUBLIC_FILENAME =
  "Syn Cole - Feel Good  Future House  NCS - Copyright Free Music.mp3";

export function getAmbientMusicPublicSrc(): string {
  const fromEnv = process.env.NEXT_PUBLIC_AMBIENT_MUSIC_PATH?.trim();
  if (fromEnv) {
    return fromEnv.startsWith("/") ? fromEnv : `/${fromEnv}`;
  }
  return `/${encodeURIComponent(DEFAULT_PUBLIC_FILENAME)}`;
}
