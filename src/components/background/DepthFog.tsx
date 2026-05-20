"use client";

export default function DepthFog() {
  return (
    <div
      className="fixed inset-0 pointer-events-none will-change-transform"
      style={{ zIndex: 1 }}
      data-parallax-scroll="0.12"
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-28"
        style={{
          background: `
            linear-gradient(to bottom, transparent 0%, rgba(10, 10, 15, 0.3) 30%, transparent 50%),
            linear-gradient(to top, transparent 0%, rgba(10, 10, 15, 0.5) 40%, rgba(10, 10, 15, 0.8) 100%)
          `,
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 50% 100%, rgba(56, 249, 215, 0.04), transparent 55%),
            radial-gradient(ellipse 90% 60% at 20% 90%, rgba(196, 181, 253, 0.035), transparent 50%),
            radial-gradient(ellipse 90% 60% at 80% 85%, rgba(125, 211, 252, 0.03), transparent 50%)
          `,
        }}
      />
    </div>
  );
}
