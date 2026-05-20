/**
 * Canonical resume PDF served from `/public`.
 * Place your file as `public/issac_sunny_resume.pdf`, or set `NEXT_PUBLIC_RESUME_PDF_PATH`.
 */

export const RESUME_PDF_PUBLIC_PATH =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_RESUME_PDF_PATH?.trim()) ||
  "/issac_sunny_resume.pdf";

export const RESUME_DOWNLOAD_FILENAME = "Issac_Sunny_Resume.pdf";

/** Download the static PDF with a stable filename (blob path avoids some browsers ignoring `download`). */
export async function downloadResumePdfAsset(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const res = await fetch(RESUME_PDF_PUBLIC_PATH);
    if (!res.ok) throw new Error(String(res.status));
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = RESUME_DOWNLOAD_FILENAME;
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch {
    window.open(RESUME_PDF_PUBLIC_PATH, "_blank", "noopener,noreferrer");
  }
}
