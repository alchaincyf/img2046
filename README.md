# 图像魔方 img2046.com

图像魔方是一个强大的在线图像处理工具，基于 Next.js 14 开发，提供多种图像处理功能和 AI 创意工具。

## 功能

1. 格式转换
   - 支持 JPG、PNG、WEBP、GIF 和 PDF 格式之间的相互转换
   - 文件大小限制为 10MB

2. 裁剪
   - 自定义裁剪图片尺寸和比例

3. 调整大小
   - 调整图片尺寸，保持或不保持原始比例

4. 压缩
   - 压缩图片以减小文件大小

5. 滤镜
   - 应用各种滤镜效果

6. SVG 编辑器
   - 创建自定义 SVG 图形

7. 极简Logo设计
   - 输入公司或产品名称
   - 生成独特的 SVG 格式 Logo
   - 显示设计理念

8. AI 文生图
   - 输入提示词
   - 可选输入负面提示词
   - 选择图片尺寸
   - 生成高质量 AI 图片

## 使用方法

1. 访问 https://www.img2046.com/
2. 从左侧菜单选择所需功能
3. 按照页面提示上传图片或输入所需信息
4. 点击相应按钮进行处理或生成
5. 下载或保存处理结果

## 注意事项

- 图片处理和 AI 生成可能需要一些时间，请耐心等待
- 如遇到错误，请检查网络连接并重试
- 生成的内容仅供参考，可能需要进一步调整或优化

## 技术栈

- Next.js 14 (App Router)
- React
- TypeScript
- Material-UI (MUI)
- Axios
- Framer Motion

## 环境变量

请确保在 .env.local 文件中设置以下环境变量：

- SILICONFLOW_API_KEY: 硅基流动 API 密钥（用于 AI 图片生成）
- DEEPSEEK_API_KEY: DeepSeek API 密钥（如果使用）

## 开发

1. 克隆仓库
2. 安装依赖: `npm install`
3. 运行开发服务器: `npm run dev`
4. 在浏览器中打开 http://localhost:3000

## 部署

本项目已部署在 Vercel 上。如需自行部署，请确保正确设置环境变量，并在 vercel.json 中配置适当的函数超时时间。

## SEO 优化

项目已包含以下 SEO 优化措施：
- 元数据设置（标题、描述、关键词）
- Open Graph 标签
- Twitter 卡片
- 规范链接
- 结构化数据
- Google Analytics 集成

## 性能优化

- 使用 Next.js 的图像组件进行图片优化
- 动态导入部分组件以减少初始加载时间
- 使用 Framer Motion 实现平滑的页面过渡效果

## 贡献

欢迎提交 Issues 和 Pull Requests 来改进这个项目。

## 许可证

[MIT License](LICENSE)
