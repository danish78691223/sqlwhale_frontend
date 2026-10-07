import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.21st.dev",
        pathname: "/assets/**",
      },
    ],
  },
};

export default nextConfig;
