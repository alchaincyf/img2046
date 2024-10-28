'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Paper, CircularProgress, Typography, Grid, useTheme, useMediaQuery } from '@mui/material';
import { collection, query, orderBy, limit, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import ImageGenerator from '../components/ImageGenerator';
import AIToolLayout from '../components/AIToolLayout';
import Link from 'next/link';

// 删除 Head 和 Metadata 相关的导入和导出

interface HistoryItem {
  id: string;
  originalPrompt: string;
  imageUrl: string;
}

const AIImageGeneratorPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const q = query(collection(db, 'imageHistory'), orderBy('createdAt', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const historyItems: HistoryItem[] = [];
        querySnapshot.forEach((doc) => {
          historyItems.push({ id: doc.id, ...doc.data() } as HistoryItem);
        });
        setHistory(historyItems);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching history: ", err);
        setError("加载历史记录时出错");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addToHistory = useCallback(async (item: Omit<HistoryItem, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'imageHistory'), {
        ...item,
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding document: ', error);
      setError("添加到历史记录时出错");
    }
  }, []);

  const truncatePrompt = (prompt: string) => {
    const words = prompt.split(/\s+/);
    if (words.length <= 5) {
      return prompt.length <= 10 ? prompt : prompt.slice(0, 10) + '...';
    } else {
      return words.slice(0, 5).join(' ') + '...';
    }
  };

  const renderHistoryItem = useCallback((item: HistoryItem) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
        <Link href={`/ai-image-generator/${item.id}`} passHref>
          <Box sx={{ 
            border: '1px solid #e0e0e0', 
            borderRadius: '4px', 
            padding: '8px', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            cursor: 'pointer',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            },
            width: '100%', // 使用100%宽度以适应不同屏幕尺寸
            maxWidth: '256px', // 最大宽度仍然保持为256px
            margin: '0 auto', // 居中显示
          }}>
            <Box sx={{ 
              width: '100%', 
              paddingTop: '100%', // 保持1:1的宽高比
              position: 'relative', 
              overflow: 'hidden',
              marginBottom: '8px',
              backgroundColor: '#f0f0f0',
            }}>
              <img 
                src={item.imageUrl} 
                alt={item.originalPrompt}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                loading="lazy"
              />
            </Box>
            <Typography 
              variant="body2" 
              sx={{
                width: '100%',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
                maxHeight: '3em', // 限制最多显示两行
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
              title={item.originalPrompt}
            >
              {truncatePrompt(item.originalPrompt)}
            </Typography>
          </Box>
        </Link>
      </Grid>
    );
  }, []);

  const memoizedHistory = useMemo(() => history.map(renderHistoryItem), [history, renderHistoryItem]);

  return (
    <AIToolLayout
      title="免费 AI 文生图工具"
      description={
        <div>
          <p>使用 AI 文生图器，只需输入描述性的提示词，我们就能为您自动优化提示词内容，再自动完成图片生成。</p>
          <p>
            最佳文生图工具
            <a 
              href="https://nf.video/7zwro3/?gid=26" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: '#1976d2',
                textDecoration: 'underline',
                marginLeft: '4px'
              }}
            >
              Midjourney
            </a>
          </p>
        </div>
      }
      iconSrc="/images/ai-image-generator.svg"
    >
      <Paper elevation={3} sx={{ 
        p: 3, 
        width: '100%', 
        boxSizing: 'border-box',
        mb: 4,
      }}>
        <ImageGenerator onGenerate={addToHistory} />
      </Paper>
      <Box sx={{ 
        width: '100%', 
        overflowX: 'hidden',
      }}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>生成历史</Typography>
            <Grid container spacing={2} justifyContent="center">
              {memoizedHistory}
            </Grid>
          </Box>
        )}
      </Box>
    </AIToolLayout>
  );
};

export default AIImageGeneratorPage;
