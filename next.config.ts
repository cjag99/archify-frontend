import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: [
    "@antv/x6",
    "@antv/x6-react-shape",
  ],
};

export default nextConfig;
