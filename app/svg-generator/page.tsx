'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Button, TextField, Typography, Grid, useTheme, useMediaQuery, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Image from 'next/image';
import Feedback from '../components/Feedback';
import { SelectChangeEvent } from '@mui/material/Select';

export default function SVGGeneratorPage() {
  const [svgCodes, setSvgCodes] = useState<string[]>(['']);
  const [previewUrls, setPreviewUrls] = useState<string[]>(['']);
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
          <linearGradient id="compressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3498db;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#2ecc71;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect x="40" y="40" width="120" height="120" fill="url(#compressGrad)" rx="10">
          <animate attributeName="height" values="120;80;120" dur="3s" repeatCount="indefinite" />
          <animate attributeName="y" values="40;60;40" dur="3s" repeatCount="indefinite" />
          <animate attributeName="width" values="120;100;120" dur="3s" repeatCount="indefinite" />
          <animate attributeName="x" values="40;50;40" dur="3s" repeatCount="indefinite" />
        </rect>
        <path d="M60 100 L140 100" stroke="#ecf0f1" stroke-width="4" stroke-linecap="round">
          <animate attributeName="d" values="M60 100 L140 100;M70 100 L130 100;M60 100 L140 100" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M70 60 L130 60 M70 140 L130 140" stroke="#34495e" stroke-width="4" stroke-linecap="round">
          <animate attributeName="d" values="M70 60 L130 60 M70 140 L130 140;M80 80 L120 80 M80 120 L120 120;M70 60 L130 60 M70 140 L130 140" dur="3s" repeatCount="indefinite" />
        </path>
      </svg>
    `;
    setSvgCodes([defaultSvg]);
    setPreviewUrls([URL.createObjectURL(new Blob([defaultSvg], { type: 'image/svg+xml' }))]);
  }, []);

  const handleSvgCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    // Split multiple SVGs if detected
    const svgRegex = /<svg[\s\S]*?<\/svg>/g;
    const matches = newValue.match(svgRegex);
    
    if (matches && matches.length > 0) {
      setSvgCodes(matches);
      const newUrls = matches.map(svg => {
        const sanitizedSvg = sanitizeSvg(svg);
        return URL.createObjectURL(new Blob([sanitizedSvg], { type: 'image/svg+xml' }));
      });
      setPreviewUrls(newUrls);
    } else {
      setSvgCodes([newValue]);
      if (newValue.trim()) {
        const sanitizedSvg = sanitizeSvg(newValue);
        setPreviewUrls([URL.createObjectURL(new Blob([sanitizedSvg], { type: 'image/svg+xml' }))]);
      } else {
        setPreviewUrls(['']);
      }
    }
  };

  const sanitizeSvg = (svg: string): string => {
    // Add missing xmlns if not present
    if (!svg.includes('xmlns="http://www.w3.org/2000/svg"')) {
      svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    return svg;
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const readers = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target?.result as string || '');
          };
          reader.readAsText(file);
        });
      });

      Promise.all(readers).then(results => {
        setSvgCodes(results);
        const newUrls = results.map(svg => {
          const sanitizedSvg = sanitizeSvg(svg);
          return URL.createObjectURL(new Blob([sanitizedSvg], { type: 'image/svg+xml' }));
        });
        setPreviewUrls(newUrls);
      });
    }
  };

  const handleScaleChange = (event: SelectChangeEvent<number>) => {
    setScaleFactor(Number(event.target.value));
  };

  const handleDownload = async (format: 'svg' | 'png' | 'jpg') => {
    setLoading(true);
    try {
      for (let i = 0; i < svgCodes.length; i++) {
        const svgCode = svgCodes[i];
        if (format === 'svg') {
          const sanitizedSvg = sanitizeSvg(svgCode);
          const blob = new Blob([sanitizedSvg], { type: 'image/svg+xml' });
          downloadBlob(blob, `image_${i + 1}.${format}`);
        } else {
          const sanitizedSvg = sanitizeSvg(svgCode);
          const svgBlob = new Blob([sanitizedSvg], { type: 'image/svg+xml' });
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
              downloadBlob(blob, `image_${i + 1}_${scaleFactor}x.${format}`);
            } else {
              throw new Error('Failed to create blob');
            }
          }
          URL.revokeObjectURL(url);
        }
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
    const newUrls = svgCodes.map(svg => {
      const sanitizedSvg = sanitizeSvg(svg);
      return URL.createObjectURL(new Blob([sanitizedSvg], { type: 'image/svg+xml' }));
    });
    setPreviewUrls(newUrls);
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
            value={svgCodes.join('\n\n')}
            onChange={handleSvgCodeChange}
            placeholder="在这里输入或粘贴SVG代码，支持多个SVG"
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
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept=".svg"
            multiple
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            border: '1px solid #e0e0e0', 
            borderRadius: '4px', 
            p: 2,
            minHeight: '300px',
            overflowY: 'auto'
          }}>
            <Typography variant="h6" gutterBottom>预览</Typography>
            {previewUrls.map((url, index) => (
              url && (
                <Box key={index} sx={{ mb: 2, textAlign: 'center' }}>
                  <img
                    src={url}
                    alt={`SVG Preview ${index + 1}`}
                    style={{ 
                      maxWidth: '100%',
                      height: 'auto',
                      marginBottom: '10px'
                    }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    SVG {index + 1}
                  </Typography>
                </Box>
              )
            ))}
          </Box>
        </Grid>
      </Grid>
      {previewUrls.length > 0 && (
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