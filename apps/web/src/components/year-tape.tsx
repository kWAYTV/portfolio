import type { ContributionCalendar } from "@repo/github";

const TAPE_HEIGHT = 72;
const TICK_GAP = 2;
const BASELINE = 2;

export function YearTape({
  calendar,
  caption,
  emptyLabel,
}: {
  calendar: ContributionCalendar | null;
  caption: string;
  emptyLabel: string;
}) {
  if (!calendar || calendar.days.length === 0) {
    return (
      <p className="font-mono text-[length:var(--text-xs)] text-[var(--color-muted)]">
        {emptyLabel}
      </p>
    );
  }

  const max = calendar.days.reduce((high, day) => Math.max(high, day.count), 0);
  const width = Math.max(calendar.days.length * TICK_GAP, 1);
  const monthMarks = monthLabels(calendar.days);

  return (
    <figure className="min-w-0">
      <svg
        aria-label={caption}
        className="block h-auto w-full overflow-visible"
        role="img"
        viewBox={`0 0 ${width} ${TAPE_HEIGHT + 18}`}
      >
        <title>{caption}</title>
        {calendar.days.map((day, index) => {
          const ratio = max === 0 ? 0 : day.count / max;
          const tickHeight =
            day.count === 0 ? BASELINE : Math.max(4, ratio * TAPE_HEIGHT);
          const x = index * TICK_GAP;
          return (
            <rect
              fill="var(--color-tape)"
              height={tickHeight}
              key={day.date}
              opacity={day.count === 0 ? 0.22 : 0.4 + ratio * 0.6}
              width="1.4"
              x={x}
              y={TAPE_HEIGHT - tickHeight}
            >
              <title>{`${day.date} · ${day.count}`}</title>
            </rect>
          );
        })}
        {monthMarks.map((mark) => (
          <text
            className="fill-[var(--color-muted)]"
            fontFamily="var(--font-mono)"
            fontSize="8"
            key={mark.label}
            x={mark.x}
            y={TAPE_HEIGHT + 14}
          >
            {mark.label}
          </text>
        ))}
      </svg>
      <figcaption className="mt-[var(--space-sm)] font-mono text-[length:var(--text-xs)] text-[var(--color-muted)] tabular-nums">
        {caption}
      </figcaption>
    </figure>
  );
}

function monthLabels(days: ContributionCalendar["days"]) {
  const marks: Array<{ label: string; x: number }> = [];
  let lastMonth = "";

  for (const [index, day] of days.entries()) {
    const month = day.date.slice(0, 7);
    if (month === lastMonth) {
      continue;
    }
    lastMonth = month;
    const date = new Date(`${day.date}T00:00:00Z`);
    marks.push({
      label: date.toLocaleString("en", { month: "short", timeZone: "UTC" }),
      x: index * TICK_GAP,
    });
  }

  return marks;
}
