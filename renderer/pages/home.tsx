"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { CompanionSettings } from "@/components/dashboard/companion-settings";
import { VoiceSettings } from "@/components/dashboard/voice-settings";
import { TextToolsSettings } from "@/components/dashboard/text-tools-settings";
import { MCPSettings } from "@/components/dashboard/mcp-settings";
import { MetaSettings } from "@/components/dashboard/meta-settings";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { StatusPanel } from "@/components/dashboard/status-panel";
import {
  SettingsProvider,
  useSettings
} from "@/components/dashboard/settings-context";
import { I18nProvider } from "../lib/i18n/i18n-context";
import type { Language } from "../lib/i18n/translations";

type TabType = "companion" | "voice" | "text-tools" | "mcp" | "meta";

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<TabType>("companion");
  const { fontSize, highContrast, reducedMotion, language } = useSettings();

  const renderContent = () => {
    switch (activeTab) {
      case "companion":
        return <CompanionSettings />;
      case "voice":
        return <VoiceSettings />;
      case "text-tools":
        return <TextToolsSettings />;
      case "mcp":
        return <MCPSettings />;
      case "meta":
        return <MetaSettings />;
      default:
        return <CompanionSettings />;
    }
  };

  return (
    <I18nProvider language={language as Language}>
      <div
        className={`bg-background min-h-screen ${
          reducedMotion ? "" : "transition-all duration-300"
        }`}
        style={{ fontSize: `${fontSize}px` }}
      >
        <div className="flex h-screen overflow-hidden">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
              <div className="mx-auto max-w-6xl space-y-6">
                <StatusPanel />
                <QuickActions />
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
      </div>
    </I18nProvider>
  );
}

export default function DashboardPage() {
  return (
    <SettingsProvider>
      <DashboardContent />
    </SettingsProvider>
  );
}
