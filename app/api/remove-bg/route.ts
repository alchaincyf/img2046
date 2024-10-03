import { NextRequest, NextResponse } from 'next/server';

const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json({ error: '缺少图像' }, { status: 400 });
    }

    const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY!,
      },
      body: await image.arrayBuffer(),
    });

    if (!removeBgResponse.ok) {
      throw new Error('Failed to remove background');
    }

    const removedBgImage = await removeBgResponse.arrayBuffer();

    return new NextResponse(removedBgImage, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (error) {
    console.error('Error removing background:', error);
    return NextResponse.json({ error: '去除背景时出错' }, { status: 500 });
  }
}