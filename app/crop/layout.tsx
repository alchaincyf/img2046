import type { Metadata } from 'next'

const title = '免费在线图片裁剪工具 - 自由调整图片尺寸和比例 | 图像魔方'
const description = '使用图像魔方的在线图片裁剪工具，轻松调整图片大小和比例。支持多种裁剪比例，操作简单快捷，适用于各种社交媒体平台和设计需求。'
const url = 'https://www.img2046.com/crop'

export const metadata: Metadata = {
  title,
  description,
  keywords: ['图片裁剪', '在线裁剪', '图片剪裁', '裁剪工具', '图片尺寸调整', '照片裁剪', '免费裁剪', '比例裁剪'],
  openGraph: {
    title,
    description,
    url,
    siteName: '图像魔方',
    images: [
      {
        url: 'https://www.img2046.com/og-image-crop.jpg',
        width: 1200,
        height: 630,
        alt: '图片裁剪工具',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.img2046.com/og-image-crop.jpg'],
  },
  alternates: {
    canonical: url,
  },
}

export default function CropLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}