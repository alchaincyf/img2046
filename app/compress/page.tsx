'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Slider,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
  Modal,
  Card,
  CardContent,
  CardMedia,
  LinearProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import Image from 'next/image';
import Feedback from '../components/Feedback';
import ImageToolLayout from '../components/ImageToolLayout';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';

interface CompressedImage {
  dataUrl: string;
  fileName: string;
  originalSize: number;
  compressedSize: number;
  ratio: string;
  format: string;
}

interface HistoryItem {
  id: string;
  timestamp: number;
  images: CompressedImage[];
  quality: number;
  format: string;
}

export default function CompressPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [compressedImages, setCompressedImages] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState<number>(80);
  const [outputFormat, setOutputFormat] = useState<'auto' | 'jpeg' | 'png' | 'webp'>('auto');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [smartSuggestion, setSmartSuggestion] = useState<string>('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 加载历史记录
  useEffect(() => {
    const savedHistory = localStorage.getItem('compress_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('加载历史记录失败', e);
      }
    }
  }, []);

  // 保存历史记录
  const saveToHistory = (images: CompressedImage[]) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      images,
      quality,
      format: outputFormat
    };
    const newHistory = [newItem, ...history].slice(0, 20); // 只保留最近20条
    setHistory(newHistory);
    localStorage.setItem('compress_history', JSON.stringify(newHistory));
  };

  const onSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 20);
      setFiles(selectedFiles);
      const urls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);

      // 智能建议
      const suggestion = getSmartSuggestion(selectedFiles);
      setSmartSuggestion(suggestion);
    }
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const getSmartSuggestion = (fileList: File[]): string => {
    if (fileList.length === 0) return '';

    const firstFile = fileList[0];
    const avgSize = fileList.reduce((sum, f) => sum + f.size, 0) / fileList.length;

    // PNG 图片
    if (firstFile.type === 'image/png') {
      if (avgSize > 1024 * 1024) {
        return '💡 建议：PNG 大文件建议质量 75-85，或转换为 WebP 格式以获得更好压缩';
      }
      return '💡 建议：PNG 图片建议质量 80-90 以保持清晰度';
    }

    // JPEG 照片
    if (firstFile.type === 'image/jpeg') {
      if (avgSize > 2 * 1024 * 1024) {
        return '💡 建议：大尺寸照片建议质量 60-75，可显著减小文件大小';
      }
      return '💡 建议：照片建议质量 70-85 以平衡大小和质量';
    }

    // WebP
    if (firstFile.type === 'image/webp') {
      return '💡 建议：WebP 已经是高效格式，质量 75-85 即可';
    }

    return '💡 建议：根据用途选择格式 - Web用WebP，需兼容性用JPEG，需透明用PNG';
  };

  const handleCompress = async () => {
    setLoading(true);
    setError(null);
    try {
      const compressed = await Promise.all(
        files.map(file => compressImage(file, quality, outputFormat))
      );
      setCompressedImages(compressed);
      saveToHistory(compressed);
      setSuccess(true);
    } catch (err) {
      console.error('压缩错误:', err);
      setError("压缩过程中出现错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  const checkImageAlpha = (img: HTMLImageElement): boolean => {
    const canvas = document.createElement('canvas');
    canvas.width = Math.min(img.width, 100);
    canvas.height = Math.min(img.height, 100);
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // 检查是否有透明像素
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] < 255) {
        return true;
      }
    }
    return false;
  };

  const compressImage = (
    file: File,
    quality: number,
    format: 'auto' | 'jpeg' | 'png' | 'webp'
  ): Promise<CompressedImage> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('无法创建canvas上下文'));
              return;
            }

            canvas.width = img.width;
            canvas.height = img.height;

            // 检测透明度
            const hasAlpha = checkImageAlpha(img);

            // 智能选择格式
            let finalFormat = format;
            if (format === 'auto') {
              if (hasAlpha) {
                finalFormat = 'png';
              } else {
                // WebP 通常比 JPEG 压缩率更好
                finalFormat = 'webp';
              }
            }

            // 如果不是PNG，添加白色背景
            if (finalFormat !== 'png') {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0);

            const mimeType = `image/${finalFormat}`;
            const dataUrl = canvas.toDataURL(mimeType, quality / 100);
            const extension = finalFormat === 'jpeg' ? 'jpg' : finalFormat;
            const fileName = `${file.name.split('.')[0]}_compressed.${extension}`;

            // 计算文件大小
            const originalSize = file.size;
            const compressedSize = Math.round((dataUrl.length - 22) * 3 / 4);
            const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);

            resolve({
              dataUrl,
              fileName,
              originalSize,
              compressedSize,
              ratio,
              format: finalFormat
            });
          } catch (error) {
            reject(error);
          }
        };
        img.onerror = () => reject(new Error('图片加载失败'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getTotalStats = () => {
    if (compressedImages.length === 0) return null;

    const totalOriginal = compressedImages.reduce((sum, img) => sum + img.originalSize, 0);
    const totalCompressed = compressedImages.reduce((sum, img) => sum + img.compressedSize, 0);
    const totalRatio = ((1 - totalCompressed / totalOriginal) * 100).toFixed(1);

    return {
      original: formatFileSize(totalOriginal),
      compressed: formatFileSize(totalCompressed),
      saved: formatFileSize(totalOriginal - totalCompressed),
      ratio: totalRatio
    };
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

  const loadFromHistory = (item: HistoryItem) => {
    setCompressedImages(item.images);
    setQuality(item.quality);
    setOutputFormat(item.format as 'auto' | 'jpeg' | 'png' | 'webp');
    setShowHistory(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('compress_history');
  };

  const totalStats = getTotalStats();

  return (
    <ImageToolLayout
      title="批量图片压缩工具"
      description="使用我们的在线批量图片压缩工具，一次性压缩多达20张图片，支持PNG、JPEG、WebP格式。"
    >
      <Box sx={{ '& > *': { mb: 3 }, maxWidth: '100%', margin: '0 auto', padding: '20px' }}>
        {/* 标题区 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {history.length > 0 && (
            <Tooltip title="查看历史记录">
              <IconButton onClick={() => setShowHistory(true)} color="primary">
                <HistoryIcon />
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  {history.length}
                </Typography>
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* 介绍区 */}
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', mb: 3, backgroundColor: '#ecf0f1', borderRadius: '10px', padding: '20px' }}>
          <Image src="/images/compress.svg" alt="Compress" width={isMobile ? 150 : 200} height={isMobile ? 150 : 200} />
          <Typography variant="h6" sx={{ ml: isMobile ? 0 : 3, mt: isMobile ? 2 : 0, color: '#34495e' }}>
            智能图片压缩工具，支持PNG、JPEG、WebP格式，自动检测透明背景，所有处理在本地浏览器完成，保护您的隐私。
          </Typography>
        </Box>

        {/* 智能建议 */}
        {smartSuggestion && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {smartSuggestion}
          </Alert>
        )}

        {/* 上传按钮 */}
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

        {/* 设置区 */}
        {files.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>压缩质量: {quality}%</Typography>
                <Slider
                  value={quality}
                  onChange={(_, newValue) => setQuality(newValue as number)}
                  aria-labelledby="quality-slider"
                  valueLabelDisplay="auto"
                  min={10}
                  max={100}
                  marks={[
                    { value: 50, label: '高压缩' },
                    { value: 80, label: '平衡' },
                    { value: 95, label: '高质量' }
                  ]}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>输出格式</InputLabel>
                  <Select
                    value={outputFormat}
                    label="输出格式"
                    onChange={(e: SelectChangeEvent) => setOutputFormat(e.target.value as 'auto' | 'jpeg' | 'png' | 'webp')}
                  >
                    <MenuItem value="auto">自动选择（推荐）</MenuItem>
                    <MenuItem value="webp">WebP（最佳压缩）</MenuItem>
                    <MenuItem value="jpeg">JPEG（兼容性好）</MenuItem>
                    <MenuItem value="png">PNG（保留透明）</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* 预览区 */}
        {files.length > 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={compressedImages.length > 0 ? 6 : 12}>
              <Typography variant="h6" gutterBottom>
                原图预览 ({files.length} 张)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {previewUrls.map((url, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <img
                      src={url}
                      style={{ width: '120px', height: '120px', objectFit: 'cover', cursor: 'pointer', borderRadius: '8px' }}
                      alt={`Original ${index + 1}`}
                      onClick={() => handleImageClick(url)}
                    />
                    <Typography variant="caption" display="block" sx={{ mt: 0.5, textAlign: 'center' }}>
                      {formatFileSize(files[index].size)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>

            {compressedImages.length > 0 && (
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  压缩后 ({compressedImages.length} 张)
                </Typography>
                <Grid container spacing={2}>
                  {compressedImages.map((img, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card sx={{ cursor: 'pointer' }} onClick={() => handleImageClick(img.dataUrl)}>
                        <CardMedia
                          component="img"
                          height="120"
                          image={img.dataUrl}
                          alt={`Compressed ${index + 1}`}
                          sx={{ objectFit: 'cover' }}
                        />
                        <CardContent sx={{ p: 1.5 }}>
                          <Typography variant="caption" display="block">
                            原始: {formatFileSize(img.originalSize)}
                          </Typography>
                          <Typography variant="caption" display="block">
                            压缩: {formatFileSize(img.compressedSize)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
                              节省 {img.ratio}%
                            </Typography>
                            <Chip label={img.format.toUpperCase()} size="small" sx={{ ml: 1, height: '16px' }} />
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={parseFloat(img.ratio)}
                            color="success"
                            sx={{ mt: 1, height: 6, borderRadius: 3 }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
          </Grid>
        )}

        {/* 总计统计 */}
        {totalStats && (
          <Alert severity="success" sx={{ mt: 3 }}>
            <Typography variant="body1">
              <strong>压缩完成！</strong> 原始总大小: {totalStats.original} → 压缩后: {totalStats.compressed}
            </Typography>
            <Typography variant="body2">
              节省空间: {totalStats.saved} ({totalStats.ratio}% 压缩率)
            </Typography>
          </Alert>
        )}

        {/* 操作按钮 */}
        {files.length > 0 && (
          <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip
              label={files.length > 1 ? `已选 ${files.length} 张` : '已选 1 张'}
              variant="outlined"
            />
            <Button
              variant="contained"
              onClick={handleCompress}
              disabled={files.length === 0 || loading}
              sx={{
                fontSize: '1.1rem',
                padding: '10px 20px',
                backgroundColor: '#2ecc71',
                '&:hover': {
                  backgroundColor: '#27ae60'
                }
              }}
            >
              {loading ? '压缩中...' : files.length > 1 ? `批量压缩 (${files.length} 张)` : '立即压缩'}
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
                {compressedImages.length === 1 ? '下载压缩图片' : '下载压缩包 (ZIP)'}
              </Button>
            )}
          </Box>
        )}

        {/* 历史记录弹窗 */}
        <Modal
          open={showHistory}
          onClose={() => setShowHistory(false)}
          aria-labelledby="history-modal"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '90%' : '600px',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxHeight: '80vh',
            overflow: 'auto',
            borderRadius: 2
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">压缩历史记录</Typography>
              <Button
                startIcon={<DeleteIcon />}
                onClick={clearHistory}
                color="error"
                size="small"
              >
                清空
              </Button>
            </Box>
            {history.map((item) => (
              <Card
                key={item.id}
                sx={{ mb: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                onClick={() => loadFromHistory(item)}
              >
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(item.timestamp).toLocaleString('zh-CN')}
                  </Typography>
                  <Typography variant="body1">
                    {item.images.length} 张图片 | 质量: {item.quality}% | 格式: {item.format}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    {item.images.slice(0, 3).map((img, idx) => (
                      <img
                        key={idx}
                        src={img.dataUrl}
                        alt={`thumb-${idx}`}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ))}
                    {item.images.length > 3 && (
                      <Box sx={{
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'action.selected',
                        borderRadius: '4px'
                      }}>
                        <Typography>+{item.images.length - 3}</Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
            {history.length === 0 && (
              <Typography color="text.secondary" align="center">
                暂无历史记录
              </Typography>
            )}
          </Box>
        </Modal>

        {/* 图片预览弹窗 */}
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

        <Feedback loading={loading} success={success} error={error} onClose={handleClose} />
      </Box>

    </ImageToolLayout>
  );
}
