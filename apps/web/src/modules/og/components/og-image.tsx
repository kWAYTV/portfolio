interface OgImageProps {
  description?: string;
  subtitle?: string;
  title: string;
}

export function OgImage({ title, description, subtitle }: OgImageProps) {
  return (
    <div
      style={{
        background: "#fcfcfc",
        borderBottom: "12px solid #111",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: 72,
        width: "100%",
      }}
    >
      <div
        style={{
          color: "#666",
          fontFamily: "ui-monospace, monospace",
          fontSize: 22,
          letterSpacing: "0.09em",
          textTransform: "uppercase",
        }}
      >
        {subtitle}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            color: "#111",
            fontSize: title.length > 40 ? 56 : 88,
            fontWeight: 800,
            letterSpacing: "-0.045em",
            lineHeight: 0.95,
            maxWidth: "92%",
            textTransform: "lowercase",
          }}
        >
          {title}
        </div>
        {description ? (
          <div style={{ color: "#444", fontSize: 28, maxWidth: "80%" }}>
            {description}
          </div>
        ) : null}
      </div>
    </div>
  );
}
