"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

/** Syn Cole — Feel Good (NCS) in `public/`, or `NEXT_PUBLIC_AMBIENT_MUSIC_PATH`. */
function getAmbientMusicPublicSrc(): string {
  const fromEnv = process.env.NEXT_PUBLIC_AMBIENT_MUSIC_PATH?.trim();
  if (fromEnv) return fromEnv.startsWith("/") ? fromEnv : `/${fromEnv}`;
  const file =
    "Syn Cole - Feel Good  Future House  NCS - Copyright Free Music.mp3";
  return `/${encodeURIComponent(file)}`;
}

const AMBIENT_SRC = getAmbientMusicPublicSrc();

export default function AmbientMusicFab() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.loop = true;
    const onEnded = () => {
      try {
        el.currentTime = 0;
        void el.play();
      } catch {
        /* ignore */
      }
    };
    el.addEventListener("ended", onEnded);
    return () => el.removeEventListener("ended", onEnded);
  }, []);

  useEffect(() => {
    return () => {
      const a = audioRef.current;
      if (a) {
        a.pause();
        a.removeAttribute("src");
        a.load();
      }
    };
  }, []);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    setLoadError(false);

    if (el.paused) {
      el.volume = 0.32;
      if (!el.src) {
        el.src = AMBIENT_SRC;
      }
      void el.play().then(
        () => {
          setPlaying(true);
          setLoadError(false);
        },
        () => {
          setPlaying(false);
          setLoadError(true);
        }
      );
    } else {
      el.pause();
      setPlaying(false);
    }
  }, []);

  return (
    <div
      className={cn(
        "fixed z-[65] flex flex-col items-center gap-1",
        "max-md:left-[max(0.75rem,env(safe-area-inset-left))] max-md:right-auto max-md:bottom-[calc(5.75rem+3.5rem+0.5rem)]",
        "md:bottom-[calc(2rem+3.5rem+0.5rem)] md:right-8 md:left-auto"
      )}
    >
      <audio
        ref={audioRef}
        loop
        preload="none"
        className="hidden"
        playsInline
        onEnded={() => {
          const el = audioRef.current;
          if (!el) return;
          el.currentTime = 0;
          void el.play().catch(() => setPlaying(false));
        }}
        onError={() => {
          setLoadError(true);
          setPlaying(false);
        }}
      />
      <motion.button
        type="button"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        onClick={toggle}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full border-2 backdrop-blur-md transition-colors duration-200",
          playing
            ? [
                "border-lime-400 bg-lime-500/20 text-lime-200",
                "shadow-[0_0_0_1px_rgba(163,230,53,0.35),0_0_36px_rgba(132,204,22,0.55)]",
              ]
            : [
                "border-zinc-600 bg-zinc-900/85 text-zinc-500",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
              ],
          loadError && "cursor-not-allowed opacity-50 border-rose-900/60 text-rose-400/80"
        )}
        aria-label={
          loadError
            ? "Music unavailable"
            : playing
              ? "Music on — tap to turn off"
              : "Music off — tap to turn on"
        }
        aria-pressed={playing}
        title={
          loadError
            ? "Could not load audio — check the file is in /public with the expected name"
            : playing
              ? "Music is on — tap to stop"
              : "Music is off — tap to play"
        }
      >
        {playing ? (
          <Volume2 className="h-7 w-7 text-lime-200 drop-shadow-[0_0_10px_rgba(190,242,100,0.9)]" aria-hidden />
        ) : (
          <VolumeX className="h-6 w-6 text-zinc-500" aria-hidden />
        )}
      </motion.button>
      <span
        className={cn(
          "select-none text-[10px] font-semibold uppercase tracking-widest",
          playing ? "text-lime-300" : "text-zinc-500",
          loadError && "text-rose-400/90"
        )}
        aria-hidden
      >
        {loadError ? "Unavailable" : playing ? "On" : "Off"}
      </span>
    </div>
  );
}
