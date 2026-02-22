"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { GameId } from "@/data/gamesData";

const GAME_MODAL_CONTENT_CLASS =
  "w-full h-full max-w-4xl max-h-[90vh] min-h-[min(90vh,400px)] overflow-hidden flex flex-col glass rounded-2xl border border-ai-border shadow-2xl";

export default function GameModal({
  gameId,
  onClose,
  children,
}: {
  gameId: GameId | null;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!gameId) return;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [gameId, handleEscape]);

  if (!gameId) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Game"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative ${GAME_MODAL_CONTENT_CLASS}`}
        >
          <div className="flex items-center justify-end gap-2 p-3 border-b border-ai-border bg-ai-bg/95 backdrop-blur-md shrink-0 rounded-t-2xl min-h-[52px]">
            <button
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] p-2 rounded-lg text-ai-muted hover:text-white hover:bg-ai-glow/10 active:bg-ai-glow/20 transition-colors touch-manipulation flex items-center justify-center"
              aria-label="Close game"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col items-center justify-start sm:justify-center p-4 pb-8" style={{ WebkitOverflowScrolling: "touch" }}>
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
