"use client";

/** Fewer DOM nodes than the original 280 — same look, much less layout/paint cost. */
const STAR_COUNT = 100;

export default function HeroCyberEnvironment() {
  const stars = Array.from({ length: STAR_COUNT }, (_, i) => {
    const row = i % 10;
    const col = Math.floor(i / 10);
    return {
      id: i,
      left: `${(col * 7.2 + row * 2.9) % 99}%`,
      top: `${(row * 4.1 + (col % 6) * 1.7) % 99}%`,
      size: i % 9 === 0 ? 2.5 : 1 + (i % 4),
      opacity: 0.2 + (i % 9) * 0.08,
      teal: i % 5 === 0,
    };
  });

  return (
    <div
      data-rich-hero
      className="absolute inset-0 z-[12] pointer-events-none overflow-hidden select-none"
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 70% at 50% 18%, rgba(0,55,48,0.42) 0%, transparent 52%), linear-gradient(180deg, #030403 0%, #060a0c 55%, #020303 100%)",
        }}
      />

      <div
        className="lab-horizon-glow pointer-events-none absolute inset-x-[-20%] bottom-[-8%] h-[55%] opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 80% 42% at 50% 100%, rgba(0,255,136,0.22) 0%, rgba(0,212,255,0.08) 35%, transparent 70%)",
        }}
      />

      <div className="absolute inset-0">
        {stars.map((s) => (
          <span
            key={s.id}
            className={
              s.teal
                ? "absolute rounded-full shadow-[0_0_8px_rgba(0,255,204,0.55)]"
                : "absolute rounded-full bg-white shadow-[0_0_5px_rgba(255,255,255,0.45)]"
            }
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              background: s.teal ? "rgba(0,255,204,0.95)" : undefined,
            }}
          />
        ))}
      </div>

      <div
        className="absolute inset-0 mix-blend-screen opacity-[0.32]"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 30% 30%, rgba(0,255,136,0.11), transparent 60%), radial-gradient(ellipse 70% 45% at 70% 25%, rgba(0,255,204,0.07), transparent 55%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(3,5,6,0.2) 55%, rgba(0,0,0,0.75) 100%), radial-gradient(120% 80% at 50% 100%, rgba(0,255,136,0.06), transparent 55%)",
        }}
      />
    </div>
  );
}
