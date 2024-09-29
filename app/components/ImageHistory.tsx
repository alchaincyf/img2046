'use client';

import React, { useState } from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';

interface HistoryItem {
  id: string;
  originalPrompt: string;
  optimizedPrompt: string;
  imageUrl: string;
}

interface ImageHistoryProps {
  history: HistoryItem[];
}

const ImageHistory: React.FC<ImageHistoryProps> = ({ history }) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => new Set(prev).add(id));
  };

  const handleImageError = (id: string) => {
    console.error(`Failed to load image for item ${id}`);
    // 可以在这里设置一个默认图片或者显示错误信息
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>生成历史</Typography>
      <Grid container spacing={2}>
        {history.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Box sx={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: '4px', 
              padding: '8px', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column' 
            }}>
              <Box sx={{ 
                width: '100%', 
                paddingTop: '100%', 
                position: 'relative', 
                overflow: 'hidden',
                marginBottom: '8px',
                backgroundColor: '#f0f0f0' // 添加背景色
              }}>
                {!loadedImages.has(item.id) && (
                  <CircularProgress 
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                )}
                <img 
                  src={item.imageUrl} 
                  alt={item.originalPrompt}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: loadedImages.has(item.id) ? 'block' : 'none'
                  }}
                  onLoad={() => handleImageLoad(item.id)}
                  onError={() => handleImageError(item.id)}
                />
              </Box>
              <Typography variant="body2" noWrap title={item.originalPrompt}>
                原始提示词: {item.originalPrompt}
              </Typography>
              <Typography variant="body2" noWrap title={item.optimizedPrompt}>
                优化后提示词: {item.optimizedPrompt}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ImageHistory;