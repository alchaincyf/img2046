import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '拍照学单词 - AI图片识别生成英语单词 | 图像魔方',
  description: '上传照片，AI智能识别图片内容并生成相关英语单词。通过场景化学习，让英语学习更有趣、更高效。支持JPG、PNG、WEBP等格式。',
  keywords: '拍照学单词,AI英语学习,图片识别,英语单词,场景化学习,智能教育',
}

export default function PhotoVocabularyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
