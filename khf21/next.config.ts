import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,

  // PWA設定
  reactStrictMode: true,

  // 画像最適化設定
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // モバイル最適化
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
