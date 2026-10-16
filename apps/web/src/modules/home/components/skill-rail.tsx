import { skills } from "@/modules/home/consts/skills";

function channel(hex: string, start: number) {
  return Number.parseInt(hex.slice(start, start + 2), 16);
}

function onDark(hex: string) {
  const red = channel(hex, 0);
  const green = channel(hex, 2);
  const blue = channel(hex, 4);
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
  if (luminance < 0.28) {
    return "#f4efe6";
  }
  return `#${hex}`;
}

function Mark({
  hex,
  path,
  title,
}: {
  hex: string;
  path: string;
  title: string;
}) {
  return (
    <span
      className="skill-mark"
      style={{
        ["--mark" as string]: `#${hex}`,
        ["--mark-on-dark" as string]: onDark(hex),
      }}
      title={title}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d={path} fill="currentColor" />
      </svg>
      <span className="sr-only">{title}</span>
    </span>
  );
}

export function SkillRail({ label }: { label: string }) {
  return (
    <section aria-label={label} className="marquee">
      <ul className="marquee-track">
        {skills.map((skill) => (
          <li key={skill.title}>
            <Mark hex={skill.hex} path={skill.path} title={skill.title} />
          </li>
        ))}
        {skills.map((skill) => (
          <li aria-hidden="true" key={`${skill.title}-copy`}>
            <Mark hex={skill.hex} path={skill.path} title={skill.title} />
          </li>
        ))}
      </ul>
    </section>
  );
}
