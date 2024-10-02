import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '免费在线图片滤镜工具 - 一键美化您的照片 | 图像魔方',
  description: '使用图像魔方的在线图片滤镜工具，轻松为您的照片添加各种滤镜效果。提供多种滤镜选项，让您的图片更具吸引力。简单易用，无需下载软件。',
}

export default function FilterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}