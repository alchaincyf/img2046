import { Inter } from 'next/font/google'
import './globals.css'
import Layout from './components/Layout'
import Footer from './components/Footer'
import { Metadata } from 'next'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '图像魔方 img2046.com | 一站式图像处理工具',
  description: '图像魔方是一个强大的在线图像处理工具，提供格式转换、裁剪、调整大小、压缩、滤镜、SVG生成器和AI Logo设计等功能。轻松处理您的图片需求。',
  keywords: '图像处理, 格式转换, 图片裁剪, 图片压缩, AI Logo设计, SVG生成器',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://www.img2046.com/',
    siteName: '图像魔方 img2046.com',
    images: [
      {
        url: 'https://www.img2046.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '图像魔方 img2046.com',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@your_twitter_handle',
    creator: '@your_twitter_handle',
  },
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
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/image-tools-icon.svg" />
        <link rel="canonical" href="https://www.img2046.com/" />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FRKGZTH854"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-FRKGZTH854');
          `}
        </Script>
        {/* 结构化数据 */}
        <Script id="structured-data" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "图像魔方 img2046.com",
              "url": "https://www.img2046.com/",
              "description": "图像魔方是一个强大的在线图像处理工具，提供格式转换、裁剪、调整大小、压缩、滤镜、SVG生成器和AI Logo设计等功能。支持JPG、PNG、WEBP、GIF和PDF格式之间的相互转换，文件大小限制为10MB。",
              "applicationCategory": "MultimediaApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "CNY"
              }
            }
          `}
        </Script>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Layout>{children}</Layout>
        <Footer />
      </body>
    </html>
  )
}
