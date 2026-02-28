type OgImageProps = {
  title: string;
  description?: string;
  /** Optional subtitle below description (e.g. "Portfolio", "Blog") */
  subtitle?: string;
};

const BG = "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)";

export function OgImage({ title, description, subtitle }: OgImageProps) {
  return (
    <div
      style={{
        background: BG,
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
          fontSize: title.length > 40 ? 48 : 72,
          fontWeight: 600,
          color: "#ffffff",
          letterSpacing: "-0.02em",
          textAlign: "center",
          maxWidth: "90%",
        }}
      >
        {title}
      </div>
      {description && (
        <div
          style={{
            fontSize: 28,
            color: "#a3a3a3",
            marginTop: 16,
            textAlign: "center",
            maxWidth: "85%",
          }}
        >
          {description}
        </div>
      )}
      {subtitle && (
        <div
          style={{
            fontSize: 24,
            color: "#525252",
            marginTop: description ? 32 : 48,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}
