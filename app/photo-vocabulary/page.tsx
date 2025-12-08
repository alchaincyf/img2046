'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  useTheme,
  useMediaQuery,
  Fade,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SchoolIcon from '@mui/icons-material/School';
import TranslateIcon from '@mui/icons-material/Translate';
import Image from 'next/image';

interface Word {
  word: string;
  translation: string;
  pronunciation?: string;
  example?: string;
}

interface AnalysisResult {
  description: string;
  words: Word[];
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function PhotoVocabularyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('文件大小不能超过10MB');
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setError('');
    setResult(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/analyze-photo', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '分析失败');
      }

      if (!data.success) {
        throw new Error(data.error || '分析失败');
      }

      setResult({
        description: data.description,
        words: data.words
      });
    } catch (err) {
      console.error('分析错误:', err);
      setError((err as Error).message || '分析过程中发生错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl('');
    setResult(null);
    setError('');
  };

  return (
    <Box component="main" sx={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '20px' : '40px' }}>
      {/* 页面标题 */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: isMobile ? '2rem' : '2.5rem',
            fontWeight: 'bold',
            color: '#2c3e50',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          <SchoolIcon sx={{ fontSize: isMobile ? '2rem' : '2.5rem' }} />
          拍照学单词
        </Typography>
        <Typography variant="h6" sx={{ color: '#7f8c8d', mb: 1 }}>
          上传照片，AI帮你生成相关英语单词
        </Typography>
        <Typography variant="body2" sx={{ color: '#95a5a6' }}>
          通过图片场景学习英语单词，让学习更有趣、更直观
        </Typography>
      </Box>

      {/* 上传区域 */}
      {!file && (
        <Paper
          {...getRootProps()}
          sx={{
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            border: '2px dashed',
            borderColor: isDragActive ? '#3498db' : '#bdc3c7',
            backgroundColor: isDragActive ? 'rgba(52, 152, 219, 0.05)' : '#ecf0f1',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#3498db',
              backgroundColor: 'rgba(52, 152, 219, 0.05)',
            }
          }}
        >
          <input {...getInputProps()} />
          <PhotoCameraIcon sx={{ fontSize: 64, color: '#3498db', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {isDragActive ? '放开上传图片' : '点击或拖拽图片到这里'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            支持 JPG、PNG、WEBP、GIF 格式，最大 10MB
          </Typography>
        </Paper>
      )}

      {/* 图片预览和分析按钮 */}
      {file && !result && (
        <Fade in={true}>
          <Paper sx={{ p: 3, borderRadius: '12px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '500px',
                  height: 'auto',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <img
                  src={previewUrl}
                  alt="预览图片"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleAnalyze}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <TranslateIcon />}
                  sx={{
                    backgroundColor: '#3498db',
                    '&:hover': {
                      backgroundColor: '#2980b9'
                    },
                    minWidth: '150px'
                  }}
                >
                  {loading ? '分析中...' : '开始分析'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleReset}
                  disabled={loading}
                  sx={{
                    borderColor: '#95a5a6',
                    color: '#95a5a6',
                    '&:hover': {
                      borderColor: '#7f8c8d',
                      backgroundColor: 'rgba(149, 165, 166, 0.05)'
                    }
                  }}
                >
                  重新上传
                </Button>
              </Box>
            </Box>
          </Paper>
        </Fade>
      )}

      {/* 错误提示 */}
      {error && (
        <Fade in={true}>
          <Alert severity="error" sx={{ mt: 2, borderRadius: '8px' }} onClose={() => setError('')}>
            {error}
          </Alert>
        </Fade>
      )}

      {/* 分析结果 */}
      {result && (
        <Fade in={true}>
          <Box sx={{ mt: 3 }}>
            {/* 图片和描述 */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    <img
                      src={previewUrl}
                      alt="分析的图片"
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
                    图片描述
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#34495e', lineHeight: 1.8, mb: 2 }}>
                    {result.description}
                  </Typography>
                  <Chip
                    label={`共生成 ${result.words.length} 个单词`}
                    color="primary"
                    sx={{ mt: 1 }}
                  />
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleReset}
                      sx={{
                        borderColor: '#95a5a6',
                        color: '#95a5a6',
                        '&:hover': {
                          borderColor: '#7f8c8d',
                          backgroundColor: 'rgba(149, 165, 166, 0.05)'
                        }
                      }}
                    >
                      分析新图片
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* 单词列表 */}
            <Typography variant="h5" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold', mb: 2 }}>
              学习单词
            </Typography>
            <Grid container spacing={2}>
              {result.words.map((word, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h5"
                        component="div"
                        gutterBottom
                        sx={{
                          color: '#3498db',
                          fontWeight: 'bold',
                          mb: 1
                        }}
                      >
                        {word.word}
                      </Typography>
                      {word.pronunciation && (
                        <Typography
                          variant="body2"
                          sx={{ color: '#7f8c8d', mb: 1, fontStyle: 'italic' }}
                        >
                          {word.pronunciation}
                        </Typography>
                      )}
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#2c3e50',
                          mb: 2,
                          fontSize: '1.1rem'
                        }}
                      >
                        {word.translation}
                      </Typography>
                      {word.example && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#95a5a6',
                            fontStyle: 'italic',
                            borderLeft: '3px solid #3498db',
                            paddingLeft: '12px',
                            lineHeight: 1.6
                          }}
                        >
                          {word.example}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>
      )}
    </Box>
  );
}
