/** @type {import('next').NextConfig} */
const nextVersion = require('next/package.json').version;
const majorVersion = Number(nextVersion.split('.')[0]);

const baseConfig = {
  transpilePackages: ['@mui/icons-material'],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const nextConfig =
  majorVersion >= 15
    ? {
        ...baseConfig,
        serverExternalPackages: ['sharp', 'node-fetch', 'form-data'],
      }
    : {
        ...baseConfig,
        experimental: {
          serverComponentsExternalPackages: ['sharp', 'node-fetch', 'form-data'],
        },
      };

module.exports = nextConfig;
