"use client";

interface IdeLayoutEmbedProps {
  children: React.ReactNode;
}

export function IdeLayoutEmbed({ children }: IdeLayoutEmbedProps) {
  return (
    <main
      className="min-h-screen w-full overflow-y-auto"
      data-ide-main
      data-preview
    >
      {children}
    </main>
  );
}
