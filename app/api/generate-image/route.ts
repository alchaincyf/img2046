import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const SILICONFLOW_API_URL = 'https://api.siliconflow.cn/v1/stabilityai/stable-diffusion-xl-base-1.0/text-to-image';

const defaultNegativePrompt = 'NSFW, (worst quality:2), (low quality:2), (normal quality:2), (monochrome), (grayscale), (skin blemishes:1.331), (acne:1.331), (age spots:1.331), (extra fingers:1.61051), (deformed limbs:1.331), (malformed limbs:1.331), (ugly:1.331), (poorly drawn hands:1.5), (poorly drawn feet:1.5), (poorly drawn face:1.5), (mutated hands:1.331), (bad anatomy:1.21), (distorted face:1.331), (disfigured:1.331), (low contrast), (underexposed), (overexposed), (amateur), (blurry), (bad proportions:1.331), (extra limbs:1.331), (fused fingers:1.61051), (unclear eyes:1.331)';

async function makeRequest(prompt: string, retries = 3) {
  try {
    const response = await axios.post(SILICONFLOW_API_URL, {
      prompt,
      negative_prompt: defaultNegativePrompt,
      image_size: '1024x1024',
      batch_size: 1,
      num_inference_steps: 20,
      guidance_scale: 7.5
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