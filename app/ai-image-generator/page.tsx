'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import ImageGenerator from '../components/ImageGenerator';
import ImageHistory from '../components/ImageHistory';
import ImageToolLayout from '../components/ImageToolLayout';

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
      return docRef.id;
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <ImageToolLayout
      title="AI 文生图工具"
      description="使用我们的 AI 文生图工具，只需输入描述性的提示词，我们就能为您自动优化提示词内容，再自动完成图片生成。"
    >
      <Box sx={{ '& > *': { mb: 3 }, maxWidth: '100%', margin: '0 auto', padding: '20px' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', fontSize: isMobile ? '1.5rem' : '2rem' }}>
          AI 文生图
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', mb: 3, backgroundColor: '#ecf0f1', borderRadius: '10px', padding: '20px' }}>
          <Image 
            src="/images/ai-image-generator.svg" 
            alt="AI Image Generator" 
            width={isMobile ? 150 : 200} 
            height={isMobile ? 150 : 200}
            priority
          />
          <Typography variant="h6" sx={{ ml: isMobile ? 0 : 3, mt: isMobile ? 2 : 0, color: '#34495e' }}>
            使用 AI 文生图器，只需输入描述性的提示词，我们就能为您自动优化提示词内容，再自动完成图片生成。
          </Typography>
        </Box>
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
          flexGrow: 1,
        }}>
          <ImageHistory history={history} />
        </Box>
      </Box>
    </ImageToolLayout>
  );
};

export default AIImageGeneratorPage;