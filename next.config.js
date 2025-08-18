/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: false,
  experimental: {
    optimizeCss: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
