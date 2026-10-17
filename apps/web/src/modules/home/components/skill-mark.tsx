import type { CSSProperties } from "react";

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

/**
 * A server-rendered link to a tool's homepage. The icon is a `<use>` of a
 * symbol in the shared `/skills.svg` sprite and the short title lives in
 * `data-title` for the rail's single tip, so the mark itself ships no
 * JavaScript.
 * `label` is the full link purpose ("Go website") for screen readers.
 */
export function SkillMark({
  hex,
  href,
  iconHref,
  label,
  tabIndex,
  title,
}: {
  hex: string;
  href: string;
  iconHref: string;
  label: string;
  tabIndex?: number;
  title: string;
}) {
  return (
    <a
      className="skill-mark"
      data-title={title}
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
      <svg aria-hidden="true">
        <use href={iconHref} />
      </svg>
      <span className="sr-only">{label}</span>
    </a>
  );
}
