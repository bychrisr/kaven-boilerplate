import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.API_URL 
          ? `${process.env.API_URL}/api/:path*` 
          : 'http://localhost:8000/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: process.env.API_URL
          ? `${process.env.API_URL}/uploads/:path*`
          : 'http://localhost:8000/uploads/:path*',
      }
    ];
  },
};

export default withNextIntl(nextConfig);
