"use client";

interface ExperienceItem {
  company: string;
  id: string;
  period: string;
  periodLabel: string;
  role: string;
}

interface ExperienceTimelineClientProps {
  columns: {
    company: string;
    period: string;
    role: string;
  };
  items: ExperienceItem[];
}

export function ExperienceTimelineClient({
  columns,
  items,
}: ExperienceTimelineClientProps) {
  return (
    <div className="surface-panel overflow-hidden">
      <table className="w-full min-w-0 border-collapse text-left">
        <caption className="sr-only">{columns.role}</caption>
        <thead className="border-border border-b">
          <tr className="font-mono-label text-muted-foreground">
            <th className="px-3 py-2.5 font-medium sm:px-4" scope="col">
              {columns.period}
            </th>
            <th className="px-3 py-2.5 font-medium sm:px-4" scope="col">
              {columns.company}
            </th>
            <th
              className="hidden px-3 py-2.5 font-medium sm:table-cell sm:px-4"
              scope="col"
            >
              {columns.role}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isActive = item.period.toLowerCase().includes("present");
            return (
              <tr className="row-hairline align-top" key={item.id}>
                <td className="px-3 py-3 font-mono text-[11px] text-muted-foreground tabular-nums sm:px-4 sm:text-xs">
                  <span
                    className={
                      isActive ? "text-[var(--color-accent-signal)]" : undefined
                    }
                  >
                    {item.periodLabel}
                  </span>
                </td>
                <td className="px-3 py-3 sm:px-4">
                  <div className="font-display font-medium text-foreground text-sm tracking-tight">
                    {item.company}
                  </div>
                  <div className="mt-1 text-muted-foreground text-xs sm:hidden">
                    {item.role}
                  </div>
                </td>
                <td className="hidden px-3 py-3 text-muted-foreground text-sm sm:table-cell sm:px-4">
                  {item.role}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
