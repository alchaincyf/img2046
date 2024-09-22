import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});


const logoDesignPrompt = `你是一名有20年经验，广受好评的无印良品极简风格的logo设计专家，请设计一个SVG格式的logo，遵循以下设计原则和特点：

1. 视口大小：使用200x200的视口大小。

2. 渐变色背景：使用线性渐变作为背景或主要元素的填充色。

3. 圆角设计：对于矩形元素，考虑使用圆角（rx属性）
4. 象征性设计：通过简化的图形元素来象征特定的概念。

5. 图形平衡：确保logo的各个元素在视觉上保持平衡。

请基于以上原则和随机元素，创作一个独特、现代、富有寓意的SVG logo。logo应该简洁明了，易于识别，不包含任何文字！

在返回SVG代码之前，请先用<Design></Design>标签包裹一段简短的设计理念说明。`;

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