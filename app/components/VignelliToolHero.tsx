'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

interface VignelliToolHeroProps {
  title: string;
  description?: string;
  num?: string; // 编号 01..12
}

const VignelliToolHero: React.FC<VignelliToolHeroProps> = ({ title, description, num }) => {
  return (
    <Box
      sx={{
        pb: { xs: 3, md: 4 },
        mb: { xs: 3, md: 4 },
        borderBottom: '1px solid rgba(10,10,10,0.15)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: { xs: 2, md: 2.5 },
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ width: 8, height: 8, backgroundColor: '#DC2F1A', flexShrink: 0 }} />
        <Typography
          sx={{
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: 10,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(10,10,10,0.7)',
          }}
        >
          {num ? `${num} — Tool · 工具` : '— Tool · 工具'}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Typography
          sx={{
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: 10,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(10,10,10,0.4)',
            display: { xs: 'none', md: 'inline' },
          }}
        >
          IMG.2046 · HUASHENG.AI
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
          fontFamily:
            '"Inter", -apple-system, BlinkMacSystemFont, "Noto Sans SC", system-ui, sans-serif',
        }}
      >
        {title}
        <Box component="span" sx={{ color: '#DC2F1A' }}>.</Box>
      </Typography>
      {description && (
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
  );
};

export default VignelliToolHero;
