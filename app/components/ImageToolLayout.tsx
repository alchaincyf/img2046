import React from 'react';
import Head from 'next/head';
import { Box, Typography } from '@mui/material';

interface ImageToolLayoutProps {
  title: string;
  description: React.ReactNode;
  metaDescription?: string;
  children: React.ReactNode;
}

const ImageToolLayout: React.FC<ImageToolLayoutProps> = ({
  title,
  description,
  metaDescription,
  children
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

      {/* Vignelli hero · 让所有工具页与主页视觉血缘一致 */}
      <Box
        sx={{
          pb: { xs: 3, md: 4 },
          mb: { xs: 3, md: 4 },
          borderBottom: '1px solid rgba(10,10,10,0.15)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: { xs: 2, md: 2.5 } }}>
          <Box sx={{ width: 8, height: 8, backgroundColor: '#DC2F1A' }} />
          <Typography
            sx={{
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              fontSize: 10,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(10,10,10,0.7)',
            }}
          >
            — Tool · 工具 · img.2046
          </Typography>
        </Box>
        <Typography
          component="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: 36, sm: 48, md: 64 },
            lineHeight: 1.05,
            letterSpacing: '-0.015em',
            color: '#0A0A0A',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Noto Sans SC", system-ui, sans-serif',
          }}
        >
          {title}
          <Box component="span" sx={{ color: '#DC2F1A' }}>.</Box>
        </Typography>
        {typeof description === 'string' && (
          <Typography
            sx={{
              mt: { xs: 1.5, md: 2 },
              fontSize: { xs: 14, md: 17 },
              lineHeight: 1.65,
              fontStyle: 'italic',
              color: 'rgba(10,10,10,0.65)',
              maxWidth: 720,
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      {children}
    </>
  );
};

export default ImageToolLayout;
