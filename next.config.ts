import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["form-builder.mtandao.app","localhost","3589-41-90-184-236.ngrok-free.app","3589-41-90-184-236.ngrok-free.app"],

    // domains: ['app.kersacco.co.ke',"localhost","formbuilder.mtandao.app"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'form-builder.mtandao.app',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
  productionBrowserSourceMaps: false,
  reactStrictMode: true,

  experimental: {
    scrollRestoration: true,
  },
};

export default nextConfig;
