import { Inter } from 'next/font/google'
import './globals.css'
import Layout from './components/Layout'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '图像魔方 The Image Matrix',
  description: '一站式图像处理工具',
  icons: [
    { rel: 'icon', url: '/image-tools-icon.svg' },
    { rel: 'apple-touch-icon', url: '/image-tools-icon.svg' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/image-tools-icon.svg" />
      </head>
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
