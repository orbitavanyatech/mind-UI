import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [{ source: "/admin", destination: "/admin/dashboard", permanent: false }];
  },
};

export default nextConfig;
