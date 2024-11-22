/** @type {import('next').NextConfig} */
// import withBundleAnalyzer from "@next/bundle-analyzer";
const withBundleAnalyzer = require("@next/bundle-analyzer");

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});
const nextConfig = {
  productionBrowserSourceMaps: true,
  async headers() {
    return [
      {
        source: "/(.*).webp",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "max-age=30, must-revalidate", // Adjust this as needed
          },
        ],
      },
      {
        source: "/.well-known/assetlinks.json",
        locale: false,
        headers: [
          {
            key: "Content-Type",
            value: "application/json",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/.well-known/assetlinks.json",
        destination: "/api/hello",
      },
    ];
  },
  reactStrictMode: false,
};

module.exports = bundleAnalyzer(nextConfig);
