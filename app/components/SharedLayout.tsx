'use client';

import { ReactNode } from 'react';
import { Container, Typography, Box, Paper, Tabs, Tab } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SharedLayoutProps {
  children: ReactNode;
  title: string;
}

export default function SharedLayout({ children, title }: SharedLayoutProps) {
  const pathname = usePathname();

  const getTabValue = () => {
    switch (pathname) {
      case '/':
        return 0;
      case '/crop':
        return 1;
      case '/resize':
        return 2;
      case '/compress':
        return 3;
      case '/filter':
        return 4;
      default:
        return 0;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          图片处理工具
        </Typography>
        <Tabs value={getTabValue()} centered>
          <Tab label="格式转换" component={Link} href="/" />
          <Tab label="裁剪" component={Link} href="/crop" />
          <Tab label="调整大小" component={Link} href="/resize" />
          <Tab label="压缩" component={Link} href="/compress" />
          <Tab label="滤镜" component={Link} href="/filter" />
        </Tabs>
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h4" gutterBottom>{title}</Typography>
          {children}
        </Paper>
      </Box>
    </Container>
  );
}