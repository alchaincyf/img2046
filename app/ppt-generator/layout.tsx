import type { Metadata } from 'next'

const title = '免费在线SVG转PPT工具 - 轻松创建精美演示文稿 | 图像魔方'
const description = '使用图像魔方的在线SVG转PPT工具，轻松将SVG代码转换为精美的PPT幻灯片。支持多页面生成、实时预览、多种导出格式。免费、快速、专业。'
const url = 'https://www.img2046.com/ppt-generator'

export const metadata: Metadata = {
  title,
  description,
  keywords: ['SVG转PPT', 'PPT生成器', '在线PPT制作', '演示文稿生成', 'PPT工具', '幻灯片制作', '免费PPT', 'SVG to PPT'],
  openGraph: {
    title,
    description,
    url,
    siteName: '图像魔方',
    images: [
      {
        url: 'https://www.img2046.com/og-image-ppt.jpg',
        width: 1200,
        height: 630,
        alt: 'PPT生成工具',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.img2046.com/og-image-ppt.jpg'],
  },
  alternates: {
    canonical: url,
  },
}

export default function PPTGeneratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}