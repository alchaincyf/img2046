import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        backgroundColor: '#0A0A0A',
        color: '#FFFFFF',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        py: { xs: 4, md: 6 },
        px: { xs: 3, md: 6 },
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
        {/* 顶部签名行 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 4,
            mb: 5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <span style={{ width: 8, height: 8, backgroundColor: '#DC2F1A', display: 'inline-block' }} />
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                fontSize: '11px',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              img<span style={{ color: '#DC2F1A' }}>.</span>2046 · Image Toolkit
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            HUASHENG.AI · 2026
          </Typography>
        </Box>

        {/* 4 列 meta 网格 */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 0,
            borderTop: '1px solid rgba(255,255,255,0.15)',
            pt: 3,
          }}
        >
          <FooterCol label="— Project">
            <FooterLink href="https://www.img2046.com/">img2046.com</FooterLink>
            <FooterLink href="/aidex/">AIDEX AI 工具目录</FooterLink>
          </FooterCol>
          <FooterCol label="— Created By">
            <FooterLink href="https://huasheng.ai/" external>花叔 · huasheng.ai</FooterLink>
            <FooterLink href="https://www.youtube.com/@Alchain" external>YouTube @Alchain</FooterLink>
            <FooterLink href="https://github.com/alchaincyf/img2046" external>GitHub @alchaincyf</FooterLink>
          </FooterCol>
          <FooterCol label="— Learn">
            <FooterLink href="https://www.bookai.top/" external>bookai.top</FooterLink>
            <FooterLink href="https://www.bookai.top/cursor/intro" external>Cursor 教程</FooterLink>
            <FooterLink href="https://lovlogo.com/" external>Lovlogo</FooterLink>
          </FooterCol>
          <FooterCol label="— License">
            <Typography sx={metaText}>Free Forever</Typography>
            <Typography sx={metaText}>本地处理 · 0 上传</Typography>
            <Typography sx={metaText}>Built with Cursor + Claude</Typography>
          </FooterCol>
        </Box>

        {/* 底部 copyright */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography sx={{ ...metaText, opacity: 0.5 }}>
            © 2024–2026 img.2046 · All tools free
          </Typography>
          <Typography sx={{ ...metaText, opacity: 0.5 }}>
            Designed with huashu-design.skill
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const metaText = {
  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
  fontSize: '10px',
  letterSpacing: '0.25em',
  textTransform: 'uppercase' as const,
  color: 'rgba(255,255,255,0.7)',
  lineHeight: 1.8,
};

const labelText = {
  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
  fontSize: '9px',
  letterSpacing: '0.3em',
  textTransform: 'uppercase' as const,
  color: 'rgba(255,255,255,0.4)',
  mb: 1.5,
};

function FooterCol({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box sx={{ pr: 2, pb: { xs: 3, md: 0 } }}>
      <Typography sx={labelText}>{label}</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>{children}</Box>
    </Box>
  );
}

function FooterLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  return (
    <Link
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      underline="none"
      sx={{
        ...metaText,
        color: 'rgba(255,255,255,0.7)',
        '&:hover': { color: '#DC2F1A' },
        transition: 'color 0.15s',
        py: 0.3,
      }}
    >
      {children}
    </Link>
  );
}

export default Footer;
