"use client";

import { useState, useCallback, useRef, useEffect } from "react";

function randomBits(length: number): number[] {
  return Array.from({ length }, () => (Math.random() < 0.5 ? 0 : 1));
}

export default function BinaryTapGame({ onScore }: { onScore?: (score: number) => void }) {
  const [level, setLevel] = useState(3);
  const [pattern, setPattern] = useState<number[]>(() => randomBits(3));
  const [input, setInput] = useState<number[]>([]);
  const [wrong, setWrong] = useState(false);
  const [score, setScore] = useState(0);
  const showPattern = useRef(true);

  useEffect(() => {
    setPattern(randomBits(level));
    setInput([]);
    setWrong(false);
    showPattern.current = true;
    const t = setTimeout(() => { showPattern.current = false; }, 1500 + level * 200);
    return () => clearTimeout(t);
  }, [level]);

  const tap = useCallback((bit: 0 | 1) => {
    if (showPattern.current) return;
    const next = [...input, bit];
    setInput(next);
    if (next.length === pattern.length) {
      const correct = next.every((b, i) => b === pattern[i]);
      if (correct) {
        setScore((s) => s + level * 10);
        onScore?.(score + level * 10);
        setLevel((l) => Math.min(8, l + 1));
      } else {
        setWrong(true);
        onScore?.(score);
        setTimeout(() => { setLevel(3); setScore(0); setWrong(false); }, 1500);
      }
    }
  }, [input, pattern, level, score, onScore]);

  const reset = () => {
    setLevel(3); setScore(0); setWrong(false);
    setPattern(randomBits(3)); setInput([]);
    showPattern.current = true;
    setTimeout(() => { showPattern.current = false; }, 1500);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      <p className="text-ai-glow font-mono">Level: {level} - Score: {score}</p>
      <p className="text-ai-muted text-sm">{showPattern.current ? "Memorize the pattern" : "Tap the same pattern"}</p>
      <div className="flex gap-3 flex-wrap justify-center">
        {pattern.map((b, i) => (
          <span key={i} className={`w-12 h-12 rounded-lg flex items-center justify-center font-mono text-xl ${showPattern.current ? "bg-ai-glow/30 text-white" : "bg-ai-surface text-ai-muted"} ${!showPattern.current && input[i] !== undefined ? (input[i] === b ? "bg-ai-glow/20 text-ai-glow" : "bg-red-500/20 text-red-400") : ""}`}>
            {showPattern.current ? b : input[i] ?? "?"}
          </span>
        ))}
      </div>
      {!showPattern.current && !wrong && (
        <div className="flex gap-4">
          <button type="button" onClick={() => tap(0)} className="w-16 h-16 rounded-lg bg-ai-surface border border-ai-border text-2xl font-mono text-white touch-manipulation">0</button>
          <button type="button" onClick={() => tap(1)} className="w-16 h-16 rounded-lg bg-ai-surface border border-ai-border text-2xl font-mono text-white touch-manipulation">1</button>
        </div>
      )}
      {wrong && <p className="text-red-400">Wrong! Final score: {score}</p>}
      <button type="button" onClick={reset} className="px-6 py-2 rounded-lg bg-ai-glow/20 text-ai-glow touch-manipulation">Restart</button>
    </div>
  );
}
