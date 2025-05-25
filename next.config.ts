import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false,
  },
  onDemandEntries: {
    // prevents the overlay from showing errors as you type
    maxInactiveAge: 1000 * 60 * 60,
  },
};

export default nextConfig;