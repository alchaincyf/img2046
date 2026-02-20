'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Button, TextField, Typography, Grid, useTheme, useMediaQuery, Select, MenuItem, FormControl, InputLabel, LinearProgress } from '@mui/material';
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
  const [gifFps, setGifFps] = useState<number>(10);
  const [isGeneratingGif, setIsGeneratingGif] = useState(false);
  const [gifProgress, setGifProgress] = useState<number>(0);

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

    const widthStr = svgElement.getAttribute('width') || '';
    const heightStr = svgElement.getAttribute('height') || '';
    let width = (widthStr.includes('%') || widthStr.includes('em') || widthStr.includes('vw')) ? 0 : parseInt(widthStr) || 0;
    let height = (heightStr.includes('%') || heightStr.includes('em') || heightStr.includes('vh')) ? 0 : parseInt(heightStr) || 0;

    if (width === 0 || height === 0) {
      const viewBox = svgElement.getAttribute('viewBox');
      if (viewBox) {
        const parts = viewBox.split(/[\s,]+/).map(Number);
        width = parts[2] || width;
        height = parts[3] || height;
      }
    }

    return { width: width || 1024, height: height || 1024 };
  };

  const getSvgAnimationDuration = (svgCode: string): number => {
    let maxDuration = 0;

    // SMIL animations
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgCode, 'image/svg+xml');
    const animElements = svgDoc.querySelectorAll('animate, animateTransform, animateMotion, set');
    animElements.forEach(el => {
      const dur = el.getAttribute('dur');
      if (dur) {
        let seconds = 0;
        if (dur.endsWith('ms')) seconds = parseFloat(dur) / 1000;
        else if (dur.endsWith('s')) seconds = parseFloat(dur);
        else seconds = parseFloat(dur);
        if (!isNaN(seconds) && seconds > maxDuration) maxDuration = seconds;
      }
    });

    // CSS animations - parse duration from animation properties
    const cssTimeRegex = /animation(?:-duration)?:\s*[^;]*?([\d.]+)(s|ms)/gi;
    let match;
    const durations: number[] = [];
    while ((match = cssTimeRegex.exec(svgCode)) !== null) {
      let seconds = parseFloat(match[1]);
      if (match[2] === 'ms') seconds /= 1000;
      if (!isNaN(seconds) && seconds > 0 && seconds <= 5) durations.push(seconds);
    }
    if (durations.length > 0) {
      maxDuration = Math.max(maxDuration, Math.max(...durations));
    }

    return maxDuration || 3;
  };

  const interpolateValues = (from: string, to: string, t: number): string => {
    const fromNum = parseFloat(from);
    const toNum = parseFloat(to);
    if (!isNaN(fromNum) && !isNaN(toNum) && from.trim() === String(fromNum) && to.trim() === String(toNum)) {
      const result = fromNum + (toNum - fromNum) * t;
      return String(Math.round(result * 100) / 100);
    }
    const fromNums = from.match(/-?\d+\.?\d*/g);
    const toNums = to.match(/-?\d+\.?\d*/g);
    if (fromNums && toNums && fromNums.length === toNums.length) {
      let numIndex = 0;
      return from.replace(/-?\d+\.?\d*/g, () => {
        const f = parseFloat(fromNums[numIndex]);
        const tVal = parseFloat(toNums[numIndex]);
        numIndex++;
        const result = f + (tVal - f) * t;
        return String(Math.round(result * 100) / 100);
      });
    }
    return t < 0.5 ? from : to;
  };

  const applyAnimationValues = (svgElement: Element, time: number) => {
    const animElements = svgElement.querySelectorAll('animate, animateTransform');
    animElements.forEach(anim => {
      const target = anim.parentElement;
      const attrName = anim.getAttribute('attributeName');
      const valuesStr = anim.getAttribute('values');
      const durStr = anim.getAttribute('dur');
      const fromStr = anim.getAttribute('from');
      const toStr = anim.getAttribute('to');
      if (!target || !attrName) return;

      let animDur = 3;
      if (durStr) {
        if (durStr.endsWith('ms')) animDur = parseFloat(durStr) / 1000;
        else if (durStr.endsWith('s')) animDur = parseFloat(durStr);
        else animDur = parseFloat(durStr);
      }
      if (isNaN(animDur) || animDur <= 0) animDur = 3;

      const progress = (time % animDur) / animDur;
      let interpolatedValue: string;

      if (valuesStr) {
        const values = valuesStr.split(';').map(v => v.trim());
        const segments = values.length - 1;
        if (segments <= 0) {
          interpolatedValue = values[0];
        } else {
          const segmentProgress = progress * segments;
          const segmentIndex = Math.min(Math.floor(segmentProgress), segments - 1);
          const segmentFraction = segmentProgress - segmentIndex;
          const fromVal = values[segmentIndex];
          const toVal = values[Math.min(segmentIndex + 1, values.length - 1)];
          interpolatedValue = interpolateValues(fromVal, toVal, segmentFraction);
        }
      } else if (fromStr && toStr) {
        interpolatedValue = interpolateValues(fromStr, toStr, progress);
      } else {
        return;
      }

      if (anim.tagName === 'animateTransform') {
        const transformType = anim.getAttribute('type') || 'translate';
        target.setAttribute('transform', `${transformType}(${interpolatedValue})`);
      } else {
        target.setAttribute(attrName, interpolatedValue);
      }
    });
  };

  const fixSvgDimensions = (svgCode: string, width: number, height: number): string => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svgEl = svgDoc.documentElement;
    svgEl.setAttribute('width', String(width));
    svgEl.setAttribute('height', String(height));
    return new XMLSerializer().serializeToString(svgEl);
  };

  const convertSvgToGif = async (
    svgCode: string, fps: number, scale: number,
    onProgress?: (progress: number) => void
  ): Promise<Blob> => {
    const GifModule = await import('gif.js');
    const GIF = GifModule.default || GifModule;

    const { width, height } = getSvgSize(svgCode);
    const scaledWidth = Math.round(width * scale);
    const scaledHeight = Math.round(height * scale);
    const duration = getSvgAnimationDuration(svgCode);

    const gif = new GIF({
      workers: 2,
      quality: 1,
      width: scaledWidth,
      height: scaledHeight,
      workerScript: '/gif.worker.js',
      repeat: 0,
    });

    const totalFrames = Math.ceil(fps * duration);
    const frameDelay = Math.round(1000 / fps);

    // Fix SVG dimensions (replace %, em, etc. with pixel values)
    const fixedSvg = fixSvgDimensions(sanitizeSvg(svgCode), width, height);

    const hasCssAnimation = /<style[\s\S]*?animation/i.test(svgCode);

    if (hasCssAnimation) {
      // Real-time capture for CSS animations
      const svgBlob = new Blob([fixedSvg], { type: 'image/svg+xml;charset=utf-8' });
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(svgBlob);
      });

      const img = document.createElement('img');
      img.style.cssText = 'position:fixed;left:0;top:0;opacity:0.01;pointer-events:none;z-index:-9999;';
      document.body.appendChild(img);

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('SVG加载失败'));
        img.src = dataUrl;
      });

      // Wait for first paint and animation to start
      await new Promise(r => setTimeout(r, 100));

      const canvas = document.createElement('canvas');
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      const ctx = canvas.getContext('2d')!;

      return new Promise((resolve, reject) => {
        let framesCaptured = 0;
        const startTime = performance.now();

        const captureNextFrame = () => {
          try {
            ctx.clearRect(0, 0, scaledWidth, scaledHeight);
            ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
            gif.addFrame(ctx, { copy: true, delay: frameDelay });
            framesCaptured++;

            if (onProgress) onProgress(framesCaptured / totalFrames);

            if (framesCaptured >= totalFrames) {
              document.body.removeChild(img);
              gif.on('finished', (blob: Blob) => resolve(blob));
              gif.render();
            } else {
              const nextTime = startTime + framesCaptured * frameDelay;
              const delay = Math.max(0, nextTime - performance.now());
              setTimeout(captureNextFrame, delay);
            }
          } catch (err) {
            if (img.parentNode) document.body.removeChild(img);
            reject(err);
          }
        };

        captureNextFrame();
      });
    } else {
      // Frame-by-frame for SMIL animations (deterministic, no real-time wait)
      const parser = new DOMParser();
      const serializer = new XMLSerializer();

      const canvas = document.createElement('canvas');
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      const ctx = canvas.getContext('2d')!;

      for (let frame = 0; frame < totalFrames; frame++) {
        const time = (frame / totalFrames) * duration;

        const svgDoc = parser.parseFromString(fixedSvg, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;

        applyAnimationValues(svgElement, time);
        svgElement.querySelectorAll('animate, animateTransform, animateMotion, set').forEach(el => el.remove());

        const svgString = serializer.serializeToString(svgElement);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(svgBlob);
        });

        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const i = new Image();
          i.onload = () => resolve(i);
          i.onerror = () => reject(new Error('帧图像加载失败'));
          i.src = dataUrl;
        });

        ctx.clearRect(0, 0, scaledWidth, scaledHeight);
        ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
        gif.addFrame(ctx, { copy: true, delay: frameDelay });

        if (onProgress) onProgress((frame + 1) / totalFrames);
      }

      return new Promise((resolve) => {
        gif.on('finished', (blob: Blob) => resolve(blob));
        gif.render();
      });
    }
  };

  const handleDownloadGif = async () => {
    setIsGeneratingGif(true);
    setGifProgress(0);
    setLoading(true);
    try {
      if (svgCodes.length > 1) {
        const zip = new JSZip();
        for (let i = 0; i < svgCodes.length; i++) {
          const sanitized = sanitizeSvg(svgCodes[i]);
          if (sanitized.trim()) {
            const blob = await convertSvgToGif(
              sanitized, gifFps, scaleFactor,
              (p) => setGifProgress((i + p) / svgCodes.length)
            );
            zip.file(`image_${i + 1}.gif`, blob);
          }
        }
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, 'images.zip');
      } else {
        const sanitized = sanitizeSvg(svgCodes[0]);
        if (sanitized.trim()) {
          const blob = await convertSvgToGif(
            sanitized, gifFps, scaleFactor,
            (p) => setGifProgress(p)
          );
          if (isMobileDevice() && supportsWebShareAPI()) {
            await shareImageToGallery(blob, 'image.gif');
          } else {
            downloadBlob(blob, 'image.gif');
          }
        }
      }
      setSuccess(true);
    } catch (err) {
      console.error('GIF generation error:', err);
      setError('GIF生成失败，请重试。');
    } finally {
      setIsGeneratingGif(false);
      setGifProgress(0);
      setLoading(false);
    }
  };

  // 检测是否为移动设备
  const isMobileDevice = () => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // 检测是否支持Web Share API
  const supportsWebShareAPI = () => {
    if (typeof window === 'undefined') return false;
    return navigator && 'share' in navigator;
  };

  // 使用Web Share API分享图片到相册
  const shareImageToGallery = async (blob: Blob, fileName: string) => {
    try {
      if (typeof window === 'undefined') return false;
      if (navigator.share) {
        await navigator.share({
          files: [new File([blob], fileName, { type: blob.type })],
          title: '图像魔方 - 分享图片',
        });
        return true;
      }
    } catch (error) {
      console.error('分享失败:', error);
    }
    return false;
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
            <FormControl variant="outlined" sx={{ minWidth: 100 }} size="small">
              <InputLabel id="gif-fps-label">帧率</InputLabel>
              <Select
                labelId="gif-fps-label"
                value={gifFps}
                onChange={(e) => setGifFps(Number(e.target.value))}
                label="帧率"
                disabled={isGeneratingGif}
              >
                <MenuItem value={5}>5 FPS</MenuItem>
                <MenuItem value={10}>10 FPS</MenuItem>
                <MenuItem value={15}>15 FPS</MenuItem>
                <MenuItem value={20}>20 FPS</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleDownloadGif}
              disabled={isGeneratingGif || loading}
              sx={{
                mb: 2,
                backgroundColor: '#e67e22',
                '&:hover': { backgroundColor: '#d35400' }
              }}
            >
              {isGeneratingGif
                ? `生成GIF中... ${Math.round(gifProgress * 100)}%`
                : (isMobileDevice() && svgCodes.length === 1 ? '保存GIF到相册' : '下载GIF')}
            </Button>
          </Box>
          {isGeneratingGif && (
            <Box sx={{ mt: 1 }}>
              <LinearProgress variant="determinate" value={gifProgress * 100} sx={{ borderRadius: 1 }} />
            </Box>
          )}
        </Box>
      )}
      <Feedback loading={loading} success={success} error={error} onClose={handleClose} />
    </Box>
  );
}