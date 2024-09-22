'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Button, Select, MenuItem, FormControl, InputLabel, Typography, Grid } from '@mui/material';
import Image from 'next/image';
import Feedback from '../components/Feedback';

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
  const [filter, setFilter] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [filteredBlob, setFilteredBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setSrc(reader.result as string));
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  useEffect(() => {
    if (src && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const img = new window.Image();
      img.onload = () => {
        if (canvasRef.current) {
          canvasRef.current.width = img.width;
          canvasRef.current.height = img.height;
          ctx?.drawImage(img, 0, 0);
          applyFilter();
        }
      };
      img.src = src;
    }
  }, [src, canvasRef]);

  const applyFilter = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.filter = filter;
        const img = new window.Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          canvasRef.current?.toBlob((blob) => {
            if (blob) {
              setFilteredBlob(blob);
            }
          }, 'image/png');
        };
        img.src = src as string;
      }
    }
  };

  useEffect(() => {
    applyFilter();
  }, [filter]);

  const handleDownload = () => {
    if (filteredBlob) {
      const url = URL.createObjectURL(filteredBlob);
      const link = document.createElement('a');
      link.download = 'filtered_image.png';
      link.href = url;
      link.click();
      setSuccess(true);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
  };

  return (
    <Box sx={{ '& > *': { mb: 3 }, maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
        图片滤镜
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, backgroundColor: '#ecf0f1', borderRadius: '10px', padding: '20px' }}>
        <Image src="/images/filter.svg" alt="Image Filter" width={200} height={200} />
        <Typography variant="h6" sx={{ ml: 3, color: '#34495e' }}>
          为您的图片添加独特的风格。选择各种滤镜效果，如灰度、复古或高对比度，轻松提升您的图片视觉效果。
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
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>选择滤镜</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="选择滤镜"
            >
              {filters.map((f) => (
                <MenuItem key={f.name} value={f.filter}>{f.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>原图</Typography>
              <img src={src} alt="Original" style={{ maxWidth: '100%', height: 'auto' }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>滤镜效果</Typography>
              <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto' }} />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              onClick={handleDownload}
              sx={{ 
                fontSize: '1.1rem', 
                padding: '10px 20px',
                backgroundColor: '#2ecc71',
                '&:hover': {
                  backgroundColor: '#27ae60'
                }
              }}
            >
              下载
            </Button>
          </Box>
        </Box>
      )}
      <Feedback loading={loading} success={success} error={error} onClose={handleClose} />
    </Box>
  );
}