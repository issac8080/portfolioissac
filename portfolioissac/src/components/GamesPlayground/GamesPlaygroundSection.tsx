"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Play } from "lucide-react";
import GameModal from "./GameModal";
import { GAMES, getBestScore, setBestScore, type GameId } from "@/data/gamesData";
import SnakeGame from "./games/SnakeGame";
import SudokuGame from "./games/SudokuGame";
import TicTacToeGame from "./games/TicTacToeGame";
import ChessGame from "./games/ChessGame";
import MemoryMatchGame from "./games/MemoryMatchGame";
import BinaryTapGame from "./games/BinaryTapGame";
import NeuralMazeGame from "./games/NeuralMazeGame";

const GAME_COMPONENTS: Record<GameId, React.ComponentType<{ onScore?: (score: number) => void }>> = {
  snake: SnakeGame,
  sudoku: SudokuGame,
  tictactoe: TicTacToeGame,
  chess: ChessGame,
  memory: MemoryMatchGame,
  "binary-tap": BinaryTapGame,
  "neural-maze": NeuralMazeGame,
};

function GameCard({
  id,
  name,
  difficulty,
  storageKey,
  bestScore,
  onPlay,
}: {
  id: GameId;
  name: string;
  difficulty: string;
  storageKey: string;
  bestScore: number | null;
  onPlay: () => void;
}) {
  return (
    <motion.article
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="glass rounded-xl border border-ai-border p-5 flex flex-col gap-3"
    >
      <h3 className="text-lg font-semibold text-white">{name}</h3>
      <p className="text-xs text-ai-muted">Difficulty: {difficulty}</p>
      {bestScore != null && (
        <p className="text-sm text-ai-glow">Best: {bestScore}</p>
      )}
      <button
        type="button"
        onClick={onPlay}
        className="mt-auto flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-ai-glow/15 text-ai-glow hover:bg-ai-glow/25 transition-colors touch-manipulation"
      >
        <Play className="w-4 h-4" />
        Play
      </button>
    </motion.article>
  );
}

export default function GamesPlaygroundSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [selectedGameId, setSelectedGameId] = useState<GameId | null>(null);
  const [bestScores, setBestScores] = useState<Record<string, number | null>>({});

  useEffect(() => {
    const next: Record<string, number | null> = {};
    GAMES.forEach((g) => {
      next[g.storageKey] = getBestScore(g.storageKey);
    });
    setBestScores(next);
  }, [selectedGameId]);

  const GameContent = selectedGameId ? GAME_COMPONENTS[selectedGameId] : null;
  const meta = selectedGameId ? GAMES.find((g) => g.id === selectedGameId) : null;

  return (
    <section
      id="games"
      ref={ref}
      className="relative py-24 md:py-32 overflow-visible"
      data-cinematic-reveal
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl md:text-4xl font-bold text-white mb-2 font-[var(--font-space-grotesk)]"
        >
          Games Playground
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-ai-muted mb-12"
        >
          Classic micro-games — play in-browser, no backend. Best scores saved locally.
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {GAMES.map((game) => (
            <GameCard
              key={game.id}
              id={game.id}
              name={game.name}
              difficulty={game.difficulty}
              storageKey={game.storageKey}
              bestScore={bestScores[game.storageKey] ?? null}
              onPlay={() => setSelectedGameId(game.id)}
            />
          ))}
        </div>
      </div>

      <GameModal gameId={selectedGameId} onClose={() => setSelectedGameId(null)}>
        {GameContent && meta && (
          <GameContent
            onScore={(score) => {
              const prev = getBestScore(meta.storageKey);
              if (prev == null || score > prev) {
                setBestScore(meta.storageKey, score);
                setBestScores((s) => ({ ...s, [meta.storageKey]: score }));
              }
            }}
          />
        )}
      </GameModal>
    </section>
  );
}
