import type { Metadata } from 'next'

const title = '在线文字卡片生成器 - 创建精美文字图片 | 图像魔方'
const description = '使用图像魔方的在线文字卡片生成器，轻松创建精美的文字图片。自定义字体、颜色和背景，适合社交媒体分享和营销使用。支持多种样式和格式。'
const url = 'https://www.img2046.com/text-card-generator'

export const metadata: Metadata = {
  title,
  description,
  keywords: ['文字卡片', '文字图片生成', '卡片设计', '语录卡片', '文字海报', '社交卡片', '免费卡片制作', '文字转图片'],
  openGraph: {
    title,
    description,
    url,
    siteName: '图像魔方',
    images: [
      {
        url: 'https://www.img2046.com/og-image-text-card.jpg',
        width: 1200,
        height: 630,
        alt: '文字卡片生成器',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.img2046.com/og-image-text-card.jpg'],
  },
  alternates: {
    canonical: url,
  },
}

export default function TextCardGeneratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}