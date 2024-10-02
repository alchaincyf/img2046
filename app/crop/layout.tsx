import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '免费在线图片裁剪工具 - 自由调整图片尺寸和比例 | 图像魔方',
  description: '使用图像魔方的在线图片裁剪工具，轻松调整图片大小和比例。支持多种裁剪比例，操作简单快捷，适用于各种社交媒体平台和设计需求。',
}

export default function CropLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}