"use client";

import { Bot, Mic, FileText, Plug, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettings } from "./settings-context";
import { useI18n } from "@/lib/i18n/i18n-context";

type TabType = "companion" | "voice" | "text-tools" | "mcp" | "meta";

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { reducedMotion, highContrast } = useSettings();
  const { t } = useI18n();

  const navItems: {
    id: TabType;
    label: string;
    icon: typeof Bot;
    description: string;
  }[] = [
    {
      id: "companion",
      label: t.nav.companion,
      icon: Bot,
      description: t.nav.companionDesc
    },
    {
      id: "voice",
      label: t.nav.voice,
      icon: Mic,
      description: t.nav.voiceDesc
    },
    {
      id: "text-tools",
      label: t.nav.textTools,
      icon: FileText,
      description: t.nav.textToolsDesc
    },
    {
      id: "mcp",
      label: t.nav.connections,
      icon: Plug,
      description: t.nav.connectionsDesc
    },
    {
      id: "meta",
      label: t.nav.dashboard,
      icon: Settings,
      description: t.nav.dashboardDesc
    }
  ];

  return (
    <aside className="border-border bg-sidebar hidden w-72 flex-col border-r lg:flex">
      {/* Logo */}
      <div className="border-sidebar-border flex h-20 items-center gap-3 border-b px-6">
        <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-xl">
          <Sparkles className="text-primary-foreground h-6 w-6" />
        </div>
        <div>
          <h1 className="text-sidebar-foreground text-lg font-semibold">
            {t.brand.name}
          </h1>
          <p className="text-sidebar-foreground/70 text-sm">
            {t.brand.tagline}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 space-y-2 p-4"
        role="navigation"
        aria-label="Main navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex w-full items-center gap-4 rounded-xl px-4 py-4 text-left",
                reducedMotion ? "" : "transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50",
                highContrast && isActive && "ring-primary ring-2"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  isActive ? "bg-primary" : "bg-sidebar-accent"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive
                      ? "text-primary-foreground"
                      : "text-sidebar-foreground/70"
                  )}
                />
              </div>
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm opacity-70">{item.description}</p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Help Section */}
      <div className="border-sidebar-border border-t p-4">
        <div className="bg-sidebar-accent rounded-xl p-4">
          <p className="text-sidebar-foreground font-medium">{t.help.title}</p>
          <p className="text-sidebar-foreground/70 mt-1 text-sm">
            {t.help.description}
          </p>
        </div>
      </div>
    </aside>
  );
}
