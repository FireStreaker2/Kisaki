"use client";

import { Zap, Brain } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useSettings } from "./settings-context";
import { useI18n } from "@/lib/i18n/i18n-context";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";

// AI Model options - free models
const aiModels = [
  {
    id: "meta-llama/Llama-3.1-8B-Instruct:cerebras",
    provider: "Meta",
    name: "Cerebras",
    speed: "Fast",
    quality: "Good"
  },
  {
    id: "CohereLabs/tiny-aya-global:cohere",
    provider: "Cohere",
    name: "Cohere",
    speed: "Fast",
    quality: "Good"
  },
  {
    id: "Nanbeige/Nanbeige4.1-3B:featherless-ai",
    provider: "Nanbeige",
    name: "Featherless AI",
    speed: "Fast",
    quality: "Good"
  },
  {
    id: "openai/gpt-oss-120b:groq",
    provider: "OpenAI",
    name: "Groq",
    speed: "Fast",
    quality: "Good"
  }
];

export function AIModelSettings() {
  const { aiModelConfig, setAIModelConfig, reducedMotion, highContrast } =
    useSettings();
  const { t } = useI18n();

  const selectedModel = aiModels.find((m) => m.id === aiModelConfig.model);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-foreground text-2xl font-semibold">
          {t.aiModel.aiModelTitle}
        </h3>
        <p className="text-muted-foreground mt-1">{t.aiModel.aiModelDesc}</p>
      </div>

      {/* AI Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Brain className="text-primary h-6 w-6" />
            {t.aiModel.aiModelTitle}
          </CardTitle>
          <CardDescription className="text-base">
            {t.aiModel.aiModelDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="ai-model" className="text-base font-medium">
                {t.aiModel.selectModel}
              </FieldLabel>
              <Select
                value={aiModelConfig.model}
                onValueChange={(value) => {
                  const model = aiModels.find((m) => m.id === value);
                  if (model) {
                    setAIModelConfig({
                      ...aiModelConfig,
                      model: value,
                      provider: model.provider
                    });
                  }
                }}
              >
                <SelectTrigger id="ai-model" className="h-14 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {aiModels.map((model) => (
                    <SelectItem
                      key={model.id}
                      value={model.id}
                      className="py-3 text-base"
                    >
                      <div className="flex items-center gap-2">
                        <Zap className="text-success h-4 w-4" />
                        {model.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          {selectedModel && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="bg-muted rounded-xl p-4 text-center">
                <p className="text-muted-foreground text-sm">
                  {t.aiModel.modelSpeed}
                </p>
                <p className="text-foreground mt-1 font-semibold">
                  {selectedModel.speed}
                </p>
              </div>
              <div className="bg-muted rounded-xl p-4 text-center">
                <p className="text-muted-foreground text-sm">
                  {t.aiModel.modelQuality}
                </p>
                <p className="text-foreground mt-1 font-semibold">
                  {selectedModel.quality}
                </p>
              </div>
              <div className="bg-muted rounded-xl p-4 text-center">
                <p className="text-muted-foreground text-sm">
                  {t.aiModel.modelCost}
                </p>
                <p className="text-success mt-1 font-semibold">
                  {t.aiModel.free}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
