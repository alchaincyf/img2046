'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, Box, Typography, Button, IconButton, Badge } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import Image from 'next/image';
import { motion } from 'framer-motion';

// 广告弹窗组件属性
interface AdPopupProps {
  adLink: string;
}

const AdPopup: React.FC<AdPopupProps> = ({ adLink }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // 检查今天是否已经显示过广告
    const lastShownDate = localStorage.getItem('adLastShown');
    const today = new Date().toISOString().split('T')[0]; // 获取当前日期 YYYY-MM-DD

    if (lastShownDate !== today) {
      // 如果今天没有显示过广告，则显示广告
      // 设置一个延迟，让用户先浏览页面内容
      const timer = setTimeout(() => {
        setOpen(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    // 记录今天已经显示过广告
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('adLastShown', today);
  };

  const handleClick = () => {
    // 记录用户已经点击过广告
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('adLastShown', today);
    
    // 跳转到广告链接
    window.open(adLink, '_blank');
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          maxWidth: '500px',
          width: '100%',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #e8f5fe 0%, #ffffff 100%)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        }
      }}
    >
      <DialogTitle sx={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eaeaea' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalFireDepartmentIcon sx={{ color: '#f50057' }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
            AI工具特惠活动
          </Typography>
        </Box>
        <IconButton aria-label="close" onClick={handleClose} sx={{ color: '#666' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: '24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              width: '100%', 
              height: '180px', 
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}>
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                  opacity: 0.9,
                }}
              />
              
              {/* 装饰性元素 */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                }}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              
              <motion.div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '30px',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.15)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: 0.5,
                }}
              />
              
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                textAlign: 'center',
                padding: '0 20px'
              }}>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    ChatGPT、Claude
                  </Typography>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    MidJourney会员特惠
                  </Typography>
                </motion.div>
              </Box>
            </Box>
            
            <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1a1a1a', mt: 1 }}>
              限时特惠：29元/月起
            </Typography>
            
            <Typography variant="body1" sx={{ textAlign: 'center', color: '#444' }}>
              国内直连，无需科学上网，立即体验AI领域顶级工具，提升工作效率与创意表现力
            </Typography>
            
            <Box sx={{ 
              padding: '12px', 
              backgroundColor: '#f0f7ff', 
              borderRadius: '8px', 
              width: '100%',
              border: '1px dashed #3f51b5',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', textAlign: 'center', mb: 1, position: 'relative', zIndex: 2 }}>
                独家优惠码
              </Typography>
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{
                  position: 'absolute',
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(63,81,181,0.1) 0%, rgba(255,255,255,0) 70%)',
                  top: '-100px',
                  right: '-100px',
                  zIndex: 1
                }}
              />
              <Typography variant="h6" sx={{ 
                color: '#f50057', 
                backgroundColor: '#ffebef', 
                padding: '5px', 
                borderRadius: '4px', 
                textAlign: 'center', 
                fontWeight: 'bold',
                position: 'relative',
                zIndex: 2,
                textShadow: '0 1px 1px rgba(0,0,0,0.05)'
              }}>
                huasheng
              </Typography>
            </Box>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              style={{ width: '100%' }}
            >
              <Button 
                onClick={handleClick} 
                fullWidth 
                variant="contained" 
                sx={{ 
                  mt: 1, 
                  py: 1.5,
                  background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #303f9f 30%, #3f51b5 90%)',
                    boxShadow: '0 6px 14px rgba(63, 81, 181, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
                  animation: 'shine 2s infinite',
                  '@keyframes shine': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' }
                  }
                }} />
                立即领取特惠 →
              </Button>
            </motion.div>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ color: '#999', textAlign: 'center', mt: 1 }}>
                安全可靠的官方合作渠道，简单注册即可使用
              </Typography>
              <Badge 
                sx={{ 
                  '& .MuiBadge-badge': { 
                    backgroundColor: '#4caf50',
                    color: 'white',
                  }
                }}
                badgeContent="官方"
              />
            </Box>
          </Box>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AdPopup; 