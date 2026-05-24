/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export' removed — Vercel SSR enables API routes (webhooks, dynamic pages)
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
