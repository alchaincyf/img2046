import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Card, CardContent } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const AWSMiniProgramPromo: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // 检查是否已经关闭过
    const isClosed = localStorage.getItem('aws-promo-closed');
    const currentDate = new Date();
    const endDate = new Date('2025-06-18');
    
    // 如果没有关闭过且在展示期内，则显示
    if (!isClosed && currentDate <= endDate) {
      // 延迟3秒显示，避免干扰用户初始体验
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('aws-promo-closed', 'true');
  };

  const handleMiniProgramClick = () => {
    window.open('https://mini.awsapp.cn/l/pcWvkgtaUeVU', '_blank');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 100 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.8, x: 100 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
        }}
      >
        <Card
          sx={{
            width: isExpanded ? '340px' : '300px',
            maxWidth: '90vw',
            background: 'linear-gradient(135deg, #FF9500 0%, #FF6B00 100%)',
            color: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(255, 149, 0, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 40px rgba(255, 149, 0, 0.4)',
            }
          }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            {/* 关闭按钮 */}
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                width: 24,
                height: 24,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>

            {/* AWS Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 20,
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1
                }}
              >
                <Typography
                  sx={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: '#FF9500',
                    fontFamily: 'Arial, sans-serif'
                  }}
                >
                  AWS
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                中国峰会
              </Typography>
            </Box>

            {/* 活动信息 */}
            <Typography variant="body2" sx={{ mb: 1, opacity: 0.95 }}>
              📅 6月19-20日 · 上海世博中心
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9, fontSize: '12px' }}>
              🚀 生成式AI落地实践 · 200+全球重磅嘉宾
            </Typography>

            {/* 小程序码区域 */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                p: 2.5,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Box
                component="img"
                src="/aws.jpg"
                alt="AWS峰会小程序码"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMiniProgramClick();
                }}
                sx={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  p: 1.5,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                  }
                }}
              />
              
              <Typography
                variant="caption"
                sx={{
                  mt: 1.5,
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                微信扫码立即报名
              </Typography>
              
              <Typography
                variant="caption"
                sx={{
                  fontSize: '10px',
                  opacity: 0.8,
                  textAlign: 'center',
                  mt: 0.5
                }}
              >
                或点击小程序码直接跳转
              </Typography>
            </Box>

            {/* 亮点信息 */}
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                  <Typography variant="caption" sx={{ fontSize: '10px', opacity: 0.9 }}>
                    ✨ 30+行业技术分论坛 · 10+动手训练营<br/>
                    🎯 12000+业务技术构建者 · 10000m²体验区
                  </Typography>
                </Box>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default AWSMiniProgramPromo; 