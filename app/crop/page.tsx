'use client';

import { useState, useCallback } from 'react';
import { Box, Button, Typography, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import FileUpload from '../components/FileUpload';
import Image from 'next/image';
import Feedback from '../components/Feedback';

const aspectRatios = [
  { label: '自由', value: undefined },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '16:9', value: 16 / 9 },
];

function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(blob);
    }, 'image/jpeg');
  });
}

export default function CropPage() {
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);
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

  const onImageLoad = useCallback((img: HTMLImageElement) => {
    setImage(img);
  }, []);

  const handleCrop = async () => {
    if (image && crop) {
      try {
        const croppedImageBlob = await getCroppedImg(image, crop as PixelCrop);
        const croppedImageUrl = URL.createObjectURL(croppedImageBlob);
        setCroppedImageUrl(croppedImageUrl);
      } catch (e) {
        console.error('Error cropping image:', e);
      }
    }
  };

  const handleDownload = () => {
    if (croppedImageUrl) {
      const link = document.createElement('a');
      link.download = 'cropped_image.jpg';
      link.href = croppedImageUrl;
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
        <Image src="/images/crop.svg" alt="Image Crop" width={200} height={200} />
        <Typography variant="body1" sx={{ ml: 3 }}>
          使用我们的图片裁剪工具，您可以轻松地调整图片大小和比例。上传图片，选择裁剪区域，然后保存您的完美构图。
        </Typography>
      </Box>
      <FileUpload onFilesSelected={onSelectFile} />
      {src && (
        <Box sx={{ mt: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>选择裁剪比例</InputLabel>
            <Select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as number | undefined)}
              label="选择裁剪比例"
            >
              {aspectRatios.map((ratio) => (
                <MenuItem key={ratio.label} value={ratio.value}>{ratio.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>原图</Typography>
              <ReactCrop
                crop={crop}
                onChange={c => setCrop(c)}
                aspect={aspectRatio}
                onComplete={(c) => setCrop(c)}
              >
                <img src={src} onLoad={e => onImageLoad(e.currentTarget)} style={{ maxWidth: '100%' }} />
              </ReactCrop>
              <Typography variant="body2" sx={{ mt: 2 }}>
                操作指南：
                <ol>
                  <li>选择裁剪比例（可选）</li>
                  <li>在图片上拖动鼠标来选择裁剪区域</li>
                  <li>调整选择框大小来精确裁剪</li>
                  <li>点击"裁剪"按钮查看效果</li>
                </ol>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>裁剪预览</Typography>
              {croppedImageUrl ? (
                <img src={croppedImageUrl} alt="Cropped" style={{ maxWidth: '100%' }} />
              ) : (
                <Typography>裁剪后的图片将显示在这里</Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      )}
      {src && (
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleCrop} sx={{ mr: 2 }}>
            裁剪
          </Button>
          {croppedImageUrl && (
            <Button variant="contained" onClick={handleDownload}>
              下载
            </Button>
          )}
        </Box>
      )}
      <Feedback loading={loading} success={success} error={error} onClose={handleClose} />
    </Box>
  );
}