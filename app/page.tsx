'use client';

import { useState, useCallback } from 'react';
import { Box, Button, Grid, Typography, Paper } from '@mui/material';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import Feedback from './components/Feedback';

const supportedFormats = ['jpg', 'png', 'webp', 'gif', 'pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError('文件大小不能超过10MB');
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': supportedFormats.filter(format => format !== 'pdf').map(format => `.${format}`),
      'application/pdf': ['.pdf']
    },
    maxSize: MAX_FILE_SIZE
  });

  const handleConvert = async () => {
    if (!file || !selectedFormat) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', selectedFormat);

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `converted.${selectedFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccess(true);
    } catch (err) {
      setError('转换失败，请重试。');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
  };

  return (
    <Box component="main" sx={{ '& > *': { mb: 3 }, maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h1" gutterBottom sx={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2c3e50' }}>
        图片格式转换
      </Typography>
      <section>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, backgroundColor: '#ecf0f1', borderRadius: '10px', padding: '20px' }}>
          <Image 
            src="/images/format-convert.svg" 
            alt="格式转换图标" 
            width={200} 
            height={200} 
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,..."  // 添加一个模糊的占位符
            priority  // 如果这是首屏图片，可以添加 priority 属性
          />
          <Typography variant="h2" sx={{ ml: 3, color: '#34495e', fontSize: '1.5rem' }}>
            欢迎使用我们的图片格式转换工具。上传您的图片或PDF，选择要转换的格式，然后点击转换按钮即可开始。支持JPG、PNG、WEBP、GIF和PDF格式之间的相互转换。文件大小限制为10MB。
          </Typography>
        </Box>
      </section>
      <section>
        <Paper
          {...getRootProps()}
          sx={{
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? '#e8f4fd' : '#f7f9fa',
            border: '2px dashed #3498db',
            '&:hover': {
              backgroundColor: '#e8f4fd',
            },
          }}
        >
          <input {...getInputProps()} />
          <Typography variant="h3" gutterBottom sx={{ fontSize: '1.5rem' }}>
            {isDragActive ? '释放文件以上传' : '拖放文件到这里, 或者点击选择文件'}
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }}>
            选择文件
          </Button>
        </Paper>
      </section>
      {previewUrl && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>预览</Typography>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        </Box>
      )}
      {file && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>选择转换格式</Typography>
          <Grid container spacing={2}>
            {supportedFormats.map((format) => (
              <Grid item xs={6} sm={4} md={2} key={format}>
                <Button
                  variant={selectedFormat === format ? "contained" : "outlined"}
                  onClick={() => setSelectedFormat(format)}
                  fullWidth
                  sx={{
                    height: '48px',
                    fontSize: '1rem',
                    backgroundColor: selectedFormat === format ? '#3498db' : 'transparent',
                    color: selectedFormat === format ? 'white' : '#3498db',
                    '&:hover': {
                      backgroundColor: selectedFormat === format ? '#2980b9' : '#e8f4fd',
                    }
                  }}
                >
                  {format.toUpperCase()}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {file && selectedFormat && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={handleConvert}
            sx={{
              fontSize: '1.1rem',
              padding: '10px 20px',
              backgroundColor: '#2ecc71',
              '&:hover': {
                backgroundColor: '#27ae60'
              }
            }}
          >
            转换并下载
          </Button>
        </Box>
      )}
      <Feedback loading={loading} success={success} error={error} onClose={handleClose} />
    </Box>
  );
}
