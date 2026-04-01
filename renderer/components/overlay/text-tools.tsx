"use client";

import { useState, useEffect, useRef } from "react";
import { I18nProvider, useI18n } from "@/lib/i18n/i18n-context";
import { useSettings } from "../dashboard/settings-context";
import { Language } from "@/lib/i18n/translations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Lightbulb,
  FileText,
  Languages,
  ShieldCheck,
  Volume2,
  Square,
  Copy,
  Check,
  ChevronDown,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

import { InferenceClient } from "@huggingface/inference";

type ToolType = "explain" | "summarize" | "translate" | "factCheck" | null;

interface ToolResult {
  type: ToolType;
  content: string;
  confidence?: number;
  sources?: string[];
}

interface ToolButton {
  type: ToolType;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}

export function TextToolsPanel({ initialText = "" }: { initialText?: string }) {
  const { language, personality } = useSettings();
  return (
    <I18nProvider
      language={language as Language}
      companionName={personality.name}
    >
      <PanelContent initialText={initialText} />
    </I18nProvider>
  );
}

function PanelContent({ initialText }: { initialText: string }) {
  const { t } = useI18n();
  const [selectedText, setSelectedText] = useState<string>(initialText);
  const [activeTool, setActiveTool] = useState<ToolType>(null);
  const [result, setResult] = useState<ToolResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const {
    textToolsConfig,
    personality,
    aiModelConfig,
    soundEffects,
    voiceConfig
  } = useSettings();

  const hf = new InferenceClient(process.env.NEXT_PUBLIC_HF_API_KEY || "");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("electronAPI" in window)) return;

    const unsubscribe = window.electronAPI.onText((text: string) => {
      setSelectedText(text);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Only include enabled tools
  const tools: ToolButton[] = [
    textToolsConfig.explainEnabled && {
      type: "explain",
      icon: Lightbulb,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/50"
    },
    textToolsConfig.summarizeEnabled && {
      type: "summarize",
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/50"
    },
    textToolsConfig.translateEnabled && {
      type: "translate",
      icon: Languages,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/50"
    },
    textToolsConfig.factCheckEnabled && {
      type: "factCheck",
      icon: ShieldCheck,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/50"
    }
  ].filter(Boolean) as ToolButton[];

  const handleToolClick = async (tool: ToolType) => {
    if (!tool || !selectedText.trim()) return;

    setActiveTool(tool);
    setIsProcessing(true);
    setResult(null);

    try {
      let prompt = "";
      const companionStyle = [
        `You are ${personality.name}.`,
        `Use a ${personality.tone} tone.`,
        `Keep the response ${personality.verbosity}.`,
        personality.humor
          ? "Humor is allowed when it improves clarity and remains tasteful."
          : "Do not add jokes or playful language.",
        `Use a ${textToolsConfig.readingLevel} reading level unless accuracy requires technical terms.`
      ].join(" ");

      switch (tool) {
        case "explain":
          prompt = `Explain the following text in simple terms:\n\n${selectedText}`;
          break;
        case "summarize":
          prompt = `Summarize the following text in concise bullet points:\n\n${selectedText}`;
          break;
        case "translate":
          prompt = `Translate the following text into ${textToolsConfig.defaultLanguage}:\n\n${selectedText}`;
          break;
        case "factCheck":
          prompt = `Fact-check the following statement and return confidence (0-100) and sources:\n\n${selectedText}`;
          break;
      }

      const response = await hf.chatCompletion({
        model: aiModelConfig.model,
        messages: [
          { role: "system", content: companionStyle },
          { role: "user", content: prompt }
        ]
      });

      const content = response.choices[0].message.content as string;

      const newResult: ToolResult = { type: tool, content };

      if (tool === "factCheck") {
        const match = content.match(/Confidence: (\d+)%/);
        if (match) newResult.confidence = parseInt(match[1], 10);

        const sourcesMatch = content.match(/Sources: (.*)/);
        if (sourcesMatch)
          newResult.sources = sourcesMatch[1]
            .split(",")
            .map((s: string) => s.trim());
      }

      setResult(newResult);
    } catch (err) {
      console.error(err);
      setResult({
        type: tool,
        content: "Error: Could not fetch result from Hugging Face API."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyResult = async () => {
    if (!result?.content) return;
    await navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const speakResult = () => {
    if (!soundEffects || !voiceConfig.enabled) return;
    if (!result?.content) return;

    if (typeof window !== "undefined" && "electronAPI" in window) {
      window.electronAPI.speakText({
        text: result.content,
        voice: voiceConfig.voice,
        speed: voiceConfig.speed
      });
      return;
    }

    if (!("speechSynthesis" in globalThis)) return;

    if (isSpeaking) {
      globalThis.speechSynthesis.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
      return;
    }

    const utterance = new SpeechSynthesisUtterance(result.content);
    utterance.rate = voiceConfig.speed;
    utterance.pitch = voiceConfig.pitch;
    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    setIsSpeaking(true);
    globalThis.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in globalThis))
      return;

    return () => {
      globalThis.speechSynthesis.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
    };
  }, []);

  return (
    <Card className="border-primary/20 w-full border-2 shadow-lg flex flex-col h-screen">
      <div className="bg-primary/5 border-border flex items-center gap-2 border-b px-4 py-2 shrink-0">
        <Sparkles className="text-primary h-5 w-5" />
        <span className="text-foreground font-semibold text-sm">{t.overlay.title}</span>
      </div>

      <CardContent className="space-y-3 p-3 overflow-y-auto flex-1">
        <textarea
          value={selectedText}
          onChange={(e) => setSelectedText(e.target.value)}
          placeholder={t.overlay.placeholder}
          className="bg-muted/40 text-foreground focus:ring-primary w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 h-16"
        />

        <div className="flex flex-wrap justify-center gap-2">
          {tools.map(({ type, icon: Icon, bg, color }: ToolButton) => (
            <Button
              key={type}
              variant="ghost"
              onClick={() => handleToolClick(type)}
              disabled={!selectedText.trim() || isProcessing}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-4 transition-all text-xs flex-1 min-w-20 max-w-28",
                bg,
                activeTool === type && "bg-primary text-white"
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6",
                  activeTool === type ? "text-white" : color
                )}
              />
              <span className="text-center font-semibold text-xs">
                {t.overlay[type as keyof typeof t.overlay]}
              </span>
            </Button>
          ))}
        </div>

        {(isProcessing || result) && (
          <div className="border-t pt-2">
            {isProcessing ? (
              <div className="flex flex-col items-center gap-2 py-3">
                <Spinner className="text-primary h-6 w-6" />
                <p className="text-muted-foreground text-xs">
                  {t.overlay.processing}
                </p>
              </div>
            ) : result ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-foreground text-sm font-semibold">
                    {t.overlay.result}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={speakResult}
                      disabled={!soundEffects || !voiceConfig.enabled}
                      className="h-7 w-7 p-0"
                    >
                      {isSpeaking ? (
                        <Square className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={copyResult}
                      className="h-7 w-7 p-0"
                    >
                      {copied ? (
                        <Check className="text-success h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="bg-card border-border rounded-lg border p-2 text-xs leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {result.content}
                </div>

                {result.type === "factCheck" &&
                  result.confidence !== undefined && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {t.overlay.confidence}:
                        </span>
                        <span className="font-semibold">
                          {result.confidence}%
                        </span>
                      </div>

                      <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>

                      {result.sources && (
                        <div>
                          <button
                            onClick={() => setExpanded(!expanded)}
                            className="text-muted-foreground hover:text-foreground flex items-center gap-0.5 text-xs"
                          >
                            {t.overlay.sources}
                            <ChevronDown
                              className={cn(
                                "h-3 w-3",
                                expanded && "rotate-180"
                              )}
                            />
                          </button>

                          {expanded && (
                            <ul className="mt-1 space-y-0.5">
                              {result.sources.map((s, i) => (
                                <li
                                  key={i}
                                  className="text-primary cursor-pointer text-xs hover:underline truncate"
                                >
                                  {s}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  )}
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
