'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Grid, 
  Typography, 
  useTheme, 
  useMediaQuery, 
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Card,
  CardContent
} from '@mui/material';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Image from 'next/image';
import Feedback from '../components/Feedback';
import ImageToolLayout from '../components/ImageToolLayout';

export default function RoundedCornersPage() {
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({ unit: '%', width: 80, height: 80, x: 10, y: 10 });
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(1);
  const [cornerRadius, setCornerRadius] = useState<number>(20);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'crop' | 'process'>('upload');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageElRef = useRef<HTMLImageElement | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSrc(reader.result as string);
        setCurrentStep('crop');
        setCroppedImageUrl(null);
        setProcessedImageUrl(null);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const computeInitialCrop = useCallback((imgW: number, imgH: number, aspect: number | null) => {
    const initialWidthPercent = 80;
    let widthPercent = initialWidthPercent;
    let heightPercent: number;
    if (!aspect) {
      // 自由比例：宽高都给一个合理百分比
      heightPercent = 80;
    } else {
      // 固定比例：按宽度百分比推导高度百分比
      heightPercent = (widthPercent * imgW) / (aspect * imgH);
      if (heightPercent > 90) heightPercent = 90;
    }
    // 居中放置
    const x = (100 - widthPercent) / 2;
    const y = (100 - heightPercent) / 2;
    return { unit: '%', width: widthPercent, height: heightPercent, x, y } as Crop;
  }, []);

  const onImageLoad = useCallback((image: HTMLImageElement) => {
    imageElRef.current = image;
    const imgW = image.naturalWidth || image.width;
    const imgH = image.naturalHeight || image.height;
    setImageSize({ width: imgW, height: imgH });
    const next = computeInitialCrop(imgW, imgH, aspectRatio);
    setCrop(next);
  }, [aspectRatio, computeInitialCrop]);

  // 当裁剪比例变更时，基于图片尺寸重新计算一个合规的裁剪区域
  useEffect(() => {
    if (!imageSize) return;
    const next = computeInitialCrop(imageSize.width, imageSize.height, aspectRatio);
    setCrop(next);
  }, [aspectRatio, imageSize, computeInitialCrop]);

  const handleCrop = () => {
    if (src && crop.width && crop.height) {
      setLoading(true);
      const image = new window.Image() as HTMLImageElement;
      image.src = src;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const imgW = image.naturalWidth;
        const imgH = image.naturalHeight;
        let cropWidthPx = Math.max(1, Math.round(((crop.width || 0) / 100) * imgW));
        let cropHeightPx = Math.max(1, Math.round(((crop.height || 0) / 100) * imgH));
        let cropXPx = Math.max(0, Math.round(((crop.x || 0) / 100) * imgW));
        let cropYPx = Math.max(0, Math.round(((crop.y || 0) / 100) * imgH));

        // 边界约束，避免 drawImage 源区域越界导致空白
        if (cropXPx + cropWidthPx > imgW) {
          cropWidthPx = imgW - cropXPx;
        }
        if (cropYPx + cropHeightPx > imgH) {
          cropHeightPx = imgH - cropYPx;
        }
        
        canvas.width = cropWidthPx;
        canvas.height = cropHeightPx;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(
            image,
            cropXPx,
            cropYPx,
            cropWidthPx,
            cropHeightPx,
            0,
            0,
            cropWidthPx,
            cropHeightPx
          );
          const croppedImageUrl = canvas.toDataURL('image/png');
          setCroppedImageUrl(croppedImageUrl);
          setCurrentStep('process');
          setLoading(false);
        }
      };
    }
  };

  const generateRoundedPreview = useCallback(() => {
    if (!croppedImageUrl) return;
    const image = new window.Image() as HTMLImageElement;
    image.src = croppedImageUrl;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = image.naturalWidth || image.width;
      const h = image.naturalHeight || image.height;
      canvas.width = Math.max(1, Math.round(w));
      canvas.height = Math.max(1, Math.round(h));

      const radius = Math.min(cornerRadius, Math.min(canvas.width, canvas.height) / 2);
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
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const url = canvas.toDataURL('image/png');
      setProcessedImageUrl(url);
    };
  }, [croppedImageUrl, cornerRadius]);

  // 防抖实时预览
  useEffect(() => {
    if (!croppedImageUrl) {
      setProcessedImageUrl(null);
      return;
    }
    const handle = window.setTimeout(() => {
      generateRoundedPreview();
    }, 100);
    return () => window.clearTimeout(handle);
  }, [croppedImageUrl, cornerRadius, generateRoundedPreview]);

  const handleDownload = () => {
    if (processedImageUrl) {
      const link = document.createElement('a');
      link.download = 'rounded_corners_image.png';
      link.href = processedImageUrl;
      link.click();
      setSuccess(true);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
  };

  const handleReset = () => {
    setSrc(null);
    setCroppedImageUrl(null);
    setProcessedImageUrl(null);
    setCurrentStep('upload');
    setCornerRadius(20);
    setCrop({ unit: '%', width: 80, height: 80, x: 10, y: 10 });
  };

  return (
    <ImageToolLayout
      title="圆角处理工具"
      description="使用我们的在线圆角处理工具，轻松为图片添加圆角效果。支持图片裁剪和圆角程度调整，操作简单快捷。"
    >
      <Box sx={{ '& > *': { mb: 3 }, maxWidth: '100%', margin: '0 auto', padding: '20px' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', fontSize: isMobile ? '1.5rem' : '2rem' }}>
          图片圆角处理
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', mb: 3, backgroundColor: '#ecf0f1', borderRadius: '10px', padding: '20px' }}>
          <Image src="/images/crop.svg" alt="Rounded Corners" width={isMobile ? 150 : 200} height={isMobile ? 150 : 200} style={{ width: isMobile ? 150 : 200, height: isMobile ? 150 : 200 }} />
          <Typography variant="h6" sx={{ ml: isMobile ? 0 : 3, mt: isMobile ? 2 : 0, color: '#34495e' }}>
            使用我们的圆角处理工具，您可以轻松地为图片添加圆角效果。上传图片，选择裁剪区域，调整圆角程度，然后下载处理后的图片。
          </Typography>
        </Box>

        {/* 步骤指示器 */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Card sx={{ backgroundColor: currentStep === 'upload' ? '#3498db' : '#ecf0f1', color: currentStep === 'upload' ? 'white' : 'inherit' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2">1. 上传图片</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ backgroundColor: currentStep === 'crop' ? '#3498db' : '#ecf0f1', color: currentStep === 'crop' ? 'white' : 'inherit' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2">2. 裁剪图片</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ backgroundColor: currentStep === 'process' ? '#3498db' : '#ecf0f1', color: currentStep === 'process' ? 'white' : 'inherit' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2">3. 圆角处理</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* 上传区域 */}
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
            {src ? '重新上传图片' : '上传图片'}
          </Button>
        </label>

        {src && currentStep === 'crop' && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>步骤2：裁剪图片</Typography>
            <FormControl sx={{ mb: 2, minWidth: 120 }}>
              <InputLabel id="aspect-ratio-label">裁剪比例</InputLabel>
              <Select
                labelId="aspect-ratio-label"
                value={aspectRatio ?? ''}
                onChange={(e) => setAspectRatio(e.target.value as number | null)}
                label="裁剪比例"
              >
                <MenuItem value={1}>1:1 (正方形)</MenuItem>
                <MenuItem value={16 / 9}>16:9</MenuItem>
                <MenuItem value={4 / 3}>4:3</MenuItem>
                <MenuItem value={''}>自由</MenuItem>
              </Select>
            </FormControl>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2 }}>
                  <ReactCrop
                    crop={crop}
                    onChange={c => setCrop(c)}
                    aspect={aspectRatio || undefined}
                    onComplete={(c) => setCrop(c)}
                  >
                    <img
                      src={src}
                      onLoad={e => onImageLoad(e.currentTarget)}
                      style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
                      ref={imageElRef as unknown as React.RefObject<HTMLImageElement>}
                    />
                  </ReactCrop>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  操作指南：
                </Typography>
                <Typography variant="body2" component="div">
                  <ol>
                    <li>选择裁剪比例（推荐正方形）</li>
                    <li>在图片上拖动选择裁剪区域</li>
                    <li>调整选择框大小</li>
                    <li>点击"确认裁剪"按钮</li>
                  </ol>
                </Typography>
              </Grid>
            </Grid>
            
            <Button 
              variant="contained" 
              onClick={handleCrop} 
              disabled={loading}
              sx={{ 
                mt: 2,
                fontSize: '1.1rem', 
                padding: '10px 20px',
                backgroundColor: '#2ecc71',
                '&:hover': {
                  backgroundColor: '#27ae60'
                }
              }}
            >
              {loading ? '处理中...' : '确认裁剪'}
            </Button>
          </Box>
        )}

        {croppedImageUrl && currentStep === 'process' && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>步骤3：调整圆角</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>裁剪后的图片</Typography>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <img src={croppedImageUrl} alt="Cropped" style={{ maxWidth: '100%', display: 'block' }} />
                </Paper>
                
                <Typography variant="subtitle2" gutterBottom>圆角程度: {cornerRadius}px</Typography>
                <Slider
                  value={cornerRadius}
                  onChange={(_, newValue) => setCornerRadius(newValue as number)}
                  min={0}
                  max={100}
                  step={1}
                  valueLabelDisplay="auto"
                  sx={{ mb: 2 }}
                />
                
                <Typography variant="caption" color="text.secondary">
                  拖动滑块即可实时预览圆角效果
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>圆角处理预览</Typography>
                <Paper sx={{ p: 2, minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {processedImageUrl ? (
                    <img src={processedImageUrl} alt="Processed" style={{ maxWidth: '100%', display: 'block' }} />
                  ) : (
                    <Typography color="text.secondary">圆角处理后的图片将显示在这里</Typography>
                  )}
                </Paper>
                
                {processedImageUrl && (
                  <Button 
                    variant="contained" 
                    onClick={handleDownload}
                    sx={{ 
                      mt: 2,
                      fontSize: '1.1rem', 
                      padding: '10px 20px',
                      backgroundColor: '#3498db',
                      '&:hover': {
                        backgroundColor: '#2980b9'
                      }
                    }}
                  >
                    下载圆角图片
                  </Button>
                )}
              </Grid>
            </Grid>
          </Box>
        )}

        {(croppedImageUrl || processedImageUrl) && (
          <Button 
            variant="outlined" 
            onClick={handleReset}
            sx={{ 
              mt: 2,
              fontSize: '1.1rem', 
              padding: '10px 20px'
            }}
          >
            重新开始
          </Button>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <Feedback loading={loading} success={success} error={error} onClose={handleClose} />
      </Box>
    </ImageToolLayout>
  );
}
