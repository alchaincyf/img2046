/** @type {import('next').NextConfig} */
const nextVersion = require('next/package.json').version;
const majorVersion = Number(nextVersion.split('.')[0]);

const nextConfig =
  majorVersion >= 15
    ? {
        serverExternalPackages: ['sharp', 'node-fetch', 'form-data'],
        transpilePackages: ['@mui/icons-material'],
      }
    : {
        experimental: {
          serverComponentsExternalPackages: ['sharp', 'node-fetch', 'form-data'],
        },
        transpilePackages: ['@mui/icons-material'],
      };

module.exports = nextConfig;
