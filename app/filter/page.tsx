'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import FileUpload from '../components/FileUpload';
import SharedLayout from '../components/SharedLayout';

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
    }
  };

  return (
    <SharedLayout title="图片滤镜">
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
    </SharedLayout>
  );
}