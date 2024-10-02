'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Grid, 
  useTheme, 
  useMediaQuery, 
  Menu, 
  MenuItem, 
  IconButton,
  Paper
} from '@mui/material';
import Image from 'next/image';
import Feedback from '../components/Feedback';
import { jsPDF } from 'jspdf';
import pptxgen from 'pptxgenjs';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import AIToolLayout from '../components/AIToolLayout';

export default function SvgToPptPage() {
  const [svgCodes, setSvgCodes] = useState<string[]>(['']);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const updatePreviews = (codes: string[]) => {
    const urls = codes.map(code => URL.createObjectURL(new Blob([code], { type: 'image/svg+xml' })));
    setPreviewUrls(urls);
  };

  useEffect(() => {
    const defaultSvg = `
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="960" y="540" font-family="Arial, sans-serif" font-size="48" text-anchor="middle" fill="#333">
          欢迎使用 SVG TO PPT 工具
        </text>
      </svg>
    `;
    setSvgCodes([defaultSvg]);
    updatePreviews([defaultSvg]);
  }, []);

  // ... 其他函数保持不变

  return (
    <AIToolLayout
      title="SVG TO PPT"
      description="将SVG图像转换为PPT幻灯片，支持批量处理和多种导出格式。"
      iconSrc="/images/svg-to-ppt.svg"
    >
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2, backgroundColor: '#f5f5f5' }}>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', mb: 3, backgroundColor: '#ecf0f1', borderRadius: '10px', padding: '20px' }}>
          <div style={{ position: 'relative', width: isMobile ? '150px' : '200px', height: isMobile ? '150px' : '200px' }}>
            <Image 
              src="/images/svg-to-ppt.svg" 
              alt="SVG TO PPT" 
              layout="fill"
              objectFit="contain"
            />
          </div>
          <Typography variant="h6" sx={{ ml: isMobile ? 0 : 3, mt: isMobile ? 2 : 0, color: '#34495e' }}>
            使用我们的SVG TO PPT工具，您可以轻松地将SVG图像转换为PPT幻灯片。支持批量处理多个SVG文件，并可以导出为PDF、PPT或单独的图片文件。
          </Typography>
        </Box>

        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', fontSize: isMobile ? '1.5rem' : '2rem' }}>
          SVG TO PPT 转换器
        </Typography>
        
        <TextField
          multiline
          rows={10}
          fullWidth
          variant="outlined"
          value={svgCodes.join('\n\n')}
          onChange={handleSvgCodeChange}
          placeholder="在这里输入SVG代码，每个完整的<svg>...</svg>将作为一个独立的幻灯片"
          sx={{ mb: 2, backgroundColor: '#ffffff' }}
        />
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={handlePreview} sx={{ backgroundColor: '#3498db', '&:hover': { backgroundColor: '#2980b9' } }}>
            预览所有幻灯片
          </Button>
          <Button variant="contained" onClick={handleExportClick} sx={{ backgroundColor: '#2ecc71', '&:hover': { backgroundColor: '#27ae60' } }}>
            导出
          </Button>
        </Box>
        
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
        <Typography variant="h5" gutterBottom sx={{ mt: 4, color: '#34495e' }}>
          幻灯片预览
        </Typography>
        <Grid container spacing={2}>
          {previewUrls.map((url, index) => (
            <Grid item xs={12} key={index}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '56.25%',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
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
      </Paper>
    </AIToolLayout>
  );
}