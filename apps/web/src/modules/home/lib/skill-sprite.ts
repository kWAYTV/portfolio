import { createHash } from "node:crypto";
import { skills } from "@/modules/home/consts/skills";

export function symbolId(title: string) {
  return `skill-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

/**
 * Every stack icon as one `<symbol>` sprite. Served from `/skills.svg` and drawn
 * with `<use href="/skills.svg#id">`, so the paths (a third of the gzipped home
 * document when inlined, and serialised twice: HTML plus RSC payload) travel
 * once, after first paint, and stay in the browser cache across pages.
 */
export function renderSkillSprite() {
  const symbols = skills
    .map(
      (skill) =>
        `<symbol id="${symbolId(skill.title)}" viewBox="${
          "viewBox" in skill ? skill.viewBox : "0 0 24 24"
        }"><path d="${skill.path}" fill="currentColor"/></symbol>`
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>`;
}

// The immutable URL changes whenever a mark does.
export const skillSpriteHref = `/skills.svg?v=${createHash("sha1")
  .update(renderSkillSprite())
  .digest("base64url")
  .slice(0, 8)}`;
