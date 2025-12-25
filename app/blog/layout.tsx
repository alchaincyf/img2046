import type { Metadata } from 'next'

const title = '图像处理知识库 - 技巧教程与工具指南 | 图像魔方'
const description = '图像魔方知识库提供图片处理技巧、工具使用教程、SEO优化指南等专业内容。涵盖图片压缩、格式转换、AI绘图等热门话题，助您提升图片处理技能。'
const url = 'https://www.img2046.com/blog'

export const metadata: Metadata = {
  title,
  description,
  keywords: ['图片处理教程', '图像处理技巧', 'SEO优化', '图片压缩指南', '格式转换教程', 'AI绘图教程', '在线工具教程'],
  openGraph: {
    title,
    description,
    url,
    siteName: '图像魔方',
    images: [
      {
        url: 'https://www.img2046.com/og-image-blog.jpg',
        width: 1200,
        height: 630,
        alt: '图像魔方知识库',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.img2046.com/og-image-blog.jpg'],
  },
  alternates: {
    canonical: url,
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
