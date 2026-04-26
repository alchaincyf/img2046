'use client';

import { usePathname } from 'next/navigation';
import Layout from './Layout';
import Footer from './Footer';
import PerformanceMonitor from './PerformanceMonitor';
import FloatingAd from './FloatingAd';

/**
 * 主页 (/) 跳过原有 Layout（drawer/AppBar）+ Footer + FloatingAd，
 * 让 Vignelli 风格的主页内容裸渲染。
 * 其他工具页保持原有 chrome 不变。
 */
export default function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = pathname === '/' || pathname === '';

  if (bare) {
    return (
      <>
        {children}
        <PerformanceMonitor />
      </>
    );
  }

  return (
    <>
      <Layout>{children}</Layout>
      <Footer />
      <PerformanceMonitor />
      <FloatingAd />
    </>
  );
}
