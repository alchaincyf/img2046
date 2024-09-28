'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import ImageToolLayout from '../../components/ImageToolLayout';

interface ImageDetails {
  originalPrompt: string;
  optimizedPrompt: string;
  imageUrl: string;
}

const ImageDetailPage: React.FC = () => {
  const params = useParams();
  const id = params.id as string;
  const [imageDetails, setImageDetails] = useState<ImageDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchImageDetails = async () => {
      try {
        console.log("Fetching document with ID:", id);
        const docRef = doc(db, 'imageHistory', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setImageDetails(docSnap.data() as ImageDetails);
        } else {
          console.log("No such document!");
          setError('No such document!');
        }
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Error fetching document');
      } finally {
        setLoading(false);
      }
    };

    fetchImageDetails();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!imageDetails) {
    return null;
  }

  const pageTitle = `AI生成图片详情 - ${imageDetails.optimizedPrompt}`;
  const pageDescription = `查看AI根据提示词"${imageDetails.originalPrompt}"生成的图片详情。`;

  return (
    <ImageToolLayout
      title={pageTitle}
      description={pageDescription}
    >
      <Box sx={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>图片详情</Typography>
          <Image 
            src={imageDetails.imageUrl} 
            alt={imageDetails.optimizedPrompt}
            width={600}
            height={400}
            layout="responsive"
            unoptimized
          />
          <Typography variant="h6" sx={{ mt: 2 }}>原始提示词：</Typography>
          <Typography>{imageDetails.originalPrompt}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>优化后的提示词：</Typography>
          <Typography>{imageDetails.optimizedPrompt}</Typography>
          <Button component={Link} href="/ai-image-generator" sx={{ mt: 2 }}>
            返回生成页面
          </Button>
        </Paper>
      </Box>
    </ImageToolLayout>
  );
};

export default ImageDetailPage;