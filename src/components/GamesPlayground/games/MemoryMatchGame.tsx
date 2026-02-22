"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const PAIRS = 8;
const SYMBOLS = ["A", "B", "C", "D", "E", "F", "G", "H"];

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function MemoryMatchGame({ onScore }: { onScore?: (score: number) => void }) {
  const [cards] = useState(() => shuffle(SYMBOLS.slice(0, PAIRS).flatMap((e) => [e, e])));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<Set<number>>(new Set());
  const [startTime] = useState(() => Date.now());
  const [done, setDone] = useState(false);
  const lockRef = useRef(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 500);
    return () => clearInterval(id);
  }, [startTime, done]);

  const tryFlip = useCallback((index: number) => {
    if (lockRef.current || solved.has(index) || flipped.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      lockRef.current = true;
      const [a, b] = newFlipped;
      if (cards[a] === cards[b]) {
        setSolved((s) => new Set(Array.from(s).concat(a, b)));
        setFlipped([]);
        lockRef.current = false;
        if (solved.size + 2 === PAIRS * 2) {
          setDone(true);
          const time = Math.floor((Date.now() - startTime) / 1000);
          onScore?.(Math.max(1, 500 - time * 5));
        }
      } else {
        setTimeout(() => { setFlipped([]); lockRef.current = false; }, 600);
      }
    }
  }, [cards, flipped, solved, startTime, onScore]);

  const reset = () => { setFlipped([]); setSolved(new Set()); setDone(false); };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <p className="text-ai-glow font-mono">Time: {elapsed}s</p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-[min(95vw,320px)]">
        {cards.map((sym, i) => {
          const isFlipped = flipped.includes(i) || solved.has(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => tryFlip(i)}
              className="aspect-square min-w-[56px] min-h-[56px] rounded-lg bg-ai-surface border border-ai-border text-xl sm:text-2xl font-bold flex items-center justify-center touch-manipulation text-white active:scale-95 transition-transform"
            >
              {isFlipped ? sym : "?"}
            </button>
          );
        })}
      </div>
      {done && <p className="text-ai-glow">Done in {elapsed}s!</p>}
      <button type="button" onClick={reset} className="px-6 py-2 rounded-lg bg-ai-glow/20 text-ai-glow touch-manipulation">New Game</button>
    </div>
  );
}
