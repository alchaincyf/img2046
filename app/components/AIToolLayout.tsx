import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import ImageToolLayout from './ImageToolLayout';

interface AIToolLayoutProps {
  title: string;
  description: React.ReactNode;
  metaDescription?: string; // 添加 metaDescription 属性
  iconSrc: string;
  children: React.ReactNode;
}

const AIToolLayout: React.FC<AIToolLayoutProps> = ({ 
  title, 
  description, 
  metaDescription, // 接收 metaDescription
  iconSrc, 
  children 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ImageToolLayout 
      title={title} 
      description={description}
      metaDescription={metaDescription} // 传递 metaDescription 到 ImageToolLayout
    >
      <Box sx={{ '& > *': { mb: 3 }, maxWidth: '100%', margin: '0 auto', padding: '20px' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', fontSize: isMobile ? '1.5rem' : '2rem' }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', mb: 3, backgroundColor: '#ecf0f1', borderRadius: '10px', padding: '20px' }}>
          <Image 
            src={iconSrc}
            alt={title}
            width={isMobile ? 150 : 200}
            height={isMobile ? 150 : 200}
            style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%' }}
            priority
          />
          <Typography variant="h6" sx={{ ml: isMobile ? 0 : 3, mt: isMobile ? 2 : 0, color: '#34495e' }}>
            {description}
          </Typography>
        </Box>
        {children}
      </Box>
    </ImageToolLayout>
  );
};

export default AIToolLayout;
