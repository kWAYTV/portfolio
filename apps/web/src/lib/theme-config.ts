/** Theme preset IDs – add new themes here. CSS goes in themes.css */
export const THEME_PRESETS = [
  { id: "default", nameKey: "themePreset_default" },
  { id: "catppuccin", nameKey: "themePreset_catppuccin" },
] as const;

export type ThemePresetId = (typeof THEME_PRESETS)[number]["id"];
export const DEFAULT_THEME: ThemePresetId = "default";
