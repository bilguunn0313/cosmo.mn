import { COUNTRY_CODES } from "@cosmo/shared";
import * as flagSvgs from "country-flag-icons/string/3x2";

export const dynamicParams = false;

export function generateStaticParams() {
  return COUNTRY_CODES.map((code) => ({ file: `${code}.svg` }));
}

export async function GET(_request: Request, context: RouteContext<"/flags/[file]">) {
  const { file } = await context.params;
  const code = file.replace(/\.svg$/, "") as keyof typeof flagSvgs;
  const svg = flagSvgs[code];

  if (!svg) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
