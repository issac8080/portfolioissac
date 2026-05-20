"use client";

/**
 * Low-poly wireframe ridge silhouette + reflective floor band — pure SVG/CSS, GPU-friendly.
 */
export default function HeroWireframeTerrain() {
  return (
    <div
      className="absolute inset-x-0 bottom-0 top-[42%] z-[11] pointer-events-none overflow-hidden"
      aria-hidden
    >
      <svg
        className="absolute left-1/2 bottom-0 w-[min(140%,1200px)] -translate-x-1/2 opacity-[0.35]"
        viewBox="0 0 1200 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <linearGradient id="wire-grid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,255,136,0.45)" />
            <stop offset="100%" stopColor="rgba(0,212,255,0.12)" />
          </linearGradient>
        </defs>
        <path
          d="M0 220 L120 160 L240 200 L360 140 L480 180 L600 120 L720 170 L840 130 L960 190 L1080 150 L1200 200 L1200 320 L0 320 Z"
          stroke="url(#wire-grid)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
          fill="rgba(0,255,136,0.03)"
        />
        <path
          d="M0 240 L140 200 L280 230 L420 175 L560 215 L700 155 L840 205 L980 165 L1120 210 L1200 185"
          stroke="rgba(0,212,255,0.35)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          fill="none"
        />
        <path
          d="M0 260 L180 235 L360 255 L520 220 L680 248 L860 228 L1040 250 L1200 235"
          stroke="rgba(0,255,136,0.22)"
          strokeWidth="0.9"
          vectorEffect="non-scaling-stroke"
          fill="none"
          strokeDasharray="6 10"
        />
      </svg>
      <div
        className="absolute inset-x-0 bottom-0 h-[38%] lab-reflective-floor"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,255,136,0.04) 40%, rgba(0,0,0,0.65) 100%), linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.06) 50%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, transparent, black 35%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 35%)",
        }}
      />
    </div>
  );
}
