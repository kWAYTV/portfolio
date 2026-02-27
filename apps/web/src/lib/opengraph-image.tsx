import { ImageResponse } from "next/og";
import { siteName } from "@/lib/metadata";

export const defaultOgSize = { width: 1200, height: 630 };

export function createDefaultOgImage() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #171717 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 48,
      }}
    >
      <div
        style={{
          fontSize: 56,
          fontWeight: 600,
          color: "white",
          letterSpacing: "-0.02em",
        }}
      >
        {siteName}
      </div>
      <div
        style={{
          fontSize: 24,
          color: "rgba(255,255,255,0.6)",
          marginTop: 12,
        }}
      >
        developer · gamer · self-taught
      </div>
    </div>,
    defaultOgSize
  );
}
