'use client';

import { useState } from 'react';
import { Box, Button, Slider, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import Feedback from '../components/Feedback';

export default function CompressPage() {
  const [src, setSrc] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [compressedImageUrl, setCompressedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setSrc(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCompress = () => {
    if (src) {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0);
          const compressedImageUrl = canvas.toDataURL('image/jpeg', quality / 100);
          setCompressedImageUrl(compressedImageUrl);
        }
      };
      image.src = src;
    }
  };

  const handleDownload = () => {
    if (compressedImageUrl) {
      const link = document.createElement('a');
      link.download = 'compressed_image.jpg';
      link.href = compressedImageUrl;
      link.click();
      setSuccess(true);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
  };

  return (
    <Box sx={{ '& > *': { mb: 3 }, maxWidth: '100%', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', fontSize: isMobile ? '1.5rem' : '2rem' }}>
        图片压缩
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', mb: 3, backgroundColor: '#ecf0f1', borderRadius: '10px', padding: '20px' }}>
        <Image src="/images/compress.svg" alt="Compress" width={isMobile ? 150 : 200} height={isMobile ? 150 : 200} />
        <Typography variant="h6" sx={{ ml: isMobile ? 0 : 3, mt: isMobile ? 2 : 0, color: '#34495e' }}>
          使用我们的压缩工具，您可以轻松地减小图片文件大小。上传您的图片，调整压缩质量，然后点击压缩按钮即可。
        </Typography>
      </Box>
      <input
        type="file"
        accept="image/*"
        onChange={onSelectFile}
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
            <img src={src} style={{ maxWidth: '100%', height: 'auto' }} alt="Original" />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>压缩后预览</Typography>
            {compressedImageUrl ? (
              <img src={compressedImageUrl} alt="Compressed" style={{ maxWidth: '100%', height: 'auto' }} />
            ) : (
              <Typography>压缩后的图片将显示在这里</Typography>
            )}
          </Grid>
        </Grid>
      )}
      {src && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>压缩质量: {quality}%</Typography>
          <Slider
            value={quality}
            onChange={(_, newValue) => setQuality(newValue as number)}
            aria-labelledby="continuous-slider"
            valueLabelDisplay="auto"
            min={0}
            max={100}
          />
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              onClick={handleCompress} 
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
              压缩
            </Button>
            {compressedImageUrl && (
              <Button 
                variant="contained" 
                onClick={handleDownload}
                sx={{ 
                  fontSize: '1.1rem', 
                  padding: '10px 20px',
                  backgroundColor: '#3498db',
                  '&:hover': {
                    backgroundColor: '#2980b9'
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
  );
}