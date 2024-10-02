import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '免费在线图片尺寸&像素调整工具 - 快速简单调整图片像素大小 | 图像魔方',
  description: '使用图像魔方的在线图片尺寸调整工具，轻松调整图片大小。支持多种格式，保持比例或自定义尺寸，满足各种平台和设计需求。',
}

export default function ResizeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}