'use client';

import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, useTheme } from '@mui/material';
import NextLinkComposed from './CustomLink';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import CropIcon from '@mui/icons-material/Crop';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import CompressIcon from '@mui/icons-material/Compress';
import FilterIcon from '@mui/icons-material/Filter';
import CreateIcon from '@mui/icons-material/Create';
import BrushIcon from '@mui/icons-material/Brush';
import { motion } from 'framer-motion';
import Image from 'next/image';

const drawerWidth = 200;

const menuItems = [
  { text: '格式转换', icon: <HomeIcon />, href: '/' },
  { text: '裁剪', icon: <CropIcon />, href: '/crop' },
  { text: '调整大小', icon: <AspectRatioIcon />, href: '/resize' },
  { text: '压缩', icon: <CompressIcon />, href: '/compress' },
  { text: '滤镜', icon: <FilterIcon />, href: '/filter' },
  { text: 'SVG 生成器', icon: <CreateIcon />, href: '/svg-generator' },
  { text: 'AI Logo 设计', icon: <BrushIcon />, href: '/ai-logo-design' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const theme = useTheme();

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#2c3e50',
        }}
      >
        <Toolbar sx={{ gap: 3 }}>
          <Image src="/image-tools-icon.svg" alt="Image Tools Icon" width={40} height={40} />
          <Link href="/" passHref legacyBehavior>
            <Typography 
              variant="h6" 
              noWrap 
              component="a"
              sx={{ 
                fontWeight: 'bold',
                cursor: 'pointer',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              图像魔方 The Image Matrix
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {menuItems.map((item) => (
                <ListItem
                  key={item.text}
                  disablePadding
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
        </Drawer>
        <Box component="main" sx={{ 
          flexGrow: 1, 
          p: 2, 
          mt: '64px', 
          display: 'flex', 
          flexDirection: 'column',
          paddingBottom: '100px' // 添加底部 padding
        }}>
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
    </>
  );
}