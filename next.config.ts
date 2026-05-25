import type { NextConfig } from "next";
import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {},
};

const config = isDev
  ? nextConfig
  : withPWA({
      dest: "public",
      register: true,
      skipWaiting: true,
    })(nextConfig);

export default config;
