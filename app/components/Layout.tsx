'use client';

import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, useTheme, IconButton, useMediaQuery } from '@mui/material';
import NextLinkComposed from './CustomLink';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import { motion } from 'framer-motion';
import Image from 'next/image';
import GitHubIcon from '@mui/icons-material/GitHub';

const drawerWidth = 240;
const menuItems = [
  { text: '首页', icon: <Image src="/images/home.svg" alt="Home" width={24} height={24} />, href: '/' },
  { text: 'AI 文生图', icon: <Image src="/images/ai-image-generator.svg" alt="AI Image Generator" width={24} height={24} />, href: '/ai-image-generator' },
  { text: '文字卡片生成', icon: <Image src="/images/text-card-generator.svg" alt="Text Card Generator" width={24} height={24} />, href: '/text-card-generator' },
  { text: '图片压缩', icon: <Image src="/images/compress.svg" alt="Compress" width={24} height={24} />, href: '/compress' },
  { text: '调整大小', icon: <Image src="/images/resize.svg" alt="Resize" width={24} height={24} />, href: '/resize' },
  { text: '图片格式转换', icon: <Image src="/images/format-convert.svg" alt="Format Convert" width={24} height={24} />, href: '/format-convert' },
  { text: 'SVG 编辑器', icon: <Image src="/images/svg-generator.svg" alt="SVG Generator" width={24} height={24} />, href: '/svg-generator' },
  { text: '极简Logo设计', icon: <Image src="/images/ai-logo-design.svg" alt="AI Logo Design" width={24} height={24} />, href: '/ai-logo-design' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Toolbar /> {/* 添加这一行，为AppBar腾出空间 */}
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
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#2c3e50',
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
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar /> {/* 添加这一行，为AppBar腾出空间 */}
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
    </Box>
  );
}