"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CELL = 16;
const TICK_MS = 120;
type Dir = "up" | "down" | "left" | "right";

export default function SnakeGame({ onScore }: { onScore?: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touchStart = useRef({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const dirRef = useRef<Dir>("right");
  const pendingDirRef = useRef<Dir | null>(null);
  const snakeRef = useRef<{ x: number; y: number }[]>([{ x: 2, y: 1 }, { x: 1, y: 1 }]);
  const foodRef = useRef({ x: 5, y: 5 });
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cols = Math.min(24, Math.floor((typeof window !== "undefined" ? window.innerWidth : 400) / CELL));
  const rows = Math.min(20, Math.floor((typeof window !== "undefined" ? window.innerHeight * 0.5 : 300) / CELL));

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = cols * CELL;
    const h = rows * CELL;
    canvas.width = w;
    canvas.height = h;
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, w, h);
    const snake = snakeRef.current;
    const food = foodRef.current;
    ctx.fillStyle = "#00ff88";
    snake.forEach((s) => { ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2); });
    ctx.fillStyle = "#00d4ff";
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
  }, [cols, rows]);

  const tick = useCallback(() => {
    if (gameOver) return;
    let dir = dirRef.current;
    if (pendingDirRef.current !== null) {
      const p = pendingDirRef.current;
      const opposite = (dir === "up" && p === "down") || (dir === "down" && p === "up") || (dir === "left" && p === "right") || (dir === "right" && p === "left");
      if (!opposite) dir = p;
      pendingDirRef.current = null;
    }
    dirRef.current = dir;
    const head = snakeRef.current[0];
    const next = { x: head.x, y: head.y };
    if (dir === "up") next.y--;
    if (dir === "down") next.y++;
    if (dir === "left") next.x--;
    if (dir === "right") next.x++;
    if (next.x < 0 || next.x >= cols || next.y < 0 || next.y >= rows) {
      setGameOver(true);
      onScore?.(score);
      return;
    }
    if (snakeRef.current.some((s) => s.x === next.x && s.y === next.y)) {
      setGameOver(true);
      onScore?.(score);
      return;
    }
    const newSnake = [next, ...snakeRef.current];
    const food = foodRef.current;
    if (next.x === food.x && next.y === food.y) {
      setScore((s) => s + 10);
      let nx = Math.floor(Math.random() * cols);
      let ny = Math.floor(Math.random() * rows);
      while (newSnake.some((s) => s.x === nx && s.y === ny)) {
        nx = Math.floor(Math.random() * cols);
        ny = Math.floor(Math.random() * rows);
      }
      foodRef.current = { x: nx, y: ny };
    } else {
      newSnake.pop();
    }
    snakeRef.current = newSnake;
    draw();
  }, [cols, rows, gameOver, score, onScore, draw]);

  useEffect(() => {
    if (!started || gameOver) return;
    const id = setInterval(tick, TICK_MS);
    tickRef.current = id;
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [started, gameOver, tick]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowUp") pendingDirRef.current = "up";
    if (e.key === "ArrowDown") pendingDirRef.current = "down";
    if (e.key === "ArrowLeft") pendingDirRef.current = "left";
    if (e.key === "ArrowRight") pendingDirRef.current = "right";
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const end = e.changedTouches[0];
    const dx = end.clientX - touchStart.current.x;
    const dy = end.clientY - touchStart.current.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      pendingDirRef.current = dx > 0 ? "right" : "left";
    } else {
      pendingDirRef.current = dy > 0 ? "down" : "up";
    }
  };

  const restart = () => {
    setGameOver(false);
    setScore(0);
    setStarted(true);
    dirRef.current = "right";
    pendingDirRef.current = null;
    snakeRef.current = [{ x: 2, y: 1 }, { x: 1, y: 1 }];
    foodRef.current = { x: 5, y: 5 };
    draw();
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg relative">
      <div className="flex items-center justify-between w-full">
        <span className="text-ai-glow font-mono">Score: {score}</span>
        {!started && (
          <button type="button" onClick={() => { setStarted(true); draw(); }} className="px-4 py-2 rounded-lg bg-ai-glow/20 text-ai-glow touch-manipulation">
            Start
          </button>
        )}
        {started && !gameOver && (
          <button type="button" onClick={restart} className="px-4 py-2 rounded-lg bg-ai-glow/20 text-ai-glow touch-manipulation">
            Restart
          </button>
        )}
      </div>
      <div className="border border-ai-border rounded-lg overflow-hidden touch-none" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <canvas ref={canvasRef} className="block max-w-full" style={{ maxHeight: "70vh" }} />
      </div>
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-2xl">
          <div className="bg-ai-bg border border-ai-border rounded-xl p-6 text-center">
            <p className="text-xl text-white mb-2">Game Over</p>
            <p className="text-ai-glow mb-4">Score: {score}</p>
            <button type="button" onClick={restart} className="px-6 py-2 rounded-lg bg-ai-glow/20 text-ai-glow touch-manipulation">
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
