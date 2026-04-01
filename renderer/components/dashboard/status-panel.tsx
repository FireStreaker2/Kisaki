"use client";

import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useSettings } from "./settings-context";
import { useI18n } from "@/lib/i18n/i18n-context";
import { cn } from "@/lib/utils";

export function StatusPanel() {
  const { reducedMotion } = useSettings();
  const { t } = useI18n();

  const statusItems = [
    {
      label: t.status.systemStatus,
      connected: true,
      icon: CheckCircle2,
      description: t.status.allSystems
    }
  ];

  return (
    <Card className="border-2">
      <CardContent className="p-4 lg:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {statusItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={cn(
                  "flex items-center gap-4 rounded-xl p-4",
                  item.connected ? "bg-success/10" : "bg-muted",
                  reducedMotion ? "" : "transition-colors"
                )}
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full",
                    item.connected ? "bg-success" : "bg-muted-foreground/20"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6",
                      item.connected
                        ? "text-success-foreground"
                        : "text-muted-foreground"
                    )}
                  />
                </div>
                <div>
                  <p className="text-foreground font-semibold">{item.label}</p>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
