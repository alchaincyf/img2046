import type { Metadata } from 'next'

const title = '免费 AI 文生图工具 - 通过文字描述生成独特图像 | 图像魔方'
const description = '使用图像魔方的AI文生图工具，只需输入文字描述即可生成独特的AI图像。激发创意灵感，适用于各种创作场景。'
const url = 'https://www.img2046.com/ai-image-generator'

export const metadata: Metadata = {
  title,
  description,
  keywords: ['AI绘图', 'AI文生图', '人工智能绘画', 'AI图像生成', '文字生成图片', 'AI创作', '免费AI绘图', 'AI art'],
  openGraph: {
    title,
    description,
    url,
    siteName: '图像魔方',
    images: [
      {
        url: 'https://www.img2046.com/og-image-ai-generator.jpg',
        width: 1200,
        height: 630,
        alt: 'AI文生图工具',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.img2046.com/og-image-ai-generator.jpg'],
  },
  alternates: {
    canonical: url,
  },
}

export default function AIImageGeneratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}