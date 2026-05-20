"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useGameUiTheme } from "../gameTheme";

type Cell = "X" | "O" | null;

function checkWinner(board: Cell[]): Cell | "draw" | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  if (board.every((c) => c !== null)) return "draw";
  return null;
}

function minimax(board: Cell[], isMax: boolean): number {
  const winner = checkWinner(board);
  if (winner === "O") return 1;
  if (winner === "X") return -1;
  if (winner === "draw") return 0;
  let best = isMax ? -10 : 10;
  for (let i = 0; i < 9; i++) {
    if (board[i] !== null) continue;
    board[i] = isMax ? "O" : "X";
    const score = minimax(board, !isMax);
    board[i] = null;
    best = isMax ? Math.max(best, score) : Math.min(best, score);
  }
  return best;
}

function aiMove(board: Cell[]): number {
  let bestScore = -10;
  let move = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i] !== null) continue;
    board[i] = "O";
    const score = minimax(board, false);
    board[i] = null;
    if (score > bestScore) {
      bestScore = score;
      move = i;
    }
  }
  return move;
}

export default function TicTacToeGame({ onScore }: { onScore?: (score: number) => void }) {
  const theme = useGameUiTheme();
  const [board, setBoard] = useState<Cell[]>(() => Array(9).fill(null));
  const [xTurn, setXTurn] = useState(true);

  const winner = useMemo(() => checkWinner(board), [board]);

  const makeMove = useCallback(
    (i: number) => {
      if (board[i] !== null || winner) return;
      const newBoard = [...board];
      newBoard[i] = xTurn ? "X" : "O";
      setBoard(newBoard);
      setXTurn(!xTurn);
      const w = checkWinner(newBoard);
      if (w === "X") onScore?.(100);
      if (w === "draw") onScore?.(10);
    },
    [board, xTurn, winner, onScore]
  );

  useEffect(() => {
    if (winner || xTurn) return;
    const move = aiMove([...board]);
    if (move >= 0) {
      const timer = setTimeout(() => {
        const newBoard = [...board];
        newBoard[move] = "O";
        setBoard(newBoard);
        setXTurn(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [board, xTurn, winner]);

  const reset = () => {
    setBoard(Array(9).fill(null));
    setXTurn(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <p className="text-ai-muted text-sm">
        {winner ? (winner === "draw" ? "Draw!" : `${winner} wins!`) : xTurn ? "Your turn (X)" : "AI (O)..."}
      </p>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {board.map((cell, i) => (
          <button
            key={i}
            type="button"
            onClick={() => makeMove(i)}
            className={`min-w-[64px] min-h-[64px] w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-ai-surface border border-ai-border text-2xl font-bold touch-manipulation flex items-center justify-center active:scale-95 transition-transform
              ${cell === "X" ? theme.text : cell === "O" ? theme.accentText : "text-white"}`}
          >
            {cell ?? ""}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={reset}
        className={`px-6 py-2 rounded-lg ${theme.bg20} ${theme.text} touch-manipulation`}
      >
        Reset
      </button>
    </div>
  );
}
