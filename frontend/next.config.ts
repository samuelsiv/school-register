import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    experimental: {
        viewTransition: true,
        //ppr: 'incremental'
    },
};

export default nextConfig;
