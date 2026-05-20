"use client";

import AiTelemetryPanel from "@/components/ai-os/AiTelemetryPanel";

/**
 * Global AI OS chrome: compact telemetry HUD.
 * Ambient neural field is mounted inside `data-rich-page` on the home page so it
 * stacks beneath the existing grid / fog / parallax layers.
 */
export default function AiSystemShell() {
  return <AiTelemetryPanel />;
}
