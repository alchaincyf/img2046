//ts-nocheck

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TextField, Box, Typography, Slider, Select, MenuItem, Grid, Paper, Switch, FormControlLabel, Button, Tabs, Tab, Tooltip, Link, Alert, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import debounce from 'lodash/debounce';
import Image from 'next/image';

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

const colorSchemes: ColorSchemes = {
  莫兰迪: [
    { name: '莫兰迪红', colors: ['#B67E7E'] },
    { name: '莫兰迪橙', colors: ['#D4A797'] },
    { name: '莫兰迪黄', colors: ['#E2D2A9'] },
    { name: '莫兰迪绿', colors: ['#A3B5A6'] },
    { name: '莫兰迪青', colors: ['#A0B7B7'] },
    { name: '莫兰迪蓝', colors: ['#8CA3B4'] },
    { name: '莫兰迪紫', colors: ['#A491A8'] },
    { name: '莫兰迪粉', colors: ['#E0C5C5'] },
    { name: '莫兰迪棕', colors: ['#B0A08F'] },
    { name: '莫兰迪灰', colors: ['#A9A9A9'] },
    { name: '莫兰迪米', colors: ['#D8CAAF'] },
    { name: '莫兰迪绿灰', colors: ['#8F9E91'] },
    { name: '莫兰迪蓝灰', colors: ['#8D98A7'] },
    { name: '莫兰迪紫灰', colors: ['#9C8E9E'] },
  ],
  渐变: [
    { name: '鲜红色', colors: ['#FF0000'] },
    { name: '橙色', colors: ['#FF7F00'] },
    { name: '黄色', colors: ['#FFFF00'] },
    { name: '绿色', colors: ['#00FF00'] },
    { name: '蓝色', colors: ['#0000FF'] },
    { name: '靛蓝色', colors: ['#4B0082'] },
    { name: '紫色', colors: ['#8B00FF'] },
    { name: '品红色', colors: ['#FF00FF'] },
    { name: '深粉红', colors: ['#FF1493'] },
    { name: '青色', colors: ['#00FFFF'] },
    { name: '柠檬绿', colors: ['#32CD32'] },
    { name: '金色', colors: ['#FFD700'] },
    { name: '橙红色', colors: ['#FF4500'] },
    { name: '深紫色', colors: ['#9400D3'] },
  ],
  霓虹: [
    { name: '霓虹粉', colors: ['#FF00FF'] },
    { name: '霓虹青', colors: ['#00FFFF'] },
    { name: '霓虹紫', colors: ['#FF00FF'] },
    { name: '霓虹绿', colors: ['#00FF00'] },
    { name: '霓虹红', colors: ['#FF0000'] },
    { name: '霓虹黄', colors: ['#FFFF00'] },
    { name: '霓虹橙', colors: ['#FFA500'] },
    { name: '霓虹粉红', colors: ['#FF1493'] },
    { name: '霓虹春绿', colors: ['#00FF7F'] },
    { name: '霓虹热粉', colors: ['#FF69B4'] },
    { name: '霓虹蓝', colors: ['#1E90FF'] },
    { name: '霓虹橙红', colors: ['#FF4500'] },
    { name: '霓虹黄绿', colors: ['#7FFF00'] },
    { name: '霓虹珊瑚', colors: ['#FF6347'] },
  ],
  金属: [
    { name: '银色', colors: ['#C0C0C0'] },
    { name: '浅灰色', colors: ['#A8A8A8'] },
    { name: '中灰色', colors: ['#909090'] },
    { name: '深灰色', colors: ['#787878'] },
    { name: '暗灰色', colors: ['#606060'] },
    { name: '炭灰色', colors: ['#484848'] },
    { name: '煤黑色', colors: ['#303030'] },
    { name: '金色', colors: ['#D4AF37'] },
    { name: '暗金色', colors: ['#B8860B'] },
    { name: '青铜色', colors: ['#CD7F32'] },
    { name: '铜色', colors: ['#B87333'] },
    { name: '赭石色', colors: ['#8B4513'] },
    { name: '褐红色', colors: ['#A52A2A'] },
    { name: '暗红色', colors: ['#800000'] },
  ],
  水彩: [
    { name: '淡蓝色', colors: ['#E6F3FF'] },
    { name: '淡粉色', colors: ['#FFE6E6'] },
    { name: '淡绿色', colors: ['#E6FFE6'] },
    { name: '淡紫色', colors: ['#FFE6F3'] },
    { name: '淡紫罗兰', colors: ['#F3E6FF'] },
    { name: '淡青色', colors: ['#E6FFF3'] },
    { name: '淡橙色', colors: ['#FFF3E6'] },
    { name: '淡黄绿色', colors: ['#F3FFE6'] },
    { name: '淡粉紫色', colors: ['#FFE6FF'] },
    { name: '淡青蓝色', colors: ['#E6FFFF'] },
    { name: '淡粉红色', colors: ['#FFE6F3'] },
    { name: '淡黄色', colors: ['#F3FFE6'] },
    { name: '淡天蓝色', colors: ['#E6F3FF'] },
    { name: '淡桃色', colors: ['#FFE6E6'] },
  ],
  油画: [
    { name: '沙棕色', colors: ['#F4A460'] },
    { name: '秘鲁色', colors: ['#CD853F'] },
    { name: '原木色', colors: ['#DEB887'] },
    { name: '巧克力色', colors: ['#D2691E'] },
    { name: '马鞍棕色', colors: ['#8B4513'] },
    { name: '赭黄色', colors: ['#A0522D'] },
    { name: '印第安红', colors: ['#CD5C5C'] },
    { name: '火砖红', colors: ['#B22222'] },
    { name: '褐红色', colors: ['#A52A2A'] },
    { name: '栗色', colors: ['#800000'] },
    { name: '深红色', colors: ['#8B0000'] },
    { name: '靛青色', colors: ['#4B0082'] },
    { name: '暗蓝色', colors: ['#483D8B'] },
    { name: '午夜蓝', colors: ['#191970'] },
  ],
  自定义: [
    { name: '自定义颜色', colors: ['#000000'] },
  ],
};

type ColorSchemeSelectorProps = {
  colorSchemeType: keyof typeof colorSchemes;
  setColorSchemeType: React.Dispatch<React.SetStateAction<keyof typeof colorSchemes>>;
  gradientColors: string[];
  setGradientColors: React.Dispatch<React.SetStateAction<string[]>>;
  customColor: string;
  setCustomColor: React.Dispatch<React.SetStateAction<string>>;
};

const ColorSchemeSelector: React.FC<ColorSchemeSelectorProps> = ({ 
  colorSchemeType, 
  setColorSchemeType, 
  gradientColors, 
  setGradientColors,
  customColor,
  setCustomColor
}) => {
  return (
    <>
      <Typography gutterBottom sx={{ mt: 2, fontWeight: 'light' }}>色彩方案</Typography>
      <Tabs
        value={colorSchemeType}
        onChange={(_, newValue: keyof typeof colorSchemes) => setColorSchemeType(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        {Object.keys(colorSchemes).map((type) => (
          <Tab key={type} label={type} value={type} />
        ))}
      </Tabs>
      <Grid container spacing={1}>
        {colorSchemeType === '自定义' ? (
          <Grid item xs={12}>
            <Typography gutterBottom>选择自定义颜色</Typography>
            <TextField
              type="color"
              value={customColor}
              onChange={(e) => {
                const newColor = e.target.value;
                setCustomColor(newColor);
                setGradientColors([newColor]);
              }}
              fullWidth
            />
          </Grid>
        ) : (
          colorSchemes[colorSchemeType].map((scheme) => (
            <Grid item key={scheme.name}>
              <Tooltip title={scheme.name} arrow>
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
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                />
              </Tooltip>
            </Grid>
          ))
        )}
      </Grid>
    </>
  );
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
  const [textSize, setTextSize] = useState(35); // 将默认值从 70 减少到 35
  const [textPositionX, setTextPositionX] = useState(50);
  const [textPositionY, setTextPositionY] = useState(50);
  const [gradientColors, setGradientColors] = useState(colorSchemes['莫兰迪'][0].colors);
  const [removedBgImage, setRemovedBgImage] = useState<string | null>(null);
  const [isBold, setIsBold] = useState(false);
  const [customColor, setCustomColor] = useState('#000000');
  const [colorSchemeType, setColorSchemeType] = useState<keyof typeof colorSchemes>('莫兰迪');
  const [removeBgApiKey, setRemoveBgApiKey] = useState('');
  const [isApiKeyEditable, setIsApiKeyEditable] = useState(true);
  const [savedApiKey, setSavedApiKey] = useState('');

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
        formData.append('api_key', removeBgApiKey);

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
        alert('移除背景失败，将在原始图片上添加文字。');
        // 即使失败，也不设置 removedBgImage，这样会使用原始图片
      } finally {
        setLoading(false);
      }
    }
  };

  const handleImageProcess = useCallback(debounce(async () => {
    if (!imagePreview || !text || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('无法获取 canvas 上下文');

    const originalImage = document.createElement('img');
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
    const lines = text.split('\n').slice(0, 3);
    const lineHeight = calculatedFontSize * 1.2;
    lines.forEach((line, index) => {
      const yPosition = textY + (index - (lines.length - 1) / 2) * lineHeight;
      ctx.fillText(line, textX, yPosition);
    });

    ctx.restore();

    if (removedBgImage) {
      const removedBgImg = document.createElement('img');
      removedBgImg.src = removedBgImage;
      await new Promise((resolve) => { removedBgImg.onload = resolve; });
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(removedBgImg, 0, 0, canvas.width, canvas.height);
    }

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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <Image src="/images/text-behind-object.svg" alt="Text Behind Object Logo" width={40} height={40} />
        <Typography variant="h3" sx={{ ml: 2, textAlign: 'center', color: '#14213D', fontWeight: 'light' }}>
          Text Behind Object
        </Typography>
      </Box>
      
      <Alert severity="info" sx={{ mb: 4 }}>
        这个工具可以帮助你创建文字在物体后面的效果。上传一张图片，输入文字，然后调整设置来创建你想要的效果。
      </Alert>

      <Box sx={{ mb: 4, p: 2, backgroundColor: '#f0f0f0', borderRadius: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Remove.bg API Key 设置
          <Tooltip title="如果您没有设置 API key，将使用默认的 key。但是默认 key 可能会用完额度。建议使用自己的 API key。" arrow>
            <InfoIcon sx={{ ml: 1, verticalAlign: 'middle', fontSize: 20 }} />
          </Tooltip>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            label="Remove.bg API Key"
            value={isApiKeyEditable ? removeBgApiKey : savedApiKey}
            onChange={(e) => setRemoveBgApiKey(e.target.value)}
            fullWidth
            margin="dense"
            disabled={!isApiKeyEditable}
            type={isApiKeyEditable ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setIsApiKeyEditable(!isApiKeyEditable)}
                  edge="end"
                >
                  {isApiKeyEditable ? <SaveIcon /> : <EditIcon />}
                </IconButton>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={() => {
              setSavedApiKey(removeBgApiKey);
              setIsApiKeyEditable(false);
            }}
            disabled={!isApiKeyEditable || !removeBgApiKey}
            sx={{ ml: 1, height: '56px' }}
          >
            保存
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          获取 API key: {' '}
          <Link href="https://www.remove.bg/api" target="_blank" rel="noopener noreferrer">
            https://www.remove.bg/api
          </Link>
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          提示：本功能需要使用remove.bg的API，请自行设置，每个用户可以从 remove.bg 获得 50 次免费的 API 使用权益。
        </Typography>
      </Box>

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

            <ColorSchemeSelector 
              colorSchemeType={colorSchemeType}
              setColorSchemeType={setColorSchemeType}
              gradientColors={gradientColors}
              setGradientColors={setGradientColors}
              customColor={customColor}
              setCustomColor={setCustomColor}
            />

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
              min={5}  // 可以考虑将最小值也减小
              max={50} // 将最大值从 100 减少到 50
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

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', color: '#14213D', fontWeight: 'light' }}>
          示例图片
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between',
          gap: 2,
        }}>
          {['paris', 'newyork', 'kyoto', 'budapest'].map((city) => (
            <Box 
              key={city} 
              sx={{ 
                width: 'calc(50% - 8px)', // 每行两张图片，减去间隔
                marginBottom: 2,
                '@media (max-width: 600px)': {
                  width: '100%', // 在小屏幕上每行一张图片
                },
              }}
            >
              <Image
                src={`/images/${city}.jpg`}
                alt={`${city} example`}
                width={600}
                height={400}
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  objectFit: 'cover', 
                  borderRadius: '8px',
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </Box>
  );
}