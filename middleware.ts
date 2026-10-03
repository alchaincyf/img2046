import { NextResponse } from 'next/server'

// AIDEX 目录（约2000个模板页）已于 2026-10-03 下线。返回 410 告诉谷歌这些网址是永久删除，比 404 下架得快。
export function middleware() {
  return new NextResponse('<!doctype html><meta charset="utf-8"><title>410 Gone</title><p>AIDEX 已下线。<a href="/">返回图像魔方首页</a></p>', {
    status: 410,
    headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex' },
  })
}

export const config = { matcher: ['/aidex', '/aidex/:path*'] }
