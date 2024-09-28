'use client';

import React from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent, CardMedia } from '@mui/material';
import Link from 'next/link';

interface HistoryItem {
  id: string;
  originalPrompt: string;
  optimizedPrompt: string;
  imageUrl: string;
}

interface ImageHistoryProps {
  history: HistoryItem[];
}

const ImageHistory: React.FC<ImageHistoryProps> = ({ history }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>生成历史</Typography>
      <Grid container spacing={2}>
        {history.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardActionArea component={Link} href={`/ai-image-generator/${item.id}`}>
                <CardMedia
                  component="img"
                  height="140"
                  image={item.imageUrl}
                  alt={item.optimizedPrompt}
                />
                <CardContent>
                  <Typography variant="body2" noWrap>
                    {item.originalPrompt}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ImageHistory;