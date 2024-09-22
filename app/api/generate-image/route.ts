import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const SILICONFLOW_API_URL = 'https://api.siliconflow.cn/v1/stabilityai/stable-diffusion-xl-base-1.0/text-to-image';

export async function POST(req: NextRequest) {
  try {
    const { prompt, negativePrompt, imageSize, batchSize, seed, numInferenceSteps, guidanceScale } = await req.json();

    const response = await axios.post(SILICONFLOW_API_URL, {
      prompt,
      negative_prompt: negativePrompt,
      image_size: imageSize || '1024x1024',
      batch_size: batchSize || 1,
      seed,
      num_inference_steps: numInferenceSteps || 20,
      guidance_scale: guidanceScale || 7.5
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const generatedImages = response.data.images;

    return NextResponse.json({ images: generatedImages });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json({ error: '图片生成失败: ' + (error as Error).message }, { status: 500 });
  }
}