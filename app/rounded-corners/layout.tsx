import { Metadata } from 'next';

const title = '免费在线图片圆角处理工具 - 图片圆角美化 | 图像魔方'
const description = '在线图片圆角处理工具，支持图片裁剪和圆角程度调整。轻松为您的图片添加圆角效果，提升视觉效果。免费、快速、操作简单。'
const url = 'https://www.img2046.com/rounded-corners'

export const metadata: Metadata = {
  title,
  description,
  keywords: ['圆角处理', '图片圆角', '圆角图片', '图片美化', '圆角边框', '在线图片编辑', '免费圆角', '图片圆角工具'],
  openGraph: {
    title,
    description,
    url,
    siteName: '图像魔方',
    images: [
      {
        url: 'https://www.img2046.com/og-image-rounded.jpg',
        width: 1200,
        height: 630,
        alt: '圆角处理工具',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.img2046.com/og-image-rounded.jpg'],
  },
  alternates: {
    canonical: url,
  },
};

export default function RoundedCornersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
