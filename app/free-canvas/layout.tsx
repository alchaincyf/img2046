import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '自由画布 - 创意设计工作空间',
  description: '无限画布创作空间，支持图片编辑、绘图和多元素组合',
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