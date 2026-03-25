"use client";

import { Mic, Volume2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "./settings-context";
import { useI18n } from "@/lib/i18n/i18n-context";
import { cn } from "@/lib/utils";

export function QuickActions() {
  const { voiceConfig, setVoiceConfig, reducedMotion, personality } =
    useSettings();
  const { t } = useI18n();

  const actions = [
    {
      label: t.quickActions.testVoice,
      icon: Volume2,
      onClick: () => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(
            `Hello! I am ${personality.name}, your desktop companion.`
          );
          utterance.rate = voiceConfig.speed;
          utterance.pitch = voiceConfig.pitch;
          window.speechSynthesis.speak(utterance);
        }
      },
      variant: "default" as const
    },
    {
      label: voiceConfig.enabled
        ? t.quickActions.pauseListening
        : t.quickActions.startListening,
      icon: Mic,
      onClick: () =>
        setVoiceConfig({ ...voiceConfig, enabled: !voiceConfig.enabled }),
      variant: voiceConfig.enabled
        ? ("secondary" as const)
        : ("outline" as const)
    },
    {
      label: t.quickActions.restartCompanion,
      icon: RefreshCw,
      onClick: () => console.log("Restarting companion..."),
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
