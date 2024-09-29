import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '在线文字卡片生成器 - 创建精美文字图片 | 图像魔方',
  description: '使用图像魔方的在线文字卡片生成器，轻松创建精美的文字图片。自定义字体、颜色和背景，适合社交媒体分享和营销使用。支持多种样式和格式。',
}

export default function TextCardGeneratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}