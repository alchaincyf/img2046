'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';

interface Tool {
  num: string;
  name: string;
  en: string;
  href: string;
  desc: string;
  category: 'Basic' | 'Format' | 'Design' | 'AI';
  catCN: string;
  badges?: ('POPULAR' | 'NEW')[];
}

const tools: Tool[] = [
  { num: '01', name: '图片压缩', en: 'Image Compression', href: '/compress', desc: '智能压缩 PNG · JPEG · WebP。自动检测透明背景，保留原图质量。', category: 'Basic', catCN: '基础编辑', badges: ['POPULAR'] },
  { num: '02', name: '调整大小', en: 'Resize', href: '/resize', desc: '保持比例或自定义大小，适应小红书、X、B 站、公众号等各种平台规格。', category: 'Basic', catCN: '基础编辑' },
  { num: '03', name: '格式转换', en: 'Format Convert', href: '/format-convert', desc: 'JPG · PNG · WEBP · GIF 互转，无损压缩，批量处理。', category: 'Format', catCN: '格式转换', badges: ['POPULAR'] },
  { num: '04', name: 'SVG 编辑器', en: 'SVG Editor', href: '/svg-generator', desc: '在线创建和编辑 SVG 矢量图形，导出 React 组件。', category: 'Design', catCN: '创意设计' },
  { num: '05', name: '极简 Logo', en: 'Logo Design', href: '/ai-logo-design', desc: 'AI 快速生成简洁现代 logo。下载 SVG / PNG 多格式。', category: 'AI', catCN: 'AI 工具' },
  { num: '06', name: '圆角处理', en: 'Rounded Corners', href: '/rounded-corners', desc: '为图片添加圆角效果。自定义半径、裁剪、批量处理。', category: 'Basic', catCN: '基础编辑' },
  { num: '07', name: '自由画布', en: 'Free Canvas', href: '/free-canvas', desc: '无限创意画布，自由组合图层。从文字到图像，从草图到成品。', category: 'AI', catCN: 'AI 工具', badges: ['NEW', 'POPULAR'] },
  { num: '08', name: '文字卡片', en: 'Text Card', href: '/text-card-generator', desc: '把文字变成可分享的精美卡片。100+ 模板，一键导出。', category: 'Design', catCN: '创意设计' },
  { num: '09', name: 'AIDEX', en: 'AI Tool Index', href: '/aidex/', desc: '精选 AI 工具索引。按场景分类，含上手难度与价格区间。', category: 'AI', catCN: 'AI 工具', badges: ['NEW'] },
];

const filters = [
  { key: 'all', label: 'All', cnt: 9 },
  { key: 'Basic', label: 'Basic', cnt: 3 },
  { key: 'Format', label: 'Format', cnt: 1 },
  { key: 'Design', label: 'Design', cnt: 2 },
  { key: 'AI', label: 'AI', cnt: 3 },
];

const stats = [
  { num: '01', metaLabel: 'TOOLS', label: 'Image · AI · Design', mini: '从压缩到 SVG · 全免费', big: '9', red: '+' },
  { num: '02', metaLabel: 'PRIVACY', label: 'Zero Upload', mini: '本地处理 · 数据不离开你', big: '0', red: '' },
  { num: '03', metaLabel: 'PRICING', label: 'Free Forever', mini: '所有工具 · 永久免费', big: '100', red: '%' },
  { num: '04', metaLabel: 'REACH', label: 'Across Channels', mini: '公众号 · X · B 站 · 小红书', big: '30', red: '万+', smaller: true },
];

const faqs = [
  { num: '01', q: '图像魔方支持哪些格式？', a: '支持 PNG / JPEG / WebP / GIF / SVG / BMP / TIFF 等主流格式互转，并支持透明背景检测。' },
  { num: '02', q: '数据是否安全？', a: '所有处理在浏览器本地完成（除部分 AI 工具）。0 上传，0 留存，数据不离开你的电脑。' },
  { num: '03', q: '需要付费吗？', a: '所有工具永久免费。AI 工具消耗的算力由 huasheng.ai 团队承担，无任何限制。' },
  { num: '04', q: '可以批量处理吗？', a: '压缩 / 格式转换 / 圆角等基础工具支持批量上传与导出，最多同时处理 50 张。' },
  { num: '05', q: '移动端可用吗？', a: '所有工具响应式适配。但 SVG 编辑器、自由画布等高交互工具建议桌面端使用。' },
  { num: '06', q: '什么是 AIDEX？', a: '花叔团队精选的 AI 工具目录，按场景分类，含上手难度与价格区间，帮你少踩坑。' },
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredTools = useMemo(() => {
    return tools.filter((t) => {
      if (activeFilter !== 'all' && t.category !== activeFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return t.name.toLowerCase().includes(s) || t.en.toLowerCase().includes(s) || t.catCN.includes(search);
      }
      return true;
    });
  }, [activeFilter, search]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const el = document.getElementById('tool-search');
        el?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // 注入 Google Fonts (Inter + JetBrains Mono)
  useEffect(() => {
    const id = 'vignelli-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);
  }, []);

  return (
    <div className="vignelli-page bg-white text-[#0A0A0A]">
      <style jsx global>{`
        .vignelli-page { font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", system-ui, sans-serif; }
        .vignelli-page .vmono { font-family: 'JetBrains Mono', ui-monospace, "SF Mono", Menlo, monospace; letter-spacing: 0.25em; text-transform: uppercase; }
        .vignelli-page .v-italic { font-style: italic; }
      `}</style>

      {/* HERO */}
      <section className="border-b border-[#0A0A0A] px-6 sm:px-10 lg:px-20 pt-16 lg:pt-20 pb-14 lg:pb-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-3 mb-8 text-[10px]">
            <span className="w-2 h-2 bg-[#DC2F1A] inline-block" />
            <span className="vmono opacity-70">A · Image Toolkit Since 2024</span>
            <span className="opacity-30 hidden sm:inline">·</span>
            <span className="vmono opacity-50 hidden sm:inline">HUASHENG.AI · IMG2046.COM</span>
          </div>

          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-20 items-end">
            <div>
              <h1 className="font-extrabold leading-[0.92] tracking-[-0.03em] text-[80px] sm:text-[112px] lg:text-[160px]">
                图像<br />魔方<span className="text-[#DC2F1A]">.</span>
              </h1>
              <p className="mt-8 text-[18px] sm:text-[22px] v-italic leading-[1.55] opacity-80 max-w-[520px]">
                9 个图像处理工具，全部免费，零数据上传。<br />
                从压缩到 SVG，从格式转换到 AI 创意。
              </p>
              <div className="mt-12 flex flex-wrap items-center gap-4 lg:gap-6">
                <a href="#tools" className="bg-[#0A0A0A] text-white px-8 py-4 vmono text-[11px] hover:bg-[#DC2F1A] transition-colors inline-flex items-center gap-3">
                  浏览工具 ↓
                </a>
                <a href="https://huasheng.ai" target="_blank" rel="noopener noreferrer" className="border border-[#0A0A0A] text-[#0A0A0A] px-8 py-4 vmono text-[11px] hover:bg-[#0A0A0A] hover:text-white transition-colors inline-flex items-center gap-3">
                  花叔主页
                </a>
                <span className="ml-auto vmono text-[10px] opacity-50 hidden md:inline">↓ scroll · ⌘ K · search</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px bg-[#0A0A0A]/15 border border-[#0A0A0A]/15">
              {stats.map((s) => (
                <div key={s.num} className="bg-white p-6 lg:p-8 flex flex-col min-h-[170px]">
                  <div className="flex justify-between items-center mb-5 text-[9px]">
                    <span className="vmono opacity-55">{s.num} — {s.metaLabel}</span>
                    <span className="w-1.5 h-1.5 bg-[#DC2F1A] inline-block" />
                  </div>
                  <div className="font-bold leading-none tracking-[-0.02em] text-[48px] lg:text-[60px]">
                    {s.big}
                    <span className={`text-[#DC2F1A] ${s.smaller ? 'text-[28px] lg:text-[34px] ml-1' : ''}`}>{s.red}</span>
                  </div>
                  <div className="mt-auto pt-5 border-t border-[#0A0A0A]/15">
                    <div className="vmono text-[9px] opacity-85">{s.label}</div>
                    <div className="text-[11px] opacity-50 mt-0.5">{s.mini}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section id="tools" className="px-6 sm:px-10 lg:px-20 pt-16 lg:pt-24 pb-20 lg:pb-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <h2 className="font-extrabold leading-[1.05] tracking-[-0.015em] text-[44px] lg:text-[64px]">
              所有<span className="text-[#DC2F1A]">工具.</span>
            </h2>
            <div className="vmono text-[10px] opacity-55">— {filteredTools.length} Tools · Updated 2026 —</div>
          </div>

          <div className="flex border-t border-[#0A0A0A] border-b border-[#0A0A0A]/15 mb-px overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`vmono text-[11px] py-4 px-6 lg:px-7 border-r border-[#0A0A0A]/15 last:border-r-0 inline-flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeFilter === f.key ? 'bg-[#0A0A0A] text-white' : 'hover:bg-[#F8F8F6]'
                }`}
              >
                {f.label} <span className="opacity-60 text-[9px]">/ {f.cnt}</span>
              </button>
            ))}
            <div className="ml-auto py-4 px-6 inline-flex items-center gap-3">
              <span className="vmono text-[9px] opacity-40">⌘K</span>
              <input
                id="tool-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索工具..."
                className="bg-transparent outline-none vmono text-[11px] w-[160px] placeholder:opacity-40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-[#0A0A0A]/15">
            {filteredTools.map((t) => (
              <Link
                key={t.num}
                href={t.href}
                className="group p-9 min-h-[240px] flex flex-col gap-5 border-r border-[#0A0A0A]/15 border-b border-[#0A0A0A]/15 lg:[&:nth-child(3n)]:border-r-0 hover:bg-[#F8F8F6] transition-colors relative"
              >
                <div className="flex justify-between items-center">
                  <span className="vmono text-[10px] opacity-55">{t.num}</span>
                  {t.badges && (
                    <div className="flex gap-1.5">
                      {t.badges.map((b) => (
                        <span key={b} className={`vmono text-[8px] px-2 py-0.5 ${b === 'NEW' ? 'bg-[#DC2F1A] text-white' : 'bg-[#0A0A0A] text-white'}`}>
                          {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-[28px] font-bold leading-[1.1] tracking-[-0.01em]">
                    {t.name}<span className="text-[#DC2F1A]">.</span>
                  </h3>
                  <div className="vmono text-[10px] opacity-50 mt-1">{t.en}</div>
                </div>
                <p className="text-[13px] leading-[1.65] opacity-60 mt-auto">{t.desc}</p>
                <div className="vmono text-[9px] flex justify-between items-center pt-4 border-t border-[#0A0A0A]/15 opacity-65">
                  <span>{t.category} / {t.catCN}</span>
                  <span className="w-1.5 h-1.5 bg-[#DC2F1A] inline-block" />
                </div>
                <span className="absolute top-9 right-9 opacity-0 group-hover:opacity-100 transition-opacity vmono text-[14px]">→</span>
              </Link>
            ))}
            {filteredTools.length === 0 && (
              <div className="p-12 col-span-full text-center vmono text-[11px] opacity-50">
                没找到匹配的工具。试试切换分类或换一个关键词。
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#F8F8F6] border-t border-[#0A0A0A] px-6 sm:px-10 lg:px-20 py-20 lg:py-28">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <h2 className="font-extrabold tracking-[-0.015em] text-[40px] lg:text-[56px]">
              常见<span className="text-[#DC2F1A]">问题.</span>
            </h2>
            <div className="vmono text-[10px] opacity-55">— FAQ · 6 Topics —</div>
          </div>
          <div className="grid md:grid-cols-2 border-t border-[#0A0A0A]">
            {faqs.map((f, i) => (
              <div key={f.num} className={`py-7 border-b border-[#0A0A0A]/15 ${i % 2 === 0 ? 'md:pr-10' : 'md:pl-10 md:border-l md:border-[#0A0A0A]/15'}`}>
                <div className="flex items-start gap-4">
                  <span className="vmono text-[10px] text-[#DC2F1A] pt-1 min-w-[34px]">{f.num}</span>
                  <span className="text-[17px] font-semibold leading-[1.4]">{f.q}</span>
                </div>
                <p className="text-[13px] leading-[1.75] opacity-60 mt-3 pl-[50px]">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER section */}
      <section className="border-t border-[#0A0A0A] px-6 sm:px-10 lg:px-20 py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <h3 className="font-extrabold tracking-[-0.02em] leading-none text-[56px] lg:text-[80px]">
              开始<span className="text-[#DC2F1A]">创作.</span>
            </h3>
            <a href="#tools" className="bg-[#0A0A0A] text-white px-8 py-4 vmono text-[11px] hover:bg-[#DC2F1A] transition-colors">
              浏览工具 →
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 pt-7 border-t border-[#0A0A0A] vmono text-[10px]">
            <div className="pr-4 pt-3"><div className="opacity-45 mb-1.5">— Project</div><div className="opacity-85">img2046.com</div></div>
            <div className="pr-4 pt-3"><div className="opacity-45 mb-1.5">— By</div><div className="opacity-85">HUASHENG.AI · 花叔</div></div>
            <div className="pr-4 pt-3"><div className="opacity-45 mb-1.5">— Updated</div><div className="opacity-85">2026 · Vol.02</div></div>
            <div className="pr-4 pt-3"><div className="opacity-45 mb-1.5">— License</div><div className="opacity-85">Free Forever</div></div>
          </div>
        </div>
      </section>
    </div>
  );
}
