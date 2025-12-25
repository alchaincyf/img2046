'use client';

import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Button, Paper, Chip, useMediaQuery, useTheme, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RedeemIcon from '@mui/icons-material/Redeem';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import SchoolIcon from '@mui/icons-material/School';
import PublicIcon from '@mui/icons-material/Public';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { motion, AnimatePresence } from 'framer-motion';

// 广告配置 - 可以根据需要修改
const PROMO_ITEMS = [
  {
    id: 'zsxq',
    title: '知识星球',
    subtitle: '30元券 · 1500+人',
    link: 'https://t.zsxq.com/K3vsN',
    color: '#8B5CF6',
    badge: '限量',
    icon: <SchoolIcon />,
  },
  {
    id: 'yinhe',
    title: '银河录像局',
    subtitle: 'AI工具合租93折',
    link: 'https://nf.video/o9jj0s',
    color: '#F97316',
    badge: '热门',
    icon: <VideoLibraryIcon />,
  },
  {
    id: 'huanqiu',
    title: '环球巴士',
    subtitle: '网络加速服务',
    link: 'https://universalbus.cn/?s=5HCba2gPfO',
    color: '#10B981',
    badge: null,
    icon: <PublicIcon />,
  },
  {
    id: 'claude',
    title: 'Claude Code会员',
    subtitle: '开发者必备AI编程工具',
    link: 'https://nf.video/hiWiH',
    color: '#6366F1',
    badge: '推荐',
    icon: <RedeemIcon />,
  },
];

// 菜单组件
const MenuPanel = ({ isOpen, items, onItemClick, onClose }: {
  isOpen: boolean;
  items: typeof PROMO_ITEMS;
  onItemClick: (item: typeof PROMO_ITEMS[0]) => void;
  onClose: () => void;
}) => {
  const theme = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            position: 'absolute',
            bottom: 70,
            right: 0,
            width: 280,
            zIndex: 9999,
          }}
        >
          <Paper
            elevation={8}
            sx={{
              borderRadius: '20px',
              overflow: 'hidden',
              background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.mode === 'dark' ? '#1e293b' : '#f8fafc'} 100%)`,
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
            }}
          >
            {/* 菜单头部 */}
            <Box
              sx={{
                px: 2,
                py: 1.5,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
                <RedeemIcon fontSize="small" />
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'white' }}>
                  专属福利
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={onClose}
                sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* 菜单项 */}
            <Box sx={{ p: 1.5 }}>
              {items.map((item) => (
                <Box key={item.id}>
                  <Button
                    fullWidth
                    onClick={() => onItemClick(item)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      gap: 1.5,
                      px: 1.5,
                      py: 1,
                      mb: 0.5,
                      borderRadius: '12px',
                      textTransform: 'none',
                      bgcolor: 'transparent',
                      '&:hover': {
                        bgcolor: `rgba(${parseInt(item.color.slice(1, 3), 16)}, ${parseInt(item.color.slice(3, 5), 16)}, ${parseInt(item.color.slice(5, 7), 16)}, 0.1)`,
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: item.color,
                        color: 'white',
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box sx={{ flex: 1, textAlign: 'left' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {item.subtitle}
                      </Typography>
                    </Box>
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          bgcolor: item.color,
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '10px',
                          height: 20,
                        }}
                      />
                    )}
                    <OpenInNewIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  </Button>
                </Box>
              ))}
            </Box>

            {/* 菜单底部 */}
            <Box
              sx={{
                px: 2,
                py: 1,
                textAlign: 'center',
                borderTop: '1px solid',
                borderColor: 'divider',
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                图像魔方用户专享优惠
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 脉冲动画组件
const PulseRings = () => (
  <>
    <Box
      component={motion.div}
      animate={{
        scale: [1, 1.5],
        opacity: [0.5, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeOut',
      }}
      sx={{
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        borderRadius: '50%',
        border: '2px solid',
        borderColor: 'rgba(139, 92, 246, 0.5)',
        zIndex: -1,
      }}
    />
    <Box
      component={motion.div}
      animate={{
        scale: [1, 1.8],
        opacity: [0.3, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeOut',
        delay: 1,
      }}
      sx={{
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        borderRadius: '50%',
        border: '2px solid',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        zIndex: -1,
      }}
    />
  </>
);

// 主按钮组件
const MainButton = ({ isOpen, isHovered, onClick }: {
  isOpen: boolean;
  isHovered: boolean;
  onClick: () => void;
}) => (
  <Tooltip title={isOpen ? '' : '专属福利'} placement="left">
    <IconButton
      onClick={onClick}
      sx={{
        width: 60,
        height: 60,
        background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
        '&:hover': {
          background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
          boxShadow: '0 6px 24px rgba(139, 92, 246, 0.6)',
          transform: 'scale(1.05)',
        },
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        zIndex: 10000,
      }}
    >
      <Box sx={{ position: 'relative', color: 'white' }}>
        {!isOpen && <PulseRings />}
        {isOpen ? <CloseIcon /> : <RedeemIcon />}
      </Box>
    </IconButton>
  </Tooltip>
);

// 主组件
export default function FloatingAd() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // 延迟显示，避免影响首屏加载
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    // 5秒后自动弹出一次（如果用户没有交互过）
    const autoOpenTimer = setTimeout(() => {
      const interacted = localStorage.getItem('floatingCTAInteracted');
      if (!interacted && isVisible) {
        setIsOpen(true);
        // 3秒后自动收起
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      }
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(autoOpenTimer);
    };
  }, [isVisible]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!hasInteracted) {
      setHasInteracted(true);
      localStorage.setItem('floatingCTAInteracted', 'true');
    }
  };

  const handleItemClick = (item: typeof PROMO_ITEMS[0]) => {
    window.open(item.link, '_blank');
    setIsOpen(false);
  };

  if (!isVisible) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 16, sm: 24 },
        right: { xs: 16, sm: 24 },
        zIndex: 9998,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 1.5,
      }}
    >
      <MenuPanel
        isOpen={isOpen}
        items={PROMO_ITEMS}
        onItemClick={handleItemClick}
        onClose={() => setIsOpen(false)}
      />
      <MainButton
        isOpen={isOpen}
        isHovered={false}
        onClick={handleToggle}
      />
    </Box>
  );
}
