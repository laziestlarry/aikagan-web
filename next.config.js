/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export' removed — Vercel SSR enables API routes (webhooks, dynamic pages)
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
