'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Button, TextField, Typography, Grid, useTheme, useMediaQuery, Menu, MenuItem, IconButton } from '@mui/material';
import Image from 'next/image';
import Feedback from '../components/Feedback';
import { jsPDF } from 'jspdf';
import pptxgen from 'pptxgenjs';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';

// ... 其他导入

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

  // ... 其他状态���引用

  useEffect(() => {
    // 初始化默认SVG代码
    const defaultSvg = `
<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#F5F5F7"/>
  <text x="960" y="120" font-family="SF Pro Display, sans-serif" font-size="56" font-weight="bold" text-anchor="middle" fill="#1D1D1F">
    视觉微调的核心优势
  </text>
  <g transform="translate(240, 240)">
    <rect width="1440" height="200" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="40" y="60" font-family="SF Pro Text, sans-serif" font-size="36" fill="#1D1D1F">
      增强图像理解能力
    </text>
    <text x="40" y="120" font-family="SF Pro Text, sans-serif" font-size="24" fill="#86868B">
      提升视觉搜索、物体检测和医疗图像分析等应用的准确性
    </text>
  </g>
  <g transform="translate(240, 480)">
    <rect width="1440" height="200" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="40" y="60" font-family="SF Pro Text, sans-serif" font-size="36" fill="#1D1D1F">
      低样本学习
    </text>
    <text x="40" y="120" font-family="SF Pro Text, sans-serif" font-size="24" fill="#86868B">
      仅需100张图像即可显著提升模型性能
    </text>
  </g>
  <g transform="translate(240, 720)">
    <rect width="1440" height="200" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="40" y="60" font-family="SF Pro Text, sans-serif" font-size="36" fill="#1D1D1F">
      灵活的数据组合
    </text>
    <text x="40" y="120" font-family="SF Pro Text, sans-serif" font-size="24" fill="#86868B">
      支持文本和图像数据的混合微调，实现更强大的模型定制
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

  const updatePreviews = (codes: string[]) => {
    const urls = codes.map(code => URL.createObjectURL(new Blob([code], { type: 'image/svg+xml' })));
    setPreviewUrls(urls);
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

  const handleExportPDF = async () => {
    setLoading(true);
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1920, 1080]
      });

      for (let i = 0; i < svgCodes.length; i++) {
        if (i > 0) pdf.addPage([1920, 1080], 'landscape');
        
        // 将SVG转换为Canvas
        const canvas = document.createElement('canvas');
        canvas.width = 1920;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');
        
        const img = new Image(1920, 1080);
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = 'data:image/svg+xml;base64,' + btoa(svgCodes[i]);
        });
        
        ctx?.drawImage(img, 0, 0, 1920, 1080);
        
        // 将Canvas添加到PDF
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 1920, 1080);
      }

      pdf.save('presentation.pdf');
      setSuccess(true);
    } catch (err) {
      console.error('PDF导出错误:', err);
      setError('PDF导出失败，请重试。');
    } finally {
      setLoading(false);
      handleExportClose();
    }
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
      console.error('PPT export error:', err);
      setError('PPT导出失败，请重试。');
    } finally {
      setLoading(false);
      handleExportClose();
    }
  };

  const handleExportImages = () => {
    setLoading(true);
    try {
      previewUrls.forEach((url, index) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = `slide_${index + 1}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
      setSuccess(true);
    } catch (err) {
      console.error('Image export error:', err);
      setError('图片出失败，请重试。');
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
      
      <Button onClick={handlePreview}>预��所有幻灯片</Button>
      <Button onClick={handleExportClick}>导出</Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleExportClose}
      >
        <MenuItem onClick={handleExportPDF}>导出为PDF</MenuItem>
        <MenuItem onClick={handleExportPPT}>导出为PPT</MenuItem>
        <MenuItem onClick={handleExportImages}>导出为图片</MenuItem>
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