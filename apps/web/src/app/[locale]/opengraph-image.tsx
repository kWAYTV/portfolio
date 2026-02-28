import { ImageResponse } from "next/og";

export const alt = "Martin Vila — Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const taglineByLocale: Record<string, string> = {
  en: "welcome to my personal space.",
  es: "Bienvenido a mi espacio personal.",
};

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tagline = taglineByLocale[locale] ?? taglineByLocale.en;

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            color: "#ffffff",
            letterSpacing: "-0.02em",
          }}
        >
          Martin Vila
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#a3a3a3",
            marginTop: 16,
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#525252",
            marginTop: 48,
          }}
        >
          Portfolio
        </div>
      </div>
    ),
    { ...size }
  );
}
