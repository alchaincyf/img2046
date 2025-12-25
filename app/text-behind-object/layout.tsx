import type { Metadata } from 'next'

const title = '人物背景文字工具 - AI智能识别人物添加背景文字 | 图像魔方'
const description = '使用AI技术智能识别图片中的人物，自动将文字放置在人物后方，创造独特的视觉效果。支持自定义文字、颜色、字体，让您的图片更具创意。'
const url = 'https://www.img2046.com/text-behind-object'

export const metadata: Metadata = {
  title,
  description,
  keywords: ['人物背景文字', 'AI识别', '背景文字效果', '人物抠图', '创意文字', '图片特效', 'BodyPix', '智能文字'],
  openGraph: {
    title,
    description,
    url,
    siteName: '图像魔方',
    images: [
      {
        url: 'https://www.img2046.com/og-image-text-behind.jpg',
        width: 1200,
        height: 630,
        alt: '人物背景文字工具',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.img2046.com/og-image-text-behind.jpg'],
  },
  alternates: {
    canonical: url,
  },
}

export default function TextBehindObjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
