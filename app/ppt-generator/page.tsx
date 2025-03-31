// @ts-nocheck

'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Button, TextField, Typography, Grid, useTheme, useMediaQuery, Menu, MenuItem, IconButton, Collapse } from '@mui/material';
import Image from 'next/image';
import Feedback from '../components/Feedback';
import pptxgen from 'pptxgenjs';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useDropzone } from 'react-dropzone';

import { toPng } from 'html-to-image';

export default function BatchSVGConverterPage() {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [svgFiles, setSvgFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [svgCode, setSvgCode] = useState<string>(getDefaultSvgCode());
  const [copied, setCopied] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  function getDefaultSvgCode() {
    return `<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1E1E1E;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2C2C2C;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg-gradient)"/>
  <circle cx="960" cy="540" r="400" fill="none" stroke="#E0E0E0" stroke-width="2">
    <animate attributeName="r" values="400;420;400" dur="4s" repeatCount="indefinite" />
  </circle>
  <text x="960" y="540" font-family="微软雅黑, sans-serif" font-size="96" font-weight="bold" text-anchor="middle" fill="#E0E0E0">
    实时API：开启语音交互新纪元
    <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
  </text>
  
  <!-- 动态线条 -->
  <path d="M0 0 Q960 540, 1920 0" stroke="#FFD700" stroke-width="2" fill="none">
    <animate attributeName="d" values="M0 0 Q960 540, 1920 0; M0 1080 Q960 540, 1920 1080; M0 0 Q960 540, 1920 0" dur="10s" repeatCount="indefinite" />
  </path>
  <path d="M0 1080 Q960 540, 1920 1080" stroke="#FF69B4" stroke-width="2" fill="none">
    <animate attributeName="d" values="M0 1080 Q960 540, 1920 1080; M0 0 Q960 540, 1920 0; M0 1080 Q960 540, 1920 1080" dur="12s" repeatCount="indefinite" />
  </path>
</svg>`;
  }

  const handleSvgCodeFocus = () => {
    // 当用户点击代码框时，清空默认内容
    if (svgCode === getDefaultSvgCode()) {
      setSvgCode('');
    }
  };

  const handleSvgCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSvgCode(e.target.value);
  };

  const handlePreviewSvgCode = () => {
    if (!svgCode.trim()) {
      setError('请输入有效的SVG代码');
      return;
    }

    try {
      // 创建一个Blob对象
      const blob = new Blob([svgCode], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      // 创建一个File对象
      const file = new File([blob], 'custom-svg.svg', { type: 'image/svg+xml' });
      
      // 更新状态
      setSvgFiles([file]);
      setPreviewUrls([url]);
    } catch (err) {
      console.error('SVG预览错误:', err);
      setError('SVG代码无效，请检查后重试');
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const svgFiles = acceptedFiles.filter(file => file.type === 'image/svg+xml');
    if (svgFiles.length === 0) {
      setError('请只上传SVG文件');
      return;
    }

    setSvgFiles(svgFiles);
    const urls = svgFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/svg+xml': ['.svg']
    },
    multiple: true
  });

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

  const promptText = `作为具有20年经验的苹果发布会的keynote设计师，我希望你帮我使用同样的专业设计技巧和视觉审美，帮我把把这篇文章变成一系列结构清晰、重点突出，适合用来演讲的中文keynote，你可以使用svg实现keynote页面设计。

你也是svg的视觉设计专家，非常理解svg的限制和特色，有着极好的审美，会选择好看的无衬线字体，进行出色的有呼吸感的文字布局，通过界面的组块化清晰呈现信息。

每张svg图标的高度都是1920*1080。`;

  const handleCopyPrompt = () => {
    if (typeof window === 'undefined') return;
    try {
      navigator.clipboard.writeText(promptText);
      // 显示复制成功的提示（如果有UI组件显示这个状态）
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
      setError('复制失败');
    }
  };

  const convertSvgToPng = async (file: File, index: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const svgText = e.target?.result as string;
          
          // 创建一个容器div
          const container = document.createElement('div');
          container.style.position = 'absolute';
          container.style.left = '-9999px';
          container.style.top = '-9999px';
          container.innerHTML = svgText;
          
          // 获取SVG元素并设置尺寸
          const svgElement = container.querySelector('svg');
          if (!svgElement) {
            throw new Error('Invalid SVG file');
          }
          
          // 确保SVG有明确的尺寸
          if (!svgElement.hasAttribute('width')) {
            svgElement.setAttribute('width', '1920');
          }
          if (!svgElement.hasAttribute('height')) {
            svgElement.setAttribute('height', '1080');
          }
          
          // 添加到文档中
          document.body.appendChild(container);
          
          try {
            // 使用html-to-image转换
            const dataUrl = await toPng(container, {
              quality: 1.0,
              backgroundColor: '#ffffff'
            });
            
            // 转换dataUrl为Blob
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            resolve(blob);
          } finally {
            // 确保总是移除容器
            document.body.removeChild(container);
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read SVG file'));
      reader.readAsText(file);
    });
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

  const handleExportPNG = async () => {
    if (svgFiles.length === 0) {
      setError('请先上传SVG文件或输入SVG代码');
      return;
    }

    setLoading(true);
    try {
      // 移动设备单个文件处理
      if (isMobileDevice() && svgFiles.length === 1) {
        const pngBlob = await convertSvgToPng(svgFiles[0], 0);
        const fileName = `image_001.png`;
        
        // 尝试使用Web Share API
        if (supportsWebShareAPI()) {
          const shared = await shareImageToGallery(pngBlob, fileName);
          if (shared) {
            setSuccess(true);
            setLoading(false);
            return;
          }
        }
        
        // 如果Web Share API不可用或分享失败，回退到传统下载
        const url = URL.createObjectURL(pngBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setSuccess(true);
      } 
      // 桌面设备或多个文件处理
      else {
        const zip = new JSZip();
        let successCount = 0;
        
        // 创建所有转换的 Promise
        const conversions = svgFiles.map(async (file, index) => {
          try {
            const pngBlob = await convertSvgToPng(file, index);
            zip.file(`image_${String(index + 1).padStart(3, '0')}.png`, pngBlob);
            successCount++;
          } catch (err) {
            console.error(`Error converting SVG ${index + 1}:`, err);
            setError(`转换第 ${index + 1} 个文件失败`);
          }
        });

        // 等待所有转换完成
        await Promise.all(conversions);

        // 如果有成功转换的文件，则生成zip
        if (successCount > 0) {
          const content = await zip.generateAsync({ type: 'blob' });
          saveAs(content, 'svg_to_png_images.zip');
          setSuccess(true);
        } else {
          throw new Error('所有文件转换失败');
        }
      }
    } catch (err) {
      console.error('PNG导出错误:', err);
      setError('PNG导出失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ '& > *': { mb: 3 }, maxWidth: '100%', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', fontSize: isMobile ? '1.5rem' : '2rem' }}>
        SVG批量转换PNG
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', mb: 3, backgroundColor: '#ecf0f1', borderRadius: '10px', padding: '20px' }}>
        <Image src="/images/svg-to-ppt.svg" alt="SVG to PNG" width={isMobile ? 150 : 200} height={isMobile ? 150 : 200} />
        <Typography variant="h6" sx={{ ml: isMobile ? 0 : 3, mt: isMobile ? 2 : 0, color: '#34495e' }}>
          批量将SVG图片转换为PNG格式。支持拖拽上传多个SVG文件，或直接输入SVG代码，并一键导出为PNG格式。
        </Typography>
      </Box>

      {/* SVG代码输入区域 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          输入SVG代码
        </Typography>
        <TextField
          multiline
          rows={10}
          fullWidth
          variant="outlined"
          value={svgCode}
          onChange={handleSvgCodeChange}
          onFocus={handleSvgCodeFocus}
          placeholder="在这里输入SVG代码"
          sx={{ mb: 2, fontFamily: 'monospace' }}
        />
        <Button 
          variant="contained" 
          onClick={handlePreviewSvgCode}
          sx={{
            mb: 2,
            backgroundColor: '#3498db',
            '&:hover': {
              backgroundColor: '#2980b9'
            }
          }}
        >
          预览SVG代码
        </Button>
      </Box>

      {/* 文件上传区域 */}
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #ccc',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: isDragActive ? '#f0f4f8' : 'transparent',
          cursor: 'pointer',
          mb: 3
        }}
      >
        <input {...getInputProps()} />
        <Typography>
          {isDragActive ? '放开以添加文件' : '或拖拽SVG文件到此处，或点击选择文件'}
        </Typography>
      </Box>

      <Button 
        variant="contained" 
        onClick={handleExportPNG}
        disabled={loading || previewUrls.length === 0}
        sx={{
          mb: 3,
          backgroundColor: '#2ecc71',
          '&:hover': {
            backgroundColor: '#27ae60'
          }
        }}
      >
        {loading ? '导出中...' : isMobileDevice() && svgFiles.length === 1 ? '保存到相册' : '导出为PNG'}
      </Button>

      {/* 预览区域 */}
      <Grid container spacing={2}>
        {previewUrls.map((url, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                paddingTop: '100%',
                cursor: 'pointer',
                border: '1px solid #eee',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
              onClick={() => handleFullscreen(index)}
            >
              <Image
                src={url}
                alt={`SVG ${index + 1}`}
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
            disabled={fullscreenIndex === 0}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <Image
            src={previewUrls[fullscreenIndex]}
            alt={`Fullscreen SVG ${fullscreenIndex + 1}`}
            layout="fill"
            objectFit="contain"
          />
          <IconButton
            onClick={handleNextSlide}
            sx={{ position: 'absolute', right: 20, color: 'white' }}
            disabled={fullscreenIndex === previewUrls.length - 1}
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