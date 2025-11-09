'use client'

import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
import { 
  Palette, 
  Crop, 
  Image as ImageIcon, 
  RotateCw, 
  FileText, 
  Pen, 
  Lightbulb, 
  CornerRightDown,
  Search,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';

const tools = [
  { 
    name: '自由画布', 
    icon: <Palette className="icon" />,
    href: '/free-canvas',
    description: '无限创作空间，支持多种绘图工具',
    category: 'creative',
    isNew: true,
    keywords: ['绘图', '画布', '创作', '设计']
  },
  { 
    name: '文字卡片', 
    icon: <FileText className="icon" />,
    href: '/text-card-generator',
    description: '快速生成精美的文字卡片',
    category: 'creative',
    keywords: ['文字', '卡片', '排版', '设计']
  },
  { 
    name: 'Logo设计', 
    icon: <Lightbulb className="icon" />,
    href: '/ai-logo-design',
    description: 'AI驱动的品牌标识生成器',
    category: 'creative',
    keywords: ['Logo', '品牌', 'AI', '标识']
  },
  { 
    name: 'SVG编辑', 
    icon: <Pen className="icon" />,
    href: '/svg-generator',
    description: '矢量图形编辑与生成工具',
    category: 'creative',
    keywords: ['SVG', '矢量', '图形', '编辑']
  },
  { 
    name: '图片压缩', 
    icon: <ImageIcon className="icon" />,
    href: '/compress',
    description: '智能压缩，保持最佳画质',
    category: 'utility',
    keywords: ['压缩', '优化', '体积', '画质']
  },
  { 
    name: '尺寸调整', 
    icon: <Crop className="icon" />,
    href: '/resize',
    description: '批量调整图片尺寸',
    category: 'utility',
    keywords: ['尺寸', '调整', '批量', '缩放']
  },
  { 
    name: '格式转换', 
    icon: <RotateCw className="icon" />,
    href: '/format-convert',
    description: '支持所有主流图片格式',
    category: 'utility',
    keywords: ['格式', '转换', 'JPG', 'PNG', 'WEBP']
  },
  { 
    name: '圆角处理', 
    icon: <CornerRightDown className="icon" />,
    href: '/rounded-corners',
    description: '为图片添加圆角效果',
    category: 'utility',
    keywords: ['圆角', '边框', '装饰', '美化']
  }
];

const categories = [
  { id: 'all', name: '全部工具', icon: <Grid3X3 className="icon icon--sm" /> },
  { id: 'creative', name: '创意工具', icon: <Palette className="icon icon--sm" /> },
  { id: 'utility', name: '实用工具', icon: <ImageIcon className="icon icon--sm" /> }
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // 筛选工具
  const filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Head>
        <title>图像魔方 - 专业图像处理工具集 | img2046.com</title>
        <meta name="description" content="图像魔方 - 集创意设计与实用工具于一体的专业图像处理平台。支持图片压缩、格式转换、尺寸调整、Logo设计等多种功能。" />
        <meta name="keywords" content="图片处理,图像编辑,Logo设计,格式转换,图片压缩,在线工具" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      
      {/* 导航栏 */}
      <nav className="nav">
        <Container>
          <div className="nav__inner">
            <Link href="/" className="nav__logo">
              图像魔方
            </Link>
            <ul className="nav__menu">
              <li><Link href="/" className="nav__link nav__link--active">首页</Link></li>
              <li><Link href="/about" className="nav__link">关于</Link></li>
              <li><Link href="https://github.com/alchaincyf/img2046" className="nav__link" target="_blank" rel="noopener noreferrer">GitHub</Link></li>
            </ul>
          </div>
        </Container>
      </nav>

      {/* 跳过链接 - 可访问性 */}
      <a href="#main-content" className="skip-link">
        跳转到主要内容
      </a>

      <main>
        {/* 英雄区域 */}
        <section className="hero">
          <Container>
            <div style={{ textAlign: 'center', padding: '80px 0 60px' }}>
              <h1 style={{ 
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                fontWeight: 700,
                lineHeight: 1.1,
                marginBottom: '24px',
                color: 'var(--color-text-primary)'
              }}>
                专业图像处理工具集
              </h1>
              <p style={{
                fontSize: '18px',
                color: 'var(--color-text-secondary)',
                marginBottom: '40px',
                maxWidth: '600px',
                margin: '0 auto 40px',
                lineHeight: 1.6
              }}>
                集创意设计与实用工具于一体，为您的图像处理需求提供完整解决方案
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/free-canvas" className="button button--primary">
                  开始创作
                </Link>
                <a 
                  href="https://github.com/alchaincyf/img2046" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="button"
                >
                  查看源码
                </a>
              </div>
            </div>
          </Container>
        </section>

        {/* 工具区域 */}
        <section id="main-content" style={{ padding: '60px 0' }}>
          <Container>
            {/* 工具筛选 */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '24px',
                marginBottom: '32px'
              }}>
                {/* 搜索框 */}
                <div style={{ position: 'relative', maxWidth: '400px' }}>
                  <Search className="icon icon--sm" style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-secondary)'
                  }} />
                  <input
                    type="search"
                    placeholder="搜索工具..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--border-radius)',
                      fontSize: 'var(--font-size-base)',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-primary)'
                    }}
                  />
                </div>

                {/* 分类和视图切换 */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  {/* 分类筛选 */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`button ${selectedCategory === category.id ? 'button--primary' : ''}`}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          fontSize: '14px'
                        }}
                      >
                        {category.icon}
                        {category.name}
                      </button>
                    ))}
                  </div>

                  {/* 视图切换 */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`button ${viewMode === 'grid' ? 'button--primary' : ''}`}
                      style={{ padding: '8px' }}
                      title="网格视图"
                    >
                      <Grid3X3 className="icon icon--sm" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`button ${viewMode === 'list' ? 'button--primary' : ''}`}
                      style={{ padding: '8px' }}
                      title="列表视图"
                    >
                      <List className="icon icon--sm" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 结果计数 */}
              <p style={{ 
                color: 'var(--color-text-secondary)', 
                fontSize: 'var(--font-size-sm)',
                marginBottom: '24px'
              }}>
                找到 {filteredTools.length} 个工具
              </p>
            </div>

            {/* 工具网格 */}
            <div className={viewMode === 'grid' ? 'grid grid--4' : 'grid'} style={{
              gap: viewMode === 'list' ? '12px' : 'var(--grid-gutter)'
            }}>
              {filteredTools.map((tool) => (
                <Link 
                  key={tool.name} 
                  href={tool.href} 
                  className={`tool-card ${viewMode === 'list' ? 'tool-card--list' : ''}`}
                  style={viewMode === 'list' ? {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 24px'
                  } : {}}
                >
                  {tool.isNew && (
                    <span style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'var(--color-danger)',
                      color: 'white',
                      padding: '2px 6px',
                      fontSize: '10px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      borderRadius: '2px',
                      zIndex: 2
                    }}>
                      NEW
                    </span>
                  )}
                  
                  <div className={`tool-card__icon ${viewMode === 'list' ? 'tool-card__icon--list' : ''}`} 
                    style={viewMode === 'list' ? { 
                      margin: 0,
                      width: '40px',
                      height: '40px',
                      flexShrink: 0
                    } : {}}>
                    {tool.icon}
                  </div>
                  
                  <div style={viewMode === 'list' ? { flex: 1 } : {}}>
                    <h3 className="tool-card__title" style={viewMode === 'list' ? { 
                      marginBottom: '4px',
                      fontSize: 'var(--font-size-base)'
                    } : {}}>
                      {tool.name}
                    </h3>
                    
                    <p className="tool-card__description">
                      {tool.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* 无结果提示 */}
            {filteredTools.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                color: 'var(--color-text-secondary)'
              }}>
                <Filter className="icon icon--lg" style={{ 
                  marginBottom: '16px',
                  opacity: 0.5
                }} />
                <h3 style={{ 
                  fontSize: 'var(--font-size-lg)',
                  marginBottom: '8px'
                }}>
                  未找到匹配的工具
                </h3>
                <p>尝试调整搜索条件或选择其他分类</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="button"
                  style={{ marginTop: '16px' }}
                >
                  重置筛选
                </button>
              </div>
            )}
          </Container>
        </section>

        {/* 特性介绍 */}
        <section style={{ 
          backgroundColor: 'var(--color-surface)', 
          padding: '80px 0',
          borderTop: '1px solid var(--color-border)'
        }}>
          <Container>
            <h2 style={{ 
              textAlign: 'center',
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 600,
              marginBottom: '48px',
              color: 'var(--color-text-primary)'
            }}>
              为什么选择图像魔方？
            </h2>
            
            <div className="grid grid--3">
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'var(--color-primary)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'white'
                }}>
                  <ImageIcon className="icon" />
                </div>
                <h3 style={{ 
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 600,
                  marginBottom: '12px'
                }}>
                  本地处理
                </h3>
                <p style={{ 
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6
                }}>
                  所有图片处理都在浏览器本地完成，确保您的数据隐私安全
                </p>
              </div>
              
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'var(--color-success)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'white'
                }}>
                  <Lightbulb className="icon" />
                </div>
                <h3 style={{ 
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 600,
                  marginBottom: '12px'
                }}>
                  完全免费
                </h3>
                <p style={{ 
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6
                }}>
                  所有功能永久免费，无需注册账户，即开即用
                </p>
              </div>
              
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'var(--color-warning)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'white'
                }}>
                  <RotateCw className="icon" />
                </div>
                <h3 style={{ 
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 600,
                  marginBottom: '12px'
                }}>
                  持续更新
                </h3>
                <p style={{ 
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6
                }}>
                  定期添加新功能，根据用户反馈不断优化体验
                </p>
              </div>
            </div>
          </Container>
        </section>
      </main>

      {/* 页脚 */}
      <footer style={{ 
        backgroundColor: 'var(--color-text-primary)',
        color: 'var(--color-background)',
        padding: '40px 0',
        textAlign: 'center'
      }}>
        <Container>
          <p style={{ marginBottom: '16px' }}>
            © 2024 图像魔方 - 专业图像处理工具集
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <a 
              href="https://github.com/alchaincyf/img2046" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              GitHub
            </a>
            <a 
              href="mailto:alchaincyf@gmail.com"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              联系我们
            </a>
          </div>
        </Container>
      </footer>
    </>
  );
}