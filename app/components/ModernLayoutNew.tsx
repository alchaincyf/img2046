'use client'

import React from 'react';
import Link from 'next/link';
import { Container } from '@mui/material';
import { Home, Github, Mail, Info } from 'lucide-react';

interface ModernLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function ModernLayout({ children, title, description }: ModernLayoutProps) {
  return (
    <div className="modern-layout">
      {/* 导航栏 */}
      <nav className="nav">
        <Container>
          <div className="nav__inner">
            <Link href="/" className="nav__logo">
              图像魔方
            </Link>
            <ul className="nav__menu">
              <li>
                <Link href="/" className="nav__link">
                  <Home className="icon icon--sm" />
                  首页
                </Link>
              </li>
              <li>
                <Link href="/about" className="nav__link">
                  <Info className="icon icon--sm" />
                  关于
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/alchaincyf/img2046" 
                  className="nav__link" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Github className="icon icon--sm" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </Container>
      </nav>

      {/* 主要内容 */}
      <main className="main">
        {title && (
          <section className="hero hero--minimal">
            <Container>
              <h1 className="text-4xl font-bold">{title}</h1>
              {description && (
                <p className="text-lg text-secondary mt-4">{description}</p>
              )}
            </Container>
          </section>
        )}
        
        {children}
      </main>

      {/* 页脚 */}
      <footer className="footer">
        <Container>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              © 2024 图像魔方 - 专业图像处理工具集
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a 
                href="https://github.com/alchaincyf/img2046" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer__link"
              >
                <Github className="icon icon--sm" />
              </a>
              <a 
                href="mailto:alchaincyf@gmail.com"
                className="footer__link"
              >
                <Mail className="icon icon--sm" />
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}