'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { text: '首页', icon: '/images/home.svg', href: '/' },
  { text: '自由画布', icon: '/images/free-canvas.svg', href: '/free-canvas' },
  { text: '文字卡片', icon: '/images/text-card-generator.svg', href: '/text-card-generator' },
  { text: '图片压缩', icon: '/images/compress.svg', href: '/compress' },
  { text: '调整大小', icon: '/images/resize.svg', href: '/resize' },
  { text: '格式转换', icon: '/images/format-convert.svg', href: '/format-convert' },
  { text: 'SVG编辑器', icon: '/images/svg-generator.svg', href: '/svg-generator' },
  { text: 'Logo设计', icon: '/images/ai-logo-design.svg', href: '/ai-logo-design' },
];

export default function ModernLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Anadol风格的鼠标追踪效果
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen relative"
      style={{
        '--mouse-x': `${mousePosition.x}%`,
        '--mouse-y': `${mousePosition.y}%`,
      } as React.CSSProperties}
    >
      {/* 数据流背景 */}
      <div className="data-flow-bg" />
      
      {/* 跳转链接 - 可访问性 */}
      <a href="#main-content" className="skip-link">
        跳转到主要内容
      </a>

      {/* Rams风格导航栏 */}
      <nav className="rams-nav swiss-grid" role="navigation" aria-label="主导航">
        <div className="span-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="rams-nav__logo flex items-center gap-2">
            <Image 
              src="/image-tools-icon.svg" 
              alt="图像魔方" 
              width={32} 
              height={32}
              className="w-8 h-8"
            />
            <span className="hidden sm:inline">图像魔方</span>
          </Link>

          {/* 桌面菜单 */}
          <ul className="rams-nav__menu hidden md:flex">
            {menuItems.slice(0, 6).map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`rams-nav__link ${pathname === item.href ? 'rams-nav__link--active' : ''}`}
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>

          {/* 移动菜单按钮 */}
          <button
            className="md:hidden rams-button p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="菜单"
            aria-expanded={mobileMenuOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path 
                d={mobileMenuOpen ? "M18 6L6 18M6 6l12 12" : "M3 12h18M3 6h18M3 18h18"}
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* 移动菜单 - 瑞士网格风格 */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-x-0 top-16 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200"
          >
            <ul className="py-4">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                      pathname === item.href 
                        ? 'bg-gray-100 text-red-600 border-l-4 border-red-600' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Image 
                      src={item.icon} 
                      alt="" 
                      width={20} 
                      height={20}
                      className="w-5 h-5 opacity-60"
                    />
                    <span className="font-medium">{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主内容区 - Müller-Brockmann网格 */}
      <main 
        id="main-content"
        className="swiss-grid pt-8 pb-16"
        role="main"
      >
        <div className="span-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="data-visualization"
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* 极简页脚 */}
      <footer className="swiss-grid py-8 border-t border-gray-200 mt-auto">
        <div className="span-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © 2024 图像魔方. 遵循功能主义设计原则.
            </p>
            <div className="flex gap-6">
              <a 
                href="https://github.com/alchaincyf/img2046" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                GitHub
              </a>
              <a 
                href="https://www.bookai.top/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                BookAI
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* 减少动效模式提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-4 right-4 z-40"
      >
        <div className="text-xs text-gray-400 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
          支持 prefers-reduced-motion
        </div>
      </motion.div>
    </div>
  );
}