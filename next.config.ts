// This file is used to configure Next.js settings and behaviors.
// It includes settings for TypeScript, ESLint, and other Next.js features.
// It also includes a custom Webpack configuration to handle specific file types and modules.
// The configuration is exported as a default export, which is the standard way to export configurations in Next.js.
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*", // Proxy to backend
      },
    ];
  },
};

export default nextConfig;
