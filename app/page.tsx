'use client';

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Tabs,
  Tab,
  Chip,
  InputAdornment
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import Head from 'next/head';
import Script from 'next/script';

interface Tool {
  name: string;
  icon: string;
  href: string;
  description: string;
  isNew?: boolean;
  isPopular?: boolean;
  category: string;
}

const tools: Tool[] = [
  {
    name: '图片压缩',
    icon: '/images/compress.svg',
    href: '/compress',
    description: '智能图片压缩，支持PNG、JPEG、WebP格式，自动检测透明背景，保留原图质量。',
    isPopular: true,
    category: '基础编辑'
  },
  {
    name: '调整大小',
    icon: '/images/resize.svg',
    href: '/resize',
    description: '快速调整图片尺寸，保持比例或自定义大小，适应各种平台要求。',
    category: '基础编辑'
  },
  {
    name: '图片格式转换',
    icon: '/images/format-convert.svg',
    href: '/format-convert',
    description: '轻松将图片转换为各种格式，支持JPG、PNG、WEBP、GIF等，满足不同场景需求。',
    isPopular: true,
    category: '格式转换'
  },
  {
    name: 'SVG 编辑器',
    icon: '/images/svg-generator.svg',
    href: '/svg-generator',
    description: '在线创建和编辑SVG图形，轻松设计可缩放的矢量图像，适用于各种设计需求。',
    category: '创意设计'
  },
  {
    name: '极简Logo设计',
    icon: '/images/ai-logo-design.svg',
    href: '/ai-logo-design',
    description: '使用AI技术快速生成简洁现代的logo设计，为您的品牌打造独特标识。',
    category: 'AI工具'
  },
  {
    name: '圆角处理',
    icon: '/images/rounded-corners.svg',
    href: '/rounded-corners',
    description: '为您的图片添加圆角效果，支持图片裁剪和圆角程度调整，让图片更具现代感。',
    category: '基础编辑'
  },
  {
    name: '自由画布',
    icon: '/images/free-canvas.svg',
    href: '/free-canvas',
    description: '无限画布创作空间，支持图片编辑、绘图和多元素组合，打造专业的创意作品。',
    isNew: true,
    isPopular: true,
    category: 'AI工具'
  },
  {
    name: '文字卡片生成',
    icon: '/images/text-card-generator.svg',
    href: '/text-card-generator',
    description: '创建精美的文字卡片，自定义字体、颜色和背景，适合社交媒体分享和营销使用。',
    category: '创意设计'
  },
];

const faqs = [
  {
    question: "图像魔方是免费使用的吗？",
    answer: "是的，图像魔方的所有功能完全免费。所有图片处理都在您的浏览器本地完成，无需注册账号，保护您的隐私。"
  },
  {
    question: "我的图片数据安全吗？",
    answer: "非常安全！所有的图片处理都在您的浏览器中进行，不会上传到我们的服务器。您的图片数据完全保留在本地，我们无法访问。"
  },
  {
    question: "图像魔方支持哪些图片格式？",
    answer: "我们支持大多数常见的图片格式，包括JPG、PNG、WEBP、GIF、SVG等。压缩工具还支持智能格式转换，自动选择最佳输出格式。"
  },
  {
    question: "如何报告问题或提出建议？",
    answer: "我们欢迎您的反馈！请通过页面顶部的GitHub图标访问我们的项目页面，在那里您可以提交问题或建议。"
  },
  {
    question: "为什么选择图像魔方而不是其他工具？",
    answer: "图像魔方的优势：(1) 完全免费无广告 (2) 本地处理保护隐私 (3) 支持批量操作 (4) 智能建议优化参数 (5) 历史记录方便回溯"
  },
  {
    question: "图像魔方的AI功能是如何工作的？",
    answer: "我们的AI功能使用先进的机器学习模型，部分处理在本地完成，部分使用云端API。这既保护了您的隐私，又确保了高质量的结果。"
  },
  {
    question: "如何联系作者？",
    answer: "您可以通过以下方式联系作者：微信：alchain，邮箱：alchaincyf@gmail.com"
  }
];

const categories = ['全部', 'AI工具', '基础编辑', '格式转换', '创意设计'];

// FAQ JSON-LD 结构化数据
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};

export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('全部');

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCategoryChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
  };

  return (
    <>
      <Head>
        <title>图像魔方 - 一站式在线图像处理工具 | img2046.com</title>
        <meta name="description" content="图像魔方提供多种免费在线图像处理工具,包括图片压缩、格式转换、SVG编辑、自由画布等。所有处理在本地完成,保护您的隐私。" />
      </Head>

      {/* FAQ 结构化数据 */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        {/* 标题区 */}
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          align="center"
          sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 'bold', mb: 2 }}
        >
          图像魔方：一站式图像处理工具
        </Typography>
        <Typography
          variant="h2"
          component="h2"
          gutterBottom
          align="center"
          sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' }, mb: 4, color: 'text.secondary' }}
        >
          免费 · 安全 · 高效 · 智能
        </Typography>

        {/* 搜索框 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <TextField
            placeholder="搜索工具..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: { xs: '100%', sm: '500px' },
              '& .MuiOutlinedInput-root': {
                borderRadius: '50px',
                backgroundColor: 'background.paper'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* 分类标签 */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="工具分类"
          >
            {categories.map(category => (
              <Tab key={category} label={category} value={category} />
            ))}
          </Tabs>
        </Box>

        {/* 工具卡片网格 */}
        <Grid container spacing={4}>
          {filteredTools.map((tool) => (
            <Grid item xs={12} sm={6} md={4} key={tool.name}>
              <Link href={tool.href} passHref style={{ textDecoration: 'none' }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 8
                    }
                  }}
                >
                  {/* 标签 */}
                  <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 0.5 }}>
                    {tool.isNew && (
                      <Chip
                        label="NEW"
                        color="secondary"
                        size="small"
                        sx={{ height: '20px', fontSize: '0.7rem', fontWeight: 'bold' }}
                      />
                    )}
                    {tool.isPopular && (
                      <Chip
                        label="🔥 热门"
                        color="primary"
                        size="small"
                        sx={{ height: '20px', fontSize: '0.7rem', fontWeight: 'bold' }}
                      />
                    )}
                  </Box>

                  <Image
                    src={tool.icon}
                    alt={tool.name}
                    width={64}
                    height={64}
                    style={{ width: 64, height: 64 }}
                  />
                  <Typography
                    variant="h6"
                    component="h3"
                    align="center"
                    sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}
                  >
                    {tool.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{ flexGrow: 1, color: 'text.secondary', lineHeight: 1.6 }}
                  >
                    {tool.description}
                  </Typography>
                  <Chip
                    label={tool.category}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 2, fontSize: '0.7rem' }}
                  />
                </Paper>
              </Link>
            </Grid>
          ))}
        </Grid>

        {/* 无结果提示 */}
        {filteredTools.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              未找到匹配的工具
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              试试搜索其他关键词或切换分类
            </Typography>
          </Box>
        )}

        {/* FAQ 区域 */}
        <Box sx={{ mt: 8 }}>
          <Typography
            variant="h3"
            component="h3"
            gutterBottom
            sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, textAlign: 'center', mb: 4, fontWeight: 'bold' }}
          >
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
                <Typography sx={{ lineHeight: 1.8 }}>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* 底部统计 */}
        <Box sx={{ mt: 8, textAlign: 'center', py: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                {tools.length}+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                专业工具
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                100%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                免费使用
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                0
              </Typography>
              <Typography variant="body1" color="text.secondary">
                数据上传
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
