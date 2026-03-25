"use client";

import {
  Settings,
  Palette,
  Type,
  Eye,
  Volume2,
  Bell,
  Save,
  Globe,
  Accessibility,
  Monitor,
  Sun,
  Moon
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
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
import { useSettings } from "./settings-context";
import { useI18n } from "@/lib/i18n/i18n-context";
import { cn } from "@/lib/utils";

export function MetaSettings() {
  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
    soundEffects,
    setSoundEffects,
    notifications,
    setNotifications,
    autoSave,
    setAutoSave,
    language,
    setLanguage
  } = useSettings();
  const { t } = useI18n();

  const interfaceLanguages = [
    { code: "en", name: t.languages.en },
    { code: "es", name: t.languages.es },
    { code: "fr", name: t.languages.fr },
    { code: "de", name: t.languages.de },
    { code: "it", name: t.languages.it },
    { code: "pt", name: t.languages.pt }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-foreground text-2xl font-semibold">
          {t.meta.title}
        </h3>
        <p className="text-muted-foreground mt-1">{t.meta.description}</p>
      </div>

      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Palette className="text-primary h-6 w-6" />
            {t.meta.appearance}
          </CardTitle>
          <CardDescription className="text-base">
            {t.meta.appearanceDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                id: "light",
                name: t.meta.lightMode,
                description: t.meta.lightModeDesc,
                icon: Sun
              },
              {
                id: "dark",
                name: t.meta.darkMode,
                description: t.meta.darkModeDesc,
                icon: Moon
              },
              {
                id: "system",
                name: t.meta.system,
                description: t.meta.systemDesc,
                icon: Monitor
              }
            ].map((option) => {
              const Icon = option.icon;
              const isSelected = theme === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setTheme(option.id as typeof theme)}
                  className={cn(
                    "flex flex-col items-center rounded-xl border-2 p-5 text-center",
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
                      "flex h-14 w-14 items-center justify-center rounded-xl",
                      isSelected ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-7 w-7",
                        isSelected
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
                      )}
                    />
                  </div>
                  <p className="text-foreground mt-3 font-semibold">
                    {option.name}
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

      {/* Text Size */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Type className="text-primary h-6 w-6" />
            {t.meta.textSize}
          </CardTitle>
          <CardDescription className="text-base">
            {t.meta.textSizeDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">{t.meta.fontSize}</Label>
              <span className="bg-muted rounded-lg px-4 py-2 text-lg font-semibold">
                {fontSize}px
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground text-sm">
                {t.meta.smaller}
              </span>
              <Slider
                value={[fontSize]}
                onValueChange={([value]) => setFontSize(value)}
                min={14}
                max={24}
                step={1}
                className="flex-1"
                aria-label={t.meta.fontSize}
              />
              <span className="text-muted-foreground text-sm">
                {t.meta.larger}
              </span>
            </div>
            <div className="bg-muted mt-4 rounded-xl p-5">
              <p style={{ fontSize: `${fontSize}px` }}>{t.meta.previewText}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Accessibility className="text-primary h-6 w-6" />
            {t.meta.accessibility}
          </CardTitle>
          <CardDescription className="text-base">
            {t.meta.accessibilityDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted flex items-center justify-between rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="bg-background flex h-12 w-12 items-center justify-center rounded-lg">
                <Eye className="text-foreground h-6 w-6" />
              </div>
              <div>
                <Label
                  htmlFor="high-contrast"
                  className="text-base font-medium"
                >
                  {t.meta.highContrast}
                </Label>
                <p className="text-muted-foreground text-sm">
                  {t.meta.highContrastDesc}
                </p>
              </div>
            </div>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={setHighContrast}
              className="scale-125"
            />
          </div>

          <div className="bg-muted flex items-center justify-between rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="bg-background flex h-12 w-12 items-center justify-center rounded-lg">
                <Settings className="text-foreground h-6 w-6" />
              </div>
              <div>
                <Label
                  htmlFor="reduced-motion"
                  className="text-base font-medium"
                >
                  {t.meta.reducedMotion}
                </Label>
                <p className="text-muted-foreground text-sm">
                  {t.meta.reducedMotionDesc}
                </p>
              </div>
            </div>
            <Switch
              id="reduced-motion"
              checked={reducedMotion}
              onCheckedChange={setReducedMotion}
              className="scale-125"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications & Sound */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Bell className="text-primary h-6 w-6" />
            {t.meta.notificationsSound}
          </CardTitle>
          <CardDescription className="text-base">
            {t.meta.notificationsSoundDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted flex items-center justify-between rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="bg-background flex h-12 w-12 items-center justify-center rounded-lg">
                <Bell className="text-foreground h-6 w-6" />
              </div>
              <div>
                <Label
                  htmlFor="notifications"
                  className="text-base font-medium"
                >
                  {t.meta.notifications}
                </Label>
                <p className="text-muted-foreground text-sm">
                  {t.meta.notificationsDesc}
                </p>
              </div>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
              className="scale-125"
            />
          </div>

          <div className="bg-muted flex items-center justify-between rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="bg-background flex h-12 w-12 items-center justify-center rounded-lg">
                <Volume2 className="text-foreground h-6 w-6" />
              </div>
              <div>
                <Label
                  htmlFor="sound-effects"
                  className="text-base font-medium"
                >
                  {t.meta.soundEffects}
                </Label>
                <p className="text-muted-foreground text-sm">
                  {t.meta.soundEffectsDesc}
                </p>
              </div>
            </div>
            <Switch
              id="sound-effects"
              checked={soundEffects}
              onCheckedChange={setSoundEffects}
              className="scale-125"
            />
          </div>
        </CardContent>
      </Card>

      {/* Interface Language */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Globe className="text-primary h-6 w-6" />
            {t.meta.language}
          </CardTitle>
          <CardDescription className="text-base">
            {t.meta.languageDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="h-14 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {interfaceLanguages.map((lang) => (
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
        </CardContent>
      </Card>

      {/* Auto-Save */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Save className="text-primary h-6 w-6" />
            {t.meta.saving}
          </CardTitle>
          <CardDescription className="text-base">
            {t.meta.savingDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted flex items-center justify-between rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="bg-background flex h-12 w-12 items-center justify-center rounded-lg">
                <Save className="text-foreground h-6 w-6" />
              </div>
              <div>
                <Label htmlFor="auto-save" className="text-base font-medium">
                  {t.meta.autoSave}
                </Label>
                <p className="text-muted-foreground text-sm">
                  {t.meta.autoSaveDesc}
                </p>
              </div>
            </div>
            <Switch
              id="auto-save"
              checked={autoSave}
              onCheckedChange={setAutoSave}
              className="scale-125"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
