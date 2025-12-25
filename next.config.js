/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['sharp', 'node-fetch', 'form-data'],
  transpilePackages: ['@mui/icons-material'],
};

module.exports = nextConfig
