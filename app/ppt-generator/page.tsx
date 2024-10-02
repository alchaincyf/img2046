//ts-nocheck

'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Button, TextField, Typography, Grid, useTheme, useMediaQuery, Menu, MenuItem, IconButton } from '@mui/material';
import Image from 'next/image';
import Feedback from '../components/Feedback';
import pptxgen from 'pptxgenjs';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// ... 其他导入

import { toPng } from 'html-to-image';

export default function PPTGeneratorPage() {
  const [svgCodes, setSvgCodes] = useState<string[]>(['']);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // ... 其他状态引用

  const updatePreviews = (codes: string[]) => {
    const urls = codes.map(code => URL.createObjectURL(new Blob([code], { type: 'image/svg+xml' })));
    setPreviewUrls(urls);
  };

  useEffect(() => {
    // 初始化默认SVG代码
    const defaultSvg = `
<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#F5F5F7"/>
  <rect x="0" y="980" width="1920" height="100" fill="#34C759" opacity="0.2">
    <animate attributeName="y" from="980" to="0" dur="25s" repeatCount="indefinite"/>
  </rect>
  <rect x="-100" y="0" width="100" height="1080" fill="#007AFF" opacity="0.2">
    <animate attributeName="x" from="-100" to="1920" dur="30s" repeatCount="indefinite"/>
  </rect>
  <text x="960" y="120" font-family="SF Pro Display, sans-serif" font-size="64" font-weight="bold" text-anchor="middle" fill="#1D1D1F">
    技术原理
  </text>
  <g transform="translate(100, 200)">
    <rect width="840" height="220" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="60" y="80" font-family="SF Pro Text, sans-serif" font-size="40" fill="#1D1D1F">
      WebSocket持久连接
    </text>
    <text x="60" y="150" font-family="SF Pro Text, sans-serif" font-size="28" fill="#86868B">
      实现实时双向通信
    </text>
  </g>
  <g transform="translate(980, 200)">
    <rect width="840" height="220" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="60" y="80" font-family="SF Pro Text, sans-serif" font-size="40" fill="#1D1D1F">
      支持函数调用
    </text>
    <text x="60" y="150" font-family="SF Pro Text, sans-serif" font-size="28" fill="#86868B">
      增强交互能力和灵活性
    </text>
  </g>
  <g transform="translate(100, 460)">
    <rect width="840" height="220" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="60" y="80" font-family="SF Pro Text, sans-serif" font-size="40" fill="#1D1D1F">
      自动处理中断
    </text>
    <text x="60" y="150" font-family="SF Pro Text, sans-serif" font-size="28" fill="#86868B">
      提供更自然的对话体验
    </text>
  </g>
  <g transform="translate(980, 460)">
    <rect width="840" height="220" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="60" y="80" font-family="SF Pro Text, sans-serif" font-size="40" fill="#1D1D1F">
      流式音频输入输出
    </text>
    <text x="60" y="150" font-family="SF Pro Text, sans-serif" font-size="28" fill="#86868B">
      实现实时语音交互
    </text>
  </g>
</svg>`;
    setSvgCodes([defaultSvg]);
    updatePreviews([defaultSvg]);
  }, []);

  const handleSvgCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const svgRegex = /<svg[\s\S]*?<\/svg>/g;
    const newSvgCodes = event.target.value.match(svgRegex) || [];
    setSvgCodes(newSvgCodes);
  };

  const handleAddSlide = () => {
    setSvgCodes([...svgCodes, '']);
  };

  const handlePreview = () => {
    const urls = svgCodes.map(code => URL.createObjectURL(new Blob([code], { type: 'image/svg+xml' })));
    setPreviewUrls(urls);
  };

  const handleFullscreen = (index: number) => {
    setFullscreenIndex(index);
  };

  const handleCloseFullscreen = () => {
    setFullscreenIndex(null);
  };

  const handlePrevSlide = () => {
    if (fullscreenIndex !== null && fullscreenIndex > 0) {
      setFullscreenIndex(fullscreenIndex - 1);
    }
  };

  const handleNextSlide = () => {
    if (fullscreenIndex !== null && fullscreenIndex < previewUrls.length - 1) {
      setFullscreenIndex(fullscreenIndex + 1);
    }
  };

  const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setAnchorEl(null);
  };

  const handleExportPPT = async () => {
    setLoading(true);
    try {
      const pptx = new pptxgen();
      for (const url of previewUrls) {
        const slide = pptx.addSlide();
        slide.addImage({ path: url, x: 0, y: 0, w: '100%', h: '100%' });
      }
      await pptx.writeFile({ fileName: 'presentation.pptx' });
      setSuccess(true);
    } catch (err) {
      console.error('PPT导出错误:', err);
      setError('PPT导出失败，请重试。');
    } finally {
      setLoading(false);
      handleExportClose();
    }
  };

  const handleExportImages = async () => {
    setLoading(true);
    try {
      if (previewUrls.length === 1) {
        const link = document.createElement('a');
        link.href = previewUrls[0];
        link.download = 'slide.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const zip = new JSZip();
        const promises = previewUrls.map((url, index) =>
          fetch(url).then(res => res.blob()).then(blob => {
            zip.file(`slide_${index + 1}.svg`, blob);
          })
        );
        await Promise.all(promises);
        const content = await zip.generateAsync({type: 'blob'});
        saveAs(content, 'slides.zip');
      }
      setSuccess(true);
    } catch (err) {
      console.error('图片导出错误:', err);
      setError('图片导出失败，请重试。');
    } finally {
      setLoading(false);
      handleExportClose();
    }
  };

  const handleExportLongImage = async () => {
    setLoading(true);
    try {
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.flexDirection = 'column';

      for (const url of previewUrls) {
        const img = document.createElement('img');
        img.src = url;
        img.style.width = '100%';
        img.style.height = 'auto';
        container.appendChild(img);
      }

      document.body.appendChild(container);

      const dataUrl = await toPng(container);
      
      document.body.removeChild(container);

      const link = document.createElement('a');
      link.download = 'long_image.png';
      link.href = dataUrl;
      link.click();

      setSuccess(true);
    } catch (err) {
      console.error('长图导出错误:', err);
      setError('长图导出失败，请重试。');
    } finally {
      setLoading(false);
      handleExportClose();
    }
  };

  return (
    <Box sx={{ '& > *': { mb: 3 }, maxWidth: '100%', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', fontSize: isMobile ? '1.5rem' : '2rem' }}>
        SVG to PPT
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', mb: 3, backgroundColor: '#ecf0f1', borderRadius: '10px', padding: '20px' }}>
        <Image src="/images/svg-to-ppt.svg" alt="SVG to PPT" width={isMobile ? 150 : 200} height={isMobile ? 150 : 200} />
        <Typography variant="h6" sx={{ ml: isMobile ? 0 : 3, mt: isMobile ? 2 : 0, color: '#34495e' }}>
          使用我们的PPT生成器，您可以轻松地将SVG代码转换为精美的PPT幻灯片。只需输入SVG代码，即可生成和导出您的演示文稿。
        </Typography>
      </Box>
      
      {/* SVG代码输入区域 */}
      <TextField
        multiline
        rows={10}  // 减小输入框的高度
        fullWidth
        variant="outlined"
        value={svgCodes.join('\n\n')}
        onChange={handleSvgCodeChange}
        placeholder="在这里输入SVG代码，每个完整的<svg>...</svg>将作为一个独立的幻灯片"
        sx={{ mb: 2 }}
      />
      
      <Button onClick={handlePreview}>预览所有幻灯片</Button>
      <Button onClick={handleExportClick}>导出</Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleExportClose}
      >
        <MenuItem onClick={handleExportPPT}>导出为PPT</MenuItem>
        <MenuItem onClick={handleExportImages}>导出为图片</MenuItem>
        <MenuItem onClick={handleExportLongImage}>导出为长图</MenuItem>
      </Menu>

      {/* 预览区域 */}
      <Grid container spacing={2}>
        {previewUrls.map((url, index) => (
          <Grid item xs={12} key={index}>  {/* 修改为占据整行 */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%', // 16:9 宽高比
                cursor: 'pointer',
              }}
              onClick={() => handleFullscreen(index)}
            >
              <Image
                src={url}
                alt={`Slide ${index + 1}`}
                layout="fill"
                objectFit="contain"
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* 全屏预览 */}
      {fullscreenIndex !== null && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <IconButton
            onClick={handlePrevSlide}
            sx={{ position: 'absolute', left: 20, color: 'white' }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <Image
            src={previewUrls[fullscreenIndex]}
            alt={`Fullscreen Slide ${fullscreenIndex + 1}`}
            layout="fill"
            objectFit="contain"
          />
          <IconButton
            onClick={handleNextSlide}
            sx={{ position: 'absolute', right: 20, color: 'white' }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
          <IconButton
            onClick={handleCloseFullscreen}
            sx={{ position: 'absolute', top: 20, right: 20, color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      <Feedback loading={loading} success={success} error={error} onClose={() => setError(null)} />
    </Box>
  );
}