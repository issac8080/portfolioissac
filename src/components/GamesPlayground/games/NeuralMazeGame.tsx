"use client";

import { useState, useCallback, useMemo } from "react";

const ROWS = 5;
const COLS = 6;
const START: [number, number] = [0, 0];
const END: [number, number] = [ROWS - 1, COLS - 1];

function generateMaze(): boolean[][] {
  const grid = Array(ROWS)
    .fill(0)
    .map(() => Array(COLS).fill(true));
  grid[START[0]][START[1]] = false;
  grid[END[0]][END[1]] = false;
  const blockCount = 6 + Math.floor(Math.random() * 6);
  let placed = 0;
  while (placed < blockCount) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if ((r === START[0] && c === START[1]) || (r === END[0] && c === END[1])) continue;
    if (!grid[r][c]) continue;
    grid[r][c] = false;
    placed++;
  }
  return grid;
}

function canReachEnd(grid: boolean[][], start: [number, number]): boolean {
  const visited = Array(ROWS)
    .fill(0)
    .map(() => Array(COLS).fill(false));
  const stack: [number, number][] = [start];
  while (stack.length) {
    const [r, c] = stack.pop()!;
    if (r === END[0] && c === END[1]) return true;
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;
    if (!grid[r][c] || visited[r][c]) continue;
    visited[r][c] = true;
    stack.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]);
  }
  return false;
}

export default function NeuralMazeGame({ onScore }: { onScore?: (score: number) => void }) {
  const [grid, setGrid] = useState(() => {
    let g = generateMaze();
    while (!canReachEnd(g, START)) g = generateMaze();
    return g;
  });
  const [pos, setPos] = useState<[number, number]>(START);
  const [won, setWon] = useState(false);
  const [moves, setMoves] = useState(0);

  const move = useCallback(
    (dr: number, dc: number) => {
      if (won) return;
      const [r, c] = pos;
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return;
      if (!grid[nr][nc]) return;
      setPos([nr, nc]);
      setMoves((m) => m + 1);
      if (nr === END[0] && nc === END[1]) {
        setWon(true);
        const score = Math.max(10, 200 - (moves + 1));
        onScore?.(score);
      }
    },
    [pos, grid, won, moves, onScore]
  );

  const newMaze = () => {
    let g = generateMaze();
    while (!canReachEnd(g, START)) g = generateMaze();
    setGrid(g);
    setPos(START);
    setWon(false);
    setMoves(0);
  };

  const cellSize = "clamp(40px, 12vw, 52px)";
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <p className="text-ai-muted text-sm">Moves: {moves} · Reach the output node</p>
      <div
        className="inline-grid gap-1 border-2 border-ai-border rounded-lg p-2 bg-ai-bg"
        style={{
          gridTemplateColumns: `repeat(${COLS}, ${cellSize})`,
          gridTemplateRows: `repeat(${ROWS}, ${cellSize})`,
        }}
      >
        {Array.from({ length: ROWS * COLS }, (_, i) => {
          const r = Math.floor(i / COLS);
          const c = i % COLS;
          const blocked = !grid[r][c];
          const isStart = r === START[0] && c === START[1];
          const isEnd = r === END[0] && c === END[1];
          const isPos = r === pos[0] && c === pos[1];
          return (
            <div
              key={i}
              className={`rounded-lg flex items-center justify-center text-lg font-mono touch-manipulation
                ${blocked ? "bg-red-900/40 border border-red-500/50" : "bg-ai-surface border border-ai-border"}
                ${isStart ? "bg-ai-glow/20 text-ai-glow" : ""}
                ${isEnd ? "bg-ai-accent/20 text-ai-accent" : ""}
                ${isPos ? "ring-2 ring-ai-glow" : ""}`}
              style={{ width: cellSize, height: cellSize, minWidth: cellSize, minHeight: cellSize }}
            >
              {isPos ? "●" : isStart ? "S" : isEnd ? "E" : blocked ? "✕" : ""}
            </div>
          );
        })}
      </div>
      {!won && (
        <div className="grid grid-cols-3 gap-2 place-items-center">
          <div />
          <button
            type="button"
            onClick={() => move(-1, 0)}
            className="min-w-[48px] min-h-[48px] w-12 h-12 rounded-lg bg-ai-surface border border-ai-border text-ai-glow touch-manipulation flex items-center justify-center active:scale-95 transition-transform"
          >
            ↑
          </button>
          <div />
          <button
            type="button"
            onClick={() => move(0, -1)}
            className="min-w-[48px] min-h-[48px] w-12 h-12 rounded-lg bg-ai-surface border border-ai-border text-ai-glow touch-manipulation flex items-center justify-center active:scale-95 transition-transform"
          >
            ←
          </button>
          <div />
          <button
            type="button"
            onClick={() => move(0, 1)}
            className="min-w-[48px] min-h-[48px] w-12 h-12 rounded-lg bg-ai-surface border border-ai-border text-ai-glow touch-manipulation flex items-center justify-center active:scale-95 transition-transform"
          >
            →
          </button>
          <div />
          <button
            type="button"
            onClick={() => move(1, 0)}
            className="min-w-[48px] min-h-[48px] w-12 h-12 rounded-lg bg-ai-surface border border-ai-border text-ai-glow touch-manipulation flex items-center justify-center active:scale-95 transition-transform"
          >
            ↓
          </button>
          <div />
        </div>
      )}
      {won && <p className="text-ai-glow">You reached the output! Score: {Math.max(10, 200 - moves)}</p>}
      <button
        type="button"
        onClick={newMaze}
        className="px-6 py-2 rounded-lg bg-ai-glow/20 text-ai-glow touch-manipulation"
      >
        New Maze
      </button>
    </div>
  );
}
