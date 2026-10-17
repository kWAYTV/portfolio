import { getTranslations } from "next-intl/server";
import { SkillMark } from "@/modules/home/components/skill-mark";
import { SkillTip } from "@/modules/home/components/skill-tip";
import { skillSites } from "@/modules/home/consts/skill-sites";
import { skills } from "@/modules/home/consts/skills";
import { skillSpriteHref, symbolId } from "@/modules/home/lib/skill-sprite";

/**
 * The marquee needs every mark twice for a seamless loop. Both copies draw
 * their icon from the shared `/skills.svg` sprite, and the marks are plain
 * server HTML: the only client code is the shared hover tip.
 */
export async function SkillRail() {
  const t = await getTranslations("hero");
  return (
    <SkillTip>
      <section aria-label={t("stack")} className="marquee">
        <ul className="marquee-track">
          {skills.map((skill) => (
            <li key={skill.title}>
              <SkillMark
                hex={skill.hex}
                href={skillSites[skill.title]}
                iconHref={`${skillSpriteHref}#${symbolId(skill.title)}`}
                label={t("site", { name: skill.title })}
                title={skill.title}
              />
            </li>
          ))}
          {skills.map((skill) => (
            <li aria-hidden="true" key={`${skill.title}-copy`}>
              <SkillMark
                hex={skill.hex}
                href={skillSites[skill.title]}
                iconHref={`${skillSpriteHref}#${symbolId(skill.title)}`}
                label={t("site", { name: skill.title })}
                tabIndex={-1}
                title={skill.title}
              />
            </li>
          ))}
        </ul>
      </section>
    </SkillTip>
  );
}
