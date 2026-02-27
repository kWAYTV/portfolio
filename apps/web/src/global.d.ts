import type { Messages } from "@repo/i18n";

declare global {
  interface IntlMessages extends Messages {}
}
