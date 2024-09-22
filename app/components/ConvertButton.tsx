'use client';

import { useState } from 'react';
import { Button, LinearProgress, Box, Typography } from '@mui/material';
import dynamic from 'next/dynamic';

const CloudUploadIcon = dynamic(() => import('@mui/icons-material/CloudUpload'), { ssr: false });

interface ConvertButtonProps {
  files: File[];
  selectedFormat: string;
  onConversionComplete: (blob: Blob, fileName: string) => void;
}

export default function ConvertButton({ files, selectedFormat, onConversionComplete }: ConvertButtonProps) {
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleConvert = async () => {
    if (files.length === 0) {
      console.log('Client: No files selected');
      alert('请先上传文件');
      return;
    }

    console.log('Client: Starting conversion');
    console.log('Client: Selected format:', selectedFormat);
    console.log('Client: Number of files:', files.length);

    setIsConverting(true);
    setProgress(0);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
      console.log('Client: Appending file:', file.name, 'Size:', file.size, 'bytes');
    });
    formData.append('format', selectedFormat);

    try {
      console.log('Client: Sending request to server');
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('转换失败');
      }

      const contentType = response.headers.get('Content-Type');
      console.log('Client: Response Content-Type:', contentType);

      const blob = await response.blob();
      console.log('Client: Blob type:', blob.type);
      console.log('Client: Blob size:', blob.size, 'bytes');

      let fileName;
      if (contentType === 'application/zip') {
        fileName = 'converted_images.zip';
      } else if (contentType === 'application/pdf') {
        fileName = files.length === 1 ? `${files[0].name.split('.')[0]}_converted.pdf` : 'converted.pdf';
      } else {
        const fileExtension = contentType?.split('/')[1] || selectedFormat.toLowerCase();
        fileName = `${files[0].name.split('.')[0]}_converted.${fileExtension}`;
      }
      console.log('Client: Generated file name:', fileName);

      onConversionComplete(blob, fileName);
      console.log('Client: Conversion complete');
    } catch (error) {
      console.error('Client: 转换错误:', error);
      alert('转换过程中出错，请重试');
    } finally {
      setIsConverting(false);
      setProgress(0);
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        startIcon={<CloudUploadIcon />}
        onClick={handleConvert}
        disabled={isConverting}
        fullWidth
      >
        {isConverting ? '转换中...' : '开始转换'}
      </Button>
      {isConverting && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            {`${Math.round(progress)}%`}
          </Typography>
        </Box>
      )}
    </Box>
  );
}