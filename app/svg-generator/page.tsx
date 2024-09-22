'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Button, TextField, Typography, Grid, Paper } from '@mui/material';
import Image from 'next/image';
import Feedback from '../components/Feedback';

export default function SVGGeneratorPage() {
  const [svgCode, setSvgCode] = useState<string>(`
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="90" fill="#FFEB3B" />
  <circle cx="70" cy="80" r="15" fill="#000">
    <animate attributeName="r" values="15;10;15" dur="1s" repeatCount="indefinite" />
  </circle>
  <circle cx="130" cy="80" r="15" fill="#000">
    <animate attributeName="r" values="15;10;15" dur="1s" repeatCount="indefinite" />
  </circle>
  <path d="M60 130 Q100 160 140 130" stroke="#000" stroke-width="8" fill="none">
    <animate attributeName="d" values="M60 130 Q100 160 140 130;M60 140 Q100 170 140 140;M60 130 Q100 160 140 130" dur="2s" repeatCount="indefinite" />
  </path>
</svg>
  `.trim());

  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    updatePreview();
  }, [svgCode]);

  const updatePreview = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
  };

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
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
  };

  return (
    <Box sx={{ '& > *': { mb: 2 } }}>
      <Typography variant="h5" gutterBottom>
        SVG 生成器
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Image src="/images/svg-generator.svg" alt="SVG Generator" width={150} height={150} />
        <Typography variant="body2" sx={{ ml: 2 }}>
          使用我们的 SVG 生成器，您可以输入 SVG 代码，实时预览图像，并下载为不同的图片格式。您也可以上传 SVG 文件进行编辑。
        </Typography>
      </Box>
      <Button variant="contained" onClick={handleUpload} sx={{ mb: 2 }}>
        上传 SVG 文件
      </Button>
      <input
        type="file"
        accept=".svg"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="SVG 代码"
            multiline
            rows={10}
            fullWidth
            variant="outlined"
            value={svgCode}
            onChange={handleSvgCodeChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>预览</Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img src={previewUrl} alt="SVG Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() => handleDownload('svg')} sx={{ mr: 1 }}>
          下载 SVG
        </Button>
        <Button variant="contained" onClick={() => handleDownload('png')} sx={{ mr: 1 }}>
          下载 PNG
        </Button>
        <Button variant="contained" onClick={() => handleDownload('jpg')}>
          下载 JPG
        </Button>
      </Box>
      <Feedback loading={loading} success={success} error={error} onClose={handleClose} />
    </Box>
  );
}