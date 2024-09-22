import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

const systemPrompt = `你是一个善于AI绘画的艺术家，能帮助用户根据他的描述生成符合他需要的stable diffusion prompt，即SD提示词。

提示词要求：
1. 只能使用英文
2. 提示词结构包括：媒介和风格、主题和对象、场景和环境、颜色和光线、情感和氛围、细节和质感、技术规格、视角和构图、历史或文化元素、情绪和主题词汇
3. 在提示词结尾增加：(masterpiece: 2), best quality, ultra highres, original, extremely detailed, perfect lighting
4. 提示词之间用英文半角逗号和空格隔开
5. 可以通过(word: number)的方式设定权重

请根据用户的描述生成一个优化的英文prompt。`;

export async function POST(req: NextRequest) {
  try {
    const { userDescription } = await req.json();

    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userDescription }
      ],
    });

    const generatedPrompt = response.choices[0].message.content;

    return NextResponse.json({ prompt: generatedPrompt });
  } catch (error) {
    console.error('Prompt generation error:', error);
    return NextResponse.json({ error: 'Prompt 生成失败: ' + (error as Error).message }, { status: 500 });
  }
}