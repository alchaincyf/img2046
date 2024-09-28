'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Button, TextField, Typography, Grid, useTheme, useMediaQuery, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Image from 'next/image';
import Feedback from '../components/Feedback';
import { SelectChangeEvent } from '@mui/material/Select';

export default function SVGGeneratorPage() {
  const [svgCode, setSvgCode] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scaleFactor, setScaleFactor] = useState(1);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const defaultSvg = `
      <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="resizeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3498db;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#2ecc71;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect x="40" y="40" width="120" height="120" fill="url(#resizeGrad)" rx="10">
          <animate attributeName="width" values="120;110;120" dur="3s" repeatCount="indefinite" />
          <animate attributeName="height" values="120;110;120" dur="3s" repeatCount="indefinite" />
        </rect>
        <path d="M40 100 L160 100 M100 40 L100 160" stroke="#ecf0f1" stroke-width="4" />
        <circle cx="100" cy="100" r="10" fill="#2ecc71">
          <animate attributeName="r" values="10;8;10" dur="2s" repeatCount="indefinite" />
        </circle>
        <path d="M30 30 L50 50 M170 170 L150 150" stroke="#34495e" stroke-width="4">
          <animate attributeName="d" values="M30 30 L50 50 M170 170 L150 150;M35 35 L55 55 M165 165 L145 145;M30 30 L50 50 M170 170 L150 150" dur="3s" repeatCount="indefinite" />
        </path>
      </svg>
    `;
    setSvgCode(defaultSvg);
    setPreviewUrl(URL.createObjectURL(new Blob([defaultSvg], { type: 'image/svg+xml' })));
  }, []);

  const handleSvgCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSvgCode(event.target.value);
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setSvgCode(content);
      };
      reader.readAsText(file);
    }
  };

  const handleScaleChange = (event: SelectChangeEvent<number>) => {
    setScaleFactor(Number(event.target.value));
  };

  const handleDownload = async (format: 'svg' | 'png' | 'jpg') => {
    setLoading(true);
    try {
      if (format === 'svg') {
        const blob = new Blob([svgCode], { type: 'image/svg+xml' });
        downloadBlob(blob, `image.${format}`);
      } else {
        const svgBlob = new Blob([svgCode], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);
        const img = new window.Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Image loading failed'));
          img.src = url;
        });

        const canvas = document.createElement('canvas');
        const svgSize = getSvgSize(svgCode);
        canvas.width = svgSize.width * scaleFactor;
        canvas.height = svgSize.height * scaleFactor;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(scaleFactor, scaleFactor);
          ctx.drawImage(img, 0, 0);
          const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, `image/${format}`);
          });
          if (blob) {
            downloadBlob(blob, `image_${scaleFactor}x.${format}`);
          } else {
            throw new Error('Failed to create blob');
          }
        } else {
          throw new Error('Failed to get canvas context');
        }
        URL.revokeObjectURL(url);
      }
      setSuccess(true);
    } catch (err) {
      console.error('Download error:', err);
      setError('下载失败，请重试。');
    } finally {
      setLoading(false);
    }
  };

  const downloadBlob = (blob: Blob, fileName: string) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handlePreview = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    setPreviewUrl(URL.createObjectURL(blob));
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
  };

  const getSvgSize = (svgCode: string): { width: number; height: number } => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;

    let width = parseInt(svgElement.getAttribute('width') || '0');
    let height = parseInt(svgElement.getAttribute('height') || '0');

    if (width === 0 || height === 0) {
      const viewBox = svgElement.getAttribute('viewBox');
      if (viewBox) {
        const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);
        width = vbWidth;
        height = vbHeight;
      }
    }

    return { width: width || 1024, height: height || 1024 };
  };

  return (
    <Box sx={{ '& > *': { mb: 3 }, maxWidth: '100%', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', fontSize: isMobile ? '1.5rem' : '2rem' }}>
        SVG 编辑器
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', mb: 3, backgroundColor: '#ecf0f1', borderRadius: '10px', padding: '20px' }}>
        <div style={{ position: 'relative', width: isMobile ? '150px' : '200px', height: isMobile ? '150px' : '200px' }}>
          <Image 
            src="/images/svg-generator.svg" 
            alt="SVG Generator" 
            layout="fill"
            objectFit="contain"
          />
        </div>
        <Typography variant="h6" sx={{ ml: isMobile ? 0 : 3, mt: isMobile ? 2 : 0, color: '#34495e' }}>
          使用我们的SVG编辑器，您可以轻松地创建和编辑SVG图形。输入SVG代码，预览效果，然后下载为SVG、PNG或JPG格式。
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            multiline
            rows={10}
            fullWidth
            variant="outlined"
            value={svgCode}
            onChange={handleSvgCodeChange}
            placeholder="在这里输入或粘贴SVG代码"
          />
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              onClick={handleUpload}
              sx={{ 
                mr: 2,
                fontSize: '1rem', 
                padding: '8px 16px',
                backgroundColor: '#3498db',
                '&:hover': {
                  backgroundColor: '#2980b9'
                }
              }}
            >
              上传SVG文件
            </Button>
            <Button 
              variant="contained" 
              onClick={handlePreview}
              sx={{ 
                fontSize: '1rem', 
                padding: '8px 16px',
                backgroundColor: '#2ecc71',
                '&:hover': {
                  backgroundColor: '#27ae60'
                }
              }}
            >
              预览
            </Button>
          </Box>
          <input
            type="file"
            accept=".svg"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>预览</Typography>
          {previewUrl ? (
            <img src={previewUrl} alt="SVG Preview" style={{ maxWidth: '100%', height: 'auto' }} />
          ) : (
            <Typography>SVG预览将显示在这里</Typography>
          )}
        </Grid>
      </Grid>
      {previewUrl && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>下载选项</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
              <InputLabel id="scale-factor-label">倍数</InputLabel>
              <Select
                labelId="scale-factor-label"
                value={scaleFactor}
                onChange={handleScaleChange}
                label="倍数"
              >
                <MenuItem value={0.5}>0.5x</MenuItem>
                <MenuItem value={1}>1x</MenuItem>
                <MenuItem value={2}>2x</MenuItem>
                <MenuItem value={4}>4x</MenuItem>
                <MenuItem value={8}>8x</MenuItem>
              </Select>
            </FormControl>
            <Button 
              variant="contained" 
              onClick={() => handleDownload('svg')}
              sx={{ mr: 2, mb: 2 }}
            >
              下载SVG
            </Button>
            <Button 
              variant="contained" 
              onClick={() => handleDownload('png')}
              sx={{ mr: 2, mb: 2 }}
            >
              下载PNG
            </Button>
            <Button 
              variant="contained" 
              onClick={() => handleDownload('jpg')}
              sx={{ mb: 2 }}
            >
              下载JPG
            </Button>
          </Box>
        </Box>
      )}
      <Feedback loading={loading} success={success} error={error} onClose={handleClose} />
    </Box>
  );
}