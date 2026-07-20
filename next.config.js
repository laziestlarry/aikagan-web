/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export' removed — Vercel SSR enables API routes (webhooks, dynamic pages)
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://autonomax-revenue-lenljbhrqq-uc.a.run.app" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
