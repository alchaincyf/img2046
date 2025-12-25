import type { Metadata } from 'next'

const title = 'AI Logo 设计工具 - 快速生成独特品牌标识 | 图像魔方'
const description = '使用图像魔方的AI Logo设计工具，轻松创建独特的品牌标识。只需输入品牌名称，即可生成专业的SVG格式logo，支持多种下载格式。'
const url = 'https://www.img2046.com/ai-logo-design'

export const metadata: Metadata = {
  title,
  description,
  keywords: ['AI Logo设计', 'Logo生成器', '品牌标识设计', 'AI标志设计', 'SVG Logo', '免费Logo制作', 'Logo生成工具', '在线Logo设计'],
  openGraph: {
    title,
    description,
    url,
    siteName: '图像魔方',
    images: [
      {
        url: 'https://www.img2046.com/og-image-logo.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Logo设计工具',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.img2046.com/og-image-logo.jpg'],
  },
  alternates: {
    canonical: url,
  },
}

export default function AILogoDesignLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}