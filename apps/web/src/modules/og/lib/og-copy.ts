export interface OgCopy {
  description?: string;
  subtitle?: string;
  title: string;
}

export const PAGE_COPY: Record<string, Record<string, OgCopy>> = {
  home: {
    en: {
      title: "Martin Vila",
      description: "welcome to my personal space.",
      subtitle: "Portfolio",
    },
    es: {
      title: "Martin Vila",
      description: "Bienvenido a mi espacio personal.",
      subtitle: "Portafolio",
    },
  },
  blog: {
    en: {
      title: "Blog",
      description: "Quiet notes from current work.",
      subtitle: "Martin Vila",
    },
    es: {
      title: "Blog",
      description: "Notas breves del trabajo actual.",
      subtitle: "Martin Vila",
    },
  },
  projects: {
    en: {
      title: "Projects",
      description: "Open source work",
      subtitle: "Martin Vila",
    },
    es: {
      title: "Projects",
      description: "Trabajo open source",
      subtitle: "Martin Vila",
    },
  },
  about: {
    en: {
      title: "About",
      description: "A bit about me",
      subtitle: "Martin Vila",
    },
    es: {
      title: "About",
      description: "Un poco sobre mí",
      subtitle: "Martin Vila",
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
