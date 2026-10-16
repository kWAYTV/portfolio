import { TooltipProvider } from "@/components/ui/tooltip";
import { SkillMark } from "@/modules/home/components/skill-mark";
import { skillSites } from "@/modules/home/consts/skill-sites";
import { skills } from "@/modules/home/consts/skills";

export function SkillRail({ label }: { label: string }) {
  return (
    <TooltipProvider delayDuration={280} skipDelayDuration={120}>
      <section aria-label={label} className="marquee">
        <ul className="marquee-track">
          {skills.map((skill) => (
            <li key={skill.title}>
              <SkillMark
                hex={skill.hex}
                href={skillSites[skill.title]}
                path={skill.path}
                title={skill.title}
                viewBox={"viewBox" in skill ? skill.viewBox : undefined}
              />
            </li>
          ))}
          {skills.map((skill) => (
            <li aria-hidden="true" key={`${skill.title}-copy`}>
              <SkillMark
                hex={skill.hex}
                href={skillSites[skill.title]}
                path={skill.path}
                tabIndex={-1}
                title={skill.title}
                viewBox={"viewBox" in skill ? skill.viewBox : undefined}
              />
            </li>
          ))}
        </ul>
      </section>
    </TooltipProvider>
  );
}
