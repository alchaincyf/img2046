'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, Box, Typography, Button, IconButton, Badge } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import Image from 'next/image';
import { motion } from 'framer-motion';

// 广告配置
const ADS_CONFIG = [
  {
    id: 'videoMembership',
    link: 'https://nf.video/hiWiH',
    title: '🎬 创作者必备神器',
    titleIcon: <LocalFireDepartmentIcon sx={{ color: '#ff6b6b' }} />,
    bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    titleText: ['Netflix、Disney+', 'YouTube会员合租'],
    mainTitle: '银河录像局 - 低至5折订阅',
    description: '设计师和创作者的灵感源泉！正版流媒体会员合租，海量高清素材和创意内容，激发无限创作灵感',
    couponCode: 'huasheng',
    buttonText: '立即解锁创意宝库 →'
  }
];

// 广告弹窗组件
export default function MultiAdsPopup() {
  const [open, setOpen] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    // 从localStorage读取今天显示的广告信息
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const adsShownToday = JSON.parse(localStorage.getItem('adsShownToday') || '{"date":"","ads":[]}');
    
    // 如果是新的一天，重置广告显示记录
    if (adsShownToday.date !== today) {
      localStorage.setItem('adsShownToday', JSON.stringify({
        date: today,
        ads: []
      }));
      
      // 设置显示第一个（也是唯一的）广告
      setCurrentAdIndex(0);
    } else if (!adsShownToday.ads.includes(ADS_CONFIG[0].id)) {
      // 如果今天还没有显示过广告，显示它
      setCurrentAdIndex(0);
    } else {
      // 如果广告今天已经显示过了，不再显示
      return;
    }
    
    // 设置延迟显示
    const timer = setTimeout(() => {
      setOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setOpen(false);
    
    // 记录此广告已显示
    recordAdShown(ADS_CONFIG[currentAdIndex].id);
  };

  const handleClick = () => {
    // 记录此广告已显示
    recordAdShown(ADS_CONFIG[currentAdIndex].id);
    
    // 跳转到广告链接
    window.open(ADS_CONFIG[currentAdIndex].link, '_blank');
    setOpen(false);
  };

  // 记录广告已显示
  const recordAdShown = (adId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const adsShownToday = JSON.parse(localStorage.getItem('adsShownToday') || '{"date":"","ads":[]}');
    
    // 如果是新的一天，重置记录
    if (adsShownToday.date !== today) {
      localStorage.setItem('adsShownToday', JSON.stringify({
        date: today,
        ads: [adId]
      }));
    } else {
      // 添加新显示的广告ID
      if (!adsShownToday.ads.includes(adId)) {
        adsShownToday.ads.push(adId);
        localStorage.setItem('adsShownToday', JSON.stringify(adsShownToday));
      }
    }
  };

  // 如果没有广告要显示，不渲染任何内容
  if (!open) return null;

  const currentAd = ADS_CONFIG[currentAdIndex];

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
          background: 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        }
      }}
    >
      <DialogTitle sx={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eaeaea' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {currentAd.titleIcon}
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#764ba2' }}>
            {currentAd.title}
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
                  backgroundImage: currentAd.bgGradient,
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
                    {currentAd.titleText[0]}
                  </Typography>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    {currentAd.titleText[1]}
                  </Typography>
                </motion.div>
              </Box>
            </Box>
            
            <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1a1a1a', mt: 1 }}>
              {currentAd.mainTitle}
            </Typography>
            
            <Typography variant="body1" sx={{ textAlign: 'center', color: '#444' }}>
              {currentAd.description}
            </Typography>
            
            <Box sx={{ 
              padding: '12px', 
              backgroundColor: '#f0f7ff', 
              borderRadius: '8px', 
              width: '100%',
              border: '1px dashed #764ba2',
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
                {currentAd.couponCode}
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
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)',
                    boxShadow: '0 6px 14px rgba(118, 75, 162, 0.4)',
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
                {currentAd.buttonText}
              </Button>
            </motion.div>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ color: '#999', textAlign: 'center', mt: 1 }}>
                专为创作者打造，稳定可靠，即刻激发创意
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
} 