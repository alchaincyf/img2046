import type { Metadata } from 'next'

const title = '免费在线图片尺寸&像素调整工具 - 快速简单调整图片像素大小 | 图像魔方'
const description = '使用图像魔方的在线图片尺寸调整工具，轻松调整图片大小。支持多种格式，保持比例或自定义尺寸，满足各种平台和设计需求。'
const url = 'https://www.img2046.com/resize'

export const metadata: Metadata = {
  title,
  description,
  keywords: ['图片缩放', '调整尺寸', '图片大小调整', '像素调整', '图片resize', '尺寸修改', '免费调整', '批量调整'],
  openGraph: {
    title,
    description,
    url,
    siteName: '图像魔方',
    images: [
      {
        url: 'https://www.img2046.com/og-image-resize.jpg',
        width: 1200,
        height: 630,
        alt: '图片尺寸调整工具',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.img2046.com/og-image-resize.jpg'],
  },
  alternates: {
    canonical: url,
  },
}

export default function ResizeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}