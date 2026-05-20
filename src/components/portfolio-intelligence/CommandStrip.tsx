"use client";

import { memo } from "react";
import {
  Cpu,
  FileText,
  MessageSquareText,
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  VolumeX,
  Cloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  engineeringMode: boolean;
  onToggleEngineering: () => void;
  interviewMode: boolean;
  onToggleInterview: () => void;
  openaiAvailable: boolean;
  openaiEnabled: boolean;
  onToggleOpenai: () => void;
  voiceSupported: boolean;
  listening: boolean;
  onVoice: () => void;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
  onTailoredResume: () => void;
  onAdvancedUnlock: () => void;
  advancedUnlocked: boolean;
};

export default memo(function CommandStrip({
  engineeringMode,
  onToggleEngineering,
  interviewMode,
  onToggleInterview,
  openaiAvailable,
  openaiEnabled,
  onToggleOpenai,
  voiceSupported,
  listening,
  onVoice,
  autoSpeak,
  onToggleAutoSpeak,
  onTailoredResume,
  onAdvancedUnlock,
  advancedUnlocked,
}: Props) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-t border-white/5 bg-black/20 px-2 py-1.5">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        disabled={!voiceSupported}
        onClick={onVoice}
        className={cn(
          "h-8 gap-1 px-2 text-[10px]",
          listening && "border border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
        )}
        aria-pressed={listening}
        title={voiceSupported ? "Voice input" : "Voice not supported"}
      >
        {listening ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
        Voice
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={onToggleAutoSpeak}
        className={cn("h-8 gap-1 px-2 text-[10px]", autoSpeak && "text-cyan-200")}
        aria-pressed={autoSpeak}
      >
        {autoSpeak ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
        AI read
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={onToggleInterview}
        className={cn(
          "h-8 gap-1 px-2 text-[10px]",
          interviewMode && "border border-fuchsia-500/35 bg-fuchsia-500/10 text-fuchsia-100"
        )}
        aria-pressed={interviewMode}
        title="Interview Issac AI — technical & architecture drills"
      >
        <MessageSquareText className="h-3.5 w-3.5" />
        Interview
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        disabled={!openaiAvailable}
        onClick={onToggleOpenai}
        className={cn(
          "h-8 gap-1 px-2 text-[10px]",
          openaiEnabled && "border border-sky-500/35 bg-sky-500/10 text-sky-100"
        )}
        aria-pressed={openaiEnabled}
        title={
          openaiAvailable
            ? openaiEnabled
              ? "GPT on: answers can use richer phrasing. Turn off for shorter, template-style replies."
              : "GPT off: concise replies from built-in patterns. Turn on for richer phrasing when you want it."
            : "Richer phrasing isn’t enabled in this build."
        }
      >
        <Cloud className="h-3.5 w-3.5" />
        GPT
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={onToggleEngineering}
        className={cn(
          "h-8 gap-1 px-2 text-[10px]",
          engineeringMode && "border border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
        )}
        aria-pressed={engineeringMode}
      >
        <Cpu className="h-3.5 w-3.5" />
        Eng
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={onTailoredResume}
        className="h-8 gap-1 px-2 text-[10px]"
      >
        <FileText className="h-3.5 w-3.5" />
        Résumé
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={onAdvancedUnlock}
        className={cn(
          "h-8 gap-1 px-2 text-[10px]",
          advancedUnlocked && "border border-violet-500/40 text-violet-100"
        )}
        aria-pressed={advancedUnlocked}
      >
        <Sparkles className="h-3.5 w-3.5" />
        Adv
      </Button>
    </div>
  );
});
