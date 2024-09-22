'use client';

import { Box, Typography, Button, Paper } from '@mui/material';
import dynamic from 'next/dynamic';

const GetAppIcon = dynamic(() => import('@mui/icons-material/GetApp'), { ssr: false });

interface DownloadAreaProps {
  convertedFile: Blob | null;
  fileName: string;
}

export default function DownloadArea({ convertedFile, fileName }: DownloadAreaProps) {
  if (!convertedFile) {
    return (
      <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>下载区域</Typography>
        <Typography>转换完成后，文件将显示在这里供下载。</Typography>
      </Paper>
    );
  }

  const url = URL.createObjectURL(convertedFile);
  console.log('Download blob type:', convertedFile.type);
  console.log('Download file name:', fileName);

  return (
    <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>下载区域</Typography>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<GetAppIcon />}
        href={url}
        download={fileName}
        sx={{ mb: 2 }}
      >
        下载转换后的文件
      </Button>
      <Typography variant="body2" sx={{ mt: 1 }}>文件类型: {convertedFile.type}</Typography>
      <Typography variant="body2">文件名: {fileName}</Typography>
    </Paper>
  );
}