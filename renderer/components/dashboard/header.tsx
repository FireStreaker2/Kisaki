"use client";

import { Bell, Moon, Sun, Menu, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "./settings-context";
import { useI18n } from "@/lib/i18n/i18n-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileSidebar } from "./mobile-sidebar";

export function Header() {
  const { theme, setTheme, notifications, reducedMotion } = useSettings();
  const { t } = useI18n();

  return (
    <header className="border-border bg-card flex h-20 items-center justify-between border-b px-4 lg:px-8">
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <MobileSidebar />
        </SheetContent>
      </Sheet>

      {/* Title */}
      <div className="hidden lg:block">
        <h2 className="text-foreground text-xl font-semibold">
          {t.brand.settingsTitle}
        </h2>
        <p className="text-muted-foreground text-sm">
          {t.brand.settingsDescription}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Help Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`h-12 w-12 ${reducedMotion ? "" : "transition-all"}`}
          aria-label={t.header.getHelp}
        >
          <HelpCircle className="h-6 w-6" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className={`relative h-12 w-12 ${reducedMotion ? "" : "transition-all"}`}
          aria-label={`${t.header.notifications} ${notifications ? t.common.enabled : t.common.disabled}`}
        >
          <Bell className="h-6 w-6" />
          {notifications && (
            <span className="bg-accent absolute top-2 right-2 h-3 w-3 rounded-full" />
          )}
        </Button>

        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`h-12 w-12 ${reducedMotion ? "" : "transition-all"}`}
              aria-label={t.header.changeTheme}
            >
              {theme === "dark" ? (
                <Moon className="h-6 w-6" />
              ) : (
                <Sun className="h-6 w-6" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className="py-3 text-base"
            >
              <Sun className="mr-3 h-5 w-5" />
              {t.header.lightMode}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className="py-3 text-base"
            >
              <Moon className="mr-3 h-5 w-5" />
              {t.header.darkMode}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
