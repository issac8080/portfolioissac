import { redirect } from "next/navigation";

/** Old URL: same experience now opens the in-page résumé modal on the home route. */
export default function ResumeStudyLegacyRedirect() {
  redirect("/?resumeStudy=1");
}
