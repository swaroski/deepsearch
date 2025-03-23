import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    domains: ['https://deepreach.netlify.app'], // Add any external image hosts used by next/image
  },
  typescript: {
    ignoreBuildErrors: false, // make this true temporarily to debug TypeScript
  },
  env: {
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY, // Add any runtime env variables here
  },
};

export default nextConfig;
