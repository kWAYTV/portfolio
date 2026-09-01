interface OgImageProps {
  description?: string;
  subtitle?: string;
  title: string;
}

export function OgImage({ title, description, subtitle }: OgImageProps) {
  return (
    <div
      style={{
        background: "#f4efe3",
        border: "16px solid #c9b89a",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "flex-end",
        padding: 80,
        width: "100%",
      }}
    >
      <div
        style={{
          color: "#2b2218",
          fontSize: title.length > 40 ? 48 : 72,
          fontWeight: 500,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          maxWidth: "90%",
        }}
      >
        {title}
      </div>
      {description ? (
        <div
          style={{
            color: "#5c5144",
            fontSize: 28,
            marginTop: 16,
            maxWidth: "80%",
          }}
        >
          {description}
        </div>
      ) : null}
      {subtitle ? (
        <div
          style={{
            color: "#8a7a66",
            fontFamily: "ui-monospace, monospace",
            fontSize: 22,
            marginTop: 28,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}
