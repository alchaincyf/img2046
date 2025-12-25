import type { Metadata } from 'next';

const title = '自由画布 - 创意设计工作空间 | 图像魔方'
const description = '无限画布创作空间，支持图片编辑、绘图和多元素组合。在线图片编辑器，支持图层管理、文本编辑、图形绘制，释放你的创意。'
const url = 'https://www.img2046.com/free-canvas'

export const metadata: Metadata = {
  title,
  description,
  keywords: ['在线画布', '图片编辑器', '自由画布', '在线设计', '图层编辑', '创意设计', '免费画板', 'Konva编辑器'],
  openGraph: {
    title,
    description,
    url,
    siteName: '图像魔方',
    images: [
      {
        url: 'https://www.img2046.com/og-image-canvas.jpg',
        width: 1200,
        height: 630,
        alt: '自由画布编辑器',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.img2046.com/og-image-canvas.jpg'],
  },
  alternates: {
    canonical: url,
  },
};

export default function FreeCanvasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Google Fonts - 中文字体 */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100;300;400;500;700;900&family=Noto+Serif+SC:wght@200;300;400;500;600;700;900&family=ZCOOL+KuaiLe&family=ZCOOL+QingKe+HuangYou&family=ZCOOL+XiaoWei&family=Ma+Shan+Zheng&family=Zhi+Mang+Xing&family=Liu+Jian+Mao+Cao&display=swap"
        rel="stylesheet"
      />
      {/* Google Fonts - 英文字体 */}
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&family=Open+Sans:wght@300;400;500;600;700;800&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&family=Oswald:wght@200;300;400;500;600;700&family=Pacifico&family=Dancing+Script:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}