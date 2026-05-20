/** Neon HUD accents for project cards — cycles by card index (games playground parity). */
export type ProjectHudAccent = {
  borderNeonTop: string;
  borderNeonBottom: string;
  hudGlow: string;
  dot: string;
  titleAccent: string;
  techChip: string;
  ctaRow: string;
};

const ACCENTS: ProjectHudAccent[] = [
  {
    borderNeonTop: "border-t-2 border-emerald-400/85",
    borderNeonBottom: "border-b-2 border-emerald-400/55",
    hudGlow: "shadow-[0_0_32px_rgba(52,211,153,0.28)]",
    dot: "bg-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.95)]",
    titleAccent: "text-emerald-200",
    techChip: "border border-emerald-400/35 bg-emerald-500/10 text-emerald-100/95",
    ctaRow: "border-t border-emerald-500/25",
  },
  {
    borderNeonTop: "border-t-2 border-sky-400/85",
    borderNeonBottom: "border-b-2 border-cyan-400/50",
    hudGlow: "shadow-[0_0_32px_rgba(56,189,248,0.26)]",
    dot: "bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.9)]",
    titleAccent: "text-sky-200",
    techChip: "border border-sky-400/35 bg-sky-500/10 text-sky-100/95",
    ctaRow: "border-t border-sky-500/25",
  },
  {
    borderNeonTop: "border-t-2 border-violet-400/85",
    borderNeonBottom: "border-b-2 border-fuchsia-500/45",
    hudGlow: "shadow-[0_0_32px_rgba(167,139,250,0.26)]",
    dot: "bg-fuchsia-400 shadow-[0_0_12px_rgba(232,121,249,0.85)]",
    titleAccent: "text-violet-200",
    techChip: "border border-violet-400/35 bg-violet-500/10 text-violet-100/95",
    ctaRow: "border-t border-violet-500/25",
  },
  {
    borderNeonTop: "border-t-2 border-amber-400/90",
    borderNeonBottom: "border-b-2 border-amber-500/55",
    hudGlow: "shadow-[0_0_32px_rgba(251,191,36,0.26)]",
    dot: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]",
    titleAccent: "text-amber-200",
    techChip: "border border-amber-400/35 bg-amber-500/10 text-amber-100/95",
    ctaRow: "border-t border-amber-500/25",
  },
  {
    borderNeonTop: "border-t-2 border-fuchsia-400/85",
    borderNeonBottom: "border-b-2 border-rose-500/45",
    hudGlow: "shadow-[0_0_32px_rgba(232,121,249,0.26)]",
    dot: "bg-fuchsia-400 shadow-[0_0_12px_rgba(244,114,182,0.85)]",
    titleAccent: "text-fuchsia-200",
    techChip: "border border-fuchsia-400/35 bg-fuchsia-500/10 text-fuchsia-100/95",
    ctaRow: "border-t border-fuchsia-500/25",
  },
  {
    borderNeonTop: "border-t-2 border-cyan-400/85",
    borderNeonBottom: "border-b-2 border-teal-500/45",
    hudGlow: "shadow-[0_0_32px_rgba(34,211,238,0.26)]",
    dot: "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]",
    titleAccent: "text-cyan-200",
    techChip: "border border-cyan-400/35 bg-cyan-500/10 text-cyan-100/95",
    ctaRow: "border-t border-cyan-500/25",
  },
];

export function getProjectHudAccent(index: number): ProjectHudAccent {
  return ACCENTS[Math.abs(index) % ACCENTS.length]!;
}
