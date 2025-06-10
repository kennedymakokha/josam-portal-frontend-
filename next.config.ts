import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['app.kersacco.co.ke',"localhost","formbuilder.mtandao.app"],
  },
  productionBrowserSourceMaps: false,
  reactStrictMode: true,

  experimental: {
    scrollRestoration: true,
  },
};

export default nextConfig;
