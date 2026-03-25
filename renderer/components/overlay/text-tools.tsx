"use client";

import { useState, useEffect } from "react";
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
  Copy,
  Check,
  ChevronDown,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

// Use the Hugging Face Inference client
import { InferenceClient } from "@huggingface/inference";

type ToolType = "explain" | "summarize" | "translate" | "factCheck" | null;

interface ToolResult {
  type: ToolType;
  content: string;
  confidence?: number;
  sources?: string[];
}

export function TextToolsPanel({ initialText = "" }: { initialText?: string }) {
  const { language } = useSettings();
  return (
    <I18nProvider language={language as Language}>
      <PanelContent initialText={initialText} />
    </I18nProvider>
  );
}

function PanelContent({ initialText }: { initialText: string }) {
  const { t } = useI18n();
  const [selectedText, setSelectedText] = useState(initialText);
  const [activeTool, setActiveTool] = useState<ToolType>(null);
  const [result, setResult] = useState<ToolResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Initialize Hugging Face client
  const hf = new InferenceClient(process.env.NEXT_PUBLIC_HF_API_KEY || "");

  // Listen for text from Electron main process
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("electronAPI" in window)) return;

    // @ts-ignore
    window.electronAPI.onText((text: string) => {
      setSelectedText(text);
    });
  }, []);

  const tools = [
    {
      type: "explain" as const,
      icon: Lightbulb,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/50"
    },
    {
      type: "summarize" as const,
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/50"
    },
    {
      type: "translate" as const,
      icon: Languages,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/50"
    },
    {
      type: "factCheck" as const,
      icon: ShieldCheck,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/50"
    }
  ];

  const handleToolClick = async (tool: ToolType) => {
    if (!tool || !selectedText.trim()) return;

    setActiveTool(tool);
    setIsProcessing(true);
    setResult(null);

    try {
      let prompt = "";

      switch (tool) {
        case "explain":
          prompt = `Explain the following text in simple terms:\n\n${selectedText}`;
          break;
        case "summarize":
          prompt = `Summarize the following text in concise bullet points:\n\n${selectedText}`;
          break;
        case "translate":
          prompt = `Translate the following text into Chinese:\n\n${selectedText}`;
          break;
        case "factCheck":
          prompt = `Fact-check the following statement and return confidence (0-100) and sources:\n\n${selectedText}`;
          break;
      }

      // Call Hugging Face text-generation endpoint
      const response = await hf.chatCompletion({
        model: "meta-llama/Llama-3.1-8B-Instruct:cerebras",
        messages: [
          {
            role: "user",
            content: prompt
          }
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
    if (!result?.content || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(result.content);
    window.speechSynthesis.speak(u);
  };

  return (
    <Card className="border-primary/20 h-full w-full max-w-xl border-2 shadow-lg">
      <div className="bg-primary/5 border-border flex items-center gap-2 border-b px-4 py-3">
        <Sparkles className="text-primary h-5 w-5" />
        <span className="text-foreground font-semibold">{t.overlay.title}</span>
      </div>

      <CardContent className="space-y-4 p-4">
        <textarea
          value={selectedText}
          onChange={(e) => setSelectedText(e.target.value)}
          placeholder={t.overlay.placeholder}
          className="bg-muted/40 text-foreground focus:ring-primary w-full resize-none rounded-lg border px-3 py-2 text-base outline-none focus:ring-2"
        />

        <div className="flex flex-row justify-center gap-4">
          {tools.map(({ type, icon: Icon, bg, color }) => (
            <Button
              key={type}
              variant="ghost"
              onClick={() => handleToolClick(type)}
              disabled={!selectedText.trim() || isProcessing}
              className={cn(
                "flex min-w-30 flex-col items-center justify-center gap-2 rounded-xl px-6 py-8 transition-all",
                bg,
                activeTool === type && "bg-primary text-white"
              )}
            >
              <Icon
                className={cn(
                  "h-8 w-8",
                  activeTool === type ? "text-white" : color
                )}
              />
              <span className="text-center text-base font-semibold">
                {t.overlay[type]}
              </span>
            </Button>
          ))}
        </div>

        {(isProcessing || result) && (
          <div className="border-t pt-4">
            {isProcessing ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <Spinner className="text-primary h-8 w-8" />
                <p className="text-muted-foreground text-lg">
                  {t.overlay.processing}
                </p>
              </div>
            ) : result ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-foreground text-lg font-semibold">
                    {t.overlay.result}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={speakResult}>
                      <Volume2 className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={copyResult}>
                      {copied ? (
                        <Check className="text-success h-5 w-5" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="bg-card border-border rounded-xl border p-4 text-base leading-relaxed whitespace-pre-wrap">
                  {result.content}
                </div>

                {result.type === "factCheck" &&
                  result.confidence !== undefined && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {t.overlay.confidence}:
                        </span>
                        <span className="font-semibold">
                          {result.confidence}%
                        </span>
                      </div>

                      <div className="bg-muted h-2 overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>

                      {result.sources && (
                        <div>
                          <button
                            onClick={() => setExpanded(!expanded)}
                            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm"
                          >
                            {t.overlay.sources}
                            <ChevronDown
                              className={cn(
                                "h-4 w-4",
                                expanded && "rotate-180"
                              )}
                            />
                          </button>

                          {expanded && (
                            <ul className="mt-2 space-y-1">
                              {result.sources.map((s, i) => (
                                <li
                                  key={i}
                                  className="text-primary cursor-pointer text-sm hover:underline"
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
