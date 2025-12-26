# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

图像魔方 (img2046.com) - 基于 Next.js 14 的在线图像处理工具平台，提供 13+ 种图像处理和 AI 创意工具。

## 常用命令

```bash
npm run dev      # 启动开发服务器 (localhost:3000)
npm run build    # 生产构建 (Next.js 优化构建)
npm run start    # 启动生产服务器
npm run lint     # ESLint 代码检查 (构建时忽略错误)
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
├── api/                    # API 路由 (所有 route.ts 文件)
│   ├── convert/           # 图片格式转换 (Sharp)
│   ├── generate-image/    # AI 图像生成 (SiliconFlow API)
│   ├── remove-bg/         # 背景去除
│   ├── text-behind-subject/ # 人物背景文字
│   ├── design-logo/       # Logo 设计
│   ├── analyze-photo/     # 图片分析
│   └── upload/            # 文件上传处理
├── components/            # 全局共享组件
├── utils/                 # 工具函数 (rateLimiter, imageGenerationQueue, translate)
├── free-canvas/           # 自由画布模块 (Konva + Zustand)
│   ├── store/canvasStore.ts  # 画布状态管理 (元素、历史、工具)
│   ├── components/       # Canvas, Toolbar, PropertyPanel 等
│   ├── hooks/            # 自定义 hooks
│   └── types/index.ts    # CanvasElement, Tool, ElementData 等类型
├── [功能路由]/page.tsx   # 独立功能页面 (17+ 工具页面)
│   ├── ai-image-generator/
│   ├── text-card-generator/
│   ├── format-convert/
│   ├── compress/
│   ├── text-behind-object/
│   └── ...
messages/                  # i18n 翻译文件 (zh.json, en.json)
public/                    # 静态资源
```

**路由结构**: 项目使用 Next.js 14 App Router,所有功能页面直接在 `app/` 下作为顶级路由,无 `[locale]` 嵌套。

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
- **元素类型** (`ElementType`): `image | text | rect | circle | line | path`
- **工具类型** (`Tool`): `select | pan | text | rect | circle | line | pen | eraser`
- **核心 Store 接口**:
  - `elements: CanvasElement[]` - 画布元素数组
  - `canvasState: CanvasState` - 画布状态 (缩放、位置、网格、选中项)
  - `history/historyIndex` - 撤销/重做栈 (最多 50 步)
  - `clipboard: CanvasElement[]` - 剪贴板

**关键操作方法**:
- 元素管理: `addElement()`, `updateElement()`, `deleteElement()`
- 选择: `selectElement()`, `selectAll()`, `clearSelection()`
- 图层: `bringToFront()`, `sendToBack()`, `bringForward()`, `sendBackward()`
- 历史: `undo()`, `redo()`, `saveHistory()`
- 剪贴板: `copy()`, `paste()`, `cut()`, `duplicate()`
- 画布视图: `setScale()`, `setPosition()`, `resetView()`

**ID 生成**: 使用 `nanoid()` 生成唯一元素 ID
**Z-Index 管理**: 自动维护元素层级,新元素总是在最上层

## API 路由规范

- 使用 Next.js App Router API Routes (`app/api/*/route.ts`)
- 主要使用 POST 方法处理请求,部分支持 GET (如状态查询)
- 文件上传使用 FormData,建议最大 10MB
- Vercel Functions 超时限制: 59 秒 (部分 AI 请求设置 180 秒内部超时)
- 返回格式: JSON (`NextResponse.json()`) 或 Blob (图像数据)
- 错误处理: 统一返回 `{ error: string }` 格式,状态码 400/500

**重试机制示例** (`generate-image/route.ts`):
- SiliconFlow API 使用 3 次重试,5 秒延迟
- 模型回退策略: Kolors → FLUX.1 → Stable Diffusion XL

## 环境变量

创建 `.env.local` 文件:

```bash
SILICONFLOW_API_KEY=xxx      # AI 图片生成 (必需,用于 generate-image API)
OPENAI_API_KEY=xxx           # OpenAI 服务 (可选)
FIREBASE_API_KEY=xxx         # Firebase 配置 (可选)
FIREBASE_PROJECT_ID=xxx      # Firebase 配置 (可选)
```

## 开发注意事项

### 图像处理策略
- **浏览器端优先**: 使用 Canvas API、html-to-image 处理简单操作,减少服务器负载
- **服务端处理**: Sharp 仅用于复杂转换 (格式转换、高质量压缩)
- **GPU 加速**: Konva + React-Konva 用于需要高性能 2D 渲染的画布操作

### 技术限制
- **Sharp 限制**: 仅在服务端 (API Routes) 使用,已配置为 `serverExternalPackages`
- **FormData 大小**: 建议文件上传限制 10MB
- **Vercel 超时**: API Routes 需在 59 秒内完成 (生产环境)

### 国际化
- 所有新功能必须支持中英文
- 翻译文件: `messages/zh.json` 和 `messages/en.json`
- 使用 `next-intl` 库处理翻译

### Next.js 配置
- **transpilePackages**: `@mui/icons-material` 需转译
- **eslint**: 构建时忽略 ESLint 错误 (`ignoreDuringBuilds: true`)
- 支持 Next.js 14 和 15+ 版本 (动态配置 `serverExternalPackages`)
