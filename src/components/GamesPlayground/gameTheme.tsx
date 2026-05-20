"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { GameId } from "@/data/gamesData";

/** Per-game UI accents (Tailwind utility strings + canvas hex). */
export type GameUiTheme = {
  text: string;
  /** Second accent (goals, partner color, maze exit, etc.) */
  accentText: string;
  accentBg20: string;
  bg15: string;
  bg20: string;
  bg25: string;
  bg30: string;
  ring: string;
  cardBorder: string;
  cardButton: string;
  canvasPrimary: string;
  canvasSecondary: string;
  modalBarBorder: string;
  modalCloseHover: string;
  /** HUD-style card chrome */
  hudGlow: string;
  borderNeonTop: string;
  borderNeonBottom: string;
  difficultyDot: string;
  playHudButton: string;
};

const DEFAULT_THEME: GameUiTheme = {
  text: "text-teal-300",
  accentText: "text-cyan-300",
  accentBg20: "bg-cyan-400/20",
  bg15: "bg-teal-300/15",
  bg20: "bg-teal-300/20",
  bg25: "bg-teal-300/25",
  bg30: "bg-teal-300/30",
  ring: "ring-teal-300",
  cardBorder: "border-teal-300/30",
  cardButton: "bg-teal-300/15 text-teal-300 hover:bg-teal-300/25",
  canvasPrimary: "#2dd4bf",
  canvasSecondary: "#fbbf24",
  modalBarBorder: "border-teal-400/25",
  modalCloseHover: "hover:bg-teal-400/10 active:bg-teal-400/20",
  hudGlow: "shadow-[0_0_32px_rgba(45,212,191,0.22)]",
  borderNeonTop: "border-t-2 border-teal-400/75",
  borderNeonBottom: "border-b-2 border-teal-400/55",
  difficultyDot: "bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.85)]",
  playHudButton:
    "border border-teal-400/45 bg-teal-500/15 text-teal-100 hover:bg-teal-500/30 shadow-[0_0_18px_rgba(45,212,191,0.18)]",
};

const GAME_UI_THEMES: Record<GameId, GameUiTheme> = {
  snake: {
    text: "text-emerald-400",
    accentText: "text-lime-300",
    accentBg20: "bg-lime-400/20",
    bg15: "bg-emerald-400/15",
    bg20: "bg-emerald-400/20",
    bg25: "bg-emerald-400/25",
    bg30: "bg-emerald-400/30",
    ring: "ring-emerald-400",
    cardBorder: "border-emerald-400/35",
    cardButton: "bg-emerald-400/15 text-emerald-300 hover:bg-emerald-400/25",
    canvasPrimary: "#34d399",
    canvasSecondary: "#fbbf24",
    modalBarBorder: "border-emerald-500/30",
    modalCloseHover: "hover:bg-emerald-400/10 active:bg-emerald-400/20",
    hudGlow: "shadow-[0_0_36px_rgba(52,211,153,0.28)]",
    borderNeonTop: "border-t-2 border-emerald-400/85",
    borderNeonBottom: "border-b-2 border-emerald-400/60",
    difficultyDot: "bg-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.95)]",
    playHudButton:
      "border border-emerald-400/50 bg-emerald-500/15 text-emerald-100 hover:bg-emerald-500/30 shadow-[0_0_22px_rgba(52,211,153,0.25)]",
  },
  sudoku: {
    text: "text-sky-400",
    accentText: "text-indigo-400",
    accentBg20: "bg-indigo-400/20",
    bg15: "bg-sky-400/15",
    bg20: "bg-sky-400/20",
    bg25: "bg-sky-400/25",
    bg30: "bg-sky-400/30",
    ring: "ring-sky-400",
    cardBorder: "border-sky-400/35",
    cardButton: "bg-sky-400/15 text-sky-200 hover:bg-sky-400/25",
    canvasPrimary: "#38bdf8",
    canvasSecondary: "#e0f2fe",
    modalBarBorder: "border-sky-500/30",
    modalCloseHover: "hover:bg-sky-400/10 active:bg-sky-400/20",
    hudGlow: "shadow-[0_0_34px_rgba(56,189,248,0.28)]",
    borderNeonTop: "border-t-2 border-sky-400/85",
    borderNeonBottom: "border-b-2 border-sky-400/55",
    difficultyDot: "bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.9)]",
    playHudButton:
      "border border-sky-400/50 bg-sky-500/15 text-sky-100 hover:bg-sky-500/30 shadow-[0_0_22px_rgba(56,189,248,0.22)]",
  },
  tictactoe: {
    text: "text-violet-400",
    accentText: "text-pink-400",
    accentBg20: "bg-pink-400/20",
    bg15: "bg-violet-400/15",
    bg20: "bg-violet-400/20",
    bg25: "bg-violet-400/25",
    bg30: "bg-violet-400/30",
    ring: "ring-violet-400",
    cardBorder: "border-violet-400/35",
    cardButton: "bg-violet-400/15 text-violet-200 hover:bg-violet-400/25",
    canvasPrimary: "#a78bfa",
    canvasSecondary: "#f0abfc",
    modalBarBorder: "border-violet-500/30",
    modalCloseHover: "hover:bg-violet-400/10 active:bg-violet-400/20",
    hudGlow: "shadow-[0_0_36px_rgba(167,139,250,0.28)]",
    borderNeonTop: "border-t-2 border-violet-400/85",
    borderNeonBottom: "border-b-2 border-fuchsia-500/50",
    difficultyDot: "bg-fuchsia-400 shadow-[0_0_12px_rgba(232,121,249,0.85)]",
    playHudButton:
      "border border-violet-400/50 bg-violet-500/15 text-violet-100 hover:bg-violet-500/30 shadow-[0_0_22px_rgba(167,139,250,0.22)]",
  },
  chess: {
    text: "text-amber-400",
    accentText: "text-orange-400",
    accentBg20: "bg-orange-400/20",
    bg15: "bg-amber-400/15",
    bg20: "bg-amber-400/20",
    bg25: "bg-amber-400/25",
    bg30: "bg-amber-400/30",
    ring: "ring-amber-400",
    cardBorder: "border-amber-400/35",
    cardButton: "bg-amber-400/15 text-amber-200 hover:bg-amber-400/25",
    canvasPrimary: "#fbbf24",
    canvasSecondary: "#fde68a",
    modalBarBorder: "border-amber-500/30",
    modalCloseHover: "hover:bg-amber-400/10 active:bg-amber-400/20",
    hudGlow: "shadow-[0_0_36px_rgba(251,191,36,0.28)]",
    borderNeonTop: "border-t-2 border-amber-400/90",
    borderNeonBottom: "border-b-2 border-amber-500/55",
    difficultyDot: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]",
    playHudButton:
      "border border-amber-400/50 bg-amber-500/15 text-amber-100 hover:bg-amber-500/30 shadow-[0_0_22px_rgba(251,191,36,0.22)]",
  },
  memory: {
    text: "text-fuchsia-400",
    accentText: "text-rose-400",
    accentBg20: "bg-rose-400/20",
    bg15: "bg-fuchsia-400/15",
    bg20: "bg-fuchsia-400/20",
    bg25: "bg-fuchsia-400/25",
    bg30: "bg-fuchsia-400/30",
    ring: "ring-fuchsia-400",
    cardBorder: "border-fuchsia-400/35",
    cardButton: "bg-fuchsia-400/15 text-fuchsia-200 hover:bg-fuchsia-400/25",
    canvasPrimary: "#e879f9",
    canvasSecondary: "#fda4af",
    modalBarBorder: "border-fuchsia-500/30",
    modalCloseHover: "hover:bg-fuchsia-400/10 active:bg-fuchsia-400/20",
    hudGlow: "shadow-[0_0_36px_rgba(232,121,249,0.28)]",
    borderNeonTop: "border-t-2 border-fuchsia-400/85",
    borderNeonBottom: "border-b-2 border-rose-500/45",
    difficultyDot: "bg-fuchsia-400 shadow-[0_0_12px_rgba(232,121,249,0.9)]",
    playHudButton:
      "border border-fuchsia-400/50 bg-fuchsia-500/15 text-fuchsia-100 hover:bg-fuchsia-500/30 shadow-[0_0_22px_rgba(232,121,249,0.22)]",
  },
  "binary-tap": {
    text: "text-lime-400",
    accentText: "text-cyan-400",
    accentBg20: "bg-cyan-400/20",
    bg15: "bg-lime-400/15",
    bg20: "bg-lime-400/20",
    bg25: "bg-lime-400/25",
    bg30: "bg-lime-400/30",
    ring: "ring-lime-400",
    cardBorder: "border-lime-400/35",
    cardButton: "bg-lime-400/15 text-lime-200 hover:bg-lime-400/25",
    canvasPrimary: "#a3e635",
    canvasSecondary: "#22d3ee",
    modalBarBorder: "border-lime-500/30",
    modalCloseHover: "hover:bg-lime-400/10 active:bg-lime-400/20",
    hudGlow: "shadow-[0_0_36px_rgba(163,230,53,0.28)]",
    borderNeonTop: "border-t-2 border-lime-400/85",
    borderNeonBottom: "border-b-2 border-cyan-400/55",
    difficultyDot: "bg-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.95)]",
    playHudButton:
      "border border-lime-400/50 bg-lime-500/15 text-lime-100 hover:bg-lime-500/30 shadow-[0_0_22px_rgba(163,230,53,0.22)]",
  },
  "neural-maze": {
    text: "text-cyan-400",
    accentText: "text-fuchsia-400",
    accentBg20: "bg-fuchsia-400/20",
    bg15: "bg-cyan-400/15",
    bg20: "bg-cyan-400/20",
    bg25: "bg-cyan-400/25",
    bg30: "bg-cyan-400/30",
    ring: "ring-cyan-400",
    cardBorder: "border-cyan-400/35",
    cardButton: "bg-cyan-400/15 text-cyan-100 hover:bg-cyan-400/25",
    canvasPrimary: "#22d3ee",
    canvasSecondary: "#e879f9",
    modalBarBorder: "border-cyan-500/30",
    modalCloseHover: "hover:bg-cyan-400/10 active:bg-cyan-400/20",
    hudGlow: "shadow-[0_0_36px_rgba(34,211,238,0.28)]",
    borderNeonTop: "border-t-2 border-cyan-400/85",
    borderNeonBottom: "border-b-2 border-fuchsia-500/45",
    difficultyDot: "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]",
    playHudButton:
      "border border-cyan-400/50 bg-cyan-500/15 text-cyan-100 hover:bg-cyan-500/30 shadow-[0_0_22px_rgba(34,211,238,0.22)]",
  },
};

const GameThemeContext = createContext<GameUiTheme>(DEFAULT_THEME);

export function GameThemeProvider({
  gameId,
  children,
}: {
  gameId: GameId;
  children: ReactNode;
}) {
  const value = GAME_UI_THEMES[gameId] ?? DEFAULT_THEME;
  return <GameThemeContext.Provider value={value}>{children}</GameThemeContext.Provider>;
}

export function useGameUiTheme() {
  return useContext(GameThemeContext);
}

export function getGameCardTheme(gameId: GameId): GameUiTheme {
  return GAME_UI_THEMES[gameId] ?? DEFAULT_THEME;
}
