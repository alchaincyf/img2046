import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: '#f5f5f5',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <svg
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3498db" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2ecc71" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          d="M0,0 Q50,50 100,0 T200,0 T300,0 T400,0 T500,0 V100 H0 Z"
          fill="url(#grad1)"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            from="-500 0"
            to="0 0"
            dur="20s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="body2" sx={{ color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
            <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
          </svg>
          Copyright{' '}
          <Link color="inherit" href="https://www.youtube.com/@Alchain" target="_blank" rel="noopener noreferrer">
            AI进化论-花生
          </Link>
          , Created with{' '}
          <Link color="inherit" href="https://www.bookai.top/cursor/intro" target="_blank" rel="noopener noreferrer">
            Cursor
          </Link>
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
            <path fill="currentColor" d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
          </svg>
          回到{' '}
          <Link color="inherit" href="https://www.bookai.top/" target="_blank" rel="noopener noreferrer">
            bookai.top首页
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;