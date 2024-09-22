'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Image from 'next/image';
import ImageGenerator from '../components/ImageGenerator';

const AIImageGeneratorPage: React.FC = () => {
  return (
    <Box sx={{ '& > *': { mb: 3 }, maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
        AI 图片生成器
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, backgroundColor: '#ecf0f1', borderRadius: '10px', padding: '20px' }}>
        <Image 
          src="/images/ai-image-generator.svg" 
          alt="AI Image Generator" 
          width={200} 
          height={200}
          priority
        />
        <Typography variant="h6" sx={{ ml: 3, color: '#34495e' }}>
          使用我们的 AI 图片生成器，只需输入描述性的提示词，我们就能为您自动优化提示词内容，生成独特的高质量图片。
        </Typography>
      </Box>
      <Paper sx={{ p: 3 }}>
        <ImageGenerator />
      </Paper>
    </Box>
  );
};

export default AIImageGeneratorPage;