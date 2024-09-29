'use client';

import React, { useState, useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import ImageGenerator from '../components/ImageGenerator';
import ImageHistory from '../components/ImageHistory';
import AIToolLayout from '../components/AIToolLayout';

interface HistoryItem {
  id: string;
  originalPrompt: string;
  optimizedPrompt: string;
  imageUrl: string;
}

const AIImageGeneratorPage: React.FC = () => {
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
    <AIToolLayout
      title="AI 文生图"
      description="使用 AI 文生图器，只需输入描述性的提示词，我们就能为您自动优化提示词内容，再自动完成图片生成。"
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
        flexGrow: 1,
      }}>
        <ImageHistory history={history} />
      </Box>
    </AIToolLayout>
  );
};

export default AIImageGeneratorPage;