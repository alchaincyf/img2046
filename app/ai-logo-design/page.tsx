'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, LinearProgress, useTheme, useMediaQuery, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Image from 'next/image';
import Feedback from '../components/Feedback';
import ImageToolLayout from '../components/ImageToolLayout';

// 删除 Head 和 Metadata 相关的导入和导出

export default function AILogoDesign() {
  const [logoName, setLogoName] = useState('');
  const [svgCode, setSvgCode] = useState('');
  const [designConcept, setDesignConcept] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading && progress < 90) {
      interval = setInterval(() => {
        setProgress((prevProgress) => prevProgress + 10);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [loading, progress]);

  const handleDesign = async () => {
    if (!logoName) {
      setError('请输入 logo 名称');
      return;
    }

    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      const response = await fetch('/api/design-logo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logoName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Logo 设计失败');
      }

      const data = await response.json();
      if (!data.svgCode) {
        throw new Error('未能生成 SVG 代码');
      }
      setSvgCode(data.svgCode);
      setDesignConcept(data.designConcept || '');
      setProgress(100);
      setSuccess(true);
    } catch (err) {
      console.error('Error in logo design:', err);
      setError(`Logo 设计失败: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format: 'svg' | 'png' | 'jpg') => {
    if (!svgCode) return;

    try {
      setLoading(true);
      if (format === 'svg') {
        const blob = new Blob([svgCode], { type: 'image/svg+xml' });
        downloadBlob(blob, `${logoName}_logo.svg`);
      } else {
        const response = await fetch('/api/convert-logo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ svgCode, format }),
        });

        if (!response.ok) {
          throw new Error('Conversion failed');
        }

        const blob = await response.blob();
        downloadBlob(blob, `${logoName}_logo.${format}`);
      }
      setSuccess(true);
    } catch (err) {
      setError('下载失败，请重试。');
    } finally {
      setLoading(false);
    }
  };

  const downloadBlob = (blob: Blob, fileName: string) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
  };

  return (
    <ImageToolLayout
      title="免费 AI Logo 设计工具"
      description="使用我们的 AI Logo 设计工具，只需输入您的 logo 名称，即可生成独特的 SVG 格式 logo。支持下载 SVG、PNG 和 JPG 格式。"
    >
      <Box sx={{ '& > *': { mb: 3 }, maxWidth: '100%', margin: '0 auto', padding: '20px' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', fontSize: isMobile ? '1.5rem' : '2rem' }}>
          极简Logo设计
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', mb: 3, backgroundColor: '#ecf0f1', borderRadius: '10px', padding: '20px' }}>
          <Image src="/images/ai-logo-design.svg" alt="AI Logo Design" width={isMobile ? 150 : 200} height={isMobile ? 150 : 200} />
          <Typography variant="h6" sx={{ ml: isMobile ? 0 : 3, mt: isMobile ? 2 : 0, color: '#34495e' }}>
            使用我们的 极简Logo设计工具，只需输入您的 logo 名称，我们就能为您生成独特的 SVG 格式 logo。
          </Typography>
        </Box>
        <Paper sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="输入 Logo 名称"
            variant="outlined"
            value={logoName}
            onChange={(e) => setLogoName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleDesign}
            disabled={loading}
            sx={{
              fontSize: '1.1rem',
              padding: '10px 20px',
              backgroundColor: '#2ecc71',
              '&:hover': {
                backgroundColor: '#27ae60'
              }
            }}
          >
            设计 Logo
          </Button>
        </Paper>
        {loading && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="body2" color="text.secondary" align="center">
              {`${Math.round(progress)}%`}
            </Typography>
          </Box>
        )}
        {svgCode && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>AI设计的Logo</Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              flexDirection: 'column',
              mb: 3 
            }}>
              <Box 
                dangerouslySetInnerHTML={{ __html: svgCode }} 
                sx={{ 
                  maxWidth: '300px', 
                  width: '100%',
                  '& svg': {
                    width: '100%',
                    height: 'auto'
                  }
                }} 
              />
            </Box>
            {designConcept && (
              <Typography variant="body1" sx={{ mt: 2, mb: 3, fontStyle: 'italic', color: '#555' }}>
                {designConcept}
              </Typography>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button 
                variant="contained" 
                onClick={() => handleDownload('svg')} 
                sx={{ 
                  fontSize: '1.1rem', 
                  padding: '10px 20px',
                  backgroundColor: '#2ecc71',
                  '&:hover': {
                    backgroundColor: '#27ae60'
                  }
                }}
              >
                下载 SVG
              </Button>
              <Button 
                variant="contained" 
                onClick={() => handleDownload('png')} 
                sx={{ 
                  fontSize: '1.1rem', 
                  padding: '10px 20px',
                  backgroundColor: '#e74c3c',
                  '&:hover': {
                    backgroundColor: '#c0392b'
                  }
                }}
              >
                下载 PNG
              </Button>
              <Button 
                variant="contained" 
                onClick={() => handleDownload('jpg')}
                sx={{ 
                  fontSize: '1.1rem', 
                  padding: '10px 20px',
                  backgroundColor: '#f39c12',
                  '&:hover': {
                    backgroundColor: '#d35400'
                  }
                }}
              >
                下载 JPG
              </Button>
            </Box>
          </Box>
        )}
        <Feedback loading={loading} success={success} error={error} onClose={handleClose} />
      </Box>
    </ImageToolLayout>
  );
}