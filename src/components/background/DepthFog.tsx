"use client";

export default function DepthFog() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            linear-gradient(to bottom, transparent 0%, rgba(10, 10, 15, 0.3) 30%, transparent 50%),
            linear-gradient(to top, transparent 0%, rgba(10, 10, 15, 0.5) 40%, rgba(10, 10, 15, 0.8) 100%)
          `,
        }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse 120% 80% at 50% 100%, rgba(0, 255, 136, 0.03), transparent 60%)",
        }}
      />
    </div>
  );
}
