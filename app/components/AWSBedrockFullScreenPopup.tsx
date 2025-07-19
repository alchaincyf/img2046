'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Grid,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloudIcon from '@mui/icons-material/Cloud';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import { motion, AnimatePresence } from 'framer-motion';

// AWS Bedrock 弹窗组件
export default function AWSBedrockFullScreenPopup() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // 检查是否已经显示过这个广告
    const hasShownBedrock = localStorage.getItem('hasShownBedrockAd');
    
    if (!hasShownBedrock) {
      // 1秒后显示弹窗
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    // 记录已显示过广告，避免重复显示
    localStorage.setItem('hasShownBedrockAd', 'true');
  };

  const handleClick = () => {
    // 记录点击
    localStorage.setItem('hasShownBedrockAd', 'true');
    
    // 跳转到AWS Bedrock页面
    window.open('https://aws.amazon.com/cn/bedrock?trk=c7cc721e-add3-40fb-ba86-7e18abc51205&sc_channel=psm', '_blank');
    setOpen(false);
  };

  const features = [
    {
      icon: <SmartToyIcon sx={{ fontSize: 40, color: '#FF9900' }} />,
      title: '顶级AI模型',
      description: 'Claude 4、GPT-4、Llama 3等多个领先模型'
    },
    {
      icon: <CodeIcon sx={{ fontSize: 40, color: '#FF9900' }} />,
      title: 'AI编程助手',
      description: '代码生成、调试、优化，提升开发效率10倍'
    },
    {
      icon: <CloudIcon sx={{ fontSize: 40, color: '#FF9900' }} />,
      title: '企业级部署',
      description: '无服务器架构，自动扩缩容，按需付费'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#FF9900' }} />,
      title: '数据安全',
      description: '您的数据不会用于训练，完全私有化'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: '#FF9900' }} />,
      title: '极速响应',
      description: '毫秒级响应，支持实时AI对话应用'
    }
  ];

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          fullScreen
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #0F1419 0%, #1A2332 50%, #0F1419 100%)',
              overflow: 'hidden',
              position: 'relative'
            }
          }}
        >
          {/* 背景动画效果 */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 50%, rgba(255, 153, 0, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 153, 0, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(255, 153, 0, 0.06) 0%, transparent 50%)
            `,
            zIndex: 0
          }} />

          {/* 关闭按钮 */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              zIndex: 10,
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          <DialogContent sx={{ 
            padding: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            position: 'relative',
            zIndex: 1,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255, 255, 255, 0.1)',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 153, 0, 0.5)',
              borderRadius: '3px',
            },
          }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ 
                width: '100%', 
                maxWidth: '1400px', 
                padding: isMobile ? '40px 16px' : '60px 40px',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              {/* 主标题区域 */}
              <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      fontSize: isMobile ? '2.5rem' : '4rem',
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #FF9900 30%, #FFB84D 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 2,
                      textShadow: '0 4px 8px rgba(255, 153, 0, 0.3)'
                    }}
                  >
                    AWS Bedrock
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: 'white',
                      fontSize: isMobile ? '1.2rem' : '1.8rem',
                      mb: 2,
                      fontWeight: 300
                    }}
                  >
                    为AI开发者量身打造的企业级生成式AI平台
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                    <Chip 
                      label="Claude 4" 
                      sx={{ 
                        backgroundColor: 'rgba(255, 153, 0, 0.2)', 
                        color: '#FFB84D',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }} 
                    />
                    <Chip 
                      label="GPT-4 Turbo" 
                      sx={{ 
                        backgroundColor: 'rgba(255, 153, 0, 0.2)', 
                        color: '#FFB84D',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }} 
                    />
                    <Chip 
                      label="Llama 3" 
                      sx={{ 
                        backgroundColor: 'rgba(255, 153, 0, 0.2)', 
                        color: '#FFB84D',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }} 
                    />
                    <Chip 
                      label="代码生成" 
                      sx={{ 
                        backgroundColor: 'rgba(255, 153, 0, 0.2)', 
                        color: '#FFB84D',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }} 
                    />
                  </Box>
                </motion.div>
              </Box>

              {/* 特性展示区域 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Grid container spacing={4} sx={{ mb: 8, px: 2 }}>
                  {features.map((feature, index) => (
                    <Grid item xs={12} sm={6} lg={2.4} key={index}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                      >
                        <Box sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          borderRadius: '20px',
                          padding: '28px 20px',
                          textAlign: 'center',
                          border: '1px solid rgba(255, 153, 0, 0.3)',
                          backdropFilter: 'blur(15px)',
                          transition: 'all 0.3s ease',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          minHeight: '200px',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 153, 0, 0.12)',
                            transform: 'translateY(-8px)',
                            boxShadow: '0 15px 40px rgba(255, 153, 0, 0.25)',
                            borderColor: 'rgba(255, 153, 0, 0.5)'
                          }
                        }}>
                          <motion.div
                            whileHover={{ scale: 1.15, rotate: 5 }}
                            transition={{ duration: 0.3 }}
                            style={{ marginBottom: '16px' }}
                          >
                            {feature.icon}
                          </motion.div>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: 'white', 
                              fontWeight: 'bold', 
                              mb: 2,
                              fontSize: '1.1rem'
                            }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'rgba(255, 255, 255, 0.85)',
                              lineHeight: 1.7,
                              fontSize: '0.9rem'
                            }}
                          >
                            {feature.description}
                          </Typography>
                        </Box>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>

              {/* 价值主张 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
              >
                <Box sx={{
                  background: 'linear-gradient(135deg, rgba(255, 153, 0, 0.15) 0%, rgba(255, 153, 0, 0.08) 100%)',
                  borderRadius: '24px',
                  padding: { xs: '24px', md: '40px' },
                  textAlign: 'center',
                  border: '2px solid rgba(255, 153, 0, 0.4)',
                  mb: 6,
                  mx: 2,
                  backdropFilter: 'blur(20px)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 153, 0, 0.8), transparent)',
                  }
                }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: '#FFB84D', 
                      fontWeight: 'bold', 
                      mb: 3,
                      fontSize: { xs: '1.5rem', md: '2rem' }
                    }}
                  >
                    🚀 专为您这样的AI开发者设计
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.95)',
                      fontSize: { xs: '1rem', md: '1.2rem' },
                      lineHeight: 1.8,
                      maxWidth: '900px',
                      margin: '0 auto',
                      fontWeight: 300
                    }}
                  >
                    无需从零搭建AI基础设施，直接调用世界顶级的AI模型API。<br />
                    无论是构建智能对话系统、AI编程助手，还是图像处理工具，<br />
                    <strong style={{ color: '#FFB84D' }}>Bedrock都能让您的想法快速变为现实。</strong>
                  </Typography>
                </Box>
              </motion.div>

              {/* CTA按钮 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.8 }}
              >
                <Box sx={{ textAlign: 'center', px: 2 }}>
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ display: 'inline-block' }}
                  >
                    <Button
                      onClick={handleClick}
                      variant="contained"
                      size="large"
                      sx={{
                        background: 'linear-gradient(135deg, #FF9900 0%, #FFB84D 50%, #FF9900 100%)',
                        fontSize: { xs: '1.1rem', md: '1.4rem' },
                        fontWeight: 'bold',
                        padding: { xs: '16px 32px', md: '20px 60px' },
                        borderRadius: '60px',
                        textTransform: 'none',
                        boxShadow: '0 12px 30px rgba(255, 153, 0, 0.4)',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #E6890A 0%, #FF9900 50%, #E6890A 100%)',
                          boxShadow: '0 16px 40px rgba(255, 153, 0, 0.6)',
                          borderColor: 'rgba(255, 255, 255, 0.4)',
                        },
                        '&:active': {
                          transform: 'scale(0.96)'
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                          transition: 'left 0.6s',
                        },
                        '&:hover::before': {
                          left: '100%',
                        }
                      }}
                    >
                      🚀 立即体验 AWS Bedrock
                    </Button>
                  </motion.div>
                  
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
                    {['免费试用', '按需付费', '企业级安全'].map((text, index) => (
                      <motion.div
                        key={text}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 2 + index * 0.1 }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: '#FFB84D',
                            boxShadow: '0 0 10px rgba(255, 184, 77, 0.6)'
                          }} />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '0.95rem',
                              fontWeight: 500
                            }}
                          >
                            {text}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 2.5 }}
                  >
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.5)',
                        mt: 2,
                        display: 'block',
                        fontSize: '0.8rem',
                        fontStyle: 'italic'
                      }}
                    >
                      ✨ 加入全球数万AI开发者的选择
                    </Typography>
                  </motion.div>
                </Box>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
} 