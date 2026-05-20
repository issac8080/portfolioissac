"use client";

import { useState, useEffect, useRef, useMemo, type ComponentType } from "react";
import { motion, useInView } from "framer-motion";
import {
  Play,
  Trophy,
  Gamepad2,
  Zap,
  WifiOff,
  BarChart3,
  Layers,
  Sparkles,
  Grid3x3,
  CircleDot,
  Crown,
  Brain,
  Binary,
  Network,
  Dices,
  Shuffle,
} from "lucide-react";
import { siteSectionClass, SITE_SECTION_INNER } from "@/lib/siteSectionLayout";
import GameModal from "./GameModal";
import {
  GAMES,
  getBestScore,
  setBestScore,
  type GameId,
  type GameCategory,
} from "@/data/gamesData";
import { getGameCardTheme } from "./gameTheme";
import { cn } from "@/lib/utils";
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

const GAME_ICONS: Record<GameId, ComponentType<{ className?: string }>> = {
  snake: Sparkles,
  sudoku: Grid3x3,
  tictactoe: CircleDot,
  chess: Crown,
  memory: Brain,
  "binary-tap": Binary,
  "neural-maze": Network,
};

const FILTER_CHIPS: { id: "all" | GameCategory; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: "all", label: "All games", icon: Gamepad2 },
  { id: "reflex", label: "Reflex", icon: Zap },
  { id: "logic", label: "Logic", icon: Brain },
  { id: "strategy", label: "Strategy", icon: Dices },
];

function GameCard({
  id,
  name,
  difficulty,
  bestScore,
  onPlay,
}: {
  id: GameId;
  name: string;
  difficulty: string;
  bestScore: number | null;
  onPlay: () => void;
}) {
  const t = getGameCardTheme(id);
  const Icon = GAME_ICONS[id];

  return (
    <motion.article
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative flex flex-col gap-3 overflow-hidden rounded-xl border-x border-white/[0.08] bg-[rgba(6,8,14,0.78)] p-4 backdrop-blur-md sm:p-5",
        t.borderNeonTop,
        t.borderNeonBottom,
        t.hudGlow
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.06) 45%, transparent 90%)",
        }}
      />
      <div className="relative flex flex-col items-center gap-2">
        <div
          className={cn(
            "flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-lg border bg-black/50",
            t.cardBorder
          )}
          style={{
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.45)",
          }}
        >
          <Icon className={cn("h-6 w-6", t.text)} aria-hidden />
        </div>
        <h3 className="text-center text-base font-bold tracking-tight text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.12)]">
          {name}
        </h3>
      </div>

      <div className="relative flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-wider text-ai-muted">
        <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", t.difficultyDot)} aria-hidden />
        <span>{difficulty}</span>
      </div>

      <p className={cn("relative text-center font-mono text-2xl font-bold tabular-nums", t.text)}>
        {bestScore != null ? bestScore : "—"}
        <span className="ml-1 text-[10px] font-normal uppercase tracking-widest text-ai-muted">best</span>
      </p>

      <button
        type="button"
        onClick={onPlay}
        className={cn(
          "relative mt-auto flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold uppercase tracking-wide transition-all touch-manipulation",
          t.playHudButton
        )}
      >
        <Play className="h-4 w-4 shrink-0 fill-current" aria-hidden />
        Play
      </button>
    </motion.article>
  );
}

function RandomPickCard({ poolSize, onRoll }: { poolSize: number; onRoll: () => void }) {
  return (
    <motion.article
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative flex flex-col gap-3 overflow-hidden rounded-xl border-x border-white/[0.08] bg-[rgba(6,8,14,0.78)] p-4 backdrop-blur-md sm:p-5",
        "border-t-2 border-fuchsia-400/85 border-b-2 border-violet-500/55",
        "shadow-[0_0_36px_rgba(232,121,249,0.28)]"
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.06) 45%, transparent 90%)",
        }}
      />
      <div className="relative flex flex-col items-center gap-2">
        <div
          className="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-lg border border-fuchsia-400/40 bg-black/50"
          style={{
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.45), 0 0 18px rgba(232,121,249,0.35)",
          }}
        >
          <Dices className="h-6 w-6 text-fuchsia-300" aria-hidden />
        </div>
        <h3 className="text-center text-base font-bold tracking-tight text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.12)]">
          Random pick
        </h3>
      </div>

      <div className="relative flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-wider text-ai-muted">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-400 shadow-[0_0_12px_rgba(232,121,249,0.9)]"
          aria-hidden
        />
        <span>Lucky draw</span>
      </div>

      <p className="relative text-center font-mono text-2xl font-bold tabular-nums text-fuchsia-200">
        {poolSize > 0 ? String(poolSize).padStart(2, "0") : "—"}
        <span className="ml-1 text-[10px] font-normal uppercase tracking-widest text-ai-muted">in pool</span>
      </p>

      <button
        type="button"
        onClick={onRoll}
        disabled={poolSize < 1}
        className={cn(
          "relative mt-auto flex w-full items-center justify-center gap-2 rounded-lg border border-fuchsia-400/50 bg-fuchsia-500/15 py-2.5 text-sm font-semibold uppercase tracking-wide text-fuchsia-100 shadow-[0_0_22px_rgba(232,121,249,0.22)] transition-all touch-manipulation",
          "hover:bg-fuchsia-500/30 disabled:cursor-not-allowed disabled:opacity-40"
        )}
      >
        <Shuffle className="h-4 w-4 shrink-0" aria-hidden />
        Roll
      </button>
    </motion.article>
  );
}

export default function GamesPlaygroundSection({
  onGameModalOpenChange,
}: {
  onGameModalOpenChange?: (open: boolean) => void;
} = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [selectedGameId, setSelectedGameId] = useState<GameId | null>(null);
  const [bestScores, setBestScores] = useState<Record<string, number | null>>({});
  const [filter, setFilter] = useState<"all" | GameCategory>("all");

  useEffect(() => {
    onGameModalOpenChange?.(selectedGameId != null);
  }, [selectedGameId, onGameModalOpenChange]);

  useEffect(() => {
    const next: Record<string, number | null> = {};
    GAMES.forEach((g) => {
      next[g.storageKey] = getBestScore(g.storageKey);
    });
    setBestScores(next);
  }, [selectedGameId]);

  const filteredGames = useMemo(
    () => (filter === "all" ? GAMES : GAMES.filter((g) => g.category === filter)),
    [filter]
  );

  const globalBest = useMemo(() => {
    let max = 0;
    let any = false;
    GAMES.forEach((g) => {
      const v = bestScores[g.storageKey];
      if (v != null && v > max) {
        max = v;
        any = true;
      }
    });
    return any ? max : null;
  }, [bestScores]);

  const GameContent = selectedGameId ? GAME_COMPONENTS[selectedGameId] : null;
  const meta = selectedGameId ? GAMES.find((g) => g.id === selectedGameId) : null;

  const randomGame = () => {
    const pool = filteredGames.length ? filteredGames : GAMES;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) setSelectedGameId(pick.id);
  };

  return (
    <section
      id="games"
      ref={ref}
      className={siteSectionClass("overflow-visible")}
      data-cinematic-reveal
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(rgba(56,249,215,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(125,211,252,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 88%)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent" aria-hidden />

      <div className={cn(SITE_SECTION_INNER, "relative pb-12")}>
        <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300/90">
              Lab break
            </p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="mb-3 bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-lime-200 bg-clip-text font-[var(--font-space-grotesk)] text-3xl font-black uppercase tracking-tight text-transparent drop-shadow-[0_0_24px_rgba(56,249,215,0.25)] md:text-5xl md:leading-tight"
            >
              Games playground
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="max-w-xl text-sm leading-relaxed text-ai-muted md:text-base"
            >
              Quick reflex & logic demos — local scores only, no backend. A neon break between case studies.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            className="relative w-full shrink-0 overflow-hidden rounded-xl border border-cyan-400/25 bg-black/50 p-4 shadow-[0_0_40px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:max-w-sm"
          >
            <div className="games-hud-shimmer pointer-events-none absolute inset-0 opacity-30" aria-hidden />
            <p className="relative mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200/90">
              Lab status
            </p>
            <div className="relative grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                <div className="mb-1 flex items-center gap-1.5 text-[10px] text-ai-muted">
                  <Gamepad2 className="h-3.5 w-3.5 text-cyan-300" aria-hidden />
                  Total games
                </div>
                <p className="font-mono text-xl font-bold text-white">{String(GAMES.length).padStart(2, "0")}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                <div className="mb-1 flex items-center gap-1.5 text-[10px] text-ai-muted">
                  <Trophy className="h-3.5 w-3.5 text-amber-300" aria-hidden />
                  Best score
                </div>
                <p className="font-mono text-xl font-bold text-amber-200">{globalBest ?? "—"}</p>
              </div>
            </div>
            <div className="relative mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400/60 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.9)]" />
              </span>
              <span className="text-[11px] font-medium text-lime-200/95">All systems go</span>
            </div>
          </motion.div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {FILTER_CHIPS.map((chip) => {
            const active = filter === chip.id;
            const ChipIcon = chip.icon;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setFilter(chip.id)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all",
                  active
                    ? "border-cyan-400/60 bg-cyan-500/15 text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.25)]"
                    : "border-white/10 bg-black/30 text-ai-muted hover:border-white/20 hover:text-white/90"
                )}
              >
                <ChipIcon className="h-3.5 w-3.5" aria-hidden />
                {chip.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              id={game.id}
              name={game.name}
              difficulty={game.difficulty}
              bestScore={bestScores[game.storageKey] ?? null}
              onPlay={() => setSelectedGameId(game.id)}
            />
          ))}
          <RandomPickCard poolSize={filteredGames.length} onRoll={randomGame} />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-ai-muted sm:justify-between">
          <span className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-lime-400" aria-hidden />
            Local only
          </span>
          <span className="flex items-center gap-2">
            <WifiOff className="h-3.5 w-3.5 text-cyan-400" aria-hidden />
            Offline ready
          </span>
          <span className="flex items-center gap-2">
            <BarChart3 className="h-3.5 w-3.5 text-violet-400" aria-hidden />
            Best scores
          </span>
          <span className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-fuchsia-400" aria-hidden />
            No backend
          </span>
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
