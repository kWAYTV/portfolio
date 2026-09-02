interface OgImageProps {
  description?: string;
  subtitle?: string;
  title: string;
}

/* Satori cannot read CSS custom properties; these mirror tokens.css (graphite). */
const PAPER = "#ffffff";
const INK = "#1c1c1c";
const INK_2 = "#4a4a4a";
const MUTED = "#767676";
const RULE = "#e3e3e3";

export function OgImage({ title, description, subtitle }: OgImageProps) {
  return (
    <div
      style={{
        background: PAPER,
        display: "flex",
        height: "100%",
        padding: 48,
        width: "100%",
      }}
    >
      <div
        style={{
          border: `2px solid ${RULE}`,
          borderRadius: 24,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: 64,
          width: "100%",
        }}
      >
        <div
          style={{
            color: MUTED,
            fontFamily: "ui-monospace, monospace",
            fontSize: 24,
          }}
        >
          {subtitle}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: INK,
              fontSize: title.length > 24 ? 60 : 76,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              maxWidth: "92%",
            }}
          >
            {title}
          </div>
          {description ? (
            <div
              style={{
                color: INK_2,
                fontSize: 30,
                lineHeight: 1.4,
                maxWidth: "80%",
              }}
            >
              {description}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
