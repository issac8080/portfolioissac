"use client";

import { useState, useCallback, useMemo } from "react";

type Piece = "K" | "Q" | "R" | "B" | "N" | "P" | "k" | "q" | "r" | "b" | "n" | "p";
type Square = Piece | null;
type Board = Square[][];

const INIT: Board = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

function isWhite(p: Piece): boolean {
  return p === p.toUpperCase();
}

function getLegalMoves(board: Board, fromR: number, fromC: number): [number, number][] {
  const piece = board[fromR][fromC];
  if (!piece) return [];
  const white = isWhite(piece);
  const moves: [number, number][] = [];
  const add = (r: number, c: number) => {
    if (r < 0 || r > 7 || c < 0 || c > 7) return;
    const target = board[r][c];
    if (!target) moves.push([r, c]);
    else if (isWhite(target) !== white) moves.push([r, c]);
  };
  if (piece === "P" || piece === "p") {
    const pawnDir = white ? -1 : 1;
    const startRow = white ? 6 : 1;
    add(fromR + pawnDir, fromC);
    if (fromR === startRow) add(fromR + 2 * pawnDir, fromC);
    const capL = board[fromR + pawnDir]?.[fromC - 1];
    const capR = board[fromR + pawnDir]?.[fromC + 1];
    if (capL && isWhite(capL) !== white) add(fromR + pawnDir, fromC - 1);
    if (capR && isWhite(capR) !== white) add(fromR + pawnDir, fromC + 1);
    return moves;
  }
  const rays = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  const knightDeltas = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
  if (piece === "N" || piece === "n") {
    knightDeltas.forEach(([dr, dc]) => add(fromR + dr, fromC + dc));
    return moves;
  }
  const limit = ["K", "k"].includes(piece) ? 1 : 8;
  const dirs = (piece === "B" || piece === "b") ? rays.slice(4) : (piece === "R" || piece === "r") ? rays.slice(0, 4) : rays;
  dirs.forEach(([dr, dc]) => {
    for (let step = 1; step <= limit; step++) {
      const r = fromR + dr * step;
      const c = fromC + dc * step;
      if (r < 0 || r > 7 || c < 0 || c > 7) break;
      const target = board[r][c];
      if (!target) moves.push([r, c]);
      else {
        if (isWhite(target) !== white) moves.push([r, c]);
        break;
      }
    }
  });
  return moves;
}

const SYMBOLS: Record<Piece, string> = {
  K: "\u2654", Q: "\u2655", R: "\u2656", B: "\u2657", N: "\u2658", P: "\u2659",
  k: "\u265A", q: "\u265B", r: "\u265C", b: "\u265D", n: "\u265E", p: "\u265F",
};

export default function ChessGame({ onScore }: { onScore?: (score: number) => void }) {
  const [board, setBoard] = useState<Board>(() => INIT.map((row) => [...row]));
  const [whiteTurn, setWhiteTurn] = useState(true);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [moves, setMoves] = useState(0);

  const legalMoves = useMemo(() => {
    if (!selected) return [];
    return getLegalMoves(board, selected[0], selected[1]);
  }, [board, selected]);

  const handleSquare = useCallback((r: number, c: number) => {
    const piece = board[r][c];
    if (selected) {
      const [sr, sc] = selected;
      const isLegal = legalMoves.some(([mr, mc]) => mr === r && mc === c);
      if (isLegal) {
        const newBoard = board.map((row) => [...row]);
        newBoard[r][c] = newBoard[sr][sc];
        newBoard[sr][sc] = null;
        setBoard(newBoard);
        setWhiteTurn((w) => !w);
        setMoves((m) => m + 1);
        setSelected(null);
        return;
      }
      if (piece && isWhite(piece) === whiteTurn) {
        setSelected([r, c]);
        return;
      }
      setSelected(null);
      return;
    }
    if (piece && isWhite(piece) === whiteTurn) setSelected([r, c]);
  }, [board, selected, legalMoves, whiteTurn]);

  const reset = () => {
    setBoard(INIT.map((row) => [...row]));
    setWhiteTurn(true);
    setSelected(null);
    setMoves(0);
  };

  const cellSize = "min(9vw, 44px)";
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <p className="text-ai-muted text-sm">
        {whiteTurn ? "White" : "Black"} to move - Moves: {moves}
      </p>
      <div
        className="inline-grid gap-0 border-2 border-ai-border rounded-lg overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(8, ${cellSize})`,
          gridTemplateRows: `repeat(8, ${cellSize})`,
        }}
      >
        {Array.from({ length: 64 }, (_, i) => {
          const r = Math.floor(i / 8);
          const c = i % 8;
          const dark = (r + c) % 2 === 1;
          const piece = board[r][c];
          const isSelected = selected?.[0] === r && selected?.[1] === c;
          const isLegal = legalMoves.some(([mr, mc]) => mr === r && mc === c);
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleSquare(r, c)}
              className={`flex items-center justify-center text-2xl touch-manipulation border border-transparent
                ${dark ? "bg-ai-surface" : "bg-ai-bg"}
                ${isSelected ? "ring-2 ring-ai-glow" : ""}
                ${isLegal && !piece ? "bg-ai-glow/20" : ""}
                ${isLegal && piece ? "ring-2 ring-red-400/50" : ""}`}
              style={{ width: cellSize, height: cellSize, minWidth: cellSize, minHeight: cellSize }}
            >
              {piece ? SYMBOLS[piece] : isLegal ? "\u2022" : ""}
            </button>
          );
        })}
      </div>
      <button type="button" onClick={reset} className="px-6 py-2 rounded-lg bg-ai-glow/20 text-ai-glow touch-manipulation">
        Reset
      </button>
    </div>
  );
}
