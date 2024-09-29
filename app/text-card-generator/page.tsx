'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import AIToolLayout from '../components/AIToolLayout';

// 更新预设背景和布局模板
const presetTemplates = [
  { name: '清新简约', backgroundColor: '#F0F4F8', textColor: '#2C3E50', font: 'Source Han Sans CN', fontSize: 50 },
  { name: '优雅米色', backgroundColor: '#F5E6D3', textColor: '#5D4037', font: 'Source Han Sans CN', fontSize: 50 },
  { name: '薄荷清新', backgroundColor: '#E0F2F1', textColor: '#004D40', font: 'Source Han Sans CN', fontSize: 50 },
  { name: '深邃黑', backgroundColor: '#1E1E1E', textColor: '#FFFFFF', font: 'Source Han Sans CN', fontSize: 50 },
  { name: '简约白', backgroundColor: '#FFFFFF', textColor: '#333333', font: 'Source Han Sans CN', fontSize: 50 },
  { name: '暖色调', backgroundColor: '#FFF5E6', textColor: '#5D4037', font: 'Source Han Sans CN', fontSize: 50 },
  { name: '清新绿', backgroundColor: '#E8F5E9', textColor: '#1B5E20', font: 'Source Han Sans CN', fontSize: 50 },
  { name: '典雅灰', backgroundColor: '#FAFAFA', textColor: '#37474F', font: 'Source Han Sans CN', fontSize: 50 },
];

// 更新字体列表，增加五种新字体，并将字体名称改为中文
const fonts = [
  { value: 'Source Han Sans CN', label: '思源黑体' },
  { value: 'Noto Sans SC', label: '思源宋体' },
  { value: 'PingFang SC', label: '苹方' },
  { value: 'Hiragino Sans GB', label: '冬青黑体' },
  { value: 'Microsoft YaHei', label: '微软雅黑' },
  { value: 'FZLTHJW', label: '方正兰亭黑' },
  { value: 'FZLTXHJW', label: '方正兰亭细黑' },
  { value: 'HYQiHei', label: '汉仪旗黑' },
  { value: 'DouyinMeihaoTi', label: '抖音美好体' },
  { value: 'MaokenZhuyuanTi', label: '猫啃珠圆体' },
  { value: 'YunfengFeiyunTi', label: '云峰飞云体' },
  { value: 'XimaiXihuanTi', label: '喜脉喜欢体' },
  { value: 'Slidexiaxing-Regular', label: 'Slide下行体' },
];

// 扩展渐变底座颜色选项
const gradientBaseColors = [
  { name: '极光', colors: ['#4facfe', '#00f2fe'] },
  { name: '日落', colors: ['#fa709a', '#fee140'] },
  { name: '薰衣草', colors: ['#7f7fd5', '#86a8e7', '#91eae4'] },
  { name: '火焰', colors: ['#ff9a9e', '#fad0c4'] },
  { name: '森林', colors: ['#43e97b', '#38f9d7'] },
  { name: '深邃蓝', colors: ['#0f2027', '#203a43', '#2c5364'] },
  { name: '暗夜紫', colors: ['#231557', '#44107a', '#ff1361'] },
  { name: '星空黑', colors: ['#000000', '#130f40'] },
  { name: '无底座', colors: [] }, // 保留这个选项
];

// 添加比例选项
const aspectRatios = [
  { label: '3:4', value: 3/4 },
  { label: '4:3', value: 4/3 },
  { label: '16:9', value: 16/9 },
  { label: '1:1', value: 1 },
  { label: '9:16', value: 9/16 },
];

interface TextCardProps {
  text: string;
  font: string;
  textColor: string;
  backgroundColor: string;
  imageUrl?: string;
}

function TextCard({ text, font, textColor, backgroundColor, imageUrl }: TextCardProps) {
  return (
    <div className="relative w-full pb-[133.33%]">
      <div className="absolute inset-0">
        {/* 流光底座 */}
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-[5%] bg-gradient-to-t from-white/30 to-transparent animate-flow"></div>
        </div>
        {/* 卡片主体 */}
        <div className="absolute inset-0 rounded-lg overflow-hidden" style={{ backgroundColor }}>
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            {/* 顶部文字 */}
            <div className="text-center">
              <h2 style={{ fontFamily: font, color: textColor, fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{text}</h2>
            </div>

            {/* 中间图片 */}
            {imageUrl && (
              <div className="flex-grow flex items-center justify-center">
                <img src={imageUrl} alt="Card Image" className="max-w-full max-h-full object-contain" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 添加默认卡片内容
const defaultCardContent = "欢迎使用IMG2046文字卡片生成器！\n\n这是一个强大的工具，可以帮助您创建精美的文字卡片。您可以自定义字体、颜色、背景等多种样式。\n\n开始创作吧！";

const TextCardGeneratorPage: React.FC = () => {
  const [text, setText] = useState(defaultCardContent);
  const [backgroundColor, setBackgroundColor] = useState('#F0F4F8');
  const [textColor, setTextColor] = useState('#2C3E50');
  const [fontSize, setFontSize] = useState(50);
  const [font, setFont] = useState('Source Han Sans CN'); // 将默认字体设置为思源黑体
  // 删除 layout 状态
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gradientBase, setGradientBase] = useState(gradientBaseColors[0]);
  const [autoSplit, setAutoSplit] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(aspectRatios[0].value);
  const [generatedCards, setGeneratedCards] = useState<string[]>([]);
  const [useBase, setUseBase] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    generatePreview();
  }, [text, backgroundColor, textColor, fontSize, font, selectedTemplate, gradientBase, autoSplit, aspectRatio]);

  useEffect(() => {
    // 加载自定义字体
    const loadFonts = async () => {
      const fontFaces = [
        { name: 'DouyinMeihaoTi', url: '/fonts/抖音美好体.otf' },
        { name: 'MaokenZhuyuanTi', url: '/fonts/猫啃珠圆体 MaokenZhuyuanTi.ttf' },
        { name: 'YunfengFeiyunTi', url: '/fonts/云峰飞云体.ttf' },
        { name: 'XimaiXihuanTi', url: '/fonts/喜脉喜欢体.ttf' },
        { name: 'Slidexiaxing-Regular', url: '/fonts/Slidexiaxing-Regular.ttf' },
      ];

      for (const fontFace of fontFaces) {
        try {
          const font = new FontFace(fontFace.name, `url(${fontFace.url})`);
          await font.load();
          document.fonts.add(font);
          console.log(`Font ${fontFace.name} loaded successfully`);
        } catch (error) {
          console.error(`Error loading font ${fontFace.name}:`, error);
        }
      }
    };

    loadFonts();
  }, []);

  const getWrappedLines = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split('');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const char = words[i];
      const width = ctx.measureText(currentLine + char).width;
      if (width < maxWidth) {
        currentLine += char;
      } else {
        lines.push(currentLine);
        currentLine = char;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const drawText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let testLine = '';
    let lineArray = [];

    for (let n = 0; n < words.length; n++) {
      testLine += `${words[n]} `;
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        lineArray.push(line);
        line = `${words[n]} `;
        testLine = `${words[n]} `;
      } else {
        line += `${words[n]} `;
      }

      if (n === words.length - 1) {
        lineArray.push(line);
      }
    }

    console.log('Total lines:', lineArray.length);
    console.log('Line height:', lineHeight);
    console.log('Total text height:', lineArray.length * lineHeight);

    for (let i = 0; i < lineArray.length; i++) {
      ctx.fillText(lineArray[i], x, y + i * lineHeight);
    }

    return y + lineArray.length * lineHeight;
  }

  const drawTextWithLimit = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxHeight: number) => {
    const lines = text.split('\n');
    let renderedText = '';
    let currentY = y;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      let lineFont = `${fontSize}px ${font}`;

      // 处理Markdown标题
      if (line.startsWith('# ')) {
        lineFont = `bold ${fontSize * 1.6}px ${font}`;
        line = line.substring(2);
      } else if (line.startsWith('## ')) {
        lineFont = `bold ${fontSize * 1.4}px ${font}`;
        line = line.substring(3);
      } else if (line.startsWith('### ')) {
        lineFont = `bold ${fontSize * 1.2}px ${font}`;
        line = line.substring(4);
      }

      ctx.font = lineFont;

      let chars = line.split('');
      let currentLine = '';

      for (let n = 0; n < chars.length; n++) {
        let testLine = currentLine + chars[n];
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(currentLine, x, currentY);
          renderedText += currentLine + '\n';
          currentLine = chars[n];
          currentY += lineHeight;

          if (currentY > y + maxHeight) {
            return {
              renderedText: renderedText.trim(),
              leftoverText: lines.slice(i).join('\n').substring(n)
            };
          }
        } else {
          currentLine = testLine;
        }
      }

      ctx.fillText(currentLine, x, currentY);
      renderedText += currentLine + '\n';
      currentY += lineHeight;

      if (currentY > y + maxHeight) {
        return {
          renderedText: renderedText.trim(),
          leftoverText: lines.slice(i + 1).join('\n')
        };
      }
    }

    return {
      renderedText: renderedText.trim(),
      leftoverText: ''
    };
  };

  const generatePreview = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const baseWidth = 1200;
    const baseHeight = baseWidth / aspectRatio;

    canvas.width = baseWidth;
    canvas.height = baseHeight;

    const paddingBottom = 140; // 增加到 140px (原来的 40px + 新增的 100px)
    const paddingTop = 200;
    const paddingSide = 60;
    const lineSpacing = 2.0;
    const gradientPadding = 30;

    // 文本分割和多卡片生成
    const cards: string[] = [];
    let remainingText = text;

    while (remainingText.length > 0) {
      // 重置画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制渐变底座或背景
      if (useBase && gradientBase.colors.length > 0) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradientBase.colors.forEach((color, index) => {
          gradient.addColorStop(index / (gradientBase.colors.length - 1), color);
        });
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = backgroundColor;
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制卡片背景
      const cardMargin = useBase ? 20 + gradientPadding : 0;
      const cardWidth = canvas.width - cardMargin * 2;
      const cardHeight = canvas.height - cardMargin * 2;
      const cornerRadius = 20;

      ctx.beginPath();
      ctx.moveTo(cardMargin + cornerRadius, cardMargin);
      ctx.lineTo(cardMargin + cardWidth - cornerRadius, cardMargin);
      ctx.quadraticCurveTo(cardMargin + cardWidth, cardMargin, cardMargin + cardWidth, cardMargin + cornerRadius);
      ctx.lineTo(cardMargin + cardWidth, cardMargin + cardHeight - cornerRadius);
      ctx.quadraticCurveTo(cardMargin + cardWidth, cardMargin + cardHeight, cardMargin + cardWidth - cornerRadius, cardMargin + cardHeight);
      ctx.lineTo(cardMargin + cornerRadius, cardMargin + cardHeight);
      ctx.quadraticCurveTo(cardMargin, cardMargin + cardHeight, cardMargin, cardMargin + cardHeight - cornerRadius);
      ctx.lineTo(cardMargin, cardMargin + cornerRadius);
      ctx.quadraticCurveTo(cardMargin, cardMargin, cardMargin + cornerRadius, cardMargin);
      ctx.closePath();
      
      // 添加微妙的阴影效果
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 5;
      
      ctx.fillStyle = backgroundColor;
      ctx.fill();

      // 重置阴影
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // 绘制日期
      const date = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
      ctx.font = `${fontSize * 0.7}px ${font}`; // 修改为主题文字的70%
      ctx.fillStyle = `${textColor}80`;
      ctx.textAlign = 'left';
      ctx.fillText(date, cardMargin + paddingSide, cardMargin + paddingTop * 0.4);

      // 绘制主文本
      ctx.fillStyle = textColor;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      // 确保使用选择的字体，添加后备字体
      ctx.font = `${fontSize}px "${font}", "Source Han Sans CN", sans-serif`;

      const maxWidth = cardWidth - paddingSide * 2;
      const maxHeight = cardHeight - paddingTop - paddingBottom;

      const { renderedText, leftoverText } = drawTextWithLimit(
        ctx, 
        remainingText, 
        cardMargin + paddingSide, 
        cardMargin + paddingTop, 
        maxWidth, 
        fontSize * lineSpacing, 
        maxHeight
      );

      remainingText = leftoverText;

      // 绘制字数统计和水印
      const wordCount = renderedText.replace(/\s/g, '').length;
      ctx.font = `${fontSize * 0.7}px ${font}`;
      ctx.fillStyle = `${textColor}80`;
      ctx.textAlign = 'right';
      ctx.fillText(`字数：${wordCount}`, cardMargin + cardWidth - paddingSide, cardMargin + cardHeight - paddingBottom + 60); // 调整位置

      ctx.font = `${fontSize * 0.5}px ${font}`;
      ctx.fillStyle = `${textColor}40`;
      ctx.textAlign = 'center';
      ctx.fillText("©️ Generated by IMG2046", canvas.width / 2, cardMargin + cardHeight - paddingBottom + 80); // 调整位置

      cards.push(canvas.toDataURL('image/png'));

      if (!autoSplit) break;
    }

    setGeneratedCards(cards);
  };
  // 处理模板变更的函数
  const handleTemplateChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTemplate(newValue);
    const template = presetTemplates[newValue];
    setBackgroundColor(template.backgroundColor);
    setTextColor(template.textColor);
    setFont(template.font);
    setFontSize(template.fontSize);
  };

  return (
    <AIToolLayout
      title="文字卡片生成器"
      description="创建优雅美观的文字卡片，支持Markdown格式，适合社交媒体分享或个人使用。"
      iconSrc="/images/text-card-generator.svg"
    >
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2, backgroundColor: '#f5f5f5' }}>
        <Grid container spacing={2}>
          {/* 文本输入区域 */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={isMobile ? 3 : 4}
              variant="outlined"
              label="输入文字（支持Markdown格式）"
              value={text}
              onChange={(e) => setText(e.target.value)}
              sx={{ mb: 2, backgroundColor: '#ffffff' }}
            />
          </Grid>
          {/* 模板选择区域 */}
          <Grid item xs={12}>
            <Typography variant={isMobile ? 'body2' : 'body1'} gutterBottom>选择模板</Typography>
            <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', pb: 1 }}>
              {presetTemplates.map((template, index) => (
                <Button
                  key={index}
                  variant={selectedTemplate === index ? "contained" : "outlined"}
                  onClick={() => handleTemplateChange(null, index)}
                  sx={{ 
                    mr: 1, 
                    mb: 1,
                    minWidth: 'auto',
                    padding: '4px 8px',
                    fontSize: isMobile ? '0.7rem' : '0.9rem',
                    backgroundColor: template.backgroundColor,
                    color: template.textColor,
                    fontFamily: template.font,
                    '&:hover': {
                      backgroundColor: template.backgroundColor,
                      opacity: 0.9,
                    },
                    border: selectedTemplate === index ? `2px solid ${template.textColor}` : 'none',
                  }}
                >
                  {template.name}
                </Button>
              ))}
            </Box>
          </Grid>
          {/* 渐变底座选择区域 */}
          <Grid item xs={12}>
            <Typography variant={isMobile ? 'body2' : 'body1'} gutterBottom>选择渐变底座</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {gradientBaseColors.map((gradientColor, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    setGradientBase(gradientColor);
                    setUseBase(gradientColor.colors.length > 0);
                  }}
                  sx={{
                    width: isMobile ? '30px' : '40px',
                    height: isMobile ? '30px' : '40px',
                    minWidth: 'auto',
                    background: gradientColor.colors.length > 0
                      ? `linear-gradient(to right, ${gradientColor.colors.join(', ')})`
                      : '#FFFFFF',
                    border: gradientBase === gradientColor ? '2px solid #000' : '1px solid #000',
                    p: 0,
                  }}
                >
                  {gradientColor.name === '无底座' ? '🚫' : ''}
                </Button>
              ))}
            </Box>
          </Grid>
          {/* 字体选择区域 */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
              <InputLabel>字体</InputLabel>
              <Select
                value={font}
                label="字体"
                onChange={(e) => {
                  setFont(e.target.value);
                  generatePreview();
                }}
                sx={{ backgroundColor: '#ffffff' }}
              >
                {fonts.map((fontOption) => (
                  <MenuItem key={fontOption.value} value={fontOption.value}>
                    <Typography style={{ 
                      fontFamily: `"${fontOption.value}", "Source Han Sans CN", sans-serif`,
                      fontSize: isMobile ? '14px' : '16px'
                    }}>
                      {fontOption.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* 字体大小调整区域 */}
          <Grid item xs={12} sm={6}>
            <Typography variant={isMobile ? 'body2' : 'body1'} gutterBottom>字体大小</Typography>
            <Slider
              value={fontSize}
              onChange={(_, newValue) => setFontSize(newValue as number)}
              min={18}
              max={72}
              defaultValue={50}
              valueLabelDisplay="auto"
            />
          </Grid>
          {/* 背景颜色和文字颜色选择区域 */}
          <Grid item xs={12} sm={6}>
            <Typography variant={isMobile ? 'body2' : 'body1'} gutterBottom>背景颜色</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                style={{ width: '40px', height: '40px', padding: 0, border: 'none' }}
              />
              <Typography sx={{ ml: 1 }}>{backgroundColor}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant={isMobile ? 'body2' : 'body1'} gutterBottom>文字颜色</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                style={{ width: '40px', height: '40px', padding: 0, border: 'none' }}
              />
              <Typography sx={{ ml: 1 }}>{textColor}</Typography>
            </Box>
          </Grid>
          {/* 图片比例选择区域 */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
              <InputLabel>图片比例</InputLabel>
              <Select
                value={aspectRatio}
                label="图片比例"
                onChange={(e) => setAspectRatio(Number(e.target.value))}
                sx={{ backgroundColor: '#ffffff' }}
              >
                {aspectRatios.map((ratio) => (
                  <MenuItem key={ratio.label} value={ratio.value}>{ratio.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* 自动分割长文本开关 */}
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={autoSplit}
                  onChange={(e) => setAutoSplit(e.target.checked)}
                />
              }
              label={<Typography variant={isMobile ? 'body2' : 'body1'}>自动分割长文本</Typography>}
            />
          </Grid>
        </Grid>
      </Paper>
      {/* 卡片预览和下载区域 */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>卡片预览</Typography>
        {generatedCards.map((card, index) => (
          <Box key={index} sx={{ 
            width: '100%', 
            maxWidth: isMobile ? '100%' : '600px', 
            margin: '20px auto',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <img src={card} alt={`Generated Card ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
          </Box>
        ))}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <Button
          variant="contained"
          onClick={() => {
            generatedCards.forEach((card, index) => {
              const link = document.createElement('a');
              link.download = `text-card-${index + 1}.png`;
              link.href = card;
              link.click();
            });
          }}
          sx={{ mt: 2, width: isMobile ? '100%' : 'auto' }}
        >
          下载卡片
        </Button>
      </Box>
    </AIToolLayout>
  );
};

export default TextCardGeneratorPage;