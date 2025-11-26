"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState<boolean>(true);
  const { setTheme } = useTheme();

  const handleThemeChange = () => {
    setIsDark(!isDark);
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="inline-flex items-center gap-2">
      <Switch
        aria-label="Toggle switch"
        checked={isDark}
        id="icon-label"
        onCheckedChange={handleThemeChange}
      />
      <Label htmlFor="icon-label">
        <span className="sr-only">Toggle switch</span>
        {isDark ? (
          <MoonIcon aria-hidden="true" className="size-4" />
        ) : (
          <SunIcon aria-hidden="true" className="size-4" />
        )}
      </Label>
    </div>
  );
};

export default ThemeToggle;
