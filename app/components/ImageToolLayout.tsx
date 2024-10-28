import React from 'react';
import Head from 'next/head';

interface ImageToolLayoutProps {
  title: string;
  description: React.ReactNode;
  metaDescription?: string; // 新增 metaDescription 属性
  children: React.ReactNode;
}

const ImageToolLayout: React.FC<ImageToolLayoutProps> = ({ 
  title, 
  description, 
  metaDescription, // 接收 metaDescription
  children 
}) => {
  const fullTitle = `${title} - 图像魔方`;
  // 如果没有提供 metaDescription，则尝试将 description 转换为字符串
  const metaDesc = metaDescription || (typeof description === 'string' ? description : '');

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={metaDesc} />
      </Head>
      {children}
    </>
  );
};

export default ImageToolLayout;
