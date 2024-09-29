'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Slider, Grid, Typography, useTheme, useMediaQuery, Modal } from '@mui/material';
import Image from 'next/image';
import Feedback from '../components/Feedback';
import ImageToolLayout from '../components/ImageToolLayout';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface CompressedImage {
  dataUrl: string;
  fileName: string;
}

export default function CompressPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [compressedImages, setCompressedImages] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState<number>(80);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const onSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 20);
      setFiles(selectedFiles);
      const urls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleCompress = async () => {
    setLoading(true);
    try {
      const compressed = await Promise.all(
        files.map(file => compressImage(file, quality))
      );
      setCompressedImages(compressed);
      setSuccess(true);
    } catch (err) {
      setError("压缩过程中出现错误");
    } finally {
      setLoading(false);
    }
  };

  const compressImage = (file: File, quality: number): Promise<CompressedImage> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg', quality / 100);
          const fileName = `${file.name.split('.')[0]}_compressed.jpg`;
          resolve({ dataUrl, fileName });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDownload = async () => {
    if (compressedImages.length === 1) {
      // 直接下载单个图片
      const link = document.createElement('a');
      link.href = compressedImages[0].dataUrl;
      link.download = compressedImages[0].fileName;
      link.click();
    } else {
      // 打包多个图片
      const zip = new JSZip();
      compressedImages.forEach(({ dataUrl, fileName }) => {
        const base64Data = dataUrl.split(',')[1];
        zip.file(fileName, base64Data, {base64: true});
      });
      const content = await zip.generateAsync({type: 'blob'});
      saveAs(content, 'compressed_images.zip');
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
    <ImageToolLayout
      title="批量图片压缩工具"
      description="使用我们的在线批量图片压缩工具，一次性压缩多达20张图片，并以zip格式下载。"
    >
      <Box sx={{ '& > *': { mb: 3 }, maxWidth: '100%', margin: '0 auto', padding: '20px' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', fontSize: isMobile ? '1.5rem' : '2rem' }}>
          图片压缩
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', mb: 3, backgroundColor: '#ecf0f1', borderRadius: '10px', padding: '20px' }}>
          <Image src="/images/compress.svg" alt="Compress" width={isMobile ? 150 : 200} height={isMobile ? 150 : 200} />
          <Typography variant="h6" sx={{ ml: isMobile ? 0 : 3, mt: isMobile ? 2 : 0, color: '#34495e' }}>
            使用我们的压缩工具，您可以轻松地减小图片文件大小。上传您的图片，调整压缩质量，然后点击压缩按钮即可。
          </Typography>
        </Box>
        <input
          type="file"
          accept="image/*"
          onChange={onSelectFiles}
          style={{ display: 'none' }}
          id="raised-button-file"
          multiple
        />
        <label htmlFor="raised-button-file">
          <Button 
            variant="contained" 
            component="span"
            sx={{ 
              mb: 3, 
              fontSize: '1.1rem', 
              padding: '10px 20px',
              backgroundColor: '#3498db',
              '&:hover': {
                backgroundColor: '#2980b9'
              }
            }}
          >
            上传图片（最多20张）
          </Button>
        </label>
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
              <Typography variant="h6" gutterBottom>压缩后预览</Typography>
              {compressedImages.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {compressedImages.map((img, index) => (
                    <img 
                      key={index} 
                      src={img.dataUrl} 
                      style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer' }} 
                      alt={`Compressed ${index + 1}`} 
                      onClick={() => handleImageClick(img.dataUrl)}
                    />
                  ))}
                </Box>
              ) : (
                <Typography>压缩后的图片将显示在这里</Typography>
              )}
            </Grid>
          </Grid>
        )}
        {files.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>压缩质量: {quality}%</Typography>
            <Slider
              value={quality}
              onChange={(_, newValue) => setQuality(newValue as number)}
              aria-labelledby="continuous-slider"
              valueLabelDisplay="auto"
              min={0}
              max={100}
            />
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                onClick={handleCompress} 
                disabled={files.length === 0}
                sx={{ 
                  mr: 2,
                  fontSize: '1.1rem', 
                  padding: '10px 20px',
                  backgroundColor: '#2ecc71',
                  '&:hover': {
                    backgroundColor: '#27ae60'
                  }
                }}
              >
                批量缩
              </Button>
              {compressedImages.length > 0 && (
                <Button 
                  variant="contained" 
                  onClick={handleDownload}
                  sx={{ 
                    fontSize: '1.1rem', 
                    padding: '10px 20px',
                    backgroundColor: '#3498db',
                    '&:hover': {
                      backgroundColor: '#2980b9'
                    }
                  }}
                >
                  {compressedImages.length === 1 ? '下载压缩图片' : '下载压缩包'}
                </Button>
              )}
            </Box>
          </Box>
        )}
        <Feedback loading={loading} success={success} error={error} onClose={handleClose} />
      </Box>
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
    </ImageToolLayout>
  );
}