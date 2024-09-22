import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Grid, CircularProgress } from '@mui/material';

const ImageGenerator: React.FC = () => {
  const [userDescription, setUserDescription] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 首先，使用DeepSeek API生成优化的prompt
      const promptResponse = await axios.post('/api/generate-prompt', {
        userDescription
      });
      const optimizedPrompt = promptResponse.data.prompt;

      // 然后，使用优化后的prompt生成图片
      const imageResponse = await axios.post('/api/generate-image', {
        prompt: optimizedPrompt,
      });
      setGeneratedImages(imageResponse.data.images.map((img: { url: string }) => img.url));
    } catch (error) {
      setError('图片生成失败，请稍后重试。');
      console.error('Error generating image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ '& > *': { mb: 2 } }}>
      <TextField
        fullWidth
        label="描述你想要的图片"
        variant="outlined"
        value={userDescription}
        onChange={(e) => setUserDescription(e.target.value)}
        required
        multiline
        rows={4}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={isLoading}
        sx={{
          fontSize: '1.1rem',
          padding: '10px 20px',
          backgroundColor: '#2ecc71',
          '&:hover': {
            backgroundColor: '#27ae60'
          }
        }}
      >
        {isLoading ? '生成中...' : '生成图片'}
      </Button>
      {isLoading && <CircularProgress sx={{ mt: 2 }} />}
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      {generatedImages.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>生成的图片</Typography>
          <Grid container spacing={2}>
            {generatedImages.map((url, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <img src={url} alt={`Generated image ${index + 1}`} style={{ width: '100%', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ImageGenerator;