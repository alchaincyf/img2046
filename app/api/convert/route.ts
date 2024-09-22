import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const format = formData.get('format') as string;

    if (!file || !format) {
      return NextResponse.json({ error: 'File and format are required' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let convertedBuffer;
    if (format === 'pdf') {
      // Convert image to PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      let image;
      if (file.type.startsWith('image/jpeg')) {
        image = await pdfDoc.embedJpg(buffer);
      } else if (file.type.startsWith('image/png')) {
        image = await pdfDoc.embedPng(buffer);
      } else {
        // Convert other image formats to PNG first
        const pngBuffer = await sharp(buffer).png().toBuffer();
        image = await pdfDoc.embedPng(pngBuffer);
      }
      const { width, height } = image.scale(1);
      page.setSize(width, height);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
      });
      convertedBuffer = await pdfDoc.save();
    } else if (file.type === 'application/pdf') {
      // Convert PDF to image
      const pdfDoc = await PDFDocument.load(buffer);
      const pages = pdfDoc.getPages();
      if (pages.length > 0) {
        const page = pages[0];
        // Instead of using render(), we'll use pdf.js to render the PDF
        const pdfjsLib = require('pdfjs-dist');
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
        const pdfPage = await pdf.getPage(1);
        const viewport = pdfPage.getViewport({ scale: 2 });
        const canvas = new OffscreenCanvas(viewport.width, viewport.height);
        const context = canvas.getContext('2d');
        await pdfPage.render({ canvasContext: context, viewport: viewport }).promise;
        const pngImage = await canvas.convertToBlob({ type: 'image/png' });
        convertedBuffer = await sharp(await pngImage.arrayBuffer()).toFormat(format as keyof sharp.FormatEnum).toBuffer();
      } else {
        throw new Error('PDF is empty');
      }
    } else {
      // Image to image conversion
      convertedBuffer = await sharp(buffer).toFormat(format as keyof sharp.FormatEnum).toBuffer();
    }

    return new NextResponse(convertedBuffer, {
      status: 200,
      headers: {
        'Content-Type': format === 'pdf' ? 'application/pdf' : `image/${format}`,
        'Content-Disposition': `attachment; filename="converted.${format}"`,
      },
    });
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json({ error: 'Conversion failed: ' + (error as Error).message }, { status: 500 });
  }
}