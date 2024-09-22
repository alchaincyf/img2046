/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
  },
  images: {
    domains: ['api.siliconflow.cn'],
  },
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true }
    return config
  },
  serverRuntimeConfig: {
    // 这里设置服务器端的配置
    api: {
      bodyParser: {
        sizeLimit: '10mb',
      },
    },
    serverTimeout: 59, // 设置服务器超时时间为59秒
  },
}

module.exports = nextConfig