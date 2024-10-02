import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '免费在线SVG转PPT工具 - 轻松创建精美演示文稿 | 图像魔方',
  description: '使用图像魔方的在线SVG转PPT工具，轻松将SVG代码转换为精美的PPT幻灯片。支持多页面生成、实时预览、多种导出格式。免费、快速、专业。',
}

export default function PPTGeneratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}