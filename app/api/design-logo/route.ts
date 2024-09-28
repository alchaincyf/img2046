import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});


const logoDesignPrompt = `你是一位拥有 20 年经验的Apple iOS icon 设计专家，同时也是一位资深的 SVG 工程师。请为用户设计一个独特、现代且富有寓意的 SVG 格式的 logo，遵循以下设计原则和技术规范：

1. 设计原则：
   - 现代风格：采用当代设计趋势，符合 Apple 资深设计师的审美。
   - 寓意深刻：通过简化的图形元素象征特定概念。
   - 视觉平衡：确保 logo 的各个元素在视觉上保持平衡。
   - 设计简洁：使用较少的元素传达核心概念。

2. 技术规范：
   - 视口大小：使用 "0 0 1024 1024" 的 viewBox。
   - 颜色应用：使用 3-5 种颜色，包括渐变效果。提供精确的十六进制颜色代码。
   - 渐变背景：使用线性渐变作为背景或主要元素的填充色。
   - 圆角设计：对矩形元素使用圆角（rx 属性）。
   - 图形平衡：确保 logo 的各个元素在视觉上保持平衡。
   - 代码优化：生成简洁、优化的有效 SVG 代码。

3. 注意事项：
   - logo 应简洁明了，易于识别，不包含任何文字。
   - 设计应适合直接作为 app icon 使用。
   - 考虑色彩和谐、对比度和语义。

请直接输出 SVG 代码，在返回 SVG 代码之前，用 <Design></Design> 标签包裹一段简短的设计理念说明。`;

export async function POST(req: NextRequest) {
  try {
    const { logoName } = await req.json();

    console.log('Received logo name:', logoName);

    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: logoDesignPrompt },
        { role: 'user', content: `请为"${logoName}"设计一个logo` }
      ],
    });

    console.log('API response:', response);

    const content = response.choices[0].message.content;
    
    if (content === null) {
      throw new Error('No content generated');
    }

    console.log('Generated content:', content);

    const designMatch = content.match(/<Design>([\s\S]*?)<\/Design>/);
    const designConcept = designMatch ? designMatch[1].trim() : '';
    const svgMatch = content.match(/<svg[\s\S]*<\/svg>/);
    const svgCode = svgMatch ? svgMatch[0] : '';

    if (!svgCode) {
      throw new Error('无法生成有效的 SVG');
    }

    console.log('Design concept:', designConcept);
    console.log('SVG code:', svgCode);

    return NextResponse.json({ svgCode, designConcept });
  } catch (error) {
    console.error('Logo design error:', error);
    return NextResponse.json({ error: 'Logo 设计失败: ' + (error as Error).message }, { status: 500 });
  }
}