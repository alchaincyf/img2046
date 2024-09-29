'use client';

import { useState, useCallback, useEffect } from 'react';
import { Box, Button, Grid, Typography, Paper, useTheme, useMediaQuery, Modal } from '@mui/material';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import Feedback from '../components/Feedback';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const supportedFormats = ['jpg', 'png', 'webp', 'gif', 'pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 20;

interface ConvertedImage {
  dataUrl: string;
  fileName: string;
}

export default function FormatConvert() {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => file.size <= MAX_FILE_SIZE).slice(0, MAX_FILES);
    if (validFiles.length < acceptedFiles.length) {
      setError(`部分文件超过10MB或文件数量超过${MAX_FILES}个，已自动过滤。`);
    }
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': supportedFormats.filter(format => format !== 'pdf').map(format => `.${format}`),
      'application/pdf': ['.pdf']
    },
    maxSize: MAX_FILE_SIZE
  });

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleConvert = async () => {
    if (files.length === 0 || !selectedFormat) return;
    setLoading(true);
    try {
      const converted = await Promise.all(
        files.map(file => convertImage(file, selectedFormat))
      );
      setConvertedImages(converted);
      setSuccess(true);
    } catch (err) {
      setError('转换失败，请重试。');
    } finally {
      setLoading(false);
    }
  };

  const convertImage = async (file: File, format: string): Promise<ConvertedImage> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);

    const response = await fetch('/api/convert', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Conversion failed');
    }

    const blob = await response.blob();
    const dataUrl = URL.createObjectURL(blob);
    const fileName = `${file.name.split('.')[0]}_converted.${format}`;
    return { dataUrl, fileName };
  };

  const handleDownload = async () => {
    if (convertedImages.length === 1) {
      const link = document.createElement('a');
      link.href = convertedImages[0].dataUrl;
      link.download = convertedImages[0].fileName;
      link.click();
    } else {
      const zip = new JSZip();
      convertedImages.forEach(({ dataUrl, fileName }) => {
        zip.file(fileName, fetch(dataUrl).then(res => res.blob()));
      });
      const content = await zip.generateAsync({type: 'blob'});
      saveAs(content, 'converted_images.zip');
    }
    setSuccess(true);
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <Box component="main" sx={{ '& > *': { mb: 3 }, maxWidth: '100%', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h1" gutterBottom sx={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 'bold', color: '#2c3e50' }}>
        图片格式转换
      </Typography>
      <section>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', mb: 3, backgroundColor: '#ecf0f1', borderRadius: '10px', padding: '20px' }}>
          <Image 
            src="/images/format-convert.svg" 
            alt="格式转换图标" 
            width={isMobile ? 150 : 200} 
            height={isMobile ? 150 : 200} 
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,..."
            priority
          />
          <Typography variant="h2" sx={{ ml: isMobile ? 0 : 3, mt: isMobile ? 2 : 0, color: '#34495e', fontSize: '1.5rem' }}>
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
            {isDragActive ? '释放文件以上传' : `拖放文件到这里, 或者点击选择文件（最多${MAX_FILES}个）`}
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }}>
            选择文件
          </Button>
        </Paper>
      </section>
      {files.length > 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>原图预览</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {previewUrls.map((url, index) => (
                <img 
                  key={index} 
                  src={url} 
                  style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer' }} 
                  alt={`Original ${index + 1}`} 
                  onClick={() => handleImageClick(url)}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>转换后预览</Typography>
            {convertedImages.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {convertedImages.map((img, index) => (
                  <img 
                    key={index} 
                    src={img.dataUrl} 
                    style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer' }} 
                    alt={`Converted ${index + 1}`} 
                    onClick={() => handleImageClick(img.dataUrl)}
                  />
                ))}
              </Box>
            ) : (
              <Typography>转换后的图片将显示在这里</Typography>
            )}
          </Grid>
        </Grid>
      )}
      {files.length > 0 && (
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
      {files.length > 0 && selectedFormat && (
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
            批量转换
          </Button>
          {convertedImages.length > 0 && (
            <Button
              variant="contained"
              onClick={handleDownload}
              sx={{
                ml: 2,
                fontSize: '1.1rem',
                padding: '10px 20px',
                backgroundColor: '#3498db',
                '&:hover': {
                  backgroundColor: '#2980b9'
                }
              }}
            >
              {convertedImages.length === 1 ? '下载转换图片' : '下载转换包'}
            </Button>
          )}
        </Box>
      )}
      <Feedback loading={loading} success={success} error={error} onClose={handleClose} />
      <Modal
        open={!!selectedImage}
        onClose={handleCloseModal}
        aria-labelledby="image-modal"
        aria-describedby="full-size-image"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          maxWidth: '90%',
          maxHeight: '90%',
          overflow: 'auto',
        }}>
          {selectedImage && (
            <img 
              src={selectedImage} 
              style={{ width: '100%', height: 'auto' }} 
              alt="Full size preview" 
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
}