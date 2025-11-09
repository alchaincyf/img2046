'use client'

import React, { useEffect, useState, useRef } from 'react';
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
    isNew: true,
    color: 'red'
  },
  { 
    name: '文字卡片', 
    icon: '/images/text-card-generator.svg', 
    href: '/text-card-generator',
    description: '视觉文字设计',
    category: 'design',
    color: 'blue'
  },
  { 
    name: '图片压缩', 
    icon: '/images/compress.svg', 
    href: '/compress',
    description: '智能优化体积',
    category: 'utility',
    color: 'yellow'
  },
  { 
    name: '调整大小', 
    icon: '/images/resize.svg', 
    href: '/resize',
    description: '精准尺寸控制',
    category: 'utility',
    color: 'red'
  },
  { 
    name: '格式转换', 
    icon: '/images/format-convert.svg', 
    href: '/format-convert',
    description: '全格式支持',
    category: 'utility',
    color: 'blue'
  },
  { 
    name: 'SVG编辑', 
    icon: '/images/svg-generator.svg', 
    href: '/svg-generator',
    description: '矢量图形创作',
    category: 'design',
    color: 'yellow'
  },
  { 
    name: 'Logo设计', 
    icon: '/images/ai-logo-design.svg', 
    href: '/ai-logo-design',
    description: '极简品牌标识',
    category: 'design',
    color: 'red'
  },
  { 
    name: '圆角处理', 
    icon: '/images/rounded-corners.svg', 
    href: '/rounded-corners',
    description: '优雅边缘效果',
    category: 'utility',
    color: 'blue'
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

export default function FusionHomePage() {
  const [mounted, setMounted] = useState(false);
  const [titleAnimated, setTitleAnimated] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Bass 动态标题动画
    const timer = setTimeout(() => {
      setTitleAnimated(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Heatherwick 视差滚动效果
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const cards = document.querySelectorAll('.fusion-tool-card');
      
      cards.forEach((card, index) => {
        const speed = 0.02 + (index * 0.01);
        const yPos = scrollY * speed;
        (card as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });
    };

    if (mounted) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>图像魔方 - 创意视觉工具集 | img2046.com</title>
        <meta name="description" content="图像魔方 - 融合艺术与技术的创意工具平台" />
      </Head>
      
      {/* Anadol 数据流背景保持 */}
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

        {/* Hero区域 - Bass 动态几何 */}
        <Box 
          id="main-content"
          className="bass-container"
          sx={{ 
            textAlign: 'center',
            padding: { xs: '4rem 1rem', md: '6rem 2rem' },
            position: 'relative',
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          {/* Bass 切割装饰线 */}
          <Box sx={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '200px',
            height: '3px',
            background: 'linear-gradient(15deg, var(--primary-red) 0%, var(--accent-orange) 100%)',
            transform: 'rotate(15deg)',
            opacity: 0.8
          }} />
          
          <div ref={titleRef} className={`bass-title ${titleAnimated ? 'animate' : ''}`}>
            图像魔方
          </div>
          
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.5rem', md: '2rem' },
              fontWeight: 300,
              color: 'var(--neutral-gray)',
              marginBottom: '3rem',
              letterSpacing: '0.05em'
            }}
          >
            动态 × 几何 × 空间
          </Typography>

          {/* Mondrian 按钮组 */}
          <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/free-canvas" passHref>
              <button className="mondrian-button mondrian-button--primary">
                开始创作
              </button>
            </Link>
            <a 
              href="https://github.com/alchaincyf/img2046" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <button className="mondrian-button">
                查看源码
              </button>
            </a>
          </Box>
        </Box>

        {/* Mondrian 不对称分割线 */}
        <Box sx={{
          height: '6px',
          background: 'var(--neutral-black)',
          margin: '4rem 0',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: '30%',
            top: 0,
            width: '20px',
            height: '100%',
            background: 'var(--primary-red)'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            right: '20%',
            top: 0,
            width: '15px',
            height: '100%',
            background: 'var(--primary-blue)'
          }
        }} />

        {/* 工具网格 - Mondrian 不对称布局 */}
        <Box sx={{ padding: '0 2rem', maxWidth: '1440px', margin: '0 auto' }}>
          <Typography 
            variant="h2"
            sx={{ 
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              marginBottom: '3rem',
              textAlign: 'center',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-0.5rem',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '4px',
                background: 'var(--primary-yellow)'
              }
            }}
          >
            工具集
          </Typography>

          {/* 工具卡片网格 - 融合三种风格 */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: '1fr 1fr', 
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)' 
            },
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {tools.map((tool, index) => (
              <Link key={tool.name} href={tool.href} passHref style={{ textDecoration: 'none' }}>
                <div 
                  className="fusion-tool-card"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {tool.isNew && (
                    <Box sx={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: 'var(--primary-red)',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      borderRadius: '4px',
                      transform: 'rotate(12deg)',
                      zIndex: 2
                    }}>
                      NEW
                    </Box>
                  )}
                  
                  {/* Heatherwick 材质图标容器 */}
                  <Box sx={{ 
                    width: '64px',
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    borderRadius: '12px',
                    background: tool.color === 'red' ? 'var(--primary-red)' :
                               tool.color === 'blue' ? 'var(--primary-blue)' :
                               'var(--primary-yellow)',
                    boxShadow: 'var(--material-texture)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(135deg, var(--material-copper) 0%, transparent 50%)',
                      opacity: 0.1
                    }
                  }}>
                    <Image 
                      src={tool.icon} 
                      alt={tool.name} 
                      width={32} 
                      height={32}
                      style={{ 
                        filter: 'brightness(0) invert(1)',
                        position: 'relative',
                        zIndex: 1
                      }}
                    />
                  </Box>
                  
                  <Typography 
                    variant="h3"
                    sx={{ 
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      marginBottom: '0.5rem',
                      color: 'var(--neutral-black)'
                    }}
                  >
                    {tool.name}
                  </Typography>
                  
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: 'var(--neutral-gray)',
                      fontSize: '0.875rem',
                      lineHeight: 1.5
                    }}
                  >
                    {tool.description}
                  </Typography>
                </div>
              </Link>
            ))}
          </Box>
        </Box>

        {/* FAQ 区域 - Heatherwick 层叠卡片 */}
        <Box sx={{ 
          maxWidth: '800px',
          margin: '0 auto',
          padding: '4rem 2rem'
        }}>
          <Typography 
            variant="h2"
            sx={{ 
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '3rem',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '0',
                width: '100px',
                height: '2px',
                background: 'var(--primary-blue)',
                transform: 'translateY(-50%)'
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                right: '0',
                width: '100px',
                height: '2px',
                background: 'var(--primary-blue)',
                transform: 'translateY(-50%)'
              }
            }}
          >
            常见问题
          </Typography>
          
          {faqs.map((faq, index) => (
            <div key={index} className="heatherwick-card" style={{ marginBottom: '1rem' }}>
              <Accordion 
                elevation={0}
                sx={{
                  background: 'transparent',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': {
                    margin: '0'
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <Box sx={{
                      width: '32px',
                      height: '32px',
                      background: 'var(--primary-red)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                      '& svg': {
                        fontSize: '18px'
                      }
                    }}>
                      <ExpandMoreIcon />
                    </Box>
                  }
                  sx={{
                    '& .MuiAccordionSummary-content': {
                      margin: '1rem 0'
                    }
                  }}
                >
                  <Typography 
                    variant="h4"
                    sx={{ 
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: 'var(--neutral-black)' 
                    }}
                  >
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ paddingTop: 0 }}>
                  <Typography 
                    sx={{ 
                      color: 'var(--neutral-gray)',
                      lineHeight: 1.6
                    }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          ))}
        </Box>

        {/* CTA 区域 - Bass 动态几何 */}
        <Box 
          className="bass-container"
          sx={{ 
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'linear-gradient(135deg, var(--neutral-white) 0%, var(--neutral-gray) 100%)',
            position: 'relative',
            marginTop: '4rem'
          }}
        >
          {/* Bass 装饰元素 */}
          <Box sx={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            background: 'var(--primary-yellow)',
            transform: 'rotate(45deg)',
            opacity: 0.8
          }} />
          
          <Typography 
            variant="h2"
            sx={{ 
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              fontWeight: 700,
              marginBottom: '2rem',
              color: 'var(--neutral-black)'
            }}
          >
            开始您的创作之旅
          </Typography>
          
          <Link href="/free-canvas" passHref>
            <button className="mondrian-button mondrian-button--primary">
              进入工作台
            </button>
          </Link>
        </Box>
      </Box>
    </>
  );
}
