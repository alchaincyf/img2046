'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import FileUpload from '../components/FileUpload';
import Image from 'next/image';
import Feedback from '../components/Feedback';

const filters = [
  { name: '原图', filter: '' },
  { name: '灰度', filter: 'grayscale(100%)' },
  { name: '复古', filter: 'sepia(100%)' },
  { name: '反转', filter: 'invert(100%)' },
  { name: '模糊', filter: 'blur(5px)' },
  { name: '高亮', filter: 'brightness(150%)' },
  { name: '对比度', filter: 'contrast(200%)' },
];

export default function FilterPage() {
  const [src, setSrc] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [filteredBlob, setFilteredBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSelectFile = (files: File[]) => {
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setSrc(reader.result as string));
      reader.readAsDataURL(files[0]);
    }
  };

  useEffect(() => {
    if (src && canvas) {
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        applyFilter();
      };
      img.src = src;
    }
  }, [src, canvas]);

  const applyFilter = () => {
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.filter = filter;
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              setFilteredBlob(blob);
            }
          }, 'image/png');
        };
        img.src = src as string;
      }
    }
  };

  useEffect(() => {
    applyFilter();
  }, [filter]);

  const handleDownload = () => {
    if (filteredBlob) {
      const url = URL.createObjectURL(filteredBlob);
      const link = document.createElement('a');
      link.download = 'filtered_image.png';
      link.href = url;
      link.click();
      setSuccess(true);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
  };

  return (
    <Box sx={{ '& > *': { mb: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Image src="/images/filter.svg" alt="Image Filter" width={200} height={200} />
        <Typography variant="body1" sx={{ ml: 3 }}>
          为您的图片添加独特的风格。选择各种滤镜效果，如灰度、复古或高对比度，轻松提升您的图片视觉效果。
        </Typography>
      </Box>
      <FileUpload onFilesSelected={onSelectFile} />
      {src && (
        <Box sx={{ mt: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>选择滤镜</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="选择滤镜"
            >
              {filters.map((f) => (
                <MenuItem key={f.name} value={f.filter}>{f.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <canvas ref={setCanvas} style={{ maxWidth: '100%', height: 'auto' }} />
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={applyFilter} sx={{ mr: 2 }}>
              应用滤镜
            </Button>
            {filteredBlob && (
              <Button variant="contained" onClick={handleDownload}>
                下载
              </Button>
            )}
          </Box>
        </Box>
      )}
      <Feedback loading={loading} success={success} error={error} onClose={handleClose} />
    </Box>
  );
}