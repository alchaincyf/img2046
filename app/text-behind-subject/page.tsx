'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TextField, Box, Typography, Slider, Select, MenuItem, Grid, Paper, Switch, FormControlLabel } from '@mui/material';

// 更新字体列表，添加手写风格字体
const fonts = [
  'Bodoni Moda',
  'Cinzel',
  'Cormorant Garamond',
  'Playfair Display',
  'Abril Fatface',
  'Poiret One',
  'Philosopher',
  'Spectral',
  'Yeseva One',
  'Marcellus',
  'Caveat',           // 手写风格字体1
  'Shadows Into Light', // 手写风格字体2
  'Indie Flower'      // 手写风格字体3
];

// 更新配色方案，提供更艺术和绚丽的色彩
const colorSchemes = [
  { name: '金秋落叶', colors: ['#D4AF37', '#FFA500', '#8B4513'] },
  { name: '深海梦境', colors: ['#000080', '#4169E1', '#00FFFF'] },
  { name: '紫罗兰晚霞', colors: ['#4B0082', '#8A2BE2', '#DDA0DD'] },
  { name: '翠绿山林', colors: ['#006400', '#32CD32', '#98FB98'] },
  { name: '火焰激情', colors: ['#8B0000', '#FF4500', '#FFD700'] },
  { name: '莫奈印象', colors: ['#6A5ACD', '#9370DB', '#E6E6FA'] },
  { name: '珊瑚礁梦', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'] },
  { name: '日落沙漠', colors: ['#FF7F50', '#DAA520', '#B8860B'] },
];

export default function TextBehindSubject() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Advanced settings
  const [font, setFont] = useState('Bodoni Moda');
  const [textOpacity, setTextOpacity] = useState(1); // 默认不透明度为100%
  const [textSize, setTextSize] = useState(70); // 默认文字大小为70%
  const [textPositionX, setTextPositionX] = useState(50); // 字X轴位置百分比
  const [textPositionY, setTextPositionY] = useState(50); // 文字Y轴位置百分比
  const [gradientColors, setGradientColors] = useState(colorSchemes[0].colors);

  const [removedBgImage, setRemovedBgImage] = useState<string | null>(null);

  const [isBold, setIsBold] = useState(false); // 新增加粗状态

  // 在组件的顶部添加这个 useEffect
  useEffect(() => {
    // 动态加载 Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Bodoni+Moda&family=Cinzel&family=Cormorant+Garamond&family=Playfair+Display&family=Abril+Fatface&family=Poiret+One&family=Philosopher&family=Spectral&family=Yeseva+One&family=Marcellus&family=Caveat&family=Shadows+Into+Light&family=Indie+Flower&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // 调用 remove.bg API
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/text-behind-subject', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`处理图像时出错: ${response.status}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setRemovedBgImage(url);
      } catch (error) {
        console.error('Error:', error);
        alert('处理图像时出错，请重试。');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (imagePreview && text && removedBgImage) {
      handleImageProcess();
    }
  }, [imagePreview, text, font, textSize, textPositionX, textPositionY, textOpacity, gradientColors, removedBgImage]);

  const handleImageProcess = async () => {
    if (!imagePreview || !text || !canvasRef.current || !removedBgImage) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('无法获取 canvas 上下文');

    // 创建原始图像
    const originalImage = new Image();
    originalImage.src = imagePreview;
    await new Promise((resolve) => { originalImage.onload = resolve; });

    // 设置画布大小为原始图像大小
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    // 绘制层 1：原始图像
    ctx.drawImage(originalImage, 0, 0);

    // 绘制层 2：文字
    ctx.save();
    const calculatedFontSize = (canvas.width * textSize) / 100;
    ctx.font = `${isBold ? 'bold' : 'normal'} ${calculatedFontSize}px ${font}`; // 根据 isBold 状态设置字体粗细
    
    // 创建渐变
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradientColors.forEach((color, index) => {
      gradient.addColorStop(index / (gradientColors.length - 1), color);
    });
    ctx.fillStyle = gradient;

    ctx.globalAlpha = textOpacity;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textX = (canvas.width * textPositionX) / 100;
    const textY = (canvas.height * textPositionY) / 100;
    ctx.fillText(text, textX, textY);
    ctx.restore();

    // 绘制层 3：去除背景的人物
    const removedBgImg = new Image();
    removedBgImg.src = removedBgImage;
    await new Promise((resolve) => { removedBgImg.onload = resolve; });
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(removedBgImg, 0, 0, canvas.width, canvas.height);

    setResult(canvas.toDataURL());
  };

  return (
    <Box sx={{ 
      maxWidth: 1200, 
      margin: 'auto', 
      padding: 2, 
      fontFamily: 'Bodoni Moda',
      background: 'linear-gradient(to right bottom, #ffffff, #f0f0f0)',
      borderRadius: 2,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', color: '#14213D', marginBottom: 4, fontWeight: 'light' }}>
        Text Behind Subject
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'light' }}>图片上传</Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="raised-button-file">
              <Box
                sx={{
                  border: '2px dashed #9e9e9e',
                  borderRadius: 2,
                  padding: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: '#1976d2',
                  },
                }}
              >
                <Typography>点击或拖拽上传图片</Typography>
              </Box>
            </label>
            <TextField
              label="输入要添加的文字"
              value={text}
              onChange={(e) => setText(e.target.value)}
              fullWidth
              margin="normal"
              sx={{ fontFamily: 'inherit' }}
            />
            <Typography gutterBottom sx={{ mt: 2, fontWeight: 'light' }}>字体选择</Typography>
            <Select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              fullWidth
              margin="dense"
              sx={{ fontFamily: 'inherit' }}
            >
              {fonts.map((f) => (
                <MenuItem key={f} value={f} style={{ fontFamily: f }}>
                  <span style={{ fontFamily: f }}>{f}</span>
                </MenuItem>
              ))}
            </Select>

            {/* 新增加粗选项 */}
            <FormControlLabel
              control={
                <Switch
                  checked={isBold}
                  onChange={(e) => setIsBold(e.target.checked)}
                  color="primary"
                />
              }
              label="加粗文字"
              sx={{ mt: 2 }}
            />

            <Typography gutterBottom sx={{ mt: 2, fontWeight: 'light' }}>色彩方案</Typography>
            <Grid container spacing={1}>
              {colorSchemes.map((scheme) => (
                <Grid item key={scheme.name}>
                  <Box
                    onClick={() => setGradientColors(scheme.colors)}
                    sx={{
                      width: 40,
                      height: 40,
                      background: `linear-gradient(to right, ${scheme.colors.join(', ')})`,
                      cursor: 'pointer',
                      border: JSON.stringify(gradientColors) === JSON.stringify(scheme.colors) ? '2px solid #000' : 'none',
                      borderRadius: '50%',
                    }}
                    title={scheme.name}
                  />
                </Grid>
              ))}
            </Grid>
            <Typography gutterBottom sx={{ mt: 2, fontWeight: 'light' }}>文字不透明度</Typography>
            <Slider
              value={textOpacity}
              onChange={(_, newValue) => setTextOpacity(newValue as number)}
              min={0}
              max={1}
              step={0.01}
              sx={{ color: '#14213D' }}
            />
            <Typography gutterBottom sx={{ mt: 2, fontWeight: 'light' }}>文字大小</Typography>
            <Slider
              value={textSize}
              onChange={(_, newValue) => setTextSize(newValue as number)}
              min={10}
              max={100}
              step={1}
              sx={{ color: '#14213D' }}
            />
            <Typography gutterBottom sx={{ mt: 2, fontWeight: 'light' }}>文字位置 X</Typography>
            <Slider
              value={textPositionX}
              onChange={(_, newValue) => setTextPositionX(newValue as number)}
              min={0}
              max={100}
              step={1}
              sx={{ color: '#14213D' }}
            />
            <Typography gutterBottom sx={{ mt: 2, fontWeight: 'light' }}>文字位置 Y</Typography>
            <Slider
              value={textPositionY}
              onChange={(_, newValue) => setTextPositionY(newValue as number)}
              min={0}
              max={100}
              step={1}
              sx={{ color: '#14213D' }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {result ? (
              <img src={result} alt="处理后的图片" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            ) : imagePreview ? (
              <img src={imagePreview} alt="预览图" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            ) : (
              <Typography variant="body1" color="textSecondary" sx={{ fontFamily: 'inherit', fontStyle: 'italic' }}>请上传图片并输入文字</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </Box>
  );
}