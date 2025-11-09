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
    color: '#FF4B4B',
    sequence: 1,
    isNew: true
  },
  { 
    name: '文字卡片', 
    icon: '/images/text-card-generator.svg', 
    href: '/text-card-generator',
    description: '视觉文字设计',
    color: '#FF8C00',
    sequence: 2
  },
  { 
    name: '图片压缩', 
    icon: '/images/compress.svg', 
    href: '/compress',
    description: '智能优化体积',
    color: '#FFD700',
    sequence: 3
  },
  { 
    name: '调整大小', 
    icon: '/images/resize.svg', 
    href: '/resize',
    description: '精准尺寸控制',
    color: '#32CD32',
    sequence: 4
  },
  { 
    name: '格式转换', 
    icon: '/images/format-convert.svg', 
    href: '/format-convert',
    description: '全格式支持',
    color: '#4169E1',
    sequence: 5
  },
  { 
    name: 'SVG编辑', 
    icon: '/images/svg-generator.svg', 
    href: '/svg-generator',
    description: '矢量图形创作',
    color: '#9370DB',
    sequence: 6
  },
  { 
    name: 'Logo设计', 
    icon: '/images/ai-logo-design.svg', 
    href: '/ai-logo-design',
    description: '极简品牌标识',
    color: '#FF1493',
    sequence: 7
  },
  { 
    name: '圆角处理', 
    icon: '/images/rounded-corners.svg', 
    href: '/rounded-corners',
    description: '优雅边缘效果',
    color: '#00CED1',
    sequence: 8
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

export default function HomeOptimized() {
  const [mounted, setMounted] = useState(false);
  const [visibleTools, setVisibleTools] = useState<number[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    
    // Saul Bass 风格的渐进式动画
    const timer = setInterval(() => {
      setVisibleTools(prev => {
        const next = [...prev];
        if (next.length < tools.length) {
          next.push(next.length);
        } else {
          clearInterval(timer);
        }
        return next;
      });
    }, 100);

    // Nendo 微妙鼠标跟踪
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <Head>
        <title>图像魔方 - 创意视觉工具集 | img2046.com</title>
        <meta name="description" content="图像魔方 - 融合艺术与技术的创意工具平台" />
      </Head>
      
      {/* Tadao Ando 混凝土质感背景 */}
      <div 
        className="ando-concrete-bg"
        style={{
          transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
        }}
      />
      
      {/* Saul Bass 几何遮罩层 */}
      {mounted && (
        <div className="bass-geometric-overlay">
          <svg className="bass-shapes" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon 
              points="0,0 30,0 0,40" 
              fill="#FF4B4B" 
              opacity="0.1"
              className="bass-shape-1"
            />
            <polygon 
              points="100,0 100,30 70,0" 
              fill="#4169E1" 
              opacity="0.1"
              className="bass-shape-2"
            />
            <polygon 
              points="0,100 40,100 0,60" 
              fill="#32CD32" 
              opacity="0.1"
              className="bass-shape-3"
            />
            <circle 
              cx="85" 
              cy="85" 
              r="15" 
              fill="#FFD700" 
              opacity="0.1"
              className="bass-shape-4"
            />
          </svg>
        </div>
      )}
      
      <Box sx={{ 
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh'
      }}>
        {/* 主标题 - Saul Bass 斜切风格 */}
        <Box 
          ref={titleRef}
          sx={{ 
            textAlign: 'center',
            padding: { xs: '80px 20px', md: '120px 40px' },
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Typography 
            component="h1"
            className="bass-title"
            sx={{
              fontSize: { xs: '3rem', md: '5rem' },
              fontWeight: 900,
              position: 'relative',
              letterSpacing: '-0.04em',
              lineHeight: 0.9,
              '& .title-part': {
                display: 'inline-block',
                position: 'relative'
              }
            }}
          >
            <span className="title-part title-part-1">图像</span>
            <span className="title-part title-part-2">魔方</span>
          </Typography>
          
          {/* Nendo 极简副标题 */}
          <Typography
            className="nendo-subtitle"
            sx={{
              marginTop: 4,
              fontSize: { xs: '0.9rem', md: '1.1rem' },
              fontWeight: 300,
              letterSpacing: '0.3em',
              color: '#666',
              opacity: 0.8,
              textTransform: 'uppercase'
            }}
          >
            Create • Transform • Inspire
          </Typography>
          
          {/* Tadao Ando 光束效果 */}
          <Box className="ando-light-beam" />
        </Box>

        {/* 工具网格 - Nendo 产品语义布局 */}
        <Box className="nendo-grid">
          {tools.map((tool, index) => (
            <Link 
              key={tool.name} 
              href={tool.href} 
              passHref 
              style={{ textDecoration: 'none' }}
            >
              <Paper 
                className={`tool-card-optimized ${visibleTools.includes(index) ? 'visible' : ''}`}
                elevation={0}
                style={{ 
                  '--delay': `${index * 0.1}s`,
                  '--color': tool.color
                } as React.CSSProperties}
                sx={{
                  padding: { xs: 3, md: 4 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  cursor: 'pointer',
                  background: 'white',
                  border: '1px solid #f0f0f0',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {/* Saul Bass 序号标记 */}
                <Box className="bass-sequence-marker">
                  {String(tool.sequence).padStart(2, '0')}
                </Box>
                
                {tool.isNew && (
                  <Box className="nendo-new-badge">
                    NEW
                  </Box>
                )}
                
                {/* Nendo 风格图标容器 */}
                <Box className="nendo-icon-container">
                  <Box className="icon-shadow" />
                  <Image 
                    src={tool.icon} 
                    alt={tool.name} 
                    width={56} 
                    height={56}
                    className="tool-icon"
                  />
                </Box>
                
                <Typography 
                  variant="h6" 
                  className="tool-name"
                  sx={{ 
                    fontWeight: 700,
                    fontSize: '1rem',
                    marginTop: 3,
                    marginBottom: 1,
                    letterSpacing: '0.02em'
                  }}
                >
                  {tool.name}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  className="tool-description"
                  sx={{ 
                    color: '#888',
                    fontSize: '0.85rem',
                    letterSpacing: '0.03em'
                  }}
                >
                  {tool.description}
                </Typography>
                
                {/* Tadao Ando 光影层 */}
                <Box className="ando-shadow-layer" />
              </Paper>
            </Link>
          ))}
        </Box>

        {/* FAQ - Tadao Ando 极简分割 */}
        <Box className="ando-section">
          <Box sx={{ 
            maxWidth: 800,
            margin: '0 auto',
            padding: { xs: '60px 20px', md: '100px 40px' }
          }}>
            <Typography 
              variant="h3" 
              className="section-title"
              sx={{ 
                textAlign: 'center',
                marginBottom: 8,
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 300,
                letterSpacing: '0.1em',
                position: 'relative'
              }}
            >
              常见问题
              <Box className="ando-underline" />
            </Typography>
            
            {faqs.map((faq, index) => (
              <Accordion 
                key={index}
                className="nendo-accordion"
                elevation={0}
                sx={{
                  backgroundColor: 'transparent',
                  borderBottom: '1px solid #f0f0f0',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': {
                    margin: 0
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <Box className="nendo-expand-icon">
                      <ExpandMoreIcon />
                    </Box>
                  }
                  sx={{
                    padding: '24px 0',
                    '& .MuiAccordionSummary-content': {
                      margin: 0
                    }
                  }}
                >
                  <Typography sx={{ 
                    fontWeight: 500,
                    fontSize: '1rem',
                    letterSpacing: '0.02em'
                  }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: '0 0 24px 0' }}>
                  <Typography sx={{ 
                    color: '#666',
                    lineHeight: 1.7,
                    fontSize: '0.95rem'
                  }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>

        {/* CTA - Saul Bass 动态按钮 */}
        <Box className="bass-cta-section">
          <Typography 
            variant="h4" 
            sx={{ 
              marginBottom: 6,
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}
          >
            开始创作
          </Typography>
          
          <Button 
            className="bass-cta-button"
            href="/free-canvas"
            component={Link}
          >
            <span className="button-text">进入工作台</span>
            <Box className="button-bg" />
          </Button>
        </Box>
      </Box>
      
      <style jsx global>{`
        /* Tadao Ando 混凝土背景 */
        .ando-concrete-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 110%;
          height: 110%;
          z-index: -2;
          background: 
            linear-gradient(180deg, #f8f8f8 0%, #ffffff 100%),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.01) 2px,
              rgba(0,0,0,0.01) 4px
            );
          transition: transform 0.3s ease-out;
        }
        
        /* Saul Bass 几何遮罩 */
        .bass-geometric-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          pointer-events: none;
        }
        
        .bass-shapes {
          width: 100%;
          height: 100%;
        }
        
        .bass-shape-1 { animation: float-1 20s ease-in-out infinite; }
        .bass-shape-2 { animation: float-2 25s ease-in-out infinite; }
        .bass-shape-3 { animation: float-3 30s ease-in-out infinite; }
        .bass-shape-4 { animation: float-4 22s ease-in-out infinite; }
        
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -20px); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 30px); }
        }
        
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, 20px); }
        }
        
        @keyframes float-4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, -30px) scale(1.2); }
        }
        
        /* Saul Bass 标题动画 */
        .bass-title {
          animation: title-reveal 1s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }
        
        .title-part-1 {
          animation: slide-in-left 0.8s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }
        
        .title-part-2 {
          animation: slide-in-right 0.8s 0.2s cubic-bezier(0.65, 0, 0.35, 1) forwards;
          margin-left: 0.2em;
        }
        
        @keyframes slide-in-left {
          from {
            transform: translateX(-100px) skewX(-10deg);
            opacity: 0;
          }
          to {
            transform: translateX(0) skewX(0deg);
            opacity: 1;
          }
        }
        
        @keyframes slide-in-right {
          from {
            transform: translateX(100px) skewX(10deg);
            opacity: 0;
          }
          to {
            transform: translateX(0) skewX(0deg);
            opacity: 1;
          }
        }
        
        /* Nendo 副标题 */
        .nendo-subtitle {
          animation: fade-in-up 1s 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
        }
        
        @keyframes fade-in-up {
          to {
            transform: translateY(0);
            opacity: 0.8;
          }
          from {
            transform: translateY(20px);
            opacity: 0;
          }
        }
        
        /* Tadao Ando 光束 */
        .ando-light-beam {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 100%;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(0,0,0,0.05) 50%,
            transparent 100%
          );
          animation: beam-scan 8s linear infinite;
        }
        
        @keyframes beam-scan {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        
        /* Nendo 产品网格 */
        .nendo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          padding: 0 40px 80px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        @media (max-width: 768px) {
          .nendo-grid {
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 16px;
            padding: 0 20px 60px;
          }
        }
        
        /* 工具卡片动画 */
        .tool-card-optimized {
          opacity: 0;
          transform: translateY(40px) scale(0.95);
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .tool-card-optimized.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          transition-delay: var(--delay);
        }
        
        .tool-card-optimized:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        /* Saul Bass 序号 */
        .bass-sequence-marker {
          position: absolute;
          top: 12px;
          left: 12px;
          font-size: 2rem;
          font-weight: 900;
          color: var(--color);
          opacity: 0.1;
          font-family: 'Helvetica Neue', sans-serif;
        }
        
        /* Nendo 新标签 */
        .nendo-new-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #FF4B4B;
          color: white;
          padding: 4px 12px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          border-radius: 2px;
        }
        
        /* Nendo 图标容器 */
        .nendo-icon-container {
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 20px 0;
        }
        
        .icon-shadow {
          position: absolute;
          bottom: -10px;
          width: 60%;
          height: 4px;
          background: radial-gradient(ellipse, rgba(0,0,0,0.1), transparent);
          filter: blur(4px);
        }
        
        .tool-icon {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .tool-card-optimized:hover .tool-icon {
          transform: translateY(-4px) rotate(5deg);
        }
        
        /* Tadao Ando 光影层 */
        .ando-shadow-layer {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(0,0,0,0.02) 100%
          );
          pointer-events: none;
        }
        
        /* Tadao Ando 区块 */
        .ando-section {
          position: relative;
          background: linear-gradient(
            180deg,
            #ffffff 0%,
            #fafafa 100%
          );
        }
        
        .ando-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0,0,0,0.1),
            transparent
          );
        }
        
        .ando-underline {
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 2px;
          background: #333;
        }
        
        /* Nendo 手风琴 */
        .nendo-accordion {
          transition: all 0.3s ease;
        }
        
        .nendo-accordion:hover {
          background: rgba(0,0,0,0.01) !important;
        }
        
        .nendo-expand-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .Mui-expanded .nendo-expand-icon {
          transform: rotate(180deg);
        }
        
        /* Saul Bass CTA */
        .bass-cta-section {
          text-align: center;
          padding: 100px 40px;
          position: relative;
          overflow: hidden;
        }
        
        .bass-cta-button {
          position: relative;
          padding: 20px 60px;
          font-size: 1.1rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: transparent;
          color: #333;
          border: 3px solid #333;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .button-bg {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: #333;
          transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: -1;
        }
        
        .bass-cta-button:hover {
          color: white;
        }
        
        .bass-cta-button:hover .button-bg {
          left: 0;
        }
        
        .button-text {
          position: relative;
          z-index: 1;
        }
        
        /* 响应式优化 */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
          
          .tool-card-optimized {
            opacity: 1;
            transform: none;
          }
        }
        
        /* 暗色模式支持 */
        @media (prefers-color-scheme: dark) {
          .ando-concrete-bg {
            background: 
              linear-gradient(180deg, #1a1a1a 0%, #000000 100%),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(255,255,255,0.02) 2px,
                rgba(255,255,255,0.02) 4px
              );
          }
          
          .tool-card-optimized {
            background: #1a1a1a !important;
            border-color: #333 !important;
          }
          
          .tool-name {
            color: #ffffff;
          }
          
          .tool-description {
            color: #aaa !important;
          }
          
          .bass-cta-button {
            color: #ffffff;
            border-color: #ffffff;
          }
          
          .button-bg {
            background: #ffffff;
          }
          
          .bass-cta-button:hover {
            color: #000000;
          }
        }
        
        /* 打印优化 */
        @media print {
          .bass-geometric-overlay,
          .ando-concrete-bg,
          .ando-light-beam,
          .ando-shadow-layer {
            display: none;
          }
        }
      `}</style>
    </>
  );
}