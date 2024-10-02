import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '免费 AI 文生图工具 - 通过文字描述生成独特图像 | 图像魔方',
  description: '使用图像魔方的AI文生图工具，只需输入文字描述即可生成独特的AI图像。激发创意灵感，适用于各种创作场景。',
}

export default function AIImageGeneratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}