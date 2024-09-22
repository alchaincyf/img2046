import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  try {
    const { svgCode, format } = await req.json();

    if (!svgCode || !format) {
      return NextResponse.json({ error: 'SVG code and format are required' }, { status: 400 });
    }

    let convertedBuffer;
    if (format === 'png' || format === 'jpg') {
      const svgBuffer = Buffer.from(svgCode);
      convertedBuffer = await sharp(svgBuffer)
        .toFormat(format as keyof sharp.FormatEnum)
        .toBuffer();
    } else {
      return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
    }

    return new NextResponse(convertedBuffer, {
      status: 200,
      headers: {
        'Content-Type': `image/${format}`,
        'Content-Disposition': `attachment; filename="logo.${format}"`,
      },
    });
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json({ error: 'Conversion failed' }, { status: 500 });
  }
}