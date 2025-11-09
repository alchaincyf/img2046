'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';

const tools = [
  {
    title: '自由画布',
    description: '无限创意空间，自由编辑图像',
    href: '/free-canvas',
    icon: '/images/free-canvas.svg',
    gradient: 1,
  },
  {
    title: '文字卡片生成',
    description: '快速创建精美文字卡片',
    href: '/text-card-generator',
    icon: '/images/text-card-generator.svg',
    gradient: 2,
  },
  {
    title: '图片压缩',
    description: '智能压缩，保持高质量',
    href: '/compress',
    icon: '/images/compress.svg',
    gradient: 3,
  },
  {
    title: '调整大小',
    description: '精确调整图片尺寸',
    href: '/resize',
    icon: '/images/resize.svg',
    gradient: 4,
  },
  {
    title: '格式转换',
    description: 'JPG、PNG、WEBP互转',
    href: '/format-convert',
    icon: '/images/format-convert.svg',
    gradient: 1,
  },
  {
    title: 'SVG编辑器',
    description: '矢量图形在线编辑',
    href: '/svg-generator',
    icon: '/images/svg-generator.svg',
    gradient: 2,
  },
  {
    title: 'Logo设计',
    description: '极简风格Logo生成',
    href: '/ai-logo-design',
    icon: '/images/ai-logo-design.svg',
    gradient: 3,
  },
  {
    title: '圆角处理',
    description: '为图片添加圆角效果',
    href: '/rounded-corners',
    icon: '/images/rounded-corners.svg',
    gradient: 4,
  },
];

export default function ModernHomePage() {
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: true });

  return (
    <>
      {/* Hero区域 - Rams极简主义 */}
      <section ref={heroRef} className="py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <h1 className="text-display mb-6">
            图像魔方
          </h1>
          <p className="text-h3 text-gray-600 mb-8 max-w-2xl">
            功能驱动的图像处理工具集。
            <br />
            少即是多，形式追随功能。
          </p>
          
          {/* CTA按钮组 */}
          <div className="flex flex-wrap gap-4">
            <Link href="/free-canvas" className="rams-button rams-button--primary">
              开始创作
            </Link>
            <a 
              href="https://github.com/alchaincyf/img2046" 
              target="_blank" 
              rel="noopener noreferrer"
              className="rams-button"
            >
              查看源码
            </a>
          </div>
        </motion.div>

        {/* 数据可视化装饰 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute inset-0 pointer-events-none"
        >
          <svg className="w-full h-full" viewBox="0 0 1440 600">
            <defs>
              <linearGradient id="data-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00D9FF" />
                <stop offset="50%" stopColor="#FF00FF" />
                <stop offset="100%" stopColor="#00FF88" />
              </linearGradient>
            </defs>
            <path
              d="M0,300 Q360,200 720,300 T1440,300"
              stroke="url(#data-gradient)"
              strokeWidth="1"
              fill="none"
              opacity="0.5"
            />
          </svg>
        </motion.div>
      </section>

      {/* 瑞士分割线 */}
      <div className="swiss-divider swiss-divider--accent mb-12" />

      {/* 工具网格 - Müller-Brockmann网格系统 */}
      <section className="py-8">
        <h2 className="text-h2 mb-8">核心功能</h2>
        
        <div className="tool-grid">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4,
                delay: index * 0.05,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              <Link href={tool.href}>
                <div className="tool-card group cursor-pointer">
                  {/* 渐变顶部边框 */}
                  <div 
                    className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(90deg, 
                        var(--anadol-gradient-${tool.gradient}) 0%, 
                        var(--anadol-gradient-${(tool.gradient % 4) + 1}) 100%)`
                    }}
                  />
                  
                  {/* 图标 */}
                  <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
                    <Image 
                      src={tool.icon} 
                      alt="" 
                      width={24} 
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  
                  {/* 标题和描述 */}
                  <h3 className="text-h3 mb-2">{tool.title}</h3>
                  <p className="text-caption">{tool.description}</p>
                  
                  {/* 箭头指示器 */}
                  <div className="mt-4 flex items-center text-sm font-medium text-gray-500 group-hover:text-black transition-colors">
                    <span>使用工具</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 16 16">
                      <path 
                        d="M6 12L10 8L6 4" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 设计原则说明 - Rams十大原则 */}
      <section className="py-16 mt-16 border-t border-gray-200">
        <h2 className="text-h2 mb-8">设计理念</h2>
        
        <div className="swiss-grid">
          <div className="span-4 md:span-2">
            <div className="mb-8">
              <h3 className="text-mono text-sm font-bold mb-2 text-red-600">01</h3>
              <h4 className="font-semibold mb-1">创新</h4>
              <p className="text-caption">好的设计是创新的</p>
            </div>
          </div>
          
          <div className="span-4 md:span-2">
            <div className="mb-8">
              <h3 className="text-mono text-sm font-bold mb-2 text-red-600">02</h3>
              <h4 className="font-semibold mb-1">实用</h4>
              <p className="text-caption">好的设计是实用的</p>
            </div>
          </div>
          
          <div className="span-4 md:span-2">
            <div className="mb-8">
              <h3 className="text-mono text-sm font-bold mb-2 text-red-600">03</h3>
              <h4 className="font-semibold mb-1">美观</h4>
              <p className="text-caption">好的设计是美观的</p>
            </div>
          </div>
          
          <div className="span-4 md:span-2">
            <div className="mb-8">
              <h3 className="text-mono text-sm font-bold mb-2 text-red-600">04</h3>
              <h4 className="font-semibold mb-1">易懂</h4>
              <p className="text-caption">好的设计是易懂的</p>
            </div>
          </div>
          
          <div className="span-4 md:span-2">
            <div className="mb-8">
              <h3 className="text-mono text-sm font-bold mb-2 text-red-600">05</h3>
              <h4 className="font-semibold mb-1">谦逊</h4>
              <p className="text-caption">好的设计是谦逊的</p>
            </div>
          </div>
          
          <div className="span-4 md:span-2">
            <div className="mb-8">
              <h3 className="text-mono text-sm font-bold mb-2 text-red-600">10</h3>
              <h4 className="font-semibold mb-1">极简</h4>
              <p className="text-caption">好的设计是尽可能少的设计</p>
            </div>
          </div>
        </div>
      </section>

      {/* 技术栈说明 */}
      <section className="py-8 swiss-card">
        <h3 className="swiss-card__title">技术实现</h3>
        <div className="swiss-card__content">
          <p className="mb-4">
            本项目融合了三位大师的设计理念：
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-red-600 rounded-full mt-1.5 mr-3 flex-shrink-0" />
              <span><strong>Dieter Rams</strong>：功能主义，极简10原则</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0" />
              <span><strong>Josef Müller-Brockmann</strong>：瑞士网格系统</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mt-1.5 mr-3 flex-shrink-0" />
              <span><strong>Refik Anadol</strong>：数据美学，生成艺术</span>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}