import type en from "../translations/en.json";
import type { config } from "./config";

export type Messages = typeof en;
export type Locale = keyof typeof config.locales;
