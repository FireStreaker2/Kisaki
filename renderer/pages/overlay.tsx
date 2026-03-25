"use client";

import { SettingsProvider } from "@/components/dashboard/settings-context";
import { TextToolsPanel } from "@/components/overlay/text-tools";

export default function OverlayPage() {
  return (
    <SettingsProvider>
      <TextToolsPanel />;
    </SettingsProvider>
  );
}
