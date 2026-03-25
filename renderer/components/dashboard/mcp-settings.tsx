"use client";

import { useState } from "react";
import {
  Plug,
  Server,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Wrench,
  FolderOpen,
  Search,
  Calculator,
  Bell,
  Calendar,
  Mail,
  Cloud,
  Cpu,
  Sparkles,
  Zap,
  Brain
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
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

// AI Model options - including free models
const aiModels = {
  free: [
    {
      id: "gpt-4o-mini",
      provider: "openai",
      name: "GPT-4o Mini",
      speed: "Fast",
      quality: "Good"
    },
    {
      id: "llama-3.1-8b",
      provider: "groq",
      name: "Llama 3.1 8B",
      speed: "Very Fast",
      quality: "Good"
    },
    {
      id: "mixtral-8x7b",
      provider: "groq",
      name: "Mixtral 8x7B",
      speed: "Very Fast",
      quality: "Great"
    },
    {
      id: "gemma-7b",
      provider: "groq",
      name: "Gemma 7B",
      speed: "Very Fast",
      quality: "Good"
    },
    {
      id: "phi-3-mini",
      provider: "local",
      name: "Phi-3 Mini (Local)",
      speed: "Depends on Hardware",
      quality: "Good"
    },
    {
      id: "llama-3.1-70b",
      provider: "groq",
      name: "Llama 3.1 70B",
      speed: "Fast",
      quality: "Excellent"
    }
  ],
  premium: [
    {
      id: "gpt-4o",
      provider: "openai",
      name: "GPT-4o",
      speed: "Fast",
      quality: "Excellent"
    },
    {
      id: "gpt-4-turbo",
      provider: "openai",
      name: "GPT-4 Turbo",
      speed: "Medium",
      quality: "Excellent"
    },
    {
      id: "claude-3-opus",
      provider: "anthropic",
      name: "Claude 3 Opus",
      speed: "Medium",
      quality: "Excellent"
    },
    {
      id: "claude-3-sonnet",
      provider: "anthropic",
      name: "Claude 3 Sonnet",
      speed: "Fast",
      quality: "Great"
    }
  ]
};

export function MCPSettings() {
  const {
    mcpConfig,
    setMCPConfig,
    aiModelConfig,
    setAIModelConfig,
    reducedMotion,
    highContrast
  } = useSettings();
  const { t } = useI18n();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const availableTools = [
    {
      id: "file-manager",
      name: t.mcp.tools.fileManager,
      description: t.mcp.tools.fileManagerDesc,
      icon: FolderOpen
    },
    {
      id: "web-search",
      name: t.mcp.tools.webSearch,
      description: t.mcp.tools.webSearchDesc,
      icon: Search
    },
    {
      id: "calculator",
      name: t.mcp.tools.calculator,
      description: t.mcp.tools.calculatorDesc,
      icon: Calculator
    },
    {
      id: "reminders",
      name: t.mcp.tools.reminders,
      description: t.mcp.tools.remindersDesc,
      icon: Bell
    },
    {
      id: "calendar",
      name: t.mcp.tools.calendar,
      description: t.mcp.tools.calendarDesc,
      icon: Calendar
    },
    {
      id: "email",
      name: t.mcp.tools.email,
      description: t.mcp.tools.emailDesc,
      icon: Mail
    },
    {
      id: "weather",
      name: t.mcp.tools.weather,
      description: t.mcp.tools.weatherDesc,
      icon: Cloud
    }
  ];

  const handleConnect = async () => {
    setIsConnecting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setMCPConfig({
      ...mcpConfig,
      connected: !mcpConfig.connected
    });
    setIsConnecting(false);
  };

  const toggleTool = (toolId: string) => {
    const currentTools = mcpConfig.allowedTools;
    const newTools = currentTools.includes(toolId)
      ? currentTools.filter((t) => t !== toolId)
      : [...currentTools, toolId];
    setMCPConfig({ ...mcpConfig, allowedTools: newTools });
  };

  const selectedModel = [...aiModels.free, ...aiModels.premium].find(
    (m) => m.id === aiModelConfig.model
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-foreground text-2xl font-semibold">
          {t.mcp.title}
        </h3>
        <p className="text-muted-foreground mt-1">{t.mcp.description}</p>
      </div>

      {/* AI Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Brain className="text-primary h-6 w-6" />
            {t.mcp.aiModelTitle}
          </CardTitle>
          <CardDescription className="text-base">
            {t.mcp.aiModelDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="ai-model" className="text-base font-medium">
                {t.mcp.selectModel}
              </FieldLabel>
              <Select
                value={aiModelConfig.model}
                onValueChange={(value) => {
                  const model = [...aiModels.free, ...aiModels.premium].find(
                    (m) => m.id === value
                  );
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
                  <div className="text-primary px-2 py-1.5 text-sm font-semibold">
                    {t.mcp.freeModels}
                  </div>
                  {aiModels.free.map((model) => (
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
                  <div className="text-muted-foreground px-2 py-1.5 text-sm font-semibold">
                    {t.mcp.premiumModels}
                  </div>
                  {aiModels.premium.map((model) => (
                    <SelectItem
                      key={model.id}
                      value={model.id}
                      className="py-3 text-base"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="text-warning h-4 w-4" />
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
                  {t.mcp.modelSpeed}
                </p>
                <p className="text-foreground mt-1 font-semibold">
                  {selectedModel.speed}
                </p>
              </div>
              <div className="bg-muted rounded-xl p-4 text-center">
                <p className="text-muted-foreground text-sm">
                  {t.mcp.modelQuality}
                </p>
                <p className="text-foreground mt-1 font-semibold">
                  {selectedModel.quality}
                </p>
              </div>
              <div className="bg-muted rounded-xl p-4 text-center">
                <p className="text-muted-foreground text-sm">
                  {t.mcp.modelCost}
                </p>
                <p
                  className={cn(
                    "mt-1 font-semibold",
                    aiModels.free.some((m) => m.id === selectedModel.id)
                      ? "text-success"
                      : "text-warning"
                  )}
                >
                  {aiModels.free.some((m) => m.id === selectedModel.id)
                    ? t.mcp.free
                    : t.mcp.paid}
                </p>
              </div>
            </div>
          )}

          {/* Custom API Key for premium models */}
          {aiModels.premium.some((m) => m.id === aiModelConfig.model) && (
            <Field>
              <FieldLabel
                htmlFor="model-api-key"
                className="text-base font-medium"
              >
                {t.mcp.apiKey}
              </FieldLabel>
              <FieldDescription>{t.mcp.apiKeyDesc}</FieldDescription>
              <div className="relative">
                <Input
                  id="model-api-key"
                  type={showApiKey ? "text" : "password"}
                  value={aiModelConfig.apiKey}
                  onChange={(e) =>
                    setAIModelConfig({
                      ...aiModelConfig,
                      apiKey: e.target.value
                    })
                  }
                  placeholder={t.mcp.apiKeyPlaceholder}
                  className="h-14 pr-24 text-lg"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-1/2 right-2 -translate-y-1/2"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? t.mcp.hide : t.mcp.show}
                </Button>
              </div>
            </Field>
          )}
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card
        className={mcpConfig.connected ? "border-success" : "border-warning"}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-xl",
                  mcpConfig.connected ? "bg-success" : "bg-warning"
                )}
              >
                {mcpConfig.connected ? (
                  <CheckCircle2 className="text-success-foreground h-7 w-7" />
                ) : (
                  <XCircle className="text-warning-foreground h-7 w-7" />
                )}
              </div>
              <div>
                <p className="text-foreground text-lg font-semibold">
                  {mcpConfig.connected ? t.mcp.connected : t.mcp.notConnected}
                </p>
                <p className="text-muted-foreground">
                  {mcpConfig.connected
                    ? t.mcp.readyToHelp
                    : t.mcp.connectToEnable}
                </p>
              </div>
            </div>
            <Button
              onClick={handleConnect}
              variant={mcpConfig.connected ? "outline" : "default"}
              size="lg"
              className="h-14 gap-2 px-6 text-base"
              disabled={isConnecting}
            >
              {isConnecting ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : mcpConfig.connected ? (
                <XCircle className="h-5 w-5" />
              ) : (
                <Plug className="h-5 w-5" />
              )}
              {isConnecting
                ? t.mcp.connecting
                : mcpConfig.connected
                  ? t.mcp.disconnect
                  : t.mcp.connectNow}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Server Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Server className="text-primary h-6 w-6" />
            {t.mcp.serverConfig}
          </CardTitle>
          <CardDescription className="text-base">
            {t.mcp.serverConfigDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel
                htmlFor="server-url"
                className="text-base font-medium"
              >
                {t.mcp.serverAddress}
              </FieldLabel>
              <FieldDescription>{t.mcp.serverAddressDesc}</FieldDescription>
              <Input
                id="server-url"
                value={mcpConfig.serverUrl}
                onChange={(e) =>
                  setMCPConfig({ ...mcpConfig, serverUrl: e.target.value })
                }
                placeholder={t.mcp.serverPlaceholder}
                className="h-14 text-lg"
              />
            </Field>

            <Field>
              <FieldLabel
                htmlFor="mcp-api-key"
                className="text-base font-medium"
              >
                {t.mcp.apiKey}
              </FieldLabel>
              <FieldDescription>{t.mcp.apiKeyDesc}</FieldDescription>
              <div className="relative">
                <Input
                  id="mcp-api-key"
                  type={showApiKey ? "text" : "password"}
                  value={mcpConfig.apiKey}
                  onChange={(e) =>
                    setMCPConfig({ ...mcpConfig, apiKey: e.target.value })
                  }
                  placeholder={t.mcp.apiKeyPlaceholder}
                  className="h-14 pr-24 text-lg"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-1/2 right-2 -translate-y-1/2"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? t.mcp.hide : t.mcp.show}
                </Button>
              </div>
            </Field>
          </FieldGroup>

          <div className="bg-muted flex items-center justify-between rounded-xl p-5">
            <div className="space-y-1">
              <Label htmlFor="auto-connect" className="text-base font-medium">
                {t.mcp.autoConnect}
              </Label>
              <p className="text-muted-foreground text-sm">
                {t.mcp.autoConnectDesc}
              </p>
            </div>
            <Switch
              id="auto-connect"
              checked={mcpConfig.autoConnect}
              onCheckedChange={(checked) =>
                setMCPConfig({ ...mcpConfig, autoConnect: checked })
              }
              className="scale-125"
            />
          </div>
        </CardContent>
      </Card>

      {/* Available Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Wrench className="text-primary h-6 w-6" />
            {t.mcp.availableTools}
          </CardTitle>
          <CardDescription className="text-base">
            {t.mcp.availableToolsDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableTools.map((tool) => {
              const Icon = tool.icon;
              const isEnabled = mcpConfig.allowedTools.includes(tool.id);

              return (
                <button
                  key={tool.id}
                  onClick={() => toggleTool(tool.id)}
                  className={cn(
                    "flex flex-col items-center rounded-xl border-2 p-5 text-center",
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
                      "flex h-14 w-14 items-center justify-center rounded-xl",
                      isEnabled ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-7 w-7",
                        isEnabled
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
                      )}
                    />
                  </div>
                  <p className="text-foreground mt-3 font-semibold">
                    {tool.name}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {tool.description}
                  </p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* What is MCP */}
      <Card className="border-accent bg-accent/5">
        <CardContent className="p-6">
          <h4 className="text-foreground font-semibold">{t.mcp.whatIsMcp}</h4>
          <p className="text-muted-foreground mt-2">{t.mcp.mcpExplanation}</p>
        </CardContent>
      </Card>
    </div>
  );
}
