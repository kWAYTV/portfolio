/** biome-ignore lint/performance/noBarrelFile: package entry point */
export { config } from "./config";
export { getMessagesForLocale } from "./lib/messages";
export type { Locale, Messages } from "./types";
