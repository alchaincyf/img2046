import React from 'react';
import Head from 'next/head';

interface ImageToolLayoutProps {
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
}

const ImageToolLayout: React.FC<ImageToolLayoutProps> = ({ title, description, children }) => {
  const fullTitle = `${title} - 图像魔方`;

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
      </Head>
      {children}
    </>
  );
};

export default ImageToolLayout;
