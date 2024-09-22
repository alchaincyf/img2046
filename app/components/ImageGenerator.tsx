import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Grid, CircularProgress } from '@mui/material';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [imageSize, setImageSize] = useState('1024x1024');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/generate-image', {
        prompt,
        negativePrompt,
        imageSize,
      });
      setGeneratedImages(response.data.images.map((img: { url: string }) => img.url));
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
        label="提示词"
        variant="outlined"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        required
      />
      <TextField
        fullWidth
        label="负面提示词（可选）"
        variant="outlined"
        value={negativePrompt}
        onChange={(e) => setNegativePrompt(e.target.value)}
      />
      <TextField
        select
        fullWidth
        label="图片尺寸"
        value={imageSize}
        onChange={(e) => setImageSize(e.target.value)}
        SelectProps={{
          native: true,
        }}
      >
        <option value="1024x1024">1024x1024</option>
        <option value="1024x2048">1024x2048</option>
        <option value="1536x1024">1536x1024</option>
        <option value="1536x2048">1536x2048</option>
        <option value="2048x1152">2048x1152</option>
        <option value="1152x2048">1152x2048</option>
      </TextField>
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