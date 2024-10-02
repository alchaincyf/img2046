import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

const svgExamples = [
  `<!-- Slide 1 -->
<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#F5F5F7"/>
  <rect x="0" y="0" width="400" height="400" fill="#FF9500" opacity="0.2">
    <animate attributeName="x" from="0" to="1920" dur="20s" repeatCount="indefinite"/>
  </rect>
  <rect x="1520" y="680" width="400" height="400" fill="#30B0C7" opacity="0.2">
    <animate attributeName="y" from="680" to="0" dur="15s" repeatCount="indefinite"/>
  </rect>
  <text x="960" y="540" font-family="SF Pro Display, sans-serif" font-size="96" font-weight="bold" text-anchor="middle" fill="#1D1D1F">
    实时API：开启语音交互新纪元
  </text>
</svg>`,

  `<!-- Slide 2 -->
<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#F5F5F7"/>
  <circle cx="200" cy="200" r="150" fill="#FF3B30" opacity="0.2">
    <animate attributeName="r" values="150;200;150" dur="10s" repeatCount="indefinite"/>
  </circle>
  <rect x="1620" y="780" width="300" height="300" fill="#5856D6" opacity="0.2">
    <animate attributeName="width" values="300;400;300" dur="8s" repeatCount="indefinite"/>
    <animate attributeName="height" values="300;400;300" dur="8s" repeatCount="indefinite"/>
  </rect>
  <text x="100" y="120" font-family="SF Pro Display, sans-serif" font-size="64" font-weight="bold" fill="#1D1D1F">
    实时API的核心优势
  </text>
  <g transform="translate(100, 220)">
    <rect width="1720" height="240" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="60" y="80" font-family="SF Pro Text, sans-serif" font-size="48" fill="#1D1D1F">
      低延迟多模态体验
    </text>
    <text x="60" y="160" font-family="SF Pro Text, sans-serif" font-size="32" fill="#86868B">
      支持自然语音对话，实现流畅的人机交互
    </text>
  </g>
  <g transform="translate(100, 500)">
    <rect width="1720" height="240" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="60" y="80" font-family="SF Pro Text, sans-serif" font-size="48" fill="#1D1D1F">
      单一API调用
    </text>
    <text x="60" y="160" font-family="SF Pro Text, sans-serif" font-size="32" fill="#86868B">
      简化开发流程，提高效率
    </text>
  </g>
</svg>`,

  `<!-- Slide 3 -->
<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#F5F5F7"/>
  <rect x="0" y="980" width="1920" height="100" fill="#34C759" opacity="0.2">
    <animate attributeName="y" from="980" to="0" dur="25s" repeatCount="indefinite"/>
  </rect>
  <rect x="-100" y="0" width="100" height="1080" fill="#007AFF" opacity="0.2">
    <animate attributeName="x" from="-100" to="1920" dur="30s" repeatCount="indefinite"/>
  </rect>
  <text x="960" y="120" font-family="SF Pro Display, sans-serif" font-size="64" font-weight="bold" text-anchor="middle" fill="#1D1D1F">
    技术原理
  </text>
  <g transform="translate(100, 200)">
    <rect width="840" height="220" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="60" y="80" font-family="SF Pro Text, sans-serif" font-size="40" fill="#1D1D1F">
      WebSocket持久连接
    </text>
    <text x="60" y="150" font-family="SF Pro Text, sans-serif" font-size="28" fill="#86868B">
      实现实时双向通信
    </text>
  </g>
  <g transform="translate(980, 200)">
    <rect width="840" height="220" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="60" y="80" font-family="SF Pro Text, sans-serif" font-size="40" fill="#1D1D1F">
      支持函数调用
    </text>
    <text x="60" y="150" font-family="SF Pro Text, sans-serif" font-size="28" fill="#86868B">
      增强交互能力和灵活性
    </text>
  </g>
  <g transform="translate(100, 460)">
    <rect width="840" height="220" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="60" y="80" font-family="SF Pro Text, sans-serif" font-size="40" fill="#1D1D1F">
      自动处理中断
    </text>
    <text x="60" y="150" font-family="SF Pro Text, sans-serif" font-size="28" fill="#86868B">
      提供更自然的对话体验
    </text>
  </g>
  <g transform="translate(980, 460)">
    <rect width="840" height="220" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="60" y="80" font-family="SF Pro Text, sans-serif" font-size="40" fill="#1D1D1F">
      流式音频输入输出
    </text>
    <text x="60" y="150" font-family="SF Pro Text, sans-serif" font-size="28" fill="#86868B">
      实现实时语音交互
    </text>
  </g>
</svg>`,

  `<!-- Slide 4 -->
<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#F5F5F7"/>
  <circle cx="1820" cy="100" r="200" fill="#FF9500" opacity="0.2">
    <animate attributeName="cy" values="100;980;100" dur="20s" repeatCount="indefinite"/>
  </circle>
  <rect x="0" y="540" width="100" height="100" fill="#AF52DE" opacity="0.2">
    <animate attributeName="width" values="100;1920;100" dur="15s" repeatCount="indefinite"/>
  </rect>
  <text x="960" y="120" font-family="SF Pro Display, sans-serif" font-size="64" font-weight="bold" text-anchor="middle" fill="#1D1D1F">
    应用场景
  </text>
  <g transform="translate(100, 200)">
    <rect width="1720" height="220" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="60" y="80" font-family="SF Pro Text, sans-serif" font-size="40" fill="#1D1D1F">
      智能客户支持
    </text>
    <text x="60" y="150" font-family="SF Pro Text, sans-serif" font-size="28" fill="#86868B">
      提供24/7实时语音客服，提升用户体验
    </text>
  </g>
  <g transform="translate(100, 460)">
    <rect width="1720" height="220" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="60" y="80" font-family="SF Pro Text, sans-serif" font-size="40" fill="#1D1D1F">
      语言学习应用
    </text>
    <text x="60" y="150" font-family="SF Pro Text, sans-serif" font-size="28" fill="#86868B">
      提供实时口语练习和反馈，加速语言学习
    </text>
  </g>
  <g transform="translate(100, 720)">
    <rect width="1720" height="220" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="60" y="80" font-family="SF Pro Text, sans-serif" font-size="40" fill="#1D1D1F">
      个性化健康指导
    </text>
    <text x="60" y="150" font-family="SF Pro Text, sans-serif" font-size="28" fill="#86868B">
      提供实时语音健康咨询和指导，改善用户健康状况
    </text>
  </g>
</svg>`,

  `<!-- Slide 5 -->
<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#F5F5F7"/>
  <rect x="1620" y="0" width="300" height="1080" fill="#5AC8FA" opacity="0.2">
    <animate attributeName="x" values="1620;0;1620" dur="25s" repeatCount="indefinite"/>
  </rect>
  <circle cx="100" cy="980" r="150" fill="#FF2D55" opacity="0.2">
    <animate attributeName="cy" values="980;100;980" dur="18s" repeatCount="indefinite"/>
  </circle>
  <text x="960" y="120" font-family="SF Pro Display, sans-serif" font-size="64" font-weight="bold" text-anchor="middle" fill="#1D1D1F">
    安全与隐私
  </text>
  <g transform="translate(100, 200)">
    <rect width="840" height="220" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="60" y="80" font-family="SF Pro Text, sans-serif" font-size="40" fill="#1D1D1F">
      多层安全保护
    </text>
    <text x="60" y="150" font-family="SF Pro Text, sans-serif" font-size="28" fill="#86868B">
      确保数据安全，防止滥用
    </text>
  </g>
  <g transform="translate(980, 200)">
    <rect width="840" height="220" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="60" y="80" font-family="SF Pro Text, sans-serif" font-size="40" fill="#1D1D1F">
      自动监控和人工审核
    </text>
    <text x="60" y="150" font-family="SF Pro Text, sans-serif" font-size="28" fill="#86868B">
      双重保障，确保系统安全运行
    </text>
  </g>
  <g transform="translate(100, 460)">
    <rect width="840" height="220" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="60" y="80" font-family="SF Pro Text, sans-serif" font-size="40" fill="#1D1D1F">
      严格的使用政策
    </text>
    <text x="60" y="150" font-family="SF Pro Text, sans-serif" font-size="28" fill="#86868B">
      明确规定，保护用户权益
    </text>
  </g>
  <g transform="translate(980, 460)">
    <rect width="840" height="220" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="60" y="80" font-family="SF Pro Text, sans-serif" font-size="40" fill="#1D1D1F">
      企业级隐私承诺
    </text>
    <text x="60" y="150" font-family="SF Pro Text, sans-serif" font-size="28" fill="#86868B">
      保护用户隐私，不进行未授权的数据训练
    </text>
  </g>
</svg>`,

  `<!-- Slide 6 -->
<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#F5F5F7"/>
  <rect x="0" y="0" width="1920" height="100" fill="#4CD964" opacity="0.2">
    <animate attributeName="height" values="100;1080;100" dur="22s" repeatCount="indefinite"/>
  </rect>
  <circle cx="1820" cy="980" r="200" fill="#007AFF" opacity="0.2">
    <animate attributeName="r" values="200;400;200" dur="15s" repeatCount="indefinite"/>
  </circle>
  <text x="960" y="120" font-family="SF Pro Display, sans-serif" font-size="64" font-weight="bold" text-anchor="middle" fill="#1D1D1F">
    未来展望
  </text>
  <g transform="translate(100, 200)">
    <rect width="840" height="220" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="60" y="80" font-family="SF Pro Text, sans-serif" font-size="40" fill="#1D1D1F">
      更多模态支持
    </text>
    <text x="60" y="150" font-family="SF Pro Text, sans-serif" font-size="28" fill="#86868B">
      视觉和视频能力即将推出
    </text>
  </g>
  <g transform="translate(980, 200)">
    <rect width="840" height="220" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="60" y="80" font-family="SF Pro Text, sans-serif" font-size="40" fill="#1D1D1F">
      提高并发限制
    </text>
    <text x="60" y="150" font-family="SF Pro Text, sans-serif" font-size="28" fill="#86868B">
      支持更大规模的部署
    </text>
  </g>
  <g transform="translate(100, 460)">
    <rect width="840" height="220" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="60" y="80" font-family="SF Pro Text, sans-serif" font-size="40" fill="#1D1D1F">
      官方SDK支持
    </text>
    <text x="60" y="150" font-family="SF Pro Text, sans-serif" font-size="28" fill="#86868B">
      集成到OpenAI Python和Node.js SDK
    </text>
  </g>
  <g transform="translate(980, 460)">
    <rect width="840" height="220" rx="20" ry="20" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>
    <text x="60" y="80" font-family="SF Pro Text, sans-serif" font-size="40" fill="#1D1D1F">
      提示缓存
    </text>
    <text x="60" y="150" font-family="SF Pro Text, sans-serif" font-size="28" fill="#86868B">
      以优惠价格重新处理之前的对话轮次
    </text>
  </g>
</svg>`
];

const summarizeArticlePrompt = `作为一位经验丰富的演讲稿撰写专家，请你仔细阅读用户提供的文章，并将其总结为一份结构清晰PPT文档。请遵循以下指南：

1. 使用"## 第X页"的格式来组织每一页PPT的内容。第一页是主题页，可以主要展示标题，没什么内容；
2. 每页聚焦一个主题；
4. 确保大纲结构清晰，符合金字塔原理。
5. 内容应涵盖文章的主要观点和事实性信息。

请根据这些指南和示例，为用户提供的文章创建一个结构清晰、内容精炼的PPT大纲和内容。`;

const designSlidePrompt = `作为一位拥有20年经验的苹果发布会keynote设计师，请你根据用户提供的页面信息，对内容重加工，在不改变原意的情况下设计一个专业、美观且富有视觉吸引力的SVG幻灯片。

SVG尺寸应为1920x1080像素。请确保设计风格与苹果公司的简洁、现代美学相符，并充分利用SVG的特性来创造动态效果。

在设计时，请注意以下几点：
1. 使用优雅的无衬线字体。
2. 采用清晰的信息层次结构和布局。
3. 运用适当的颜色方案，以增强可读性和视觉吸引力。
4. 在背景上增加几个大色块几何图形，图形会变化、运动，以提升视觉表现力。
5. 确保生成的SVG代码可以直接使用，无需额外处理。

可以参考以下两个示例：

${svgExamples[Math.floor(Math.random() * svgExamples.length)]}

${svgExamples[Math.floor(Math.random() * svgExamples.length)]}

请直接提供完整的SVG代码，不需要其他解释。`;

async function retryOperation<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`操作失败，正在重试（${i + 1}/${maxRetries}）...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // 指数退避
    }
  }
  throw new Error('超过最大重试次数');
}

async function generateSummary(article: string) {
  console.log('开始生成文章总结...');
  const response = await retryOperation(async () => {
    return await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: summarizeArticlePrompt },
        { role: 'user', content: article }
      ],
    });
  });
  console.log('文章总结生成完成');
  return response.choices[0].message.content;
}

async function designSlide(content: string) {
  console.log('开始设计幻灯片...');
  const response = await retryOperation(async () => {
    return await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: designSlidePrompt },
        { role: 'user', content: content }
      ],
    });
  });
  console.log('幻灯片设计完成');
  return response.choices[0].message.content;
}

export async function POST(req: NextRequest) {
  try {
    console.log('接收到POST请求');
    const { article } = await req.json();
    console.log('成功解析请求体');

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // 第一步：生成文章总结
        console.log('开始第一步：生成文章总结');
        const summary = await generateSummary(article);
        console.log('文章总结生成完成');
        controller.enqueue(encoder.encode(JSON.stringify({ type: 'summary', data: summary }) + '\n'));

        // 第二步：为每一页设计SVG
        console.log('开始第二步：为每一页设计SVG');
        const pages = summary ? summary.split(/## 第\d+页/).filter(page => page.trim() !== '') : [];
        console.log(`共分割出 ${pages.length} 页内容`);
        
        // 并发设计幻灯片
        const slidePromises = pages.map(async (page, index) => {
          console.log(`开始设计第 ${index + 1} 页`);
          const svg = await designSlide(page);
          console.log(`第 ${index + 1} 页设计完成`);
          return { type: 'svg', data: svg, page: index + 1, total: pages.length };
        });

        // 等待所有幻灯片设计完成
        const results = await Promise.all(slidePromises);

        // 按顺序发送结果
        for (const result of results) {
          controller.enqueue(encoder.encode(JSON.stringify(result) + '\n'));
        }

        controller.close();
      }
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('SVG生成错误:', error);
    return NextResponse.json({ error: 'SVG生成失败: ' + (error as Error).message }, { status: 500 });
  }
}