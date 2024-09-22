'use client';

import { useState } from 'react';
import { Box, Button, TextField, Checkbox, FormControlLabel, Grid, Typography } from '@mui/material';
import FileUpload from '../components/FileUpload';
import Image from 'next/image';
import Feedback from '../components/Feedback';

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

  const onSelectFile = (files: File[]) => {
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSrc(reader.result as string);
        const img = new Image();  // 使用 Image 构造函数
        img.onload = () => {
          setWidth(img.width);
          setHeight(img.height);
          setOriginalAspectRatio(img.width / img.height);
        };
        img.src = reader.result as string;
      });
      reader.readAsDataURL(files[0]);
    }
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
      const img = new Image();  // 使用 Image 构造函数
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
    <Box sx={{ '& > *': { mb: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Image src="/images/resize.svg" alt="Image Resize" width={200} height={200} />
        <Typography variant="body1" sx={{ ml: 3 }}>
          调整图片大小从未如此简单。上传您的图片，输入所需的尺寸，我们的工具将为您重新调整图片大小，同时保持图片质量。
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
            <Button variant="contained" onClick={handleResize} sx={{ mr: 2 }}>
              调整大小
            </Button>
            {resizedImageUrl && (
              <Button variant="contained" onClick={handleDownload}>
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