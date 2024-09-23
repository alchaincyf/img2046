import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const FLUX_API_URL = 'https://api.siliconflow.cn/v1/black-forest-labs/FLUX.1-schnell/text-to-image';

async function makeRequest(prompt: string, retries = 3) {
  try {
    const response = await axios.post(FLUX_API_URL, {
      prompt,
      image_size: '1024x1024'
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 120000 // 设置 2 分钟的超时时间
    });
    return response.data.images;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts left)`);
      return makeRequest(prompt, retries - 1);
    }
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const generatedImages = await makeRequest(prompt);
    return NextResponse.json({ images: generatedImages });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json({ error: '图片生成失败: ' + (error as Error).message }, { status: 500 });
  }
}