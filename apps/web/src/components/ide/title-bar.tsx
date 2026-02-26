"use client";

export function TitleBar() {
  return (
    <div className="flex h-9 shrink-0 items-center border-b border-[var(--ide-border)] bg-[var(--ide-titlebar)] px-4">
      <div className="hidden items-center gap-2 md:flex">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
      </div>
      <div className="flex-1 text-center">
        <span className="text-[var(--ide-titlebar-fg)] text-xs font-medium tracking-wide">
          Martin Vila — Portfolio
        </span>
      </div>
      <div className="hidden w-[52px] md:block" />
    </div>
  );
}
