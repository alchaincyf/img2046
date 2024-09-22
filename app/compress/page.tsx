'use client';

import { useState } from 'react';
import { Box, Button, Slider, Typography, Paper, Grid } from '@mui/material';
import FileUpload from '../components/FileUpload';
import NextImage from 'next/image';  // 重命名 Next.js 的 Image 组件
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

  const onSelectFile = (files: File[]) => {
    if (files && files.length > 0) {
      const file = files[0];
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
      const img = new window.Image();  // 使用 window.Image 构造函数
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
    <Box sx={{ '& > *': { mb: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <NextImage src="/images/compress.svg" alt="Image Compression" width={200} height={200} />
        <Typography variant="body1" sx={{ ml: 3 }}>
          我们的图片压缩工具可以帮助您减小文件大小，同时保持图片质量。上传图片，调整压缩级别，然后下载优化后的文件。
        </Typography>
      </Box>
      <FileUpload onFilesSelected={onSelectFile} />
      {src && (
        <Grid container spacing={2} sx={{ mt: 3 }}>
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
          <Button variant="contained" onClick={handleCompress} sx={{ mt: 2, mr: 2 }}>
            压缩
          </Button>
          {compressedImageUrl && (
            <Button variant="contained" onClick={handleDownload} sx={{ mt: 2 }}>
              下载
            </Button>
          )}
        </Box>
      )}
      <Feedback loading={loading} success={success} error={error} onClose={handleClose} />
    </Box>
  );
}