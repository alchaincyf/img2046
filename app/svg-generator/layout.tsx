import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '免费在线SVG编辑器 - 创建和编辑矢量图形 | 图像魔方',
  description: '使用图像魔方的在线SVG编辑器，轻松创建和编辑SVG矢量图形。支持多种图形元素，实时预览，适用于各种设计需求。免费、易用、功能强大。',
}

export default function SVGGeneratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}