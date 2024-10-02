import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '免费在线图片压缩工具 - 免费批量压缩图片 | 图像魔方',
  description: '使用图像魔方的在线图片压缩工具，轻松压缩JPEG、PNG、GIF等格式的图片。保持高质量的同时有效减小文件大小，提升网站加载速度。免费、快速、高效。',
}

export default function CompressLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}