'use client'

import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Head from 'next/head';

const tools = [
  { 
    name: '自由画布', 
    icon: '/images/free-canvas.svg', 
    href: '/free-canvas',
    description: '无限创作空间',
    category: 'creative',
    isNew: true
  },
  { 
    name: '文字卡片', 
    icon: '/images/text-card-generator.svg', 
    href: '/text-card-generator',
    description: '视觉文字设计',
    category: 'design'
  },
  { 
    name: '图片压缩', 
    icon: '/images/compress.svg', 
    href: '/compress',
    description: '智能优化体积',
    category: 'utility'
  },
  { 
    name: '调整大小', 
    icon: '/images/resize.svg', 
    href: '/resize',
    description: '精准尺寸控制',
    category: 'utility'
  },
  { 
    name: '格式转换', 
    icon: '/images/format-convert.svg', 
    href: '/format-convert',
    description: '全格式支持',
    category: 'utility'
  },
  { 
    name: 'SVG编辑', 
    icon: '/images/svg-generator.svg', 
    href: '/svg-generator',
    description: '矢量图形创作',
    category: 'design'
  },
  { 
    name: 'Logo设计', 
    icon: '/images/ai-logo-design.svg', 
    href: '/ai-logo-design',
    description: '极简品牌标识',
    category: 'design'
  },
  { 
    name: '圆角处理', 
    icon: '/images/rounded-corners.svg', 
    href: '/rounded-corners',
    description: '优雅边缘效果',
    category: 'utility'
  }
];

const faqs = [
  {
    question: "图像魔方是免费使用的吗？",
    answer: "是的，图像魔方的基础功能完全免费。"
  },
  {
    question: "我的图片数据安全吗？",
    answer: "所有的图片处理都在您的浏览器中进行，不会上传到服务器。"
  },
  {
    question: "支持哪些图片格式？",
    answer: "支持JPG、PNG、WEBP、GIF等常见格式。"
  },
  {
    question: "如何报告问题？",
    answer: "请通过GitHub图标访问项目页面提交问题。"
  },
  {
    question: "AI功能如何工作？",
    answer: "使用先进的机器学习模型，所有处理都在本地进行。"
  },
  {
    question: "如何联系作者？",
    answer: "微信：alchain，邮箱：alchaincyf@gmail.com"
  }
];

export default function ModernFusionHome() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>图像魔方 - 创意视觉工具集 | img2046.com</title>
        <meta name="description" content="图像魔方 - 融合艺术与技术的创意工具平台" />
      </Head>
      
      {/* Anadol 数据流背景 */}
      <div className="data-flow-bg" />
      
      <Box sx={{ 
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh'
      }}>
        {/* 跳过链接 - 可访问性 */}
        <a href="#main-content" className="skip-link">
          跳转到主要内容
        </a>

        {/* 主标题区域 - Müller-Brockmann 瑞士现代主义 */}
        <Box 
          id="main-content"
          sx={{ 
            textAlign: 'center',
            padding: { xs: 'var(--spacing-3xl) var(--spacing-lg)', md: 'var(--spacing-3xl) var(--spacing-2xl)' },
            position: 'relative'
          }}
        >
          {/* 瑞士风格分割线 */}
          <Box sx={{
            width: '80px',
            height: '4px',
            background: 'var(--accent-primary)',
            margin: '0 auto var(--spacing-xl)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '200px',
              height: '1px',
              background: 'var(--border-color)'
            }
          }} />
          
          <Typography 
            component="h1"
            className="text-display"
            sx={{
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-md)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-var(--spacing-sm)',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '2px',
                background: 'var(--accent-primary)'
              }
            }}
          >
            图像魔方
          </Typography>
          
          <Typography
            variant="h2"
            className="text-h2"
            sx={{
              color: 'var(--text-secondary)',
              fontWeight: 300,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 'var(--spacing-lg)'
            }}
          >
            创意 × 技术 × 艺术
          </Typography>

          {/* Rams 功能按钮 */}
          <Button 
            className="rams-button rams-button--primary"
            href="/free-canvas"
            component={Link}
            sx={{ 
              fontSize: 'var(--font-size-base)',
              padding: 'var(--spacing-md) var(--spacing-2xl)',
              marginTop: 'var(--spacing-lg)'
            }}
          >
            开始创作
          </Button>
        </Box>

        {/* 工具网格 - 瑞士8列网格系统 */}
        <Box className="swiss-grid swiss-grid--wide" sx={{ padding: 'var(--spacing-3xl) 0' }}>
          <Box className="span-full" sx={{ marginBottom: 'var(--spacing-2xl)' }}>
            <Typography 
              className="text-h2"
              sx={{ 
                textAlign: 'center',
                color: 'var(--text-primary)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '0',
                  width: '100px',
                  height: '1px',
                  background: 'var(--border-color)',
                  transform: 'translateY(-50%)'
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  right: '0',
                  width: '100px',
                  height: '1px',
                  background: 'var(--border-color)',
                  transform: 'translateY(-50%)'
                }
              }}
            >
              工具集
            </Typography>
          </Box>

          {tools.map((tool, index) => (
            <Box key={tool.name} className="span-2" sx={{ marginBottom: 'var(--spacing-lg)' }}>
              <Link href={tool.href} passHref style={{ textDecoration: 'none' }}>
                <Paper 
                  className="tool-card swiss-card hover-lift"
                  elevation={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    padding: 'var(--spacing-xl)',
                    transition: 'all var(--transition-base) var(--easing-standard)'
                  }}
                >
                  {tool.isNew && (
                    <Box sx={{
                      position: 'absolute',
                      top: '-var(--spacing-sm)',
                      right: '-var(--spacing-sm)',
                      background: 'var(--accent-primary)',
                      color: 'var(--swiss-white)',
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      transform: 'rotate(12deg)',
                      zIndex: 2
                    }}>
                      NEW
                    </Box>
                  )}
                  
                  <Box sx={{ 
                    width: '64px',
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--spacing-lg)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      background: 'var(--bg-tertiary)',
                      borderRadius: '50%',
                      transform: 'scale(0)',
                      transition: 'transform var(--transition-slow) var(--easing-decelerate)',
                      opacity: 0.3
                    },
                    '&:hover::before': {
                      transform: 'scale(1.2)'
                    }
                  }}>
                    <Image 
                      src={tool.icon} 
                      alt={tool.name} 
                      width={48} 
                      height={48}
                      style={{ position: 'relative', zIndex: 1 }}
                    />
                  </Box>
                  
                  <Typography 
                    className="text-h3"
                    sx={{ 
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--spacing-sm)',
                      textAlign: 'center'
                    }}
                  >
                    {tool.name}
                  </Typography>
                  
                  <Typography 
                    className="text-caption"
                    sx={{ 
                      color: 'var(--text-muted)',
                      textAlign: 'center',
                      lineHeight: 'var(--line-height-base)'
                    }}
                  >
                    {tool.description}
                  </Typography>
                </Paper>
              </Link>
            </Box>
          ))}
        </Box>

        {/* FAQ 区域 - Rams 功能性设计 */}
        <Box sx={{ 
          maxWidth: '800px',
          margin: '0 auto',
          padding: 'var(--spacing-3xl) var(--spacing-lg)'
        }}>
          <Typography 
            className="text-h2"
            sx={{ 
              textAlign: 'center',
              marginBottom: 'var(--spacing-2xl)',
              color: 'var(--text-primary)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                bottom: '-var(--spacing-md)',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '2px',
                background: 'var(--accent-primary)'
              }
            }}
          >
            常见问题
          </Typography>
          
          {faqs.map((faq, index) => (
            <Accordion 
              key={index}
              elevation={0}
              sx={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                marginBottom: 'var(--spacing-sm)',
                '&:before': { display: 'none' },
                '&.Mui-expanded': {
                  margin: '0 0 var(--spacing-sm) 0'
                }
              }}
            >
              <AccordionSummary
                expandIcon={
                  <Box sx={{
                    width: '24px',
                    height: '24px',
                    background: 'var(--accent-primary)',
                    color: 'var(--swiss-white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    '& svg': {
                      fontSize: '16px'
                    }
                  }}>
                    <ExpandMoreIcon />
                  </Box>
                }
                sx={{
                  '& .MuiAccordionSummary-content': {
                    margin: 'var(--spacing-md) 0'
                  }
                }}
              >
                <Typography className="text-h3" sx={{ color: 'var(--text-primary)' }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ paddingTop: 0 }}>
                <Typography 
                  className="text-body"
                  sx={{ 
                    color: 'var(--text-secondary)',
                    lineHeight: 'var(--line-height-loose)'
                  }}
                >
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* CTA 区域 - 瑞士现代主义 */}
        <Box sx={{ 
          textAlign: 'center',
          padding: 'var(--spacing-3xl) var(--spacing-lg)',
          background: 'var(--bg-secondary)',
          position: 'relative'
        }}>
          <Typography 
            className="text-h2"
            sx={{ 
              marginBottom: 'var(--spacing-xl)',
              color: 'var(--text-primary)'
            }}
          >
            开始您的创作之旅
          </Typography>
          
          <Button 
            className="rams-button rams-button--primary"
            href="/free-canvas"
            component={Link}
            sx={{ 
              fontSize: 'var(--font-size-base)',
              padding: 'var(--spacing-md) var(--spacing-2xl)'
            }}
          >
            进入工作台
          </Button>
        </Box>
      </Box>
    </>
  );
}
