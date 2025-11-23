import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import sharp from 'sharp';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const MAX_SIZE = 500 * 1024; // 500KB
const IMAGES_KEY = 'shared-images';

interface ImageData {
  id: string;
  data: string; // base64
  name: string;
  uploadedAt: number;
}

// 压缩图片到 500KB 以下
async function compressImage(buffer: Buffer): Promise<Buffer> {
  let quality = 90;
  let result = await sharp(buffer)
    .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality })
    .toBuffer();

  // 逐步降低质量直到小于 500KB
  while (result.length > MAX_SIZE && quality > 20) {
    quality -= 10;
    result = await sharp(buffer)
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality })
      .toBuffer();
  }

  // 如果还是太大，缩小尺寸
  if (result.length > MAX_SIZE) {
    result = await sharp(buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 70 })
      .toBuffer();
  }

  return result;
}

// POST: 上传图片
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '没有文件' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const compressed = await compressImage(buffer);
    const base64 = compressed.toString('base64');

    const imageData: ImageData = {
      id: Date.now().toString(),
      data: base64,
      name: file.name,
      uploadedAt: Date.now(),
    };

    // 获取现有图片列表
    const existing = await redis.get<ImageData[]>(IMAGES_KEY) || [];

    // 添加新图片到列表开头
    existing.unshift(imageData);

    // 保存回 Redis (限制最多 100 张图片)
    await redis.set(IMAGES_KEY, existing.slice(0, 100));

    return NextResponse.json({
      success: true,
      image: {
        id: imageData.id,
        name: imageData.name,
        uploadedAt: imageData.uploadedAt,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: '上传失败' }, { status: 500 });
  }
}

// GET: 获取所有图片
export async function GET() {
  try {
    const images = await redis.get<ImageData[]>(IMAGES_KEY) || [];
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Get images error:', error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
  }
}
