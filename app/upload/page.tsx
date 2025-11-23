'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  ImageList,
  ImageListItem,
  Paper,
  Alert,
  Snackbar,
} from '@mui/material';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db, storage } from '../firebase/config';
import dynamic from 'next/dynamic';

const CloudUploadIcon = dynamic(() => import('@mui/icons-material/CloudUpload'), { ssr: false });

interface ImageItem {
  id: string;
  url: string;
  name: string;
  uploadedAt: Date;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
};

export default function UploadPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // 加载已上传的图片
  const loadImages = async () => {
    try {
      const imagesRef = collection(db, 'shared-images');
      const q = query(imagesRef, orderBy('uploadedAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const loadedImages: ImageItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loadedImages.push({
          id: doc.id,
          url: data.url,
          name: data.name,
          uploadedAt: data.uploadedAt?.toDate() || new Date(),
        });
      });

      setImages(loadedImages);
    } catch (error) {
      console.error('Error loading images:', error);
      setSnackbar({
        open: true,
        message: '加载图片失败',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  // 上传图片
  const uploadImage = async (file: File) => {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `shared-images/${fileName}`);

    // 上传到 Firebase Storage
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // 保存元数据到 Firestore
    await addDoc(collection(db, 'shared-images'), {
      url: downloadURL,
      name: file.name,
      uploadedAt: Timestamp.now(),
    });

    return {
      url: downloadURL,
      name: file.name,
    };
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        setSnackbar({
          open: true,
          message: `文件 ${file.name} 超过 10MB 限制`,
          severity: 'error',
        });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);

    try {
      for (const file of validFiles) {
        const result = await uploadImage(file);
        setImages((prev) => [
          {
            id: Date.now().toString(),
            url: result.url,
            name: result.name,
            uploadedAt: new Date(),
          },
          ...prev,
        ]);
      }

      setSnackbar({
        open: true,
        message: `成功上传 ${validFiles.length} 张图片`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Upload error:', error);
      setSnackbar({
        open: true,
        message: '上传失败，请重试',
        severity: 'error',
      });
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    disabled: uploading,
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        图片分享
      </Typography>

      {/* 上传区域 */}
      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          mb: 4,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.400',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          cursor: uploading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover',
          },
        }}
      >
        <input {...getInputProps()} />
        <Box sx={{ textAlign: 'center' }}>
          {uploading ? (
            <>
              <CircularProgress size={48} sx={{ mb: 2 }} />
              <Typography variant="h6">上传中...</Typography>
            </>
          ) : (
            <>
              <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6">
                {isDragActive ? '放开以上传图片' : '拖放图片到这里，或点击选择'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                支持 JPG、PNG、GIF、WebP 格式，最大 10MB
              </Typography>
            </>
          )}
        </Box>
      </Paper>

      {/* 图片列表 */}
      <Typography variant="h5" gutterBottom>
        已上传的图片
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : images.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">还没有图片，上传第一张吧</Typography>
        </Paper>
      ) : (
        <ImageList variant="masonry" cols={3} gap={16}>
          {images.map((image) => (
            <ImageListItem key={image.id}>
              <img
                src={image.url}
                alt={image.name}
                loading="lazy"
                style={{
                  borderRadius: 8,
                  display: 'block',
                  width: '100%',
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}

      {/* 提示消息 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
