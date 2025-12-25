import type { Metadata } from 'next'

const title = '免费在线SVG编辑器 - 创建和编辑矢量图形 | 图像魔方'
const description = '使用图像魔方的在线SVG编辑器，轻松创建和编辑SVG矢量图形。支持多种图形元素，实时预览，适用于各种设计需求。免费、易用、功能强大。'
const url = 'https://www.img2046.com/svg-generator'

export const metadata: Metadata = {
  title,
  description,
  keywords: ['SVG编辑器', '在线SVG', '矢量图形编辑', 'SVG生成器', '矢量设计', 'SVG制作', '免费SVG工具', 'SVG在线编辑'],
  openGraph: {
    title,
    description,
    url,
    siteName: '图像魔方',
    images: [
      {
        url: 'https://www.img2046.com/og-image-svg.jpg',
        width: 1200,
        height: 630,
        alt: 'SVG编辑器',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.img2046.com/og-image-svg.jpg'],
  },
  alternates: {
    canonical: url,
  },
}

export default function SVGGeneratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}