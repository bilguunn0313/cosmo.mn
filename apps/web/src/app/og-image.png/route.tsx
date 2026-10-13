import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo";

export const dynamic = "force-static";

const WIDTH = 1200;
const HEIGHT = 630;

export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        color: "white",
        backgroundImage: "linear-gradient(120deg, #1f2a7a 0%, #2f6fc4 100%)",
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 600, opacity: 0.85 }}>
        cosmo.mn
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: -4 }}>
          {SITE_NAME}
        </div>
        <div style={{ fontSize: 44, opacity: 0.85 }}>
          Official distributor of international brands in Mongolia
        </div>
      </div>
    </div>,
    { width: WIDTH, height: HEIGHT },
  );
}
