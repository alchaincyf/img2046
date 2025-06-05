'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import './styles/homepage.css';

const tools = [
  { 
    name: 'AI 文生图', 
    icon: '/images/ai-image-generator.svg', 
    href: '/ai-image-generator',
    description: '通过文字描述生成独特的AI图像，激发创意灵感',
    gradient: 'from-purple-500 to-pink-500'
  },
  { 
    name: '文字卡片生成', 
    icon: '/images/text-card-generator.svg', 
    href: '/text-card-generator',
    description: '创建精美的文字卡片，自定义字体、颜色和背景',
    gradient: 'from-blue-500 to-cyan-500'
  },
  { 
    name: '图片压缩', 
    icon: '/images/compress.svg', 
    href: '/compress',
    description: '高效压缩图片文件大小，保持画质的同时优化加载速度',
    gradient: 'from-green-500 to-emerald-500'
  },
  { 
    name: '调整大小', 
    icon: '/images/resize.svg', 
    href: '/resize',
    description: '快速调整图片尺寸，保持比例或自定义大小',
    gradient: 'from-orange-500 to-red-500'
  },
  { 
    name: '图片格式转换', 
    icon: '/images/format-convert.svg', 
    href: '/format-convert',
    description: '轻松将图片转换为各种格式，支持多种图片类型',
    gradient: 'from-indigo-500 to-purple-500'
  },
  { 
    name: 'SVG 编辑器', 
    icon: '/images/svg-generator.svg', 
    href: '/svg-generator',
    description: '在线创建和编辑SVG图形，设计可缩放的矢量图像',
    gradient: 'from-teal-500 to-blue-500'
  },
  { 
    name: '极简Logo设计', 
    icon: '/images/ai-logo-design.svg', 
    href: '/ai-logo-design',
    description: '使用AI技术快速生成简洁现代的logo设计',
    gradient: 'from-rose-500 to-pink-500'
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <Head>
        <title>图像魔方 - 一站式在线图像处理工具 | img2046.com</title>
        <meta name="description" content="图像魔方提供多种免费在线图像处理工具,包括AI文生图、图片压缩、调整大小、格式转换等。轻松处理您的图片,提升工作效率。" />
      </Head>
      
      <div className="homepage">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <span>✨ 全新体验</span>
            </div>
            <h1 className="hero-title">
              图像魔方
              <span className="hero-subtitle">专业图像处理工具</span>
            </h1>
            <p className="hero-description">
              集AI智能、专业处理、便捷操作于一体的图像处理平台<br />
              让创意触手可及，让工作更高效
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">100万+</span>
                <span className="stat-label">用户信赖</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">7+</span>
                <span className="stat-label">专业工具</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">隐私保护</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Section */}
        <div className="tools-section">
          <div className="section-header">
            <h2 className="section-title">专业工具</h2>
            <p className="section-subtitle">为您精心打造的图像处理解决方案</p>
          </div>
          
          <div className="tools-grid">
            {tools.map((tool, index) => (
              <Link href={tool.href} key={tool.name} className="tool-card-link">
                <div 
                  className="tool-card"
                  style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}
                >
                  <div className={`tool-icon-wrapper bg-gradient-to-br ${tool.gradient}`}>
                    <Image 
                      src={tool.icon} 
                      alt={tool.name} 
                      width={32} 
                      height={32}
                      className="tool-icon"
                    />
                  </div>
                  <div className="tool-content">
                    <h3 className="tool-name">{tool.name}</h3>
                    <p className="tool-description">{tool.description}</p>
                  </div>
                  <div className="tool-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path 
                        d="M7 17L17 7M17 7H7M17 7V17" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <div className="section-header">
            <h2 className="section-title">常见问题</h2>
            <p className="section-subtitle">快速了解图像魔方的使用方法</p>
          </div>
          
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${openFaq === index ? 'open' : ''}`}>
                <div className="faq-question" onClick={() => toggleFaq(index)}>
                  {faq.question}
                  <svg 
                    className={`faq-icon ${openFaq === index ? 'rotated' : ''}`} 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none"
                  >
                    <path 
                      d="M6 9L12 15L18 9" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {openFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">立即开始创作</h2>
            <p className="cta-description">
              选择您需要的工具，开启高效的图像处理之旅
            </p>
            <div className="cta-buttons">
              <Link href="/ai-image-generator" className="cta-button primary">
                开始创作
              </Link>
              <Link href="#tools" className="cta-button secondary">
                浏览工具
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}