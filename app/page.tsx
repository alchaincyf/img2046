'use client';

import { useState } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import FileUpload from './components/FileUpload';
import FormatSelector from './components/FormatSelector';
import ConvertButton from './components/ConvertButton';
import DownloadArea from './components/DownloadArea';

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFormat, setSelectedFormat] = useState('JPG');
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState('');

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setConvertedFile(null);
  };

  const handleFormatSelected = (format: string) => {
    setSelectedFormat(format);
    setConvertedFile(null);
  };

  const handleConversionComplete = (blob: Blob, name: string) => {
    setConvertedFile(blob);
    setFileName(name);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          图片格式转换器
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ '& > *': { mb: 3 } }}>
            <FileUpload onFilesSelected={handleFilesSelected} />
            <Typography variant="h6" gutterBottom>选择目标格式：</Typography>
            <FormatSelector onFormatSelected={handleFormatSelected} />
            <ConvertButton
              files={files}
              selectedFormat={selectedFormat}
              onConversionComplete={handleConversionComplete}
            />
            <DownloadArea convertedFile={convertedFile} fileName={fileName} />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
