import type { Metadata } from 'next'

const title = '免费在线图片压缩工具 - 免费批量压缩图片 | 图像魔方'
const description = '使用图像魔方的在线图片压缩工具，轻松压缩JPEG、PNG、GIF等格式的图片。保持高质量的同时有效减小文件大小，提升网站加载速度。免费、快速、高效。'
const url = 'https://www.img2046.com/compress'

export const metadata: Metadata = {
  title,
  description,
  keywords: ['图片压缩', '在线压缩', '图片压缩工具', 'JPEG压缩', 'PNG压缩', '批量压缩', '图片优化', '免费压缩'],
  openGraph: {
    title,
    description,
    url,
    siteName: '图像魔方',
    images: [
      {
        url: 'https://www.img2046.com/og-image-compress.jpg',
        width: 1200,
        height: 630,
        alt: '图片压缩工具',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.img2046.com/og-image-compress.jpg'],
  },
  alternates: {
    canonical: url,
  },
}

export default function CompressLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}