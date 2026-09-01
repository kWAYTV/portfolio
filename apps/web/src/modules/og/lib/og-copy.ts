export interface OgCopy {
  description?: string;
  subtitle?: string;
  title: string;
}

export const PAGE_COPY: Record<string, Record<string, OgCopy>> = {
  about: {
    en: {
      description: "A bit about me",
      subtitle: "Martin Vila",
      title: "About",
    },
    es: {
      description: "Un poco sobre mí",
      subtitle: "Martin Vila",
      title: "About",
    },
  },
  blog: {
    en: {
      description: "Quiet notes from current work.",
      subtitle: "Martin Vila",
      title: "Blog",
    },
    es: {
      description: "Notas breves del trabajo actual.",
      subtitle: "Martin Vila",
      title: "Blog",
    },
  },
  home: {
    en: {
      description: "welcome to my personal space.",
      subtitle: "Portfolio",
      title: "Martin Vila",
    },
    es: {
      description: "Bienvenido a mi espacio personal.",
      subtitle: "Portafolio",
      title: "Martin Vila",
    },
  },
  projects: {
    en: {
      description: "Open source work",
      subtitle: "Martin Vila",
      title: "Projects",
    },
    es: {
      description: "Trabajo open source",
      subtitle: "Martin Vila",
      title: "Projects",
    },
  },
};

const FALLBACK_SUBTITLE = "Martin Vila";

export function getStaticOgCopy(
  pageType: keyof typeof PAGE_COPY,
  locale: string
): OgCopy {
  const copy = PAGE_COPY[pageType]?.[locale] ?? PAGE_COPY[pageType]?.en;
  return {
    ...copy,
    subtitle: copy?.subtitle ?? FALLBACK_SUBTITLE,
  };
}
