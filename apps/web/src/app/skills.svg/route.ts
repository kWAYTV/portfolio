import { renderSkillSprite } from "@/modules/home/lib/skill-sprite";

export function GET() {
  return new Response(renderSkillSprite(), {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": "image/svg+xml; charset=utf-8",
    },
  });
}
