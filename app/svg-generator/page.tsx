'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Button, TextField, Typography, Grid, useTheme, useMediaQuery, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import dynamic from 'next/dynamic';
import Feedback from '../components/Feedback';
import { SelectChangeEvent } from '@mui/material/Select';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// 动态导入 Image 组件，但在客户端不使用它
const NextImage = dynamic(() => import('next/image'), { ssr: false });

export default function SVGGeneratorPage() {
  const [svgCodes, setSvgCodes] = useState<string[]>(['']);
  const [previewUrls, setPreviewUrls] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [svgCodeFocused, setSvgCodeFocused] = useState(false);

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

  const handleSvgCodeFocus = () => {
    // 当用户点击代码框时，如果是第一次点击，清空默认内容
    if (!svgCodeFocused) {
      setSvgCodeFocused(true);
      setSvgCodes(['']);
      setPreviewUrls(['']);
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

  const handleDownload = async (format: 'svg' | 'png' | 'jpg' | 'zip') => {
    setLoading(true);
    try {
      if (format === 'zip') {
        // Create a zip file for multiple images
        const zip = new JSZip();
        const promises = svgCodes.map(async (svgCode, i) => {
          const sanitizedSvg = sanitizeSvg(svgCode);
          if (svgCode.trim()) {
            zip.file(`image_${i + 1}.svg`, sanitizedSvg);
          }
        });

        await Promise.all(promises);
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `images.zip`);
      } else {
        // Single file download
        if (svgCodes.length > 1) {
          // Create a zip file for multiple images
          const zip = new JSZip();
          const promises = svgCodes.map(async (svgCode, i) => {
            const sanitizedSvg = sanitizeSvg(svgCode);
            if (svgCode.trim()) {
              if (format === 'svg') {
                zip.file(`image_${i + 1}.svg`, sanitizedSvg);
              } else {
                const blob = await convertSvgToImage(sanitizedSvg, format, scaleFactor);
                if (blob) {
                  zip.file(`image_${i + 1}.${format}`, blob);
                }
              }
            }
          });

          await Promise.all(promises);
          const content = await zip.generateAsync({ type: 'blob' });
          saveAs(content, `images.zip`);
        } else {
          const sanitizedSvg = sanitizeSvg(svgCodes[0]);
          if (sanitizedSvg.trim()) {
            if (format === 'svg') {
              const blob = new Blob([sanitizedSvg], { type: 'image/svg+xml' });
              downloadBlob(blob, `image.${format}`);
            } else {
              const blob = await convertSvgToImage(sanitizedSvg, format, scaleFactor);
              if (blob) {
                // 在移动设备上使用Web Share API
                if (isMobileDevice() && supportsWebShareAPI()) {
                  await shareImageToGallery(blob, `image.${format}`);
                } else {
                  downloadBlob(blob, `image.${format}`);
                }
              }
            }
          }
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

  const convertSvgToImage = async (svgCode: string, format: 'png' | 'jpg', scale: number): Promise<Blob | null> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Create a temporary SVG element with proper XML declaration and encoding
        const svgWithXmlDeclaration = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>${svgCode}`;
        const svgBlob = new Blob([svgWithXmlDeclaration], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        const img = document.createElement('img');
        img.crossOrigin = 'anonymous';  // 添加跨域属性
        
        img.onload = () => {
          try {
            // Get SVG dimensions
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgCode, 'image/svg+xml');
            const svgElement = svgDoc.documentElement;
            
            // Get dimensions from viewBox or width/height attributes
            let width: number;
            let height: number;
            
            const viewBox = svgElement.getAttribute('viewBox');
            if (viewBox) {
              const [, , w, h] = viewBox.split(' ').map(Number);
              width = w;
              height = h;
            } else {
              width = parseInt(svgElement.getAttribute('width') || '0');
              height = parseInt(svgElement.getAttribute('height') || '0');
            }
            
            // Fallback dimensions if none are specified
            if (!width || !height) {
              width = img.naturalWidth || 1024;
              height = img.naturalHeight || 1024;
            }
            
            // Create canvas with proper dimensions
            const canvas = document.createElement('canvas');
            canvas.width = width * scale;
            canvas.height = height * scale;
            
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) {
              throw new Error('Failed to get canvas context');
            }
            
            // Set white background for JPG
            if (format === 'jpg') {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            
            // Scale the context to match the desired size
            ctx.scale(scale, scale);
            
            // Create an off-screen canvas for the SVG
            const offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = width;
            offscreenCanvas.height = height;
            const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
            
            if (!offscreenCtx) {
              throw new Error('Failed to get offscreen canvas context');
            }
            
            // Draw on offscreen canvas first
            offscreenCtx.drawImage(img, 0, 0, width, height);
            
            // Then draw the offscreen canvas onto the main canvas
            ctx.drawImage(offscreenCanvas, 0, 0);
            
            // Convert to blob
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error('Failed to create blob'));
                }
              },
              `image/${format}`,
              0.95
            );
          } catch (err) {
            reject(err);
          } finally {
            URL.revokeObjectURL(url);
          }
        };
        
        img.onerror = (error) => {
          console.error('Image loading error:', error);
          URL.revokeObjectURL(url);
          reject(new Error('Failed to load image'));
        };
        
        // 使用data URL而不是Blob URL
        const reader = new FileReader();
        reader.onload = function(e) {
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(svgBlob);
      } catch (err) {
        reject(err);
      }
    });
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

  // 检测是否为移动设备
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // 检测是否支持Web Share API
  const supportsWebShareAPI = () => {
    return navigator && navigator.share;
  };

  // 使用Web Share API分享图片到相册
  const shareImageToGallery = async (blob: Blob, fileName: string) => {
    try {
      const file = new File([blob], fileName, { type: blob.type });
      
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: '保存图片',
          text: '将SVG转换的图片保存到相册'
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('分享失败:', error);
      return false;
    }
  };

  return (
    <Box sx={{ '& > *': { mb: 3 }, maxWidth: '100%', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', fontSize: isMobile ? '1.5rem' : '2rem' }}>
        SVG 编辑器
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', mb: 3, backgroundColor: '#ecf0f1', borderRadius: '10px', padding: '20px' }}>
        <div style={{ position: 'relative', width: isMobile ? '150px' : '200px', height: isMobile ? '150px' : '200px' }}>
          <NextImage 
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
            onFocus={handleSvgCodeFocus}
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
              {isMobileDevice() && svgCodes.length === 1 ? '保存PNG到相册' : '下载PNG'}
            </Button>
            <Button 
              variant="contained" 
              onClick={() => handleDownload('jpg')}
              sx={{ mb: 2 }}
            >
              {isMobileDevice() && svgCodes.length === 1 ? '保存JPG到相册' : '下载JPG'}
            </Button>
          </Box>
        </Box>
      )}
      <Feedback loading={loading} success={success} error={error} onClose={handleClose} />
    </Box>
  );
}