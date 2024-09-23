'use client';

import React from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import ImageGenerator from '../components/ImageGenerator';

const AIImageGeneratorPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ '& > *': { mb: 3 }, maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', fontSize: isMobile ? '1.5rem' : '2rem' }}>
        AI 文生图
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', mb: 3, backgroundColor: '#ecf0f1', borderRadius: '10px', padding: '20px' }}>
        <Image 
          src="/images/ai-image-generator.svg" 
          alt="AI Image Generator" 
          width={isMobile ? 150 : 200} 
          height={isMobile ? 150 : 200}
          priority
        />
        <Typography variant="h6" sx={{ ml: isMobile ? 0 : 3, mt: isMobile ? 2 : 0, color: '#34495e' }}>
          使用 AI 文生图器，只需输入描述性的提示词，我们就能为您自动优化提示词内容，再自动完成图片生成。
        </Typography>
      </Box>
      <Paper sx={{ p: 3 }}>
        <ImageGenerator />
      </Paper>
    </Box>
  );
};

export default AIImageGeneratorPage;