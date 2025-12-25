import type { Metadata } from 'next'

const title = '免费在线图片滤镜工具 - 一键美化您的照片 | 图像魔方'
const description = '使用图像魔方的在线图片滤镜工具，轻松为您的照片添加各种滤镜效果。提供多种滤镜选项，让您的图片更具吸引力。简单易用，无需下载软件。'
const url = 'https://www.img2046.com/filter'

export const metadata: Metadata = {
  title,
  description,
  keywords: ['图片滤镜', '照片滤镜', '在线滤镜', '图片美化', '照片特效', '滤镜效果', '免费滤镜', '图片编辑'],
  openGraph: {
    title,
    description,
    url,
    siteName: '图像魔方',
    images: [
      {
        url: 'https://www.img2046.com/og-image-filter.jpg',
        width: 1200,
        height: 630,
        alt: '图片滤镜工具',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.img2046.com/og-image-filter.jpg'],
  },
  alternates: {
    canonical: url,
  },
}

export default function FilterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}