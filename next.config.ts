import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "wallpapercave.com",
      },
      {
        protocol: "https",
        hostname: "assets.vogue.com",
      },
      {
        protocol: "https",
        hostname: "media.vogue.com",
      },
      {
        protocol: "https",
        hostname: "media.glamour.com",
      },
      {
        protocol: "https",
        hostname: "media.gq.com",
      },
    ],
  },
  serverExternalPackages: ["better-sqlite3"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: "/bookappointment",
        destination: "/book-appointment",
        permanent: true,
      },
      {
        source: "/id/en/bookappointment",
        destination: "/book-appointment",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/terms-and-conditions",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/id/en/cart",
        destination: "/cart",
        permanent: true,
      },
      {
        source: "/id/en/cart/:path*",
        destination: "/cart",
        permanent: true,
      },
      {
        source: "/id/en/login",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/id/en/login/:path*",
        destination: "/login",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
