'use client';

import { useState, useCallback, useRef } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Slider,
  Paper,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ImageToolLayout from '../components/ImageToolLayout';

export default function RoundedCornersPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [cornerRadius, setCornerRadius] = useState<number>(20);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [fileName, setFileName] = useState<string>('rounded-image.png');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name.replace(/\.[^/.]+$/, '') + '-rounded.png');
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImageSize({ width: img.width, height: img.height });
          setOriginalImage(event.target?.result as string);
          // 自动应用圆角
          applyRoundedCorners(img, cornerRadius);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const applyRoundedCorners = useCallback((img: HTMLImageElement, radius: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 创建圆角路径
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(canvas.width - radius, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
    ctx.lineTo(canvas.width, canvas.height - radius);
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
    ctx.lineTo(radius, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.clip();

    // 绘制图片
    ctx.drawImage(img, 0, 0);

    // 转换为图片URL
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setProcessedImage(url);
      }
    }, 'image/png');
  }, []);

  const handleRadiusChange = (_: Event, value: number | number[]) => {
    const radius = value as number;
    setCornerRadius(radius);
    
    // 如果有图片，实时更新圆角
    if (originalImage) {
      const img = new Image();
      img.onload = () => {
        applyRoundedCorners(img, radius);
      };
      img.src = originalImage;
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = fileName;
      link.click();
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setCornerRadius(20);
    setImageSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name.replace(/\.[^/.]+$/, '') + '-rounded.png');
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImageSize({ width: img.width, height: img.height });
          setOriginalImage(event.target?.result as string);
          applyRoundedCorners(img, cornerRadius);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ImageToolLayout
      title="图片圆角处理"
      description="为您的图片添加圆角效果，支持自定义圆角程度"
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Stack spacing={3}>
          {/* 上传区域 */}
          {!originalImage ? (
            <Paper
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              sx={{
                p: 6,
                border: '2px dashed',
                borderColor: 'primary.main',
                borderRadius: 2,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: 'primary.dark',
                  bgcolor: 'action.hover'
                }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                点击或拖拽图片到此处
              </Typography>
              <Typography variant="body2" color="text.secondary">
                支持 JPG、PNG、GIF、WEBP 等格式
              </Typography>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </Paper>
          ) : (
            <>
              {/* 控制面板 */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    圆角设置
                  </Typography>
                  <Box sx={{ px: 2 }}>
                    <Typography gutterBottom>
                      圆角大小: {cornerRadius}px
                    </Typography>
                    <Slider
                      value={cornerRadius}
                      onChange={handleRadiusChange}
                      min={0}
                      max={Math.min(imageSize?.width || 200, imageSize?.height || 200) / 2}
                      valueLabelDisplay="auto"
                      sx={{ mb: 2 }}
                    />
                  </Box>
                  <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={handleDownload}
                      disabled={!processedImage}
                      fullWidth
                    >
                      下载图片
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<RestartAltIcon />}
                      onClick={handleReset}
                      fullWidth
                    >
                      重新开始
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* 图片预览 */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Card sx={{ flex: 1, minWidth: 300 }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom align="center">
                      原始图片
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      {originalImage && (
                        <img 
                          src={originalImage} 
                          alt="Original" 
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: 400,
                            objectFit: 'contain'
                          }} 
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>

                <Card sx={{ flex: 1, minWidth: 300 }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom align="center">
                      处理后图片
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      {processedImage && (
                        <img 
                          src={processedImage} 
                          alt="Processed" 
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: 400,
                            objectFit: 'contain'
                          }} 
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </>
          )}
        </Stack>

        {/* 隐藏的 Canvas */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </Box>
    </ImageToolLayout>
  );
}