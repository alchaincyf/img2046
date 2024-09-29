import React from 'react';
import { Box, Typography, Grid, Paper, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Head from 'next/head';

const tools = [
  { 
    name: 'AI 文生图', 
    icon: '/images/ai-image-generator.svg', 
    href: '/ai-image-generator',
    description: '通过文字描述生成独特的AI图像，激发创意灵感，适用于各种创作场景。'
  },
  { 
    name: '文字卡片生成', 
    icon: '/images/text-card-generator.svg', 
    href: '/text-card-generator',
    description: '创建精美的文字卡片，自定义字体、颜色和背景，适合社交媒体分享和营销使用。'
  },
  { 
    name: '图片压缩', 
    icon: '/images/compress.svg', 
    href: '/compress',
    description: '高效压缩图片文件大小，保持画质的同时优化加载速度，提升网站性能。'
  },
  { 
    name: '调整大小', 
    icon: '/images/resize.svg', 
    href: '/resize',
    description: '快速调整图片尺寸，保持比例或自定义大小，适应各种平台要求。'
  },
  { 
    name: '图片格式转换', 
    icon: '/images/format-convert.svg', 
    href: '/format-convert',
    description: '轻松将图片转换为各种格式，支持JPG、PNG、WEBP、GIF等，满足不同场景需求。'
  },
  { 
    name: 'SVG 编辑器', 
    icon: '/images/svg-generator.svg', 
    href: '/svg-generator',
    description: '在线创建和编辑SVG图形，轻松设计可缩放的矢量图像，适用于各种设计需求。'
  },
  { 
    name: '极简Logo设计', 
    icon: '/images/ai-logo-design.svg', 
    href: '/ai-logo-design',
    description: '使用AI技术快速生成简洁现代的logo设计，为您的品牌打造独特标识。'
  },
];

const faqs = [
  {
    question: "图像魔方是免费使用的吗？",
    answer: "是的，图像魔方的基础功能完全免费。我们可能会在未来推出一些高级功能，但核心工具将始终保持免费。"
  },
  {
    question: "我的图片数据安全吗？",
    answer: "我们非常重视用户隐私。所有的图片处理都在您的浏览器中进行，不会上传到我们的服务器。您的图片数据完全安全。"
  },
  {
    question: "图像魔方支持哪些图片格式？",
    answer: "我们支持大多数常见的图片格式，包括JPG、PNG、WEBP、GIF等。对于特定工具的格式支持，请查看相应工具页面的详细说明。"
  },
  {
    question: "如何报告问题或提出建议？",
    answer: "我们欢迎您的反馈！请通过页面顶部的GitHub图标访问我们的项目页面，在那里您可以提交问题或建议。"
  },
  {
    question: "图像魔方的AI功能是如何工作的？",
    answer: "我们的AI功能使用先进的机器学习模型，但所有处理都在本地进行。这既保护了您的隐私，又确保了快速的处理速度。"
  },
  {
    question: "如何联系作者？",
    answer: "您可以通过以下方式联系作者：微信：alchain，邮箱：alchaincyf@gmail.com"
  }
];

export default function Home() {
  return (
    <>
      <Head>
        <title>图像魔方 - 一站式在线图像处理工具 | img2046.com</title>
        <meta name="description" content="图像魔方提供多种免费在线图像处理工具,包括AI文生图、图片压缩、调整大小、格式转换等。轻松处理您的图片,提升工作效率。" />
      </Head>
      <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        <Typography variant="h1" component="h1" gutterBottom align="center" sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 'bold', mb: 4 }}>
          图像魔方：一站式图像处理工具
        </Typography>
        <Typography variant="h2" component="h2" gutterBottom align="center" sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' }, mb: 6 }}>
          轻松处理您的图片，提升工作效率
        </Typography>
        <Grid container spacing={4}>
          {tools.map((tool) => (
            <Grid item xs={12} sm={6} md={4} key={tool.name}>
              <Link href={tool.href} passHref style={{ textDecoration: 'none' }}>
                <Paper elevation={3} sx={{ 
                  p: 3, 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  transition: '0.3s', 
                  '&:hover': { 
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  } 
                }}>
                  <Image src={tool.icon} alt={tool.name} width={64} height={64} />
                  <Typography variant="h6" component="h3" align="center" sx={{ mt: 2, mb: 1 }}>
                    {tool.name}
                  </Typography>
                  <Typography variant="body2" align="center" sx={{ flexGrow: 1, color: 'text.secondary' }}>
                    {tool.description}
                  </Typography>
                </Paper>
              </Link>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 8 }}>
          <Typography variant="h3" component="h3" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, textAlign: 'center', mb: 4 }}>
            常见问题
          </Typography>
          {faqs.map((faq, index) => (
            <Accordion key={index} sx={{ mb: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}a-content`}
                id={`panel${index}a-header`}
              >
                <Typography sx={{ fontWeight: 'bold' }}>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </>
  );
}