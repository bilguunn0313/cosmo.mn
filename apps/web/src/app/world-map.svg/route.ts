import { getWorldMapSvg } from "@/lib/world-map";

export const dynamic = "force-static";

export function GET() {
  return new Response(getWorldMapSvg(), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
