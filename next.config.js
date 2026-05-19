/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
