"use client";

import type { CSSProperties } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function channel(hex: string, start: number) {
  return Number.parseInt(hex.slice(start, start + 2), 16);
}

function onDark(hex: string) {
  const red = channel(hex, 0);
  const green = channel(hex, 2);
  const blue = channel(hex, 4);
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
  if (luminance < 0.28) {
    return "#e8e8e8";
  }
  return `#${hex}`;
}

export function SkillMark({
  hex,
  href,
  path,
  tabIndex,
  title,
  viewBox = "0 0 24 24",
}: {
  hex: string;
  href: string;
  path: string;
  tabIndex?: number;
  title: string;
  viewBox?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          className="skill-mark"
          href={href}
          rel="noreferrer noopener"
          style={
            {
              "--mark": `#${hex}`,
              "--mark-on-dark": onDark(hex),
            } as CSSProperties
          }
          tabIndex={tabIndex}
          target="_blank"
        >
          <svg aria-hidden="true" viewBox={viewBox}>
            <path d={path} fill="currentColor" />
          </svg>
          <span className="sr-only">{title}</span>
        </a>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={8}>
        {title}
      </TooltipContent>
    </Tooltip>
  );
}
