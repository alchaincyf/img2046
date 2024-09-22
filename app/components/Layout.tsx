import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, useTheme } from '@mui/material';
import NextLinkComposed from './CustomLink';
import Link from 'next/link';  // 添加这行
import { usePathname } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import CropIcon from '@mui/icons-material/Crop';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import CompressIcon from '@mui/icons-material/Compress';
import FilterIcon from '@mui/icons-material/Filter';
import CreateIcon from '@mui/icons-material/Create';
import { motion } from 'framer-motion';
import Image from 'next/image';

const drawerWidth = 200; // 减小抽屉宽度

const menuItems = [
  { text: '格式转换', icon: <HomeIcon />, href: '/' },
  { text: '裁剪', icon: <CropIcon />, href: '/crop' },
  { text: '调整大小', icon: <AspectRatioIcon />, href: '/resize' },
  { text: '压缩', icon: <CompressIcon />, href: '/compress' },
  { text: '滤镜', icon: <FilterIcon />, href: '/filter' },
  { text: 'SVG 生成器', icon: <CreateIcon />, href: '/svg-generator' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Image src="/image-tools-icon.svg" alt="Image Tools Icon" width={50} height={50} />
          <Link href="/" passHref legacyBehavior>
            <Typography 
              variant="h6" 
              noWrap 
              component="a"
              sx={{ 
                ml: 2, 
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
      <Box component="main" sx={{ flexGrow: 1, p: 2, mt: '64px' }}> {/* 调整 padding 和 margin-top */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </Box>
    </Box>
  );
}