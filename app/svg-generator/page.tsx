'use client';

import { useState, useRef } from 'react';
import { Box, Button, TextField, Typography, Grid, useTheme, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import Feedback from '../components/Feedback';

export default function SVGGeneratorPage() {
  const [svgCode, setSvgCode] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const handleDownload = async (format: 'svg' | 'png' | 'jpg') => {
    setLoading(true);
    try {
      if (format === 'svg') {
        const blob = new Blob([svgCode], { type: 'image/svg+xml' });
        downloadBlob(blob, `image.${format}`);
      } else {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) downloadBlob(blob, `image.${format}`);
          }, `image/${format}`);
        };
        img.src = previewUrl;
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

  return (
    <Box sx={{ '& > *': { mb: 3 }, maxWidth: '100%', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', fontSize: isMobile ? '1.5rem' : '2rem' }}>
        SVG 编辑器
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', mb: 3, backgroundColor: '#ecf0f1', borderRadius: '10px', padding: '20px' }}>
        <Image src="/images/svg-generator.svg" alt="SVG Generator" width={isMobile ? 150 : 200} height={isMobile ? 150 : 200} />
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
      )}
      <Feedback loading={loading} success={success} error={error} onClose={handleClose} />
    </Box>
  );
}