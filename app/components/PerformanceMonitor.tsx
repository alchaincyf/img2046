'use client';

import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  lcp: number;
  cls: number;
  inp: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    lcp: 0,
    cls: 0,
    inp: 0
  });
  const [showMonitor, setShowMonitor] = useState(false);

  useEffect(() => {
    // 仅在开发环境或性能调试时显示
    const isDev = process.env.NODE_ENV === 'development';
    const showPerf = localStorage.getItem('show-perf-monitor') === 'true';
    
    if (!isDev && !showPerf) return;
    
    setShowMonitor(true);

    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 0;

    // FPS 监控
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
        
        setMetrics(prev => ({ ...prev, fps }));
      }
      
      requestAnimationFrame(measureFPS);
    };

    // Web Vitals 监控
    const observeWebVitals = () => {
      // LCP (Largest Contentful Paint)
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            const lcp = Math.round(lastEntry.startTime);
            setMetrics(prev => ({ ...prev, lcp }));
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // CLS (Cumulative Layout Shift)
          const clsObserver = new PerformanceObserver((list) => {
            let clsValue = 0;
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
            setMetrics(prev => ({ ...prev, cls: Math.round(clsValue * 1000) / 1000 }));
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

          // INP (Interaction to Next Paint) - 简化版本
          let maxINP = 0;
          const inpObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const inp = (entry as any).processingEnd - (entry as any).processingStart;
              if (inp > maxINP) {
                maxINP = inp;
                setMetrics(prev => ({ ...prev, inp: Math.round(inp) }));
              }
            }
          });
          inpObserver.observe({ entryTypes: ['event'] });
        } catch (error) {
          console.warn('Performance monitoring not fully supported:', error);
        }
      }
    };

    requestAnimationFrame(measureFPS);
    observeWebVitals();

    // 性能预警
    const checkPerformance = () => {
      // 如果 FPS < 30，禁用复杂动画
      if (fps < 30 && fps > 0) {
        document.body.classList.add('low-performance');
        console.warn('Low FPS detected, disabling complex animations');
      }

      // 如果 LCP > 2500ms，显示警告
      if (metrics.lcp > 2500) {
        console.warn('LCP is above 2.5s, consider optimizing');
      }

      // 如果 CLS > 0.1，显示警告
      if (metrics.cls > 0.1) {
        console.warn('CLS is above 0.1, layout shifts detected');
      }
    };

    const perfCheckInterval = setInterval(checkPerformance, 2000);

    return () => {
      clearInterval(perfCheckInterval);
    };
  }, []);

  if (!showMonitor) return null;

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return '#00ff00';
    if (fps >= 30) return '#ffaa00';
    return '#ff0000';
  };

  const getLCPColor = (lcp: number) => {
    if (lcp <= 2000) return '#00ff00';
    if (lcp <= 4000) return '#ffaa00';
    return '#ff0000';
  };

  const getCLSColor = (cls: number) => {
    if (cls <= 0.1) return '#00ff00';
    if (cls <= 0.25) return '#ffaa00';
    return '#ff0000';
  };

  const getINPColor = (inp: number) => {
    if (inp <= 200) return '#00ff00';
    if (inp <= 500) return '#ffaa00';
    return '#ff0000';
  };

  return (
    <div 
      className="performance-indicator show"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '12px 16px',
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '11px',
        zIndex: 9999,
        minWidth: '200px',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>Performance Monitor</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div>
          <span style={{ color: getFPSColor(metrics.fps) }}>FPS: {metrics.fps}</span>
        </div>
        <div>
          <span style={{ color: getLCPColor(metrics.lcp) }}>LCP: {metrics.lcp}ms</span>
        </div>
        <div>
          <span style={{ color: getCLSColor(metrics.cls) }}>CLS: {metrics.cls}</span>
        </div>
        <div>
          <span style={{ color: getINPColor(metrics.inp) }}>INP: {metrics.inp}ms</span>
        </div>
      </div>
      <div style={{ 
        marginTop: '8px', 
        fontSize: '9px', 
        opacity: 0.7,
        borderTop: '1px solid rgba(255,255,255,0.2)',
        paddingTop: '4px'
      }}>
        Target: LCP≤2s, INP≤200ms, CLS≤0.1
      </div>
    </div>
  );
}
