import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  sassOptions: {
    // Allow @use '@styles/tokens' etc. to resolve from project root
    loadPaths: [path.resolve(process.cwd())],
    silenceDeprecations: ["legacy-js-api"],
  },
};

export default nextConfig;
