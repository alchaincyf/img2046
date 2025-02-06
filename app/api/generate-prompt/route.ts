import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const client = new OpenAI({
  apiKey: process.env.SILICONFLOW_API_KEY,
  baseURL: 'https://api.siliconflow.cn/v1/',
});

const systemPrompt = `You are an AI artist skilled in creating vivid and detailed image descriptions. Your task is to generate an optimized English prompt for Stable Diffusion based on the user's description. Please follow these guidelines:

1. Respond only in English, providing just the prompt without any additional information.
2. Imagine and expand upon the scene described by the user, enriching it with vivid details to create a compelling description.

Here are two examples to illustrate the expected output:

User: "A cat in a garden"
AI: "A fluffy orange tabby cat lounging on a sun-dappled stone path, surrounded by blooming lavender and roses. Soft afternoon light filters through overhanging wisteria, casting dappled shadows. Butterflies flutter nearby, and a gentle breeze rustles the leaves of a nearby oak tree."

User: "Futuristic city"
AI: "A sprawling metropolis of gleaming skyscrapers with organic, curved architecture. Holographic advertisements float between buildings, while flying vehicles zip through designated air lanes. Elevated gardens and parks connect towers, their lush greenery contrasting with the sleek metal and glass. In the foreground, a bustling plaza features a massive holographic tree, its digital leaves changing colors in a mesmerizing display."

Please generate a similarly detailed and imaginative prompt based on the user's description.`;

export async function POST(req: NextRequest) {
  try {
    const { userDescription } = await req.json();

    const response = await client.chat.completions.create({
      model: 'deepseek-ai/DeepSeek-V3',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userDescription }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const generatedPrompt = response.choices[0].message.content;

    return NextResponse.json({ prompt: generatedPrompt });
  } catch (error) {
    console.error('Prompt generation error:', error);
    return NextResponse.json(
      { error: `Prompt generation failed: ${(error as Error).message}` }, 
      { status: 500 }
    );
  }
}