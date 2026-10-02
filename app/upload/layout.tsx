import type { Metadata } from 'next'
import type { ReactNode } from 'react'

// 本页自己的 canonical：不写的话会继承根布局里首页的 canonical，被谷歌当成首页的副本
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.img2046.com/upload',
  },
}

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
