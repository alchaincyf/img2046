import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Card, CardContent } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const AWSMiniProgramPromo: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    // 检查是否已经关闭过
    const isClosed = localStorage.getItem('aws-promo-closed');
    const lastShown = localStorage.getItem('aws-promo-last-shown');
    const currentDate = new Date();
    const endDate = new Date('2025-06-18');
    
    // 如果用户关闭过，检查是否已经过了24小时（给用户第二次机会）
    if (isClosed && lastShown) {
      const lastShownDate = new Date(lastShown);
      const hoursSinceLastShown = (currentDate.getTime() - lastShownDate.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastShown < 24) {
        return; // 24小时内不再显示
      }
    }
    
    // 如果在展示期内
    if (currentDate <= endDate) {
      // 检测用户行为：页面停留时间超过10秒或滚动到页面中部时显示
      let scrollTriggered = false;
      let timeTriggered = false;
      
      const handleScroll = () => {
        if (scrollTriggered) return;
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent > 30) { // 滚动超过30%时显示
          scrollTriggered = true;
          setIsVisible(true);
          localStorage.setItem('aws-promo-last-shown', currentDate.toISOString());
        }
      };
      
      // 10秒后显示（表示用户对内容有兴趣）
      const timer = setTimeout(() => {
        if (!scrollTriggered) {
          timeTriggered = true;
          setIsVisible(true);
          localStorage.setItem('aws-promo-last-shown', currentDate.toISOString());
        }
      }, 10000);
      
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // 不是永久关闭，而是24小时内不显示
    localStorage.setItem('aws-promo-closed', 'true');
    localStorage.setItem('aws-promo-last-shown', new Date().toISOString());
  };

  const handleRemindLater = () => {
    setIsVisible(false);
    // 4小时后再提醒
    const remindTime = new Date();
    remindTime.setHours(remindTime.getHours() + 4);
    localStorage.setItem('aws-promo-remind-later', remindTime.toISOString());
  };

  const handleMiniProgramClick = () => {
    // 记录点击统计
    const clicks = parseInt(localStorage.getItem('aws-promo-clicks') || '0') + 1;
    localStorage.setItem('aws-promo-clicks', clicks.toString());
    
    window.open('https://mini.awsapp.cn/l/pcWvkgtaUeVU', '_blank');
    
    // 点击后给予正面反馈
    setClickCount(prev => prev + 1);
  };

  // 添加脉冲动画效果
  useEffect(() => {
    if (isVisible) {
      const pulseTimer = setTimeout(() => {
        setShowPulse(true);
      }, 5000); // 显示5秒后开始脉冲
      
      return () => clearTimeout(pulseTimer);
    }
  }, [isVisible]);

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
            {/* 关闭和稍后提醒按钮 */}
            <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemindLater();
                }}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  width: 24,
                  height: 24,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
                title="4小时后提醒"
              >
                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>⏰</Typography>
              </IconButton>
              
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  width: 24,
                  height: 24,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
                title="24小时内不再显示"
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>

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
            
            <Typography variant="body2" sx={{ mb: 1, opacity: 0.9, fontSize: '12px' }}>
              🚀 生成式AI落地实践 · 200+全球重磅嘉宾
            </Typography>

            {/* 添加紧迫感 */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              p: 1
            }}>
              <Typography variant="caption" sx={{ 
                fontSize: '11px', 
                fontWeight: 'bold',
                color: '#FFE0B3'
              }}>
                🔥 限时免费报名 · 仅剩{Math.max(0, Math.ceil((new Date('2025-06-18').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}天
              </Typography>
            </Box>

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
                sx={{
                  position: 'relative',
                  display: 'inline-block',
                }}
              >
                {/* 脉冲动画环 */}
                {showPulse && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '-10px',
                      left: '-10px',
                      right: '-10px',
                      bottom: '-10px',
                      borderRadius: '50%',
                      border: '3px solid rgba(255, 255, 255, 0.6)',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': {
                          transform: 'scale(0.8)',
                          opacity: 1,
                        },
                        '100%': {
                          transform: 'scale(1.2)',
                          opacity: 0,
                        },
                      },
                    }}
                  />
                )}
                
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
                    transition: 'all 0.3s ease',
                    boxShadow: showPulse ? '0 6px 20px rgba(255,255,255,0.3)' : '0 4px 12px rgba(0,0,0,0.15)',
                    border: showPulse ? '2px solid rgba(255,255,255,0.5)' : 'none',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 8px 24px rgba(255,255,255,0.4)',
                    },
                    '&:active': {
                      transform: 'scale(0.98)',
                    }
                  }}
                />
                
                {/* 点击成功反馈 */}
                {clickCount > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      backgroundColor: '#4CAF50',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'bounce 0.5s ease',
                      '@keyframes bounce': {
                        '0%, 20%, 50%, 80%, 100%': {
                          transform: 'translateY(0)',
                        },
                        '40%': {
                          transform: 'translateY(-10px)',
                        },
                        '60%': {
                          transform: 'translateY(-5px)',
                        },
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: '12px', color: 'white' }}>✓</Typography>
                  </Box>
                )}
              </Box>
              
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