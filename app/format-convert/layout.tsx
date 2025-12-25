import type { Metadata } from 'next'

const title = '在线图片格式转换工具 - 支持多种格式互转 | 图像魔方'
const description = '使用图像魔方的在线图片格式转换工具，轻松将图片转换为JPG、PNG、WEBP、GIF等多种格式。快速、免费、无需下载软件，满足各种图片格式需求。'
const url = 'https://www.img2046.com/format-convert'

export const metadata: Metadata = {
  title,
  description,
  keywords: ['图片格式转换', '格式转换', 'JPG转PNG', 'PNG转JPG', 'WEBP转换', 'HEIC转JPG', '图片转换器', '免费转换'],
  openGraph: {
    title,
    description,
    url,
    siteName: '图像魔方',
    images: [
      {
        url: 'https://www.img2046.com/og-image-convert.jpg',
        width: 1200,
        height: 630,
        alt: '图片格式转换工具',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.img2046.com/og-image-convert.jpg'],
  },
  alternates: {
    canonical: url,
  },
}

export default function FormatConvertLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}