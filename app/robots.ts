import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // 禁止访问API路由
          '/firebase/',      // 禁止访问Firebase配置
          '/_next/',         // 禁止访问Next.js内部文件
          '/private/',       // 禁止访问私有文件
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/firebase/'],
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/firebase/'],
        crawlDelay: 0,
      },
    ],
    sitemap: 'https://www.img2046.com/sitemap.xml',
  }
}
