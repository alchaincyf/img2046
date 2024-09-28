'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Button, Select, MenuItem, FormControl, InputLabel, Typography, Grid, useTheme, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import Feedback from '../components/Feedback';
import ImageToolLayout from '../components/ImageToolLayout';

const filters = [
  { name: '原图', filter: '' },
  { name: '灰度', filter: 'grayscale(100%)' },
  { name: '复古', filter: 'sepia(100%)' },
  { name: '反转', filter: 'invert(100%)' },
  { name: '模糊', filter: 'blur(5px)' },
  { name: '高亮', filter: 'brightness(150%)' },
  { name: '对比度', filter: 'contrast(200%)' },
];

export default function FilterPage() {
  const [src, setSrc] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [filteredImageUrl, setFilteredImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setSrc(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (src && selectedFilter) {
      const image = new window.Image() as HTMLImageElement;
      image.src = src;
      image.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          canvas.width = image.width;
          canvas.height = image.height;
          if (ctx) {
            ctx.filter = selectedFilter;
            ctx.drawImage(image, 0, 0, image.width, image.height);
            const filteredImageUrl = canvas.toDataURL('image/jpeg');
            setFilteredImageUrl(filteredImageUrl);
          }
        }
      };
    }
  }, [src, selectedFilter]);

  const handleDownload = () => {
    if (filteredImageUrl) {
      const link = document.createElement('a');
      link.download = 'filtered_image.jpg';
      link.href = filteredImageUrl;
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
      title="图片滤镜工具"
      description="使用我们的在线图片滤镜工具，为您的图片添加各种精美效果。提供多种滤镜选项，让您的图片更具吸引力。"
    >
      <Box sx={{ '& > *': { mb: 3 }, maxWidth: '100%', margin: '0 auto', padding: '20px' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', fontSize: isMobile ? '1.5rem' : '2rem' }}>
          图片滤镜
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', mb: 3, backgroundColor: '#ecf0f1', borderRadius: '10px', padding: '20px' }}>
          <Image src="/images/filter.svg" alt="Filter" width={isMobile ? 150 : 200} height={isMobile ? 150 : 200} />
          <Typography variant="h6" sx={{ ml: isMobile ? 0 : 3, mt: isMobile ? 2 : 0, color: '#34495e' }}>
            使用我们的滤镜工具，您可以轻松地为图片添加各种效果。上传您的图片，选择滤镜，然后点击应用按钮即可。
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
          <Box sx={{ mt: 3 }}>
            <FormControl sx={{ mb: 2, minWidth: 120 }}>
              <InputLabel id="filter-select-label">选择滤镜</InputLabel>
              <Select
                labelId="filter-select-label"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                label="选择滤镜"
              >
                {filters.map((filter) => (
                  <MenuItem key={filter.name} value={filter.filter}>{filter.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>原图</Typography>
                <img src={src} style={{ maxWidth: '100%', height: 'auto' }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>滤镜效果</Typography>
                {filteredImageUrl ? (
                  <img src={filteredImageUrl} alt="Filtered" style={{ maxWidth: '100%', height: 'auto' }} />
                ) : (
                  <Typography>应用滤镜后的图片将显示在这里</Typography>
                )}
              </Grid>
            </Grid>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            {filteredImageUrl && (
              <Box sx={{ mt: 2 }}>
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
              </Box>
            )}
          </Box>
        )}
        <Feedback loading={loading} success={success} error={error} onClose={handleClose} />
      </Box>
    </ImageToolLayout>
  );
}