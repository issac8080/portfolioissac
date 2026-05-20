"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Recognition = SpeechRecognition;

function getRecognition(): Recognition | null {
  if (typeof window === "undefined") return null;
  const SR = (
    window as unknown as {
      SpeechRecognition?: new () => Recognition;
      webkitSpeechRecognition?: new () => Recognition;
    }
  ).SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: new () => Recognition }).webkitSpeechRecognition;
  if (!SR) return null;
  return new SR();
}

export function usePortfolioVoice() {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recRef = useRef<Recognition | null>(null);

  useEffect(() => {
    setSupported(!!getRecognition());
  }, []);

  const stop = useCallback(() => {
    try {
      recRef.current?.stop();
    } catch {
      /* */
    }
    recRef.current = null;
    setListening(false);
  }, []);

  const listenOnce = useCallback(
    (onResult: (text: string) => void, onError?: (msg: string) => void) => {
      const R = getRecognition();
      if (!R) {
        onError?.("Voice input is not supported in this browser.");
        return;
      }
      stop();
      const r = R;
      r.lang = "en-US";
      r.interimResults = false;
      r.maxAlternatives = 1;
      r.continuous = false;
      r.onresult = (ev: SpeechRecognitionEvent) => {
        const text = ev.results[0]?.[0]?.transcript?.trim() ?? "";
        if (text) onResult(text);
        setListening(false);
      };
      r.onerror = () => {
        onError?.("Voice capture failed.");
        setListening(false);
      };
      r.onend = () => setListening(false);
      recRef.current = r;
      setListening(true);
      try {
        r.start();
      } catch {
        setListening(false);
        onError?.("Could not start microphone.");
      }
    },
    [stop]
  );

  const speak = useCallback((text: string, opts?: { rate?: number; pitch?: number }) => {
    if (typeof window === "undefined" || !text.trim()) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.slice(0, 4000));
    u.rate = opts?.rate ?? 1;
    u.pitch = opts?.pitch ?? 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => /en-GB|en-US/.test(v.lang) && v.name.toLowerCase().includes("google")) ??
      voices.find((v) => v.lang.startsWith("en"));
    if (preferred) u.voice = preferred;
    window.speechSynthesis.speak(u);
  }, []);

  const cancelSpeech = useCallback(() => {
    if (typeof window !== "undefined") window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  return { supported, listening, listenOnce, stop, speak, cancelSpeech };
}
