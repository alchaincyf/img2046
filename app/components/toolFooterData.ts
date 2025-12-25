import compressFAQ from '../../content/faq/compress.json';

export interface FAQItem {
  question: string;
  answer: string;
  keywords: string[];
}

export interface ToolFAQData {
  title: string;
  description?: string;
  faqs: FAQItem[];
}

export interface ToolMeta {
  name: string;
  href: string;
  description: string;
  icon: string;
  category: string;
  usage: string;
}

export const toolCatalog: ToolMeta[] = [
  {
    name: '图片压缩',
    href: '/compress',
    icon: '/images/compress.svg',
    description: '智能压缩图片体积，保留清晰度与透明背景。',
    category: '基础编辑',
    usage: '上传图片后调整压缩质量与格式，点击开始压缩并下载结果。',
  },
  {
    name: '调整大小',
    href: '/resize',
    icon: '/images/resize.svg',
    description: '快速调整图片尺寸，保持比例或自定义大小。',
    category: '基础编辑',
    usage: '上传图片，输入目标尺寸并选择是否保持比例，然后生成下载。',
  },
  {
    name: '裁剪',
    href: '/crop',
    icon: '/images/crop.svg',
    description: '自由裁剪与比例裁剪，适配不同平台尺寸。',
    category: '基础编辑',
    usage: '上传图片后拖拽裁剪框或选择比例，确认裁剪并下载。',
  },
  {
    name: '图片滤镜',
    href: '/filter',
    icon: '/images/filter.svg',
    description: '一键套用滤镜与调色，提升照片风格。',
    category: '基础编辑',
    usage: '上传图片后选择滤镜与强度，保存并下载效果图。',
  },
  {
    name: '图片格式转换',
    href: '/format-convert',
    icon: '/images/format-convert.svg',
    description: '在 JPG/PNG/WEBP/GIF 等格式之间快速转换。',
    category: '格式转换',
    usage: '上传图片后选择输出格式，点击转换并下载。',
  },
  {
    name: '圆角处理',
    href: '/rounded-corners',
    icon: '/images/rounded-corners.svg',
    description: '为图片添加圆角效果，支持精细控制。',
    category: '基础编辑',
    usage: '上传图片后调整圆角半径，预览效果并下载。',
  },
  {
    name: 'SVG 生成器',
    href: '/svg-generator',
    icon: '/images/svg-generator.svg',
    description: '创建与编辑可缩放的矢量图形，导出 SVG。',
    category: '创意设计',
    usage: '在页面中创建或编辑图形元素，完成后导出 SVG 文件。',
  },
  {
    name: 'SVG 可视化编辑器',
    href: '/svg-editor',
    icon: '/images/svg-generator.svg',
    description: '更精细的 SVG 画布编辑与元素管理。',
    category: '创意设计',
    usage: '在画布上绘制与编辑矢量元素，完成后导出或保存。',
  },
  {
    name: 'SVG to PPT',
    href: '/ppt-generator',
    icon: '/images/svg-to-ppt.svg',
    description: '将 SVG 结果一键生成 PPT 文件。',
    category: '格式转换',
    usage: '上传 SVG 并设置样式，生成 PPT 后下载。',
  },
  {
    name: '文字绕物体',
    href: '/text-behind-object',
    icon: '/images/text-behind-object.svg',
    description: '让文字自然穿插在主体前后，增强层次感。',
    category: '创意设计',
    usage: '上传图片，输入文字并调整遮挡层级，导出效果图。',
  },
  {
    name: 'AI Logo 设计',
    href: '/ai-logo-design',
    icon: '/images/ai-logo-design.svg',
    description: '输入品牌信息，快速生成简洁现代的 Logo。',
    category: 'AI工具',
    usage: '填写品牌名称与风格偏好，生成并挑选喜欢的 Logo。',
  },
  {
    name: 'AI 文生图',
    href: '/ai-image-generator',
    icon: '/images/ai-image-generator.svg',
    description: '输入提示词，生成高质量图像素材。',
    category: 'AI工具',
    usage: '输入提示词并选择风格，生成图片后下载。',
  },
  {
    name: '图片上传工具',
    href: '/upload',
    icon: '/images/image-tools-icon.svg',
    description: '批量上传图片并进行基础处理。',
    category: '基础编辑',
    usage: '选择多张图片上传，按页面提示完成处理并下载。',
  },
  {
    name: '自由画布',
    href: '/free-canvas',
    icon: '/images/free-canvas.svg',
    description: '无限画布创作空间，支持绘图与多元素组合。',
    category: '创意设计',
    usage: '选择画布尺寸，绘制或导入素材，完成后导出作品。',
  },
  {
    name: '文字卡片生成',
    href: '/text-card-generator',
    icon: '/images/text-card-generator.svg',
    description: '快速生成可分享的文字卡片。',
    category: '创意设计',
    usage: '输入文字，选择模板与配色，生成并下载卡片。',
  },
];

const compressFaqData = compressFAQ as ToolFAQData;

const defaultFaqs = (tool: ToolMeta): ToolFAQData => ({
  title: `${tool.name}常见问题`,
  description: `关于${tool.name}的使用与效果说明`,
  faqs: [
    {
      question: `${tool.name}怎么使用？`,
      answer: tool.usage,
      keywords: [tool.name],
    },
    {
      question: '支持哪些格式或内容？',
      answer: '支持常见图片格式（JPG/PNG/WEBP/GIF/SVG）及页面提示的输入类型，具体以页面说明为准。',
      keywords: [],
    },
    {
      question: '处理过程会上传数据吗？',
      answer: '大多数工具在浏览器本地完成处理；如需调用第三方服务，页面会提前提示并在你确认后执行。',
      keywords: [],
    },
    {
      question: '可以批量处理吗？',
      answer: '支持的功能会在页面标注批量能力；若未提示，建议单张处理以保证效果。',
      keywords: [],
    },
    {
      question: '遇到问题如何反馈？',
      answer: '可通过页面的 GitHub 链接或邮箱 alchaincyf@gmail.com 联系我们。',
      keywords: [],
    },
  ],
});

export const getToolFaqData = (tool: ToolMeta): ToolFAQData => {
  if (tool.href === '/compress') {
    return compressFaqData;
  }
  return defaultFaqs(tool);
};

export const getRelatedTools = (current: ToolMeta, all: ToolMeta[], count = 3): ToolMeta[] => {
  const sameCategory = all.filter(
    (tool) => tool.category === current.category && tool.href !== current.href
  );
  const others = all.filter(
    (tool) => tool.category !== current.category && tool.href !== current.href
  );

  return [...sameCategory, ...others].slice(0, count);
};
