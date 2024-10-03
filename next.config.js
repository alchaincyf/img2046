/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'node-fetch', 'form-data'],
  },
}

module.exports = nextConfig