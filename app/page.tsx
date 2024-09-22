'use client';

import { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import FileUpload from './components/FileUpload';
import FormatSelector from './components/FormatSelector';
import ConvertButton from './components/ConvertButton';
import DownloadArea from './components/DownloadArea';
import Image from 'next/image';
import Feedback from './components/Feedback';

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFormat, setSelectedFormat] = useState('JPG');
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setConvertedFile(null);
    if (selectedFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(selectedFiles[0]);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleFormatSelected = (format: string) => {
    setSelectedFormat(format);
    setConvertedFile(null);
  };

  const handleConversionComplete = (blob: Blob, name: string) => {
    setConvertedFile(blob);
    setFileName(name);
    setSuccess(true);
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
  };

  return (
    <Box sx={{ '& > *': { mb: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Image src="/images/format-convert.svg" alt="Format Conversion" width={200} height={200} />
        <Typography variant="body1" sx={{ ml: 3 }}>
          欢迎使用我们的图片格式转换工具。上传您的图片，选择目标格式，然后点击转换按钮即可开始。
        </Typography>
      </Box>
      <FileUpload onFilesSelected={handleFilesSelected} />
      <FormatSelector onFormatSelected={handleFormatSelected} />
      <ConvertButton
        files={files}
        selectedFormat={selectedFormat}
        onConversionComplete={handleConversionComplete}
        setLoading={setLoading}
        setError={setError}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>原图</Typography>
          {previewUrl ? (
            <img src={previewUrl} alt="Original" style={{ maxWidth: '100%', height: 'auto' }} />
          ) : (
            <Typography>请上传图片</Typography>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>转换预览</Typography>
          {convertedFile ? (
            <img 
              src={URL.createObjectURL(convertedFile)} 
              alt="Converted" 
              style={{ maxWidth: '100%', height: 'auto' }} 
            />
          ) : (
            <Typography>转换后的图片将显示在这里</Typography>
          )}
        </Grid>
      </Grid>
      <DownloadArea convertedFile={convertedFile} fileName={fileName} />
      <Feedback loading={loading} success={success} error={error} onClose={handleClose} />
    </Box>
  );
}
