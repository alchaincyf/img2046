import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const FLUX_API_URL = 'https://api.siliconflow.cn/v1/images/generations';
const MODELS = [
  "black-forest-labs/FLUX.1-schnell",
  "stabilityai/stable-diffusion-xl-base-1.0"
];
let modelIndex = 0;

async function makeRequest(prompt: string, retries = 3) {
  try {
    const model = MODELS[modelIndex];
    modelIndex = (modelIndex + 1) % MODELS.length; // Update modelIndex for next request

    const response = await axios.post(FLUX_API_URL, {
      model,
      prompt,
      image_size: "1024x1024",
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 180000 // 增加到 3 分钟的超时时间，以适应可能的长时间处理
    });
    return response.data.data; // 假设返回的图片数据在 data 字段中
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // 添加 5 秒延迟before重试
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

// 额外的改进：添加一个获取生成状态的函数
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get('taskId');
  
  if (!taskId) {
    return NextResponse.json({ error: '缺少 taskId 参数' }, { status: 400 });
  }

  try {
    const response = await axios.get(`${FLUX_API_URL}/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
      }
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching task status:', error);
    return NextResponse.json({ error: '获取任务状态失败' }, { status: 500 });
  }
}
