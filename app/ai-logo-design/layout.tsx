import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Logo 设计工具 - 快速生成独特品牌标识 | 图像魔方',
  description: '使用图像魔方的AI Logo设计工具，轻松创建独特的品牌标识。只需输入品牌名称，即可生成专业的SVG格式logo，支持多种下载格式。',
}

export default function AILogoDesignLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}