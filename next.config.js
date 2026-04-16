const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_URL_INTERNAL: process.env.NEXTAUTH_URL_INTERNAL ?? process.env.NEXTAUTH_URL,
  },
  experimental: {
    serverComponentsExternalPackages: ['@vercel/postgres'],
  },
}

module.exports = withPWA(nextConfig);
