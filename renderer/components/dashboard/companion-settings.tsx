"use client";

import { Bot, Smile, MessageSquare, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useSettings } from "./settings-context";
import { useI18n } from "@/lib/i18n/i18n-context";
import { cn } from "@/lib/utils";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldDescription
} from "@/components/ui/field";

export function CompanionSettings() {
  const { personality, setPersonality, reducedMotion, highContrast } =
    useSettings();
  const { t } = useI18n();

  const personalities = [
    {
      id: "friendly",
      name: t.companion.personalities.friendly.name,
      description: t.companion.personalities.friendly.description,
      icon: Smile
    },
    {
      id: "professional",
      name: t.companion.personalities.professional.name,
      description: t.companion.personalities.professional.description,
      icon: Bot
    },
    {
      id: "casual",
      name: t.companion.personalities.casual.name,
      description: t.companion.personalities.casual.description,
      icon: MessageSquare
    },
    {
      id: "caring",
      name: t.companion.personalities.caring.name,
      description: t.companion.personalities.caring.description,
      icon: Sparkles
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-foreground text-2xl font-semibold">
          {t.companion.title}
        </h3>
        <p className="text-muted-foreground mt-1">{t.companion.description}</p>
      </div>

      {/* Companion Name */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Bot className="text-primary h-6 w-6" />
            {t.companion.identity}
          </CardTitle>
          <CardDescription className="text-base">
            {t.companion.identityDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel
                htmlFor="companion-name"
                className="text-base font-medium"
              >
                {t.companion.nameLabel}
              </FieldLabel>
              <FieldDescription>{t.companion.nameDesc}</FieldDescription>
              <Input
                id="companion-name"
                value={personality.name}
                onChange={(e) =>
                  setPersonality({ ...personality, name: e.target.value })
                }
                placeholder={t.companion.namePlaceholder}
                className="h-14 text-lg"
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Personality Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Smile className="text-primary h-6 w-6" />
            {t.companion.personalityType}
          </CardTitle>
          <CardDescription className="text-base">
            {t.companion.personalityTypeDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {personalities.map((p) => {
              const Icon = p.icon;
              const isSelected = personality.tone === p.id;

              return (
                <button
                  key={p.id}
                  onClick={() =>
                    setPersonality({
                      ...personality,
                      tone: p.id as typeof personality.tone
                    })
                  }
                  className={cn(
                    "flex items-start gap-4 rounded-xl border-2 p-5 text-left",
                    reducedMotion ? "" : "transition-all",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                    highContrast &&
                      isSelected &&
                      "ring-primary ring-2 ring-offset-2"
                  )}
                  aria-pressed={isSelected}
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
                      isSelected ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-6 w-6",
                        isSelected
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
                      )}
                    />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">{p.name}</p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {p.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Response Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <MessageSquare className="text-primary h-6 w-6" />
            {t.companion.responseSettings}
          </CardTitle>
          <CardDescription className="text-base">
            {t.companion.responseSettingsDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="verbosity" className="text-base font-medium">
                {t.companion.responseLength}
              </FieldLabel>
              <FieldDescription>
                {t.companion.responseLengthDesc}
              </FieldDescription>
              <Select
                value={personality.verbosity}
                onValueChange={(value: "brief" | "normal" | "detailed") =>
                  setPersonality({ ...personality, verbosity: value })
                }
              >
                <SelectTrigger id="verbosity" className="h-14 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brief" className="py-3 text-base">
                    {t.companion.brief}
                  </SelectItem>
                  <SelectItem value="normal" className="py-3 text-base">
                    {t.companion.normal}
                  </SelectItem>
                  <SelectItem value="detailed" className="py-3 text-base">
                    {t.companion.detailed}
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <div className="bg-muted flex items-center justify-between rounded-xl p-5">
            <div className="space-y-1">
              <Label htmlFor="humor" className="text-base font-medium">
                {t.companion.includeHumor}
              </Label>
              <p className="text-muted-foreground text-sm">
                {t.companion.humorDesc}
              </p>
            </div>
            <Switch
              id="humor"
              checked={personality.humor}
              onCheckedChange={(checked) =>
                setPersonality({ ...personality, humor: checked })
              }
              className="scale-125"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
