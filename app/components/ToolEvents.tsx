'use client'

import { useEffect } from 'react'

// 全站工具埋点：不改各个工具页，统一监听「上传文件」和「下载结果」，发 GA4 事件 tool_upload / tool_download，参数 tool = 页面路径。
// 口径见 gefei-seo-skill/analytics/埋点与分析方案.md。只在正式域名上发，避免本地开发和别名域名污染数据。
const HOSTS = ['www.img2046.com', 'img2046.com']

export default function ToolEvents() {
  useEffect(() => {
    if (!HOSTS.includes(window.location.hostname)) return
    const send = (name: string, extra: Record<string, string | number> = {}) => {
      const w = window as unknown as { gtag?: (...args: unknown[]) => void }
      w.gtag?.('event', name, { tool: window.location.pathname, ...extra })
    }

    // 1. 页面上带 download 属性的链接被点击（含脚本对已挂载链接调用 click()，事件会冒泡上来）
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[download]')
      if (a) send('tool_download')
    }
    // 2. 脚本临时创建、没挂到页面上的下载链接：a.click() 或 file-saver 的 dispatchEvent(click)
    const proto = HTMLAnchorElement.prototype
    const origClick = proto.click
    const origDispatch = proto.dispatchEvent
    proto.click = function (this: HTMLAnchorElement) {
      if (!this.isConnected && this.hasAttribute('download')) send('tool_download')
      return origClick.call(this)
    }
    proto.dispatchEvent = function (this: HTMLAnchorElement, ev: Event) {
      if (ev.type === 'click' && !this.isConnected && this.hasAttribute('download')) send('tool_download')
      return origDispatch.call(this, ev)
    }
    // 3. 上传：选择文件或拖进文件
    const onChange = (e: Event) => {
      const t = e.target as HTMLInputElement | null
      if (t?.type === 'file' && t.files?.length) send('tool_upload', { files: t.files.length })
    }
    const onDrop = (e: DragEvent) => {
      const n = e.dataTransfer?.files?.length || 0
      if (n) send('tool_upload', { files: n })
    }
    document.addEventListener('click', onClick, true)
    document.addEventListener('change', onChange, true)
    document.addEventListener('drop', onDrop, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('change', onChange, true)
      document.removeEventListener('drop', onDrop, true)
      proto.click = origClick
      proto.dispatchEvent = origDispatch
    }
  }, [])
  return null
}
