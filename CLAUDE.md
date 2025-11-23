# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

图像魔方 (img2046.com) - 基于 Next.js 14 的在线图像处理工具平台，提供 13+ 种图像处理和 AI 创意工具。

## 常用命令

```bash
npm run dev      # 启动开发服务器 (localhost:3000)
npm run build    # 生产构建
npm run start    # 启动生产服务器
npm run lint     # ESLint 代码检查
```

## 技术栈

- **框架**: Next.js 14 (App Router) + React 18 + TypeScript 5
- **UI**: Material-UI 6 + Tailwind CSS 3 + Framer Motion
- **画布引擎**: Konva + React-Konva (GPU 加速 2D 渲染)
- **图像处理**: Sharp (服务端) + Canvas API (客户端)
- **AI/ML**: TensorFlow.js + BodyPix (人物检测) + OpenAI/SiliconFlow API
- **状态管理**: Zustand
- **国际化**: next-intl (中/英文)

## 项目架构

```
app/
├── api/                    # API 路由 (POST 请求处理)
│   ├── convert/           # 格式转换
│   ├── generate-image/    # AI 图像生成
│   ├── remove-bg/         # 背景去除
│   └── ...
├── components/            # 全局组件
├── utils/                 # 工具函数
├── free-canvas/           # 自由画布模块 (Konva + Zustand)
│   ├── store/            # canvasStore.ts - 画布状态管理
│   ├── components/       # 画布子组件
│   ├── hooks/            # 自定义 hooks
│   └── types/            # 类型定义
├── [功能模块]/            # 每个工具独立路由
│   ├── page.tsx
│   └── layout.tsx
messages/                  # i18n 翻译文件 (zh.json, en.json)
public/                    # 静态资源
```

## 核心模块

| 路由 | 功能 | 技术 |
|------|------|------|
| `/free-canvas` | 无限画布编辑 | Konva + Zustand |
| `/ai-image-generator` | AI 文生图 | SiliconFlow API |
| `/text-card-generator` | 文字卡片 | Canvas API |
| `/format-convert` | 格式转换 | Sharp + PDF-lib |
| `/compress` | 图片压缩 | Sharp |
| `/text-behind-object` | 人物背景文字 | BodyPix + Canvas |
| `/svg-generator` | SVG 编辑 | Konva |
| `/ppt-generator` | PPT 生成 | pptxgenjs |

## 自由画布 (Free Canvas) 架构

状态管理使用 Zustand (`app/free-canvas/store/canvasStore.ts`):
- 元素类型: `image | text | rect | circle | line | path`
- 工具类型: `select | pan | text | rect | circle | line | pen | eraser`
- 支持撤销/重做 (最多 50 步历史)
- 支持复制/粘贴、图层管理、多选操作

## API 路由规范

- 使用 Next.js App Router API Routes (`app/api/`)
- 文件上传使用 FormData，最大 10MB
- Vercel Functions 超时: 59 秒
- 返回格式: JSON 或 Blob (图像数据)

## 环境变量

```bash
SILICONFLOW_API_KEY=xxx  # AI 图片生成 (必需)
# Firebase 和 OpenAI 密钥按需配置
```

## 开发注意事项

- 图像处理优先在浏览器端进行，减少服务器负载
- Konva 用于需要 GPU 加速的画布操作
- Sharp 仅用于服务端图像处理 (API Routes)
- 所有新功能应支持中英文 (messages/ 目录)
