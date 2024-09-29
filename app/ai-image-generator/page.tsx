'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import ImageGenerator from '../components/ImageGenerator';
import ImageHistory from '../components/ImageHistory';

interface HistoryItem {
  id: string;
  originalPrompt: string;
  optimizedPrompt: string;
  imageUrl: string;
}

const AIImageGeneratorPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'imageHistory'), orderBy('createdAt', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const historyItems: HistoryItem[] = [];
      querySnapshot.forEach((doc) => {
        historyItems.push({ id: doc.id, ...doc.data() } as HistoryItem);
      });
      setHistory(historyItems);
    });

    return () => unsubscribe();
  }, []);

  const addToHistory = async (item: Omit<HistoryItem, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'imageHistory'), {
        ...item,
        createdAt: new Date()
      });
      console.log("Document written with ID: ", docRef.id);
      return docRef.id; // 返回新创建的文档 ID
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <Box sx={{ 
      '& > *': { mb: 3 }, 
      maxWidth: '100%', 
      margin: '0 auto', 
      padding: '20px',
      overflowX: 'hidden' // 防止水平滚动
    }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', fontSize: isMobile ? '1.5rem' : '2rem' }}>
        AI 文生图
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        mb: 3, 
        backgroundColor: '#ecf0f1', 
        borderRadius: '10px', 
        padding: '20px' 
      }}>
        <Image 
          src="/images/ai-image-generator.svg" 
          alt="AI Image Generator" 
          width={isMobile ? 150 : 200} 
          height={isMobile ? 150 : 200}
          priority
        />
        <Typography variant="h6" sx={{ mt: 2, color: '#34495e', textAlign: 'center' }}>
          使用 AI 文生图器，只需输入描述性的提示词，我们就能为您自动优化提示词内容，再自动完成图片生成。
        </Typography>
      </Box>
      <Paper sx={{ p: 3, width: '100%', boxSizing: 'border-box' }}>
        <ImageGenerator onGenerate={addToHistory} />
      </Paper>
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <ImageHistory history={history} />
      </Box>
    </Box>
  );
};

export default AIImageGeneratorPage;