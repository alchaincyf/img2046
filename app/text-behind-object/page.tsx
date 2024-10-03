//ts-nocheck

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TextField, Box, Typography, Slider, Select, MenuItem, Grid, Paper, Switch, FormControlLabel, Button, Tabs, Tab, Tooltip, Link, Alert } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
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
    { name: '莫兰迪灰', colors: ['#F5F5F5', '#E0E0E0', '#CCCCCC', '#B8B8B8', '#A4A4A4', '#909090', '#7C7C7C', '#686868', '#545454', '#404040', '#2C2C2C', '#181818', '#040404', '#000000'] },
    { name: '莫兰迪粉', colors: ['#FFF0E6', '#FFE1CC', '#FFD2B3', '#FFC399', '#FFB480', '#FFA566', '#FF964D', '#FF8733', '#FF781A', '#FF6900', '#E65D00', '#CC5200', '#B34700', '#993D00'] },
    { name: '莫兰迪绿', colors: ['#F0F4E8', '#E1E9D1', '#D2DEBA', '#C3D3A3', '#B4C88C', '#A5BD75', '#96B25E', '#87A747', '#789C30', '#699119', '#5A8602', '#4B7B00', '#3C7000', '#2D6500'] },
    { name: '莫兰迪蓝', colors: ['#E6EBF5', '#CCD7EB', '#B3C3E1', '#99AFD7', '#809BCD', '#6687C3', '#4D73B9', '#335FAF', '#1A4BA5', '#00379B', '#002E86', '#002570', '#001C5A', '#001344'] },
    { name: '莫兰迪紫', colors: ['#F5E6FF', '#EBCCff', '#E1B3FF', '#D799FF', '#CD80FF', '#C366FF', '#B94DFF', '#AF33FF', '#A51AFF', '#9B00FF', '#8600E6', '#7000CC', '#5A00B3', '#440099'] },
    { name: '莫兰迪黄', colors: ['#FFFBE6', '#FFF7CC', '#FFF3B3', '#FFEF99', '#FFEB80', '#FFE766', '#FFE34D', '#FFDF33', '#FFDB1A', '#FFD700', '#E6C200', '#CCAC00', '#B39700', '#998100'] },
    { name: '莫兰迪棕', colors: ['#F5EBE0', '#EBD7C1', '#E1C3A2', '#D7AF83', '#CD9B64', '#C38745', '#B97326', '#AF5F07', '#A54B00', '#9B3700', '#862E00', '#702500', '#5A1C00', '#441300'] },
    { name: '莫兰迪红', colors: ['#FFE6E6', '#FFCCCC', '#FFB3B3', '#FF9999', '#FF8080', '#FF6666', '#FF4D4D', '#FF3333', '#FF1A1A', '#FF0000', '#E60000', '#CC0000', '#B30000', '#990000'] },
    { name: '莫兰迪青', colors: ['#E6FFF0', '#CCFFE1', '#B3FFD2', '#99FFC3', '#80FFB4', '#66FFA5', '#4DFF96', '#33FF87', '#1AFF78', '#00FF69', '#00E65E', '#00CC53', '#00B348', '#00993D'] },
    { name: '莫兰迪橙', colors: ['#FFF0E6', '#FFE1CC', '#FFD2B3', '#FFC399', '#FFB480', '#FFA566', '#FF964D', '#FF8733', '#FF781A', '#FF6900', '#E65D00', '#CC5200', '#B34700', '#993D00'] },
  ],
  渐变: [
    { name: '金秋落叶', colors: ['#FFF5E6', '#FFEBD1', '#FFE1BC', '#FFD7A7', '#FFCD92', '#FFC37D', '#FFB968', '#FFAF53', '#FFA53E', '#FF9B29', '#FF9114', '#FF8700', '#E67A00', '#CC6C00'] },
    { name: '深海梦境', colors: ['#E6F5FF', '#CCE9FF', '#B3DEFF', '#99D3FF', '#80C8FF', '#66BDFF', '#4DB2FF', '#33A7FF', '#1A9CFF', '#0091FF', '#0082E6', '#0073CC', '#0064B3', '#005599'] },
    { name: '紫罗兰晚霞', colors: ['#F5E6FF', '#EBCCff', '#E1B3FF', '#D799FF', '#CD80FF', '#C366FF', '#B94DFF', '#AF33FF', '#A51AFF', '#9B00FF', '#8600E6', '#7000CC', '#5A00B3', '#440099'] },
    { name: '翠绿山林', colors: ['#E6FFF0', '#CCFFE1', '#B3FFD2', '#99FFC3', '#80FFB4', '#66FFA5', '#4DFF96', '#33FF87', '#1AFF78', '#00FF69', '#00E65E', '#00CC53', '#00B348', '#00993D'] },
    { name: '火焰激情', colors: ['#FFE6E6', '#FFCCCC', '#FFB3B3', '#FF9999', '#FF8080', '#FF6666', '#FF4D4D', '#FF3333', '#FF1A1A', '#FF0000', '#E60000', '#CC0000', '#B30000', '#990000'] },
    { name: '莫奈印象', colors: ['#E6E6FF', '#CCCCFF', '#B3B3FF', '#9999FF', '#8080FF', '#6666FF', '#4D4DFF', '#3333FF', '#1A1AFF', '#0000FF', '#0000E6', '#0000CC', '#0000B3', '#000099'] },
    { name: '珊瑚礁梦', colors: ['#FFE6EB', '#FFCCD7', '#FFB3C3', '#FF99AF', '#FF809B', '#FF6687', '#FF4D73', '#FF335F', '#FF1A4B', '#FF0037', '#E6002E', '#CC0025', '#B3001C', '#990013'] },
    { name: '日落沙漠', colors: ['#FFF5E6', '#FFEBD1', '#FFE1BC', '#FFD7A7', '#FFCD92', '#FFC37D', '#FFB968', '#FFAF53', '#FFA53E', '#FF9B29', '#FF9114', '#FF8700', '#E67A00', '#CC6C00'] },
    { name: '极光幻想', colors: ['#E6FFF5', '#CCFFEB', '#B3FFE1', '#99FFD7', '#80FFCD', '#66FFC3', '#4DFFB9', '#33FFAF', '#1AFFA5', '#00FF9B', '#00E68C', '#00CC7D', '#00B36E', '#00995F'] },
    { name: '樱花飞舞', colors: ['#FFF0F5', '#FFE1EB', '#FFD2E1', '#FFC3D7', '#FFB4CD', '#FFA5C3', '#FF96B9', '#FF87AF', '#FF78A5', '#FF699B', '#FF5A91', '#FF4B87', '#FF3C7D', '#FF2D73'] },
  ],
  霓虹: [
    { name: '霓虹粉', colors: ['#FFF0F5', '#FFE1EB', '#FFD2E1', '#FFC3D7', '#FFB4CD', '#FFA5C3', '#FF96B9', '#FF87AF', '#FF78A5', '#FF699B', '#FF5A91', '#FF4B87', '#FF3C7D', '#FF2D73'] },
    { name: '霓虹蓝', colors: ['#E6FFFF', '#CCFFFF', '#B3FFFF', '#99FFFF', '#80FFFF', '#66FFFF', '#4DFFFF', '#33FFFF', '#1AFFFF', '#00FFFF', '#00E6E6', '#00CCCC', '#00B3B3', '#009999'] },
    { name: '霓虹绿', colors: ['#F0FFF0', '#E1FFE1', '#D2FFD2', '#C3FFC3', '#B4FFB4', '#A5FFA5', '#96FF96', '#87FF87', '#78FF78', '#69FF69', '#5AFF5A', '#4BFF4B', '#3CFF3C', '#2DFF2D'] },
    { name: '霓虹橙', colors: ['#FFF5E6', '#FFEBD1', '#FFE1BC', '#FFD7A7', '#FFCD92', '#FFC37D', '#FFB968', '#FFAF53', '#FFA53E', '#FF9B29', '#FF9114', '#FF8700', '#E67A00', '#CC6C00'] },
    { name: '霓虹紫', colors: ['#F5E6FF', '#EBCCff', '#E1B3FF', '#D799FF', '#CD80FF', '#C366FF', '#B94DFF', '#AF33FF', '#A51AFF', '#9B00FF', '#8600E6', '#7000CC', '#5A00B3', '#440099'] },
    { name: '霓虹黄', colors: ['#FFFFD9', '#FFFFB3', '#FFFF8C', '#FFFF66', '#FFFF40', '#FFFF1A', '#FFFF00', '#E6E600', '#CCCC00', '#B3B300', '#999900', '#808000', '#666600', '#4D4D00'] },
    { name: '霓虹红', colors: ['#FFE6E6', '#FFCCCC', '#FFB3B3', '#FF9999', '#FF8080', '#FF6666', '#FF4D4D', '#FF3333', '#FF1A1A', '#FF0000', '#E60000', '#CC0000', '#B30000', '#990000'] },
    { name: '霓虹青', colors: ['#E6FFFF', '#CCFFFF', '#B3FFFF', '#99FFFF', '#80FFFF', '#66FFFF', '#4DFFFF', '#33FFFF', '#1AFFFF', '#00FFFF', '#00E6E6', '#00CCCC', '#00B3B3', '#009999'] },
    { name: '霓虹白', colors: ['#FFFFFF', '#F2F2F2', '#E6E6E6', '#D9D9D9', '#CCCCCC', '#BFBFBF', '#B3B3B3', '#A6A6A6', '#999999', '#8C8C8C', '#808080', '#737373', '#666666', '#595959'] },
    { name: '霓虹金', colors: ['#FFF9E6', '#FFF3CC', '#FFEDB3', '#FFE799', '#FFE180', '#FFDB66', '#FFD54D', '#FFCF33', '#FFC91A', '#FFC300', '#E6B000', '#CC9C00', '#B38900', '#997500'] },
  ],
  金属: [
    { name: '金属金', colors: ['#FFF9E6', '#FFF3CC', '#FFEDB3', '#FFE799', '#FFE180', '#FFDB66', '#FFD54D', '#FFCF33', '#FFC91A', '#FFC300', '#E6B000', '#CC9C00', '#B38900', '#997500'] },
    { name: '金属银', colors: ['#FFFFFF', '#F2F2F2', '#E6E6E6', '#D9D9D9', '#CCCCCC', '#BFBFBF', '#B3B3B3', '#A6A6A6', '#999999', '#8C8C8C', '#808080', '#737373', '#666666', '#595959'] },
    { name: '金属铜', colors: ['#FFF0E6', '#FFE1CC', '#FFD2B3', '#FFC399', '#FFB480', '#FFA566', '#FF964D', '#FF8733', '#FF781A', '#FF6900', '#E65D00', '#CC5200', '#B34700', '#993D00'] },
    { name: '金属青铜', colors: ['#FFF0E6', '#FFE1CC', '#FFD2B3', '#FFC399', '#FFB480', '#FFA566', '#FF964D', '#FF8733', '#FF781A', '#FF6900', '#E65D00', '#CC5200', '#B34700', '#993D00'] },
    { name: '金属铂金', colors: ['#FFFFFF', '#F2F2F2', '#E6E6E6', '#D9D9D9', '#CCCCCC', '#BFBFBF', '#B3B3B3', '#A6A6A6', '#999999', '#8C8C8C', '#808080', '#737373', '#666666', '#595959'] },
    { name: '金属钛', colors: ['#F2F2F2', '#E6E6E6', '#D9D9D9', '#CCCCCC', '#BFBFBF', '#B3B3B3', '#A6A6A6', '#999999', '#8C8C8C', '#808080', '#737373', '#666666', '#595959', '#4D4D4D'] },
    { name: '金属铬', colors: ['#FFFFFF', '#F2F2F2', '#E6E6E6', '#D9D9D9', '#CCCCCC', '#BFBFBF', '#B3B3B3', '#A6A6A6', '#999999', '#8C8C8C', '#808080', '#737373', '#666666', '#595959'] },
    { name: '金属锡', colors: ['#F2F2F2', '#E6E6E6', '#D9D9D9', '#CCCCCC', '#BFBFBF', '#B3B3B3', '#A6A6A6', '#999999', '#8C8C8C', '#808080', '#737373', '#666666', '#595959', '#4D4D4D'] },
    { name: '金属钢', colors: ['#F2F2F2', '#E6E6E6', '#D9D9D9', '#CCCCCC', '#BFBFBF', '#B3B3B3', '#A6A6A6', '#999999', '#8C8C8C', '#808080', '#737373', '#666666', '#595959', '#4D4D4D'] },
    { name: '金属铁', colors: ['#F2F2F2', '#E6E6E6', '#D9D9D9', '#CCCCCC', '#BFBFBF', '#B3B3B3', '#A6A6A6', '#999999', '#8C8C8C', '#808080', '#737373', '#666666', '#595959', '#4D4D4D'] },
  ],
  水彩: [
    { name: '水彩蓝', colors: ['#E6F5FF', '#CCE9FF', '#B3DEFF', '#99D3FF', '#80C8FF', '#66BDFF', '#4DB2FF', '#33A7FF', '#1A9CFF', '#0091FF', '#0082E6', '#0073CC', '#0064B3', '#005599'] },
    { name: '水彩绿', colors: ['#E6FFF0', '#CCFFE1', '#B3FFD2', '#99FFC3', '#80FFB4', '#66FFA5', '#4DFF96', '#33FF87', '#1AFF78', '#00FF69', '#00E65E', '#00CC53', '#00B348', '#00993D'] },
    { name: '水彩粉', colors: ['#FFF0F5', '#FFE1EB', '#FFD2E1', '#FFC3D7', '#FFB4CD', '#FFA5C3', '#FF96B9', '#FF87AF', '#FF78A5', '#FF699B', '#FF5A91', '#FF4B87', '#FF3C7D', '#FF2D73'] },
    { name: '水彩黄', colors: ['#FFFFD9', '#FFFFB3', '#FFFF8C', '#FFFF66', '#FFFF40', '#FFFF1A', '#FFFF00', '#E6E600', '#CCCC00', '#B3B300', '#999900', '#808000', '#666600', '#4D4D00'] },
    { name: '水彩紫', colors: ['#F5E6FF', '#EBCCff', '#E1B3FF', '#D799FF', '#CD80FF', '#C366FF', '#B94DFF', '#AF33FF', '#A51AFF', '#9B00FF', '#8600E6', '#7000CC', '#5A00B3', '#440099'] },
    { name: '水彩橙', colors: ['#FFF5E6', '#FFEBD1', '#FFE1BC', '#FFD7A7', '#FFCD92', '#FFC37D', '#FFB968', '#FFAF53', '#FFA53E', '#FF9B29', '#FF9114', '#FF8700', '#E67A00', '#CC6C00'] },
    { name: '水彩棕', colors: ['#F5EBE0', '#EBD7C1', '#E1C3A2', '#D7AF83', '#CD9B64', '#C38745', '#B97326', '#AF5F07', '#A54B00', '#9B3700', '#862E00', '#702500', '#5A1C00', '#441300'] },
    { name: '水彩灰', colors: ['#FFFFFF', '#F2F2F2', '#E6E6E6', '#D9D9D9', '#CCCCCC', '#BFBFBF', '#B3B3B3', '#A6A6A6', '#999999', '#8C8C8C', '#808080', '#737373', '#666666', '#595959'] },
    { name: '水彩红', colors: ['#FFE6E6', '#FFCCCC', '#FFB3B3', '#FF9999', '#FF8080', '#FF6666', '#FF4D4D', '#FF3333', '#FF1A1A', '#FF0000', '#E60000', '#CC0000', '#B30000', '#990000'] },
    { name: '水彩青', colors: ['#E6FFFF', '#CCFFFF', '#B3FFFF', '#99FFFF', '#80FFFF', '#66FFFF', '#4DFFFF', '#33FFFF', '#1AFFFF', '#00FFFF', '#00E6E6', '#00CCCC', '#00B3B3', '#009999'] },
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
        formData.append('api_key', removeBgApiKey); // 添加用户的 API key

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

    const originalImage = new HTMLImageElement();
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
        <TextField
          label="Remove.bg API Key"
          value={removeBgApiKey}
          onChange={(e) => setRemoveBgApiKey(e.target.value)}
          fullWidth
          margin="dense"
          helperText={
            <span>
              获取 API key: {' '}
              <Link href="https://www.remove.bg/api" target="_blank" rel="noopener noreferrer">
                https://www.remove.bg/api
              </Link>
            </span>
          }
        />
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