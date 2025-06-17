import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['formbuilder.mtandao.app'],

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
