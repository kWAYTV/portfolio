"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const ZONE = "Europe/Madrid";

export function LocalClock() {
  const t = useTranslations("hero");
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      hourCycle: "h23",
      minute: "2-digit",
      second: "2-digit",
      timeZone: ZONE,
    });
    const tick = () => setLabel(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className="clock">
      <span className="meta">{t("time")}</span>
      <time dateTime={label ?? undefined} suppressHydrationWarning>
        {label ?? "––:––:––"}
      </time>
    </p>
  );
}
