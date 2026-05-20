export type GameId =
  | "snake"
  | "sudoku"
  | "tictactoe"
  | "chess"
  | "memory"
  | "binary-tap"
  | "neural-maze";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type GameCategory = "reflex" | "logic" | "strategy";

export interface GameMeta {
  id: GameId;
  name: string;
  difficulty: Difficulty;
  storageKey: string;
  category: GameCategory;
}

export const GAMES: GameMeta[] = [
  { id: "snake", name: "Snake", difficulty: "Easy", storageKey: "games-snake-best", category: "reflex" },
  { id: "sudoku", name: "Sudoku", difficulty: "Medium", storageKey: "games-sudoku-best", category: "logic" },
  { id: "tictactoe", name: "Tic Tac Toe", difficulty: "Easy", storageKey: "games-tictactoe-best", category: "strategy" },
  { id: "chess", name: "Chess", difficulty: "Hard", storageKey: "games-chess-best", category: "strategy" },
  { id: "memory", name: "Memory Match", difficulty: "Easy", storageKey: "games-memory-best", category: "logic" },
  { id: "binary-tap", name: "Binary Tap", difficulty: "Medium", storageKey: "games-binary-tap-best", category: "reflex" },
  { id: "neural-maze", name: "Neural Maze", difficulty: "Medium", storageKey: "games-neural-maze-best", category: "logic" },
];

export function getBestScore(storageKey: string): number | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(storageKey);
    if (v == null) return null;
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function setBestScore(storageKey: string, score: number): void {
  try {
    localStorage.setItem(storageKey, String(score));
  } catch {
    // ignore
  }
}
