'use client';

import { useState } from 'react';
import { Box, Button, Slider, Typography, Paper, Grid } from '@mui/material';
import Image from 'next/image';
import Feedback from '../components/Feedback';

export default function CompressPage() {
  const [src, setSrc] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [compressedImageUrl, setCompressedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setOriginalSize(file.size);
      setFileName(file.name);
      setCompressedSize(null);
      setCompressedImageUrl(null);
      const reader = new FileReader();
      reader.addEventListener('load', () => setSrc(reader.result as string));
      reader.readAsDataURL(file);
    }
  };

  const handleCompress = () => {
    if (src) {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0, img.width, img.height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setCompressedSize(blob.size);
              setCompressedImageUrl(URL.createObjectURL(blob));
            }
          },
          'image/jpeg',
          quality / 100
        );
      };
      img.src = src;
    }
  };

  const handleDownload = () => {
    if (compressedImageUrl) {
      const link = document.createElement('a');
      link.download = `compressed_${fileName}`;
      link.href = compressedImageUrl;
      link.click();
      setSuccess(true);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
  };

  // 计算压缩比例
  const compressionRatio = compressedSize 
    ? ((1 - compressedSize / originalSize) * 100).toFixed(2)
    : null;

  return (
    <Box sx={{ '& > *': { mb: 3 }, maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
        图片压缩
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, backgroundColor: '#ecf0f1', borderRadius: '10px', padding: '20px' }}>
        <Image src="/images/compress.svg" alt="Image Compression" width={200} height={200} />
        <Typography variant="h6" sx={{ ml: 3, color: '#34495e' }}>
          我们的图片压缩工具可以帮助您减小文件大小，同时保持图片质量。上传图片，调整压缩级别，然后下载优化后的文件。
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
            <img src={src} style={{ maxWidth: '100%', height: 'auto' }} />
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
          <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
            <Typography variant="body1">原始文件: {fileName}</Typography>
            <Typography variant="body1">原始大小: {(originalSize / 1024).toFixed(2)} KB</Typography>
            {compressedSize && (
              <>
                <Typography variant="body1">压缩后大小: {(compressedSize / 1024).toFixed(2)} KB</Typography>
                <Typography variant="body1">压缩比例: {compressionRatio}%</Typography>
              </>
            )}
          </Paper>
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
  );
}