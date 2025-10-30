"use client";

import { Loader2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const THEME_TOGGLE_DELAY_MS = 200;

export function ModeToggle() {
  const { setTheme, theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const [mounted, setMounted] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setIsChanging(true);
    // Small delay to allow animation to complete
    setTimeout(() => {
      setTheme(currentTheme === "light" ? "dark" : "light");
      setIsChanging(false);
    }, THEME_TOGGLE_DELAY_MS);
  };

  if (!mounted) {
    return (
      <Button className="flex items-center gap-2 p-2" variant="linkHover2">
        <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
        <span className="capitalize">Loading</span>
      </Button>
    );
  }

  return (
    <Button
      aria-label="Toggle theme"
      className="flex items-center gap-1 p-1.5 sm:gap-2 sm:p-2"
      onClick={toggleTheme}
      variant="linkHover2"
    >
      <div
        className={`flex items-center gap-1 sm:gap-2 ${isChanging ? "fade-out zoom-out animate-out duration-200" : "fade-in zoom-in animate-in duration-200"}`}
      >
        {currentTheme === "dark" ? (
          <Sun aria-hidden="true" className="h-4 w-4" />
        ) : (
          <Moon aria-hidden="true" className="h-4 w-4" />
        )}
        <span className="hidden capitalize sm:inline">
          {currentTheme === "dark" ? "Light" : "Dark"}
        </span>
      </div>
    </Button>
  );
}
