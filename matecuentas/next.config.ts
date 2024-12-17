import { NextConfig } from 'next';
import { Configuration } from 'webpack';

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  experimental: {
    // Cambiar a false si no estás usando la carpeta `app`
    appDir: false,
  },
  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve?.fallback,
          fs: false,
        },
      };
    }
    return config;
  },
};

export default nextConfig;
