import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth-cookie";
import { API_URL, PUBLIC_CONTENT_TAG } from "@/lib/public-api";

async function isAdmin(token: string) {
  const response = await fetch(new URL("/auth/me", API_URL), {
    headers: { cookie: `${ACCESS_TOKEN_COOKIE}=${token}` },
    cache: "no-store",
  });

  return response.ok;
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token || !(await isAdmin(token))) {
    return new Response(null, { status: 401 });
  }

  revalidateTag(PUBLIC_CONTENT_TAG, { expire: 0 });
  return new Response(null, { status: 204 });
}
