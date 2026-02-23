import { baseUrl } from "@/lib/metadata";

export const ogImageSize = { width: 1200, height: 630 } as const;

export const ogImageIconUrl = `${baseUrl.origin}/icon.png`;

// Hex equivalents of .dark theme (globals.css)
export const ogImageColors = {
  background: "#000000",
  foreground: "#ffffff",
  mutedForeground: "#b8b8b8",
} as const;

type OgImageContentProps = {
  title: string;
  subtitle?: string;
};

export function OgImageContent({ title, subtitle }: OgImageContentProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: ogImageColors.background,
        gap: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 96,
          height: 96,
        }}
      >
        {/* biome-ignore lint/performance/noImgElement: ImageResponse needs img for logo URL */}
        <img
          alt=""
          height={96}
          src={ogImageIconUrl}
          style={{ objectFit: "contain" }}
          width={96}
        />
      </div>
      <div
        style={{
          fontSize: 72,
          fontWeight: 500,
          letterSpacing: "-0.025em",
          color: ogImageColors.foreground,
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <div
          style={{
            fontSize: 28,
            color: ogImageColors.mutedForeground,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}
