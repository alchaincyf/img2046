'use client';

import { useState, useCallback } from 'react';
import { Box, Button, FormControl, InputLabel, Select, MenuItem, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Image from 'next/image';
import Feedback from '../components/Feedback';
import ImageToolLayout from '../components/ImageToolLayout';

export default function CropPage() {
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({ unit: '%', width: 30, height: 30, x: 0, y: 0 });
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(16 / 9);
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

  const onImageLoad = useCallback((image: HTMLImageElement) => {
    const aspect = aspectRatio || 16 / 9;
    const width = 30;
    const height = (width / aspect) * (image.naturalHeight / image.naturalWidth);
    setCrop({ unit: '%', width, height, x: 0, y: 0 });
  }, [aspectRatio]);

  const handleCrop = () => {
    if (src) {
      const image = new window.Image() as HTMLImageElement;
      image.src = src;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = (crop.width || 0);
        canvas.height = (crop.height || 0);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(
            image,
            (crop.x || 0) * scaleX,
            (crop.y || 0) * scaleY,
            (crop.width || 0) * scaleX,
            (crop.height || 0) * scaleY,
            0,
            0,
            crop.width || 0,
            crop.height || 0
          );
          const croppedImageUrl = canvas.toDataURL('image/jpeg');
          setCroppedImageUrl(croppedImageUrl);
        }
      };
    }
  };

  const handleDownload = () => {
    if (croppedImageUrl) {
      const link = document.createElement('a');
      link.download = 'cropped_image.jpg';
      link.href = croppedImageUrl;
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
      title="图片裁剪工具"
      description="使用我们的在线图片裁剪工具，轻松调整图片大小和比例。支持多种裁剪比例，操作简单快捷。"
    >
      <Box sx={{ '& > *': { mb: 3 }, maxWidth: '100%', margin: '0 auto', padding: '20px' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', fontSize: isMobile ? '1.5rem' : '2rem' }}>
          图片裁剪
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', mb: 3, backgroundColor: '#ecf0f1', borderRadius: '10px', padding: '20px' }}>
          <Image src="/images/crop.svg" alt="Crop" width={isMobile ? 150 : 200} height={isMobile ? 150 : 200} />
          <Typography variant="h6" sx={{ ml: isMobile ? 0 : 3, mt: isMobile ? 2 : 0, color: '#34495e' }}>
            使用我们的裁剪工具，您可以轻松地裁剪图片。上传您的图片，选择裁剪区域，然后点击裁剪按钮即可。
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
              <InputLabel id="aspect-ratio-label">裁剪比例</InputLabel>
              <Select
                labelId="aspect-ratio-label"
                value={aspectRatio ?? ''}
                onChange={(e) => setAspectRatio(e.target.value as number | null)}
                label="裁剪比例"
              >
                <MenuItem value={16 / 9}>16:9</MenuItem>
                <MenuItem value={4 / 3}>4:3</MenuItem>
                <MenuItem value={1}>1:1</MenuItem>
                <MenuItem value={''}>自由</MenuItem>
              </Select>
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>原图</Typography>
                <ReactCrop
                  crop={crop}
                  onChange={c => setCrop(c)}
                  aspect={aspectRatio || undefined}
                  onComplete={(c) => setCrop(c)}
                >
                  <img src={src} onLoad={e => onImageLoad(e.currentTarget)} style={{ maxWidth: '100%' }} />
                </ReactCrop>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  操作指南：
                  <ol>
                    <li>选择裁剪比例（可选）</li>
                    <li>在图片上拖动鼠标来选择裁剪区域</li>
                    <li>调整选择框大小来精确裁剪</li>
                    <li>点击"裁剪"按钮查看效果</li>
                  </ol>
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>裁剪预览</Typography>
                {croppedImageUrl ? (
                  <img src={croppedImageUrl} alt="Cropped" style={{ maxWidth: '100%' }} />
                ) : (
                  <Typography>裁剪后的图片将显示在这里</Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        )}
        {src && (
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              onClick={handleCrop} 
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
              裁剪
            </Button>
            {croppedImageUrl && (
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
        )}
        <Feedback loading={loading} success={success} error={error} onClose={handleClose} />
      </Box>
    </ImageToolLayout>
  );
}