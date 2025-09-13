/** @type {import('next').NextConfig} */
// import withBundleAnalyzer from "@next/bundle-analyzer";
const withBundleAnalyzer = require("@next/bundle-analyzer");
const path = require("path");
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});
const nextConfig = {
  transpilePackages: [
    "mui-tel-input",
    "feather-icons-react",
    "@mui/x-data-grid",
    "@mui/x-data-grid-pro",
    "@mui/x-data-grid-premium",
  ],
  productionBrowserSourceMaps: true,
  async headers() {
    return [
      {
        source: "/",
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
            value: "public, max-age=31536000, immutable", // Adjust this as needed
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
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      // deep import resolution
      "react-dom/client": path.resolve(
        __dirname,
        "node_modules/react-dom/client"
      ),
    };
    return config;
  },
};

module.exports = bundleAnalyzer(nextConfig);
