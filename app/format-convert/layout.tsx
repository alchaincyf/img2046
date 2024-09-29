import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '在线图片格式转换工具 - 支持多种格式互转 | 图像魔方',
  description: '使用图像魔方的在线图片格式转换工具，轻松将图片转换为JPG、PNG、WEBP、GIF等多种格式。快速、免费、无需下载软件，满足各种图片格式需求。',
}

export default function FormatConvertLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}