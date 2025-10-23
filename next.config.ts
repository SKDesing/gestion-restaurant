import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output so Docker multi-stage build can copy the standalone app
  output: "standalone",
  // Removed `output: "export"` to allow dynamic API routes and middleware
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // 禁用 Next.js 热重载，由 nodemon 处理重编译
  reactStrictMode: false,
  webpack: (config, { dev }) => {
    if (dev) {
      // 禁用 webpack 的热模块替换
      config.watchOptions = {
        ignored: ["**/*"], // 忽略所有文件变化
      };
    }
    return config;
  },
  // Next 16+ enables Turbopack by default. Provide an explicit empty turbopack
  // configuration to avoid the "webpack config with no turbopack config" error
  // when the project uses a custom webpack hook below.
  turbopack: {},
};

export default nextConfig;
