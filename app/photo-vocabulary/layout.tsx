import type { Metadata } from 'next'

const title = '拍照学单词 - AI图片识别生成英语单词 | 图像魔方'
const description = '上传照片，AI智能识别图片内容并生成相关英语单词。通过场景化学习，让英语学习更有趣、更高效。支持JPG、PNG、WEBP等格式。'
const url = 'https://www.img2046.com/photo-vocabulary'

export const metadata: Metadata = {
  title,
  description,
  keywords: ['拍照学单词', 'AI英语学习', '图片识别', '英语单词', '场景化学习', '智能教育', 'AI识图', '单词学习'],
  openGraph: {
    title,
    description,
    url,
    siteName: '图像魔方',
    images: [
      {
        url: 'https://www.img2046.com/og-image-vocabulary.jpg',
        width: 1200,
        height: 630,
        alt: '拍照学单词工具',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.img2046.com/og-image-vocabulary.jpg'],
  },
  alternates: {
    canonical: url,
  },
}

export default function PhotoVocabularyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
