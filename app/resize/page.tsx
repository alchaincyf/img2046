'use client';

import { useState, useEffect } from 'react';
import { Box, Button, TextField, Checkbox, FormControlLabel, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import Feedback from '../components/Feedback';
import ImageToolLayout from '../components/ImageToolLayout';

export default function ResizePage() {
  const [src, setSrc] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalAspectRatio, setOriginalAspectRatio] = useState(1);
  const [resizedImageUrl, setResizedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const onSelectFile = (files: File[]) => {
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSrc(reader.result as string);
        loadImage(reader.result as string);
      });
      reader.readAsDataURL(files[0]);
    }
  };

  const loadImage = (src: string) => {
    const img = new window.Image();
    img.onload = () => {
      setWidth(img.width);
      setHeight(img.height);
      setOriginalAspectRatio(img.width / img.height);
    };
    img.src = src;
  };

  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(event.target.value);
    setWidth(newWidth);
    if (maintainAspectRatio) {
      setHeight(Math.round(newWidth / originalAspectRatio));
    }
  };

  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(event.target.value);
    setHeight(newHeight);
    if (maintainAspectRatio) {
      setWidth(Math.round(newHeight * originalAspectRatio));
    }
  };

  const handleResize = () => {
    if (src) {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      const img = new window.Image();
      img.onload = () => {
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const resizedImageUrl = canvas.toDataURL('image/png');
          setResizedImageUrl(resizedImageUrl);
        }
      };
      img.src = src;
    }
  };

  const handleDownload = () => {
    if (resizedImageUrl) {
      const link = document.createElement('a');
      link.download = 'resized_image.png';
      link.href = resizedImageUrl;
      link.click();
      setSuccess(true);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
  };

  return (
    <ImageToolLayout
      title="图片调整大小工具"
      description="使用我们的在线图片调整大小工具，轻松改变图片尺寸。支持保持宽高比，精确调整图片大小。"
    >
      <Box sx={{ '& > *': { mb: 3 }, maxWidth: '100%', margin: '0 auto', padding: '20px' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', fontSize: isMobile ? '1.5rem' : '2rem' }}>
          调整图片大小
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', mb: 3, backgroundColor: '#ecf0f1', borderRadius: '10px', padding: '20px' }}>
          <Image src="/images/resize.svg" alt="Resize" width={isMobile ? 150 : 200} height={isMobile ? 150 : 200} />
          <Typography variant="h6" sx={{ ml: isMobile ? 0 : 3, mt: isMobile ? 2 : 0, color: '#34495e' }}>
            使用我们的调整大小工具，您可以轻松地改变图片的尺寸。上传您的图片，设置新的宽度和高度，然后点击调整大小按钮即可。
          </Typography>
        </Box>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              onSelectFile(Array.from(files));
            }
          }}
          style={{ display: 'none' }}
          id="raised-button-file"
        />
        <label htmlFor="raised-button-file">
          <Button 
            variant="contained" 
            component="span"
            sx={{ 
              mb: 3, 
              fontSize: '1.1rem', 
              padding: '10px 20px',
              backgroundColor: '#3498db',
              '&:hover': {
                backgroundColor: '#2980b9'
              }
            }}
          >
            上传图片
          </Button>
        </label>
        {src && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>原图</Typography>
              <img src={src} style={{ maxWidth: '100%', height: 'auto' }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>调整后预览</Typography>
              {resizedImageUrl ? (
                <img src={resizedImageUrl} alt="Resized" style={{ maxWidth: '100%', height: 'auto' }} />
              ) : (
                <Typography>调整大小后的图片将显示在这里</Typography>
              )}
            </Grid>
          </Grid>
        )}
        {src && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="宽度"
                type="number"
                value={width}
                onChange={handleWidthChange}
                sx={{ mr: 2 }}
              />
              <TextField
                label="高度"
                type="number"
                value={height}
                onChange={handleHeightChange}
              />
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={maintainAspectRatio}
                  onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                />
              }
              label="保持宽高比"
            />
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                onClick={handleResize} 
                sx={{ 
                  mr: 2,
                  fontSize: '1.1rem', 
                  padding: '10px 20px',
                  backgroundColor: '#2ecc71',
                  '&:hover': {
                    backgroundColor: '#27ae60'
                  }
                }}
              >
                调整大小
              </Button>
              {resizedImageUrl && (
                <Button 
                  variant="contained" 
                  onClick={handleDownload}
                  sx={{ 
                    fontSize: '1.1rem', 
                    padding: '10px 20px',
                    backgroundColor: '#e74c3c',
                    '&:hover': {
                      backgroundColor: '#c0392b'
                    }
                  }}
                >
                  下载
                </Button>
              )}
            </Box>
          </Box>
        )}
        <Feedback loading={loading} success={success} error={error} onClose={handleClose} />
      </Box>
    </ImageToolLayout>
  );
}