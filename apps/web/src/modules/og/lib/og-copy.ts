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
      title: "Sobre mí",
    },
  },
  home: {
    en: {
      description:
        "Software developer. Backend services, web apps, and the tools around them.",
      subtitle: "Portfolio",
      title: "Martin Vila",
    },
    es: {
      description:
        "Desarrollador de software. Servicios backend, aplicaciones web y las herramientas que los rodean.",
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
      title: "Proyectos",
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
