import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'safelogist.net',
        pathname: '/static/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/static/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        pathname: '/static/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
