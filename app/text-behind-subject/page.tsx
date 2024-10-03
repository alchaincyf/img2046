'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TextField, Box, Typography, Slider, Select, MenuItem, Grid, Paper, Switch, FormControlLabel, Button, Tabs, Tab } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import debounce from 'lodash/debounce';

type ColorScheme = {
  name: string;
  colors: string[];
};

type ColorSchemes = {
  [key: string]: ColorScheme[];
};

const fonts = [
  'Indie Flower',
  'Caveat',
  'Shadows Into Light',
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
];

const colorSchemes = {
  莫兰迪: [
    { name: '莫兰迪灰', colors: ['#9E9E9E'] },
    { name: '莫兰迪粉', colors: ['#E4B7A0'] },
    { name: '莫兰迪绿', colors: ['#A3B18A'] },
    { name: '莫兰迪蓝', colors: ['#8E9AAF'] },
    { name: '莫兰迪紫', colors: ['#B19CD9'] },
    { name: '莫兰迪黄', colors: ['#E9D985'] },
    { name: '莫兰迪棕', colors: ['#B49C73'] },
    { name: '莫兰迪红', colors: ['#C67B5C'] },
    { name: '莫兰迪青', colors: ['#8AA899'] },
    { name: '莫兰迪橙', colors: ['#E2A76F'] },
  ],
  渐变: [
    { name: '金秋落叶', colors: ['#D4AF37', '#FFA500', '#8B4513'] },
    { name: '深海梦境', colors: ['#000080', '#4169E1', '#00FFFF'] },
    { name: '紫罗兰晚霞', colors: ['#4B0082', '#8A2BE2', '#DDA0DD'] },
    { name: '翠绿山林', colors: ['#006400', '#32CD32', '#98FB98'] },
    { name: '火焰激情', colors: ['#8B0000', '#FF4500', '#FFD700'] },
    { name: '莫奈印象', colors: ['#6A5ACD', '#9370DB', '#E6E6FA'] },
    { name: '珊瑚礁梦', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'] },
    { name: '日落沙漠', colors: ['#FF7F50', '#DAA520', '#B8860B'] },
    { name: '极光幻想', colors: ['#00FF00', '#00FFFF', '#FF00FF'] },
    { name: '樱花飞舞', colors: ['#FFB7C5', '#FFC0CB', '#FFDAB9'] },
  ],
  霓虹: [
    { name: '霓虹粉', colors: ['#FF1493'] },
    { name: '霓虹蓝', colors: ['#00FFFF'] },
    { name: '霓虹绿', colors: ['#39FF14'] },
    { name: '霓虹橙', colors: ['#FF4500'] },
    { name: '霓虹紫', colors: ['#8A2BE2'] },
    { name: '霓虹黄', colors: ['#FFFF00'] },
    { name: '霓虹红', colors: ['#FF0000'] },
    { name: '霓虹青', colors: ['#00FFFF'] },
    { name: '霓虹白', colors: ['#FFFFFF'] },
    { name: '霓虹金', colors: ['#FFD700'] },
  ],
  金属: [
    { name: '金属金', colors: ['#FFD700', '#B8860B'] },
    { name: '金属银', colors: ['#C0C0C0', '#A9A9A9'] },
    { name: '金属铜', colors: ['#B87333', '#CD7F32'] },
    { name: '金属青铜', colors: ['#CD7F32', '#8B4513'] },
    { name: '金属铂金', colors: ['#E5E4E2', '#CECECE'] },
    { name: '金属钛', colors: ['#878681', '#4F4F4F'] },
    { name: '金属铬', colors: ['#DCDCDC', '#A9A9A9'] },
    { name: '金属锡', colors: ['#8A9A9A', '#708090'] },
    { name: '金属钢', colors: ['#71797E', '#36454F'] },
    { name: '金属铁', colors: ['#71797E', '#3B3C36'] },
  ],
  水彩: [
    { name: '水彩蓝', colors: ['#87CEEB', '#4682B4'] },
    { name: '水彩绿', colors: ['#98FB98', '#2E8B57'] },
    { name: '水彩粉', colors: ['#FFB6C1', '#DB7093'] },
    { name: '水彩黄', colors: ['#FAFAD2', '#DAA520'] },
    { name: '水彩紫', colors: ['#E6E6FA', '#9370DB'] },
    { name: '水彩橙', colors: ['#FFDAB9', '#FF7F50'] },
    { name: '水彩棕', colors: ['#DEB887', '#8B4513'] },
    { name: '水彩灰', colors: ['#DCDCDC', '#A9A9A9'] },
    { name: '水彩红', colors: ['#FFA07A', '#DC143C'] },
    { name: '水彩青', colors: ['#E0FFFF', '#20B2AA'] },
  ],
};

export default function TextBehindSubject() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [font, setFont] = useState('Indie Flower');
  const [textOpacity, setTextOpacity] = useState(1);
  const [textSize, setTextSize] = useState(70);
  const [textPositionX, setTextPositionX] = useState(50);
  const [textPositionY, setTextPositionY] = useState(50);
  const [gradientColors, setGradientColors] = useState(colorSchemes['莫兰迪'][0].colors);
  const [removedBgImage, setRemovedBgImage] = useState<string | null>(null);
  const [isBold, setIsBold] = useState(false);
  const [customColor, setCustomColor] = useState('#000000');
  const [colorSchemeType, setColorSchemeType] = useState<keyof typeof colorSchemes>('莫兰迪');

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Indie+Flower&family=Caveat&family=Shadows+Into+Light&family=Bodoni+Moda&family=Cinzel&family=Cormorant+Garamond&family=Playfair+Display&family=Abril+Fatface&family=Poiret+One&family=Philosopher&family=Spectral&family=Yeseva+One&family=Marcellus&display=swap';
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

      setResult(null);
      setRemovedBgImage(null);

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

  const handleImageProcess = useCallback(debounce(async () => {
    if (!imagePreview || !text || !canvasRef.current || !removedBgImage) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('无法获取 canvas 上下文');

    const originalImage = new Image();
    originalImage.src = imagePreview;
    await new Promise((resolve) => { originalImage.onload = resolve; });

    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    ctx.drawImage(originalImage, 0, 0);

    ctx.save();
    const calculatedFontSize = (canvas.width * textSize) / 100;
    ctx.font = `${isBold ? 'bold' : 'normal'} ${calculatedFontSize}px ${font}`;
    
    if (gradientColors.length > 1) {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradientColors.forEach((color, index) => {
        gradient.addColorStop(index / (gradientColors.length - 1), color);
      });
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = gradientColors[0];
    }

    ctx.globalAlpha = textOpacity;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textX = (canvas.width * textPositionX) / 100;
    const textY = (canvas.height * textPositionY) / 100;

    // 文字换行处理
    const lines = text.split('\n').slice(0, 3);  // 最多三行
    const lineHeight = calculatedFontSize * 1.2;  // 行高为字体大小的1.2倍
    lines.forEach((line, index) => {
      const yPosition = textY + (index - (lines.length - 1) / 2) * lineHeight;
      ctx.fillText(line, textX, yPosition);
    });

    ctx.restore();

    const removedBgImg = new Image();
    removedBgImg.src = removedBgImage;
    await new Promise((resolve) => { removedBgImg.onload = resolve; });
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(removedBgImg, 0, 0, canvas.width, canvas.height);

    setResult(canvas.toDataURL());
  }, 100), [imagePreview, text, font, textSize, textPositionX, textPositionY, textOpacity, gradientColors, removedBgImage, isBold]);

  useEffect(() => {
    handleImageProcess();
  }, [handleImageProcess]);

  const handleDownload = () => {
    if (result) {
      const link = document.createElement('a');
      link.href = result;
      link.download = 'text-behind-subject.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Box sx={{ 
      maxWidth: 1200, 
      margin: 'auto', 
      padding: 2, 
      fontFamily: 'Indie Flower',
      background: 'linear-gradient(to right bottom, #ffffff, #f0f0f0)',
      borderRadius: 2,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', color: '#14213D', marginBottom: 4, fontWeight: 'light' }}>
        Text Behind Subject
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
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
              multiline
              rows={3}
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
            <Tabs
              value={colorSchemeType}
              onChange={(_, newValue: keyof typeof colorSchemes) => setColorSchemeType(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {Object.keys(colorSchemes).map((type) => (
                <Tab key={type} label={type} value={type} />
              ))}
            </Tabs>
            <Grid container spacing={1} sx={{ mt: 1 }}>
              {colorSchemes[colorSchemeType].map((scheme) => (
                <Grid item key={scheme.name}>
                  <Box
                    onClick={() => setGradientColors(scheme.colors)}
                    sx={{
                      width: 40,
                      height: 40,
                      background: scheme.colors.length > 1 
                        ? `linear-gradient(to right, ${scheme.colors.join(', ')})`
                        : scheme.colors[0],
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

            {result && (
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                sx={{ 
                  mt: 'auto',
                  backgroundColor: '#14213D', 
                  '&:hover': { backgroundColor: '#233a66' } 
                }}
              >
                下载图片
              </Button>
            )}
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