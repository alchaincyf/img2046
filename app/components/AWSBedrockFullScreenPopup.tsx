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
      description: 'Claude 3、GPT-4、Llama 2等多个领先模型'
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
            zIndex: 1
          }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ width: '100%', maxWidth: '1200px', padding: '20px' }}
            >
              {/* 主标题区域 */}
              <Box sx={{ textAlign: 'center', mb: 6 }}>
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
                      label="Claude 3.5 Sonnet" 
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
                      label="Llama 2" 
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
                <Grid container spacing={3} sx={{ mb: 6 }}>
                  {features.map((feature, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                      >
                        <Box sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '16px',
                          padding: '24px',
                          textAlign: 'center',
                          border: '1px solid rgba(255, 153, 0, 0.2)',
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 153, 0, 0.1)',
                            transform: 'translateY(-5px)',
                            boxShadow: '0 10px 30px rgba(255, 153, 0, 0.2)'
                          }
                        }}>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {feature.icon}
                          </motion.div>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: 'white', 
                              fontWeight: 'bold', 
                              mb: 1, 
                              mt: 2 
                            }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'rgba(255, 255, 255, 0.8)',
                              lineHeight: 1.6
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
              >
                <Box sx={{
                  backgroundColor: 'rgba(255, 153, 0, 0.1)',
                  borderRadius: '20px',
                  padding: '32px',
                  textAlign: 'center',
                  border: '2px solid rgba(255, 153, 0, 0.3)',
                  mb: 4
                }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: '#FFB84D', 
                      fontWeight: 'bold', 
                      mb: 2 
                    }}
                  >
                    🚀 专为您这样的AI开发者设计
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'white',
                      fontSize: '1.1rem',
                      lineHeight: 1.8,
                      maxWidth: '800px',
                      margin: '0 auto'
                    }}
                  >
                    无需从零搭建AI基础设施，直接调用世界顶级的AI模型API。
                    无论是构建智能对话系统、AI编程助手，还是图像处理工具，
                    Bedrock都能让您的想法快速变为现实。
                  </Typography>
                </Box>
              </motion.div>

              {/* CTA按钮 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.8 }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleClick}
                      variant="contained"
                      size="large"
                      sx={{
                        background: 'linear-gradient(45deg, #FF9900 30%, #FFB84D 90%)',
                        fontSize: isMobile ? '1.1rem' : '1.3rem',
                        fontWeight: 'bold',
                        padding: '16px 48px',
                        borderRadius: '50px',
                        textTransform: 'none',
                        boxShadow: '0 8px 25px rgba(255, 153, 0, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #E6890A 30%, #FF9900 90%)',
                          boxShadow: '0 12px 35px rgba(255, 153, 0, 0.6)',
                        },
                        '&:active': {
                          transform: 'scale(0.98)'
                        }
                      }}
                    >
                      🎯 立即体验 AWS Bedrock →
                    </Button>
                  </motion.div>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      mt: 2,
                      fontSize: '0.9rem'
                    }}
                  >
                    免费试用 • 按需付费 • 企业级安全
                  </Typography>
                </Box>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
} 