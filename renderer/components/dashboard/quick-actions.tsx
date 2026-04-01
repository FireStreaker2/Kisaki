"use client";

import { Volume2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "./settings-context";
import { useI18n } from "@/lib/i18n/i18n-context";
import { cn } from "@/lib/utils";

export function QuickActions() {
  const { voiceConfig, reducedMotion, personality, soundEffects } =
    useSettings();
  const { t } = useI18n();

  const resolveBrowserVoice = (voiceId: string): SpeechSynthesisVoice | null => {
    if (!("speechSynthesis" in globalThis)) return null;
    const voices = globalThis.speechSynthesis.getVoices();
    if (!voices.length) return null;

    const loweredId = voiceId.toLowerCase();
    const locale = loweredId.split("-neural")[0] ?? "";
    const localeParts = locale.split("-");
    const lang = localeParts[0];
    const region = localeParts[1];

    return (
      voices.find((v) => v.name.toLowerCase().includes(loweredId)) ??
      voices.find((v) => v.voiceURI.toLowerCase().includes(loweredId)) ??
      voices.find((v) => v.lang.toLowerCase() === locale) ??
      voices.find((v) =>
        region
          ? v.lang.toLowerCase().startsWith(`${lang}-${region}`)
          : v.lang.toLowerCase().startsWith(lang)
      ) ??
      null
    );
  };

  const actions = [
    {
      label: t.quickActions.testVoice,
      icon: Volume2,
      onClick: () => {
        if (!soundEffects || !voiceConfig.enabled) return;

        if (typeof window !== "undefined" && "electronAPI" in window) {
          window.electronAPI.speakText({
            text: `Hello! I am ${personality.name}, your desktop companion.`,
            voice: voiceConfig.voice,
            speed: voiceConfig.speed
          });
          return;
        }

        if (typeof window !== "undefined" && "speechSynthesis" in globalThis) {
          const utterance = new SpeechSynthesisUtterance(
            `Hello! I am ${personality.name}, your desktop companion.`
          );
          const selectedVoice = resolveBrowserVoice(voiceConfig.voice);
          if (selectedVoice) utterance.voice = selectedVoice;
          utterance.rate = voiceConfig.speed;
          utterance.pitch = voiceConfig.pitch;
          globalThis.speechSynthesis.speak(utterance);
        }
      },
      variant: "default" as const,
      disabled: !soundEffects || !voiceConfig.enabled
    },
    {
      label: t.quickActions.restartCompanion,
      icon: RefreshCw,
      onClick: () => {
        if (typeof window !== "undefined" && window.electron) {
          window.electron.send("restart-app");
        }
      },
      variant: "outline" as const
    }
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.label}
            variant={action.variant}
            size="lg"
            disabled={action.disabled}
            className={cn(
              "h-14 gap-3 px-6 text-base",
              reducedMotion ? "" : "transition-all"
            )}
            onClick={action.onClick}
          >
            <Icon className="h-5 w-5" />
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}
