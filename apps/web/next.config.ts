import type { NextConfig } from "next";

const apiUrl = process.env.API_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    proxyClientMaxBodySize: "60mb",
  },
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${apiUrl}/:path*` },
      { source: "/uploads/:path*", destination: `${apiUrl}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
