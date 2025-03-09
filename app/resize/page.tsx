'use client';

import { useState, useEffect } from 'react';
import { Box, Button, TextField, Checkbox, FormControlLabel, Grid, Typography, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import Image from 'next/image';
import Feedback from '../components/Feedback';
import ImageToolLayout from '../components/ImageToolLayout';
import JSZip from 'jszip';

export default function ResizePage() {
  const [images, setImages] = useState<{
    id: number;
    src: string;
    name: string;
    width: number;
    height: number;
    resizedImageUrl: string | null;
  }[]>([]);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalAspectRatio, setOriginalAspectRatio] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingCount, setProcessingCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const onSelectFile = (files: File[]) => {
    if (files && files.length > 0) {
      // 限制最多上传99张图片
      const filesToProcess = files.slice(0, 99);
      setTotalCount(filesToProcess.length);
      setProcessingCount(0);
      
      filesToProcess.forEach((file, index) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const src = reader.result as string;
          loadImage(src, file.name, index);
        });
        reader.readAsDataURL(file);
      });
    }
  };

  const loadImage = (src: string, fileName: string, index: number) => {
    const img = new window.Image();
    img.onload = () => {
      setImages(prev => {
        // 检查是否已存在相同ID的图片
        const existingIndex = prev.findIndex(img => img.id === index);
        const newImage = {
          id: index,
          src,
          name: fileName,
          width: img.width,
          height: img.height,
          resizedImageUrl: null
        };
        
        if (existingIndex >= 0) {
          const newImages = [...prev];
          newImages[existingIndex] = newImage;
          return newImages;
        } else {
          return [...prev, newImage];
        }
      });
      
      // 设置第一张图片的尺寸作为默认值
      if (index === 0) {
        setWidth(img.width);
        setHeight(img.height);
        setOriginalAspectRatio(img.width / img.height);
      }
      
      setProcessingCount(prev => prev + 1);
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

  const handleResize = async () => {
    if (images.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedImages = [...images];
      
      for (let i = 0; i < updatedImages.length; i++) {
        const image = updatedImages[i];
        const canvas = document.createElement('canvas');
        
        // 如果保持宽高比，则为每张图片计算正确的尺寸
        let newWidth = width;
        let newHeight = height;
        
        if (maintainAspectRatio) {
          const imgRatio = image.width / image.height;
          if (imgRatio > originalAspectRatio) {
            // 宽图片
            newHeight = Math.round(newWidth / imgRatio);
          } else {
            // 高图片
            newWidth = Math.round(newHeight * imgRatio);
          }
        }
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        const ctx = canvas.getContext('2d');
        const img = new window.Image();
        
        await new Promise<void>((resolve) => {
          img.onload = () => {
            if (ctx) {
              ctx.drawImage(img, 0, 0, newWidth, newHeight);
              updatedImages[i].resizedImageUrl = canvas.toDataURL('image/png');
            }
            resolve();
          };
          img.src = image.src;
        });
      }
      
      setImages(updatedImages);
      setSuccess(true);
    } catch (err) {
      setError('处理图片时出错');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    const resizedImages = images.filter(img => img.resizedImageUrl);
    
    if (resizedImages.length === 0) return;
    
    if (resizedImages.length === 1) {
      // 单张图片直接下载
      const link = document.createElement('a');
      link.download = `resized_${resizedImages[0].name}`;
      link.href = resizedImages[0].resizedImageUrl as string;
      link.click();
    } else {
      // 多张图片打包下载
      setLoading(true);
      try {
        const zip = new JSZip();
        
        resizedImages.forEach((img, index) => {
          // 从 data URL 中提取 base64 数据
          const base64Data = img.resizedImageUrl!.split(',')[1];
          // 添加到 zip
          zip.file(`resized_${img.name}`, base64Data, {base64: true});
        });
        
        const content = await zip.generateAsync({type: 'blob'});
        const url = URL.createObjectURL(content);
        
        const link = document.createElement('a');
        link.download = 'resized_images.zip';
        link.href = url;
        link.click();
        
        // 清理 URL 对象
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        setSuccess(true);
      } catch (err) {
        setError('创建压缩文件时出错');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
  };

  const handleClearAll = () => {
    setImages([]);
    setWidth(0);
    setHeight(0);
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
            使用我们的调整大小工具，您可以轻松地改变图片的尺寸。上传您的图片（最多99张），设置新的宽度和高度，然后点击调整大小按钮即可。
          </Typography>
        </Box>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              onSelectFile(Array.from(files));
            }
          }}
          style={{ display: 'none' }}
          id="raised-button-file"
        />
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
              上传图片 (最多99张)
            </Button>
          </label>
          {images.length > 0 && (
            <Button 
              variant="outlined" 
              onClick={handleClearAll}
              sx={{ 
                mb: 3, 
                fontSize: '1.1rem', 
                padding: '10px 20px',
              }}
            >
              清除所有图片
            </Button>
          )}
        </Box>
        
        {processingCount < totalCount && totalCount > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={24} />
            <Typography>正在加载图片... ({processingCount}/{totalCount})</Typography>
          </Box>
        )}
        
        {images.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              已上传 {images.length} 张图片
            </Typography>
            
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
                  disabled={loading}
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
                  {loading ? '处理中...' : '调整大小'}
                </Button>
                {images.some(img => img.resizedImageUrl) && (
                  <Button 
                    variant="contained" 
                    onClick={handleDownload}
                    disabled={loading}
                    sx={{ 
                      fontSize: '1.1rem', 
                      padding: '10px 20px',
                      backgroundColor: '#e74c3c',
                      '&:hover': {
                        backgroundColor: '#c0392b'
                      }
                    }}
                  >
                    {loading ? '准备下载中...' : images.filter(img => img.resizedImageUrl).length > 1 ? '下载ZIP压缩包' : '下载图片'}
                  </Button>
                )}
              </Box>
            </Box>
            
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {images.slice(0, 4).map((image) => (
                <Grid item xs={12} sm={6} md={3} key={image.id}>
                  <Typography variant="subtitle1" gutterBottom>
                    {image.name} ({image.width}x{image.height})
                  </Typography>
                  <img src={image.resizedImageUrl || image.src} style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ddd' }} />
                </Grid>
              ))}
            </Grid>
            
            {images.length > 4 && (
              <Typography sx={{ mt: 2 }}>
                还有 {images.length - 4} 张图片未显示...
              </Typography>
            )}
          </>
        )}
        
        <Feedback loading={loading} success={success} error={error} onClose={handleClose} />
      </Box>
    </ImageToolLayout>
  );
}