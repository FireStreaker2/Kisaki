"use client";

import { Mic, Volume2, Ear, Radio } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSettings } from "./settings-context";
import { useI18n } from "@/lib/i18n/i18n-context";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldDescription
} from "@/components/ui/field";

const voices = [
  {
    id: "en-US-Neural2-C",
    name: "Sarah (Female, Warm)",
    locale: "English (US)"
  },
  {
    id: "en-US-Neural2-D",
    name: "James (Male, Clear)",
    locale: "English (US)"
  },
  {
    id: "en-US-Neural2-F",
    name: "Emma (Female, Friendly)",
    locale: "English (US)"
  },
  {
    id: "en-GB-Neural2-B",
    name: "Oliver (Male, British)",
    locale: "English (UK)"
  },
  {
    id: "en-GB-Neural2-C",
    name: "Sophie (Female, British)",
    locale: "English (UK)"
  }
];

export function VoiceSettings() {
  const { voiceConfig, setVoiceConfig, reducedMotion, soundEffects } = useSettings();
  const { t } = useI18n();

  const testVoice = () => {
    if (!soundEffects) return;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(t.voice.testMessage);
      utterance.rate = voiceConfig.speed;
      utterance.pitch = voiceConfig.pitch;
      utterance.volume = voiceConfig.volume;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-foreground text-2xl font-semibold">
          {t.voice.title}
        </h3>
        <p className="text-muted-foreground mt-1">{t.voice.description}</p>
      </div>

      {/* Voice Enable Toggle */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary flex h-14 w-14 items-center justify-center rounded-xl">
                <Mic className="text-primary-foreground h-7 w-7" />
              </div>
              <div>
                <p className="text-foreground text-lg font-semibold">
                  {t.voice.features}
                </p>
                <p className="text-muted-foreground">{t.voice.featuresDesc}</p>
              </div>
            </div>
            <Switch
              checked={voiceConfig.enabled}
              onCheckedChange={(checked) =>
                setVoiceConfig({ ...voiceConfig, enabled: checked })
              }
              className="scale-150"
              aria-label={t.common.toggle + " " + t.voice.features}
            />
          </div>
        </CardContent>
      </Card>

      {/* Voice Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Volume2 className="text-primary h-6 w-6" />
            {t.voice.selection}
          </CardTitle>
          <CardDescription className="text-base">
            {t.voice.selectionDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel
                htmlFor="voice-select"
                className="text-base font-medium"
              >
                {t.voice.selectVoice}
              </FieldLabel>
              <Select
                value={voiceConfig.voice}
                onValueChange={(value) =>
                  setVoiceConfig({ ...voiceConfig, voice: value })
                }
              >
                <SelectTrigger id="voice-select" className="h-14 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem
                      key={voice.id}
                      value={voice.id}
                      className="py-3 text-base"
                    >
                      {voice.name} - {voice.locale}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <Button
            onClick={testVoice}
            variant="outline"
            size="lg"
            disabled={!soundEffects}
            className="mt-4 h-12 gap-2 text-base"
          >
            <Volume2 className="h-5 w-5" />
            {t.voice.testVoice}
          </Button>
        </CardContent>
      </Card>

      {/* Voice Adjustments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Radio className="text-primary h-6 w-6" />
            {t.voice.adjustments}
          </CardTitle>
          <CardDescription className="text-base">
            {t.voice.adjustmentsDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Speed Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">
                {t.voice.speakingSpeed}
              </Label>
              <span className="bg-muted rounded-lg px-3 py-1 text-sm font-medium">
                {Math.round(voiceConfig.speed * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground text-sm">
                {t.voice.slower}
              </span>
              <Slider
                value={[voiceConfig.speed]}
                onValueChange={([value]) =>
                  setVoiceConfig({ ...voiceConfig, speed: value })
                }
                min={0.5}
                max={1.5}
                step={0.1}
                className="flex-1"
                aria-label={t.voice.speakingSpeed}
              />
              <span className="text-muted-foreground text-sm">
                {t.voice.faster}
              </span>
            </div>
          </div>

          {/* Pitch Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">
                {t.voice.voicePitch}
              </Label>
              <span className="bg-muted rounded-lg px-3 py-1 text-sm font-medium">
                {Math.round(voiceConfig.pitch * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground text-sm">
                {t.voice.lower}
              </span>
              <Slider
                value={[voiceConfig.pitch]}
                onValueChange={([value]) =>
                  setVoiceConfig({ ...voiceConfig, pitch: value })
                }
                min={0.5}
                max={1.5}
                step={0.1}
                className="flex-1"
                aria-label={t.voice.voicePitch}
              />
              <span className="text-muted-foreground text-sm">
                {t.voice.higher}
              </span>
            </div>
          </div>

          {/* Volume Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">{t.voice.volume}</Label>
              <span className="bg-muted rounded-lg px-3 py-1 text-sm font-medium">
                {Math.round(voiceConfig.volume * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground text-sm">
                {t.voice.quieter}
              </span>
              <Slider
                value={[voiceConfig.volume]}
                onValueChange={([value]) =>
                  setVoiceConfig({ ...voiceConfig, volume: value })
                }
                min={0.1}
                max={1}
                step={0.1}
                className="flex-1"
                aria-label={t.voice.volume}
              />
              <span className="text-muted-foreground text-sm">
                {t.voice.louder}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wake Word & Listening */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Ear className="text-primary h-6 w-6" />
            {t.voice.listeningSettings}
          </CardTitle>
          <CardDescription className="text-base">
            {t.voice.listeningSettingsDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="wake-word" className="text-base font-medium">
                {t.voice.wakeWord}
              </FieldLabel>
              <FieldDescription>{t.voice.wakeWordDesc}</FieldDescription>
              <Input
                id="wake-word"
                value={voiceConfig.wakeWord}
                onChange={(e) =>
                  setVoiceConfig({ ...voiceConfig, wakeWord: e.target.value })
                }
                placeholder={t.voice.wakeWordPlaceholder}
                className="h-14 text-lg"
              />
            </Field>
          </FieldGroup>

          <div className="bg-muted flex items-center justify-between rounded-xl p-5">
            <div className="space-y-1">
              <Label htmlFor="continuous" className="text-base font-medium">
                {t.voice.continuousListening}
              </Label>
              <p className="text-muted-foreground text-sm">
                {t.voice.continuousListeningDesc}
              </p>
            </div>
            <Switch
              id="continuous"
              checked={voiceConfig.continuousListening}
              onCheckedChange={(checked) =>
                setVoiceConfig({ ...voiceConfig, continuousListening: checked })
              }
              className="scale-125"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
