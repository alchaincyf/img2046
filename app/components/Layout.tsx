'use client';

import React, { useState, useEffect } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, useTheme, IconButton, useMediaQuery, Paper, Button, Chip, Divider } from '@mui/material';
import NextLinkComposed from './CustomLink';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import { motion } from 'framer-motion';
import Image from 'next/image';
import GitHubIcon from '@mui/icons-material/GitHub';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Script from 'next/script';

const drawerWidth = 240;
const menuItems = [
  { text: '首页', icon: <Image src="/images/home.svg" alt="Home" width={24} height={24} />, href: '/' },
  { text: 'AI 文生图', icon: <Image src="/images/ai-image-generator.svg" alt="AI Image Generator" width={24} height={24} />, href: '/ai-image-generator' },
  { text: '文字卡片生成', icon: <Image src="/images/text-card-generator.svg" alt="Text Card Generator" width={24} height={24} />, href: '/text-card-generator' },
  { text: '图片压缩', icon: <Image src="/images/compress.svg" alt="Compress" width={24} height={24} />, href: '/compress' },
  { text: '调整大小', icon: <Image src="/images/resize.svg" alt="Resize" width={24} height={24} />, href: '/resize' },
  { text: '图片格式转换', icon: <Image src="/images/format-convert.svg" alt="Format Convert" width={24} height={24} />, href: '/format-convert' },
  { text: 'SVG 编辑器', icon: <Image src="/images/svg-generator.svg" alt="SVG Generator" width={24} height={24} />, href: '/svg-generator' },
  { text: 'SVG to PPT', icon: <Image src="/images/svg-to-ppt.svg" alt="PPT Generator" width={24} height={24} />, href: '/ppt-generator' },
  { text: '极简Logo设计', icon: <Image src="/images/ai-logo-design.svg" alt="AI Logo Design" width={24} height={24} />, href: '/ai-logo-design' },
  { text: 'Text Behind Object', icon: <Image src="/images/text-behind-object.svg" alt="Text Behind Object" width={24} height={24} />, href: '/text-behind-object' },
];

const sidebarAds = [
  {
    title: 'ChatGPT进阶课程',
    description: '带你全面掌握ChatGPT应用技巧。提升工作、学习效率',
    link: 'https://xiaobot.net/p/AIclass',
    tag: '100万人学过',
    socialProof: '已有640人订阅'
  },
  {
    title: 'ChatGPT会员合租',
    description: '国内镜像直连，快速获取ChatGPT Plus会员（优惠码：huasheng）',
    link: 'https://nf.video/hh9tsf/?gid=18',
    tag: '29元/月',
    socialProof: '已有10万+人购买'
  },
  {
    title: '美国虚拟信用卡WILDCARD',
    description: '可用于购买ChatGPT、Claude会员,绑定美区AppStore（优惠码：AIHS）',
    link: 'https://bewildcard.com/i/AIHS',
    tag: '0月租',
    socialProof: '已有5万+人体验'
  },
  {
    title: 'Midjourney会员购买',
    description: '真实感拉满，AI绘图top1（优惠码：huasheng）',
    link: 'https://nf.video/7zwro3/?gid=26',
    tag: '29元/月',
    socialProof: '1000万+月付费用户'
  },
  {
    title: 'Claude会员购买',
    description: '无需翻墙，国内直连（优惠码：huasheng）',
    link: 'https://nf.video/j02hw9/?gid=75',
    tag: '写作能力超ChatGPT',
    socialProof: '8元单日体验卡'
  },
  {
    title: 'AI编程：从入门到精通',
    description: '我的cursor教学视频已经超30万人观看，可能是中文互联网最佳了',
    link: 'https://www.bookai.top/docs/cursor-introduction',
    tag: '365元',
    socialProof: '400+人已加入'
  }
];

// 创建自定义主题
const theme = createTheme({
  typography: {
    fontFamily: '"Noto Sans SC", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 700,
    },
    subtitle1: {
      fontWeight: 600,
    },
    body1: {
      fontWeight: 400,
    },
    body2: {
      fontWeight: 400,
    },
    button: {
      fontWeight: 600,
    },
  },
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(to bottom right, #ffffff, #f0f0f0)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
  },
});

// 在 Layout 组件之前添加这个函数
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adSidebarOpen, setAdSidebarOpen] = useState(true);
  const [shuffledAds, setShuffledAds] = useState(sidebarAds);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    setShuffledAds(shuffleArray(sidebarAds));
  }, []);

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            onClick={() => isMobile && setMobileOpen(false)}
          >
            <NextLinkComposed
              href={item.href}
              style={{
                textDecoration: 'none',
                color: item.href === pathname ? theme.palette.primary.main : 'inherit',
                display: 'flex',
                width: '100%',
                padding: '8px 16px',
                backgroundColor: item.href === pathname ? theme.palette.action.selected : 'inherit',
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </NextLinkComposed>
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ p: 2, mt: 2 }}>
        <Script 
          src="https://apis.google.com/js/platform.js" 
          strategy="lazyOnload"
        />
        <div
          className="g-ytsubscribe"
          data-channelid="UCzbSuf_A_D8dARJ33HzoDew"
          data-layout="full"
          data-count="default"
        />
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundImage: 'linear-gradient(to right, #3f51b5, #5c6bc0)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Link href="/" passHref legacyBehavior>
              <a style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                <Image src="/image-tools-icon.svg" alt="Image Tools Icon" width={40} height={40} />
                <Typography 
                  variant="h6" 
                  noWrap 
                  component="span"
                  sx={{ 
                    fontWeight: 'bold',
                    ml: 2,
                    display: { xs: 'none', sm: 'inline' }
                  }}
                >
                  图像魔方 img2046.com
                </Typography>
              </a>
            </Link>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              color="inherit"
              href="https://www.bookai.top/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                mr: 1,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <Image 
                src="/images/bookai-icon.svg" 
                alt="BookAI" 
                width={48} 
                height={48} 
              />
            </IconButton>
            <IconButton
              color="inherit"
              href="https://github.com/alchaincyf/img2046"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <GitHubIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px - 300px)` },
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.default',
          }}
        >
          <Toolbar />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            style={{ flexGrow: 1 }}
          >
            {children}
          </motion.div>
        </Box>
        <Box
          component="aside"
          sx={{
            width: 300,
            flexShrink: 0,
            transition: 'width 0.3s',
            ...(adSidebarOpen ? {} : { width: 40 }),
          }}
        >
          <Paper
            elevation={3}
            sx={{
              position: 'fixed',
              top: 64,
              right: 0,
              width: adSidebarOpen ? 300 : 40,
              height: 'calc(100vh - 64px)',
              overflow: 'hidden',
              transition: 'width 0.3s',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'background.paper',
              borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
            }}
          >
            <IconButton
              onClick={() => setAdSidebarOpen(!adSidebarOpen)}
              sx={{ 
                alignSelf: 'flex-start', 
                m: 1,
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              {adSidebarOpen ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
            {adSidebarOpen && (
              <Box sx={{ p: 2, overflowY: 'auto' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                  推荐资源
                </Typography>
                {shuffledAds.map((ad, index) => (
                  <React.Fragment key={index}>
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        mb: 2, 
                        p: 2, 
                        borderRadius: 2,
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{ad.title}</Typography>
                        <Chip 
                          label={ad.tag} 
                          size="small" 
                          color="secondary" 
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>{ad.description}</Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary', fontStyle: 'italic' }}>
                        {ad.socialProof}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        href={ad.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        endIcon={<LaunchIcon />}
                        fullWidth
                        sx={{
                          borderRadius: 8,
                          fontWeight: 'bold',
                        }}
                      >
                        了解更多
                      </Button>
                    </Paper>
                    {index < shuffledAds.length - 1 && (
                      <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
                    )}
                  </React.Fragment>
                ))}
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}