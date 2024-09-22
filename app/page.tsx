'use client';

import { useState, useCallback } from 'react';
import { Box, Button, Grid, Typography, Paper } from '@mui/material';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import Feedback from './components/Feedback';

const supportedFormats = ['JPG', 'PNG', 'WEBP', 'GIF', 'PDF'];

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [convertedFiles, setConvertedFiles] = useState<{ [key: string]: Blob | null }>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setConvertedFiles({});
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    try {
      // 这里应该是实际的转换逻辑
      // 为了演示，我们只是创建相同的 Blob 对象
      const newConvertedFiles: { [key: string]: Blob } = {};
      for (const format of supportedFormats) {
        const blob = new Blob([await file.arrayBuffer()], { type: `image/${format.toLowerCase()}` });
        newConvertedFiles[format] = blob;
      }
      setConvertedFiles(newConvertedFiles);
      setSuccess(true);
    } catch (err) {
      setError('转换失败，请重试。');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (format: string) => {
    const convertedFile = convertedFiles[format];
    if (convertedFile) {
      const url = URL.createObjectURL(convertedFile);
      const link = document.createElement('a');
      link.href = url;
      link.download = `converted_image.${format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
  };

  return (
    <Box sx={{ '& > *': { mb: 3 }, maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
        图片格式转换
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, backgroundColor: '#ecf0f1', borderRadius: '10px', padding: '20px' }}>
        <Image src="/images/format-convert.svg" alt="Format Conversion" width={200} height={200} />
        <Typography variant="h6" sx={{ ml: 3, color: '#34495e' }}>
          欢迎使用我们的图片格式转换工具。上传您的图片，然后点击转换按钮即可开始。支持JPG、PNG、WEBP、GIF和PDF格式之间的相互转换。
        </Typography>
      </Box>
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
        <Typography variant="h6" gutterBottom>
          {isDragActive ? '释放文件以上传' : '拖放文件到这里, 或者点击选择文件'}
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }}>
          选择文件
        </Button>
      </Paper>
      {previewUrl && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>预览</Typography>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        </Box>
      )}
      {file && (
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
            转换
          </Button>
        </Box>
      )}
      {Object.keys(convertedFiles).length > 0 && (
        <Grid container spacing={2} sx={{ mt: 3 }}>
          {supportedFormats.map((format) => (
            <Grid item xs={12} sm={6} md={4} key={format}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>{format}</Typography>
                <Button
                  variant="outlined"
                  onClick={() => handleDownload(format)}
                  sx={{ width: '100%' }}
                >
                  下载 {format}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      <Feedback loading={loading} success={success} error={error} onClose={handleClose} />
    </Box>
  );
}
