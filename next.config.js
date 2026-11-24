/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.watchOptions = {
      ...(config.watchOptions || {}),
      ignored: ["**/node_modules/**", "**/.git/**", "**/.next/**", "/data/**", "/sdcard/**"],
    };
    return config;
  },
};

module.exports = nextConfig;
