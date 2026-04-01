"use client";

import {
  BookOpen,
  FileText,
  Languages,
  Shield,
  Lightbulb,
  GraduationCap
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
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

export function TextToolsSettings() {
  const { textToolsConfig, setTextToolsConfig, reducedMotion, highContrast } =
    useSettings();
  const { t } = useI18n();

  const languages = [
    { code: "en", name: t.languages.en },
    { code: "es", name: t.languages.es },
    { code: "fr", name: t.languages.fr },
    { code: "de", name: t.languages.de },
    { code: "it", name: t.languages.it },
    { code: "pt", name: t.languages.pt },
    { code: "zh", name: t.languages.zh }
  ];

  const textTools = [
    {
      id: "explain",
      name: t.textTools.explain,
      description: t.textTools.explainDesc,
      icon: Lightbulb,
      key: "explainEnabled" as const
    },
    {
      id: "summarize",
      name: t.textTools.summarize,
      description: t.textTools.summarizeDesc,
      icon: FileText,
      key: "summarizeEnabled" as const
    },
    {
      id: "translate",
      name: t.textTools.translate,
      description: t.textTools.translateDesc,
      icon: Languages,
      key: "translateEnabled" as const
    },
    {
      id: "factCheck",
      name: t.textTools.factCheck,
      description: t.textTools.factCheckDesc,
      icon: Shield,
      key: "factCheckEnabled" as const
    }
  ];

  const toggleTool = (key: keyof typeof textToolsConfig) => {
    setTextToolsConfig({
      ...textToolsConfig,
      [key]: !textToolsConfig[key]
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-foreground text-2xl font-semibold">
          {t.textTools.title}
        </h3>
        <p className="text-muted-foreground mt-1">{t.textTools.description}</p>
      </div>

      {/* Enable/Disable Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <BookOpen className="text-primary h-6 w-6" />
            {t.textTools.availableTools}
          </CardTitle>
          <CardDescription className="text-base">
            {t.textTools.availableToolsDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {textTools.map((tool) => {
              const Icon = tool.icon;
              const isEnabled = textToolsConfig[tool.key];

              return (
                <button
                  key={tool.id}
                  onClick={() => toggleTool(tool.key)}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border-2 p-5 text-left",
                    reducedMotion ? "" : "transition-all",
                    isEnabled
                      ? "border-primary bg-primary/5"
                      : "border-border opacity-60",
                    highContrast &&
                      isEnabled &&
                      "ring-primary ring-2 ring-offset-2"
                  )}
                  aria-pressed={isEnabled}
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
                      isEnabled ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-6 w-6",
                        isEnabled
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground font-semibold">{tool.name}</p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {tool.description}
                    </p>
                  </div>
                  <Switch
                    checked={isEnabled}
                    className="scale-125"
                    aria-label={`${t.common.toggle} ${tool.name}`}
                  />
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Reading Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <GraduationCap className="text-primary h-6 w-6" />
            {t.textTools.readingLevel}
          </CardTitle>
          <CardDescription className="text-base">
            {t.textTools.readingLevelDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                level: "simple",
                title: t.textTools.simple,
                description: t.textTools.simpleDesc
              },
              {
                level: "standard",
                title: t.textTools.standard,
                description: t.textTools.standardDesc
              },
              {
                level: "advanced",
                title: t.textTools.advanced,
                description: t.textTools.advancedDesc
              }
            ].map((option) => {
              const isSelected = textToolsConfig.readingLevel === option.level;
              return (
                <button
                  key={option.level}
                  onClick={() =>
                    setTextToolsConfig({
                      ...textToolsConfig,
                      readingLevel:
                        option.level as typeof textToolsConfig.readingLevel
                    })
                  }
                  className={cn(
                    "rounded-xl border-2 p-5 text-center",
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
                  <p className="text-foreground font-semibold">
                    {option.title}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Translation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Languages className="text-primary h-6 w-6" />
            {t.textTools.translationSettings}
          </CardTitle>
          <CardDescription className="text-base">
            {t.textTools.translationSettingsDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel
                htmlFor="default-lang"
                className="text-base font-medium"
              >
                {t.textTools.defaultLanguage}
              </FieldLabel>
              <FieldDescription>
                {t.textTools.defaultLanguageDesc}
              </FieldDescription>
              <Select
                value={textToolsConfig.defaultLanguage}
                onValueChange={(value) =>
                  setTextToolsConfig({
                    ...textToolsConfig,
                    defaultLanguage: value
                  })
                }
              >
                <SelectTrigger id="default-lang" className="h-14 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem
                      key={lang.code}
                      value={lang.code}
                      className="py-3 text-base"
                    >
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <div className="bg-muted flex items-center justify-between rounded-xl p-5">
            <div className="space-y-1">
              <Label htmlFor="auto-detect" className="text-base font-medium">
                {t.textTools.autoDetect}
              </Label>
              <p className="text-muted-foreground text-sm">
                {t.textTools.autoDetectDesc}
              </p>
            </div>
            <Switch
              id="auto-detect"
              checked={textToolsConfig.autoDetectLanguage}
              onCheckedChange={(checked) =>
                setTextToolsConfig({
                  ...textToolsConfig,
                  autoDetectLanguage: checked
                })
              }
              className="scale-125"
            />
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="border-accent bg-accent/5">
        <CardContent className="p-6">
          <h4 className="text-foreground font-semibold">
            {t.textTools.howToUse}
          </h4>
          <ol className="text-muted-foreground mt-4 space-y-3">
            <li className="flex items-start gap-3">
              <span className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                1
              </span>
              <span className="pt-1">{t.textTools.step1}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                2
              </span>
              <span className="pt-1">{t.textTools.step2}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                3
              </span>
              <span className="pt-1">{t.textTools.step3}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                4
              </span>
              <span className="pt-1">{t.textTools.step4}</span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
