import React from 'react';
import Head from 'next/head';

interface ImageToolLayoutProps {
  title: string;
  description: React.ReactNode;
  metaDescription?: string;
  children: React.ReactNode;
}

/**
 * 工具页 SEO 元数据包装。
 * Vignelli hero 已上移到 Layout（基于 pathname 自动渲染），此处只负责 <head>。
 */
const ImageToolLayout: React.FC<ImageToolLayoutProps> = ({
  title,
  description,
  metaDescription,
  children,
}) => {
  const fullTitle = `${title} - 图像魔方`;
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
