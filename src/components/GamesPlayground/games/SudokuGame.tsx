"use client";

import { useState, useCallback, useMemo } from "react";

const N = 9;
const BOX = 3;

function generatePuzzle(): { grid: number[][]; solution: number[][] } {
  const grid = Array(N)
    .fill(0)
    .map(() => Array(N).fill(0));
  const solution = Array(N)
    .fill(0)
    .map(() => Array(N).fill(0));

  function valid(r: number, c: number, num: number): boolean {
    for (let i = 0; i < N; i++) if (grid[r][i] === num) return false;
    for (let i = 0; i < N; i++) if (grid[i][c] === num) return false;
    const br = Math.floor(r / BOX) * BOX;
    const bc = Math.floor(c / BOX) * BOX;
    for (let i = br; i < br + BOX; i++)
      for (let j = bc; j < bc + BOX; j++) if (grid[i][j] === num) return false;
    return true;
  }

  function solve(): boolean {
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (grid[r][c] !== 0) continue;
        for (let n = 1; n <= 9; n++) {
          if (!valid(r, c, n)) continue;
          grid[r][c] = n;
          if (solve()) return true;
          grid[r][c] = 0;
        }
        return false;
      }
    }
    return true;
  }
  solve();
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) solution[r][c] = grid[r][c];
  const toRemove = 45 + Math.floor(Math.random() * 15);
  let removed = 0;
  while (removed < toRemove) {
    const r = Math.floor(Math.random() * N);
    const c = Math.floor(Math.random() * N);
    if (grid[r][c] !== 0) {
      grid[r][c] = 0;
      removed++;
    }
  }
  return { grid, solution };
}

export default function SudokuGame({ onScore }: { onScore?: (score: number) => void }) {
  const { grid: initialGrid, solution } = useMemo(() => generatePuzzle(), []);
  const [grid, setGrid] = useState(() => initialGrid.map((row) => [...row]));
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [solved, setSolved] = useState(false);
  const [fixed] = useState(() =>
    initialGrid.map((row, r) => row.map((v, c) => v !== 0))
  );

  const checkWin = useCallback(() => {
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++) if (grid[r][c] !== solution[r][c]) return false;
    setSolved(true);
    const score = Math.max(0, 100 - mistakes * 10);
    onScore?.(score);
    return true;
  }, [grid, solution, mistakes, onScore]);

  const setCell = useCallback(
    (r: number, c: number, num: number) => {
      if (fixed[r][c] || solved) return;
      const newGrid = grid.map((row, i) =>
        row.map((v, j) => (i === r && j === c ? num : v))
      );
      if (num !== 0 && solution[r][c] !== num) {
        setMistakes((m) => m + 1);
      }
      setGrid(newGrid);
      setSelected(null);
      setTimeout(() => checkWin(), 0);
    },
    [grid, fixed, solution, solved, checkWin]
  );

  const newPuzzle = () => {
    const { grid: g } = generatePuzzle();
    setGrid(g.map((row) => [...row]));
    setMistakes(0);
    setSolved(false);
    setSelected(null);
  };

  const cellSize = "clamp(28px, 8vw, 40px)";
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md px-1">
      <div className="flex items-center justify-between w-full">
        <span className="text-ai-muted text-sm">Mistakes: {mistakes}</span>
        <button
          type="button"
          onClick={newPuzzle}
          className="px-4 py-2 rounded-lg bg-ai-glow/20 text-ai-glow touch-manipulation text-sm"
        >
          New Puzzle
        </button>
      </div>
      <div
        className="inline-grid gap-0 border-2 border-ai-border rounded-lg overflow-hidden bg-ai-bg"
        style={{
          gridTemplateColumns: `repeat(9, ${cellSize})`,
          gridTemplateRows: `repeat(9, ${cellSize})`,
        }}
      >
        {Array.from({ length: 81 }, (_, i) => {
          const r = Math.floor(i / 9);
          const c = i % 9;
          const v = grid[r][c];
          const isSelected = selected?.r === r && selected?.c === c;
          const isFixed = fixed[r][c];
          const isWrong = v !== 0 && solution[r][c] !== v;
          return (
            <button
              key={i}
              type="button"
              onClick={() => !isFixed && setSelected({ r, c })}
              className={`border border-ai-border/50 flex items-center justify-center text-lg font-mono touch-manipulation
                ${(c + 1) % 3 === 0 && c < 8 ? "border-r-2 border-ai-border" : ""}
                ${(r + 1) % 3 === 0 && r < 8 ? "border-b-2 border-ai-border" : ""}
                ${isSelected ? "bg-ai-glow/20 text-ai-glow" : "text-white"}
                ${isFixed ? "text-ai-muted" : ""}
                ${isWrong ? "bg-red-500/20 text-red-400" : ""}`}
              style={{ width: cellSize, height: cellSize, minWidth: cellSize, minHeight: cellSize }}
            >
              {v || ""}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-9 gap-2 w-full max-w-[min(90vw,320px)]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => selected && setCell(selected.r, selected.c, n)}
            className="aspect-square min-w-[44px] min-h-[44px] rounded-lg bg-ai-surface border border-ai-border text-white text-lg touch-manipulation flex items-center justify-center"
          >
            {n}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => selected && setCell(selected.r, selected.c, 0)}
        className="px-4 py-2 rounded-lg bg-ai-surface text-ai-muted touch-manipulation"
      >
        Clear
      </button>
      {solved && (
        <p className="text-ai-glow font-semibold">Solved! Score: {Math.max(0, 100 - mistakes * 10)}</p>
      )}
    </div>
  );
}
