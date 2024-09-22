import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import jsPDF from 'jspdf';
import JSZip from 'jszip';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll('files') as File[];
  const targetFormat = formData.get('format') as string;

  console.log('API: Received request for format:', targetFormat);
  console.log('API: Number of files received:', files.length);

  if (!files || files.length === 0) {
    console.log('API: No files uploaded');
    return NextResponse.json({ error: '没有上传文件' }, { status: 400 });
  }

  try {
    if (targetFormat.toLowerCase() === 'pdf') {
      console.log('API: Converting to PDF');
      const pdf = new jsPDF();
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const image = await sharp(buffer).jpeg().toBuffer();
        const imageDataUrl = `data:image/jpeg;base64,${image.toString('base64')}`;
        pdf.addImage(imageDataUrl, 'JPEG', 10, 10, 190, 280);
        if (i < files.length - 1) pdf.addPage();
      }
      const pdfBuffer = pdf.output('arraybuffer');
      console.log('API: PDF conversion complete');
      const fileName = files.length === 1 ? `${files[0].name.split('.')[0]}_converted.pdf` : 'converted.pdf';
      return new NextResponse(pdfBuffer, {
        headers: { 
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      });
    } else {
      const format = targetFormat.toLowerCase();

      if (files.length === 1) {
        // 处理单个文件
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        console.log('API: Processing single file');

        let convertedBuffer;
        switch (format) {
          case 'jpg':
          case 'jpeg':
            convertedBuffer = await sharp(buffer).jpeg().toBuffer();
            break;
          case 'png':
            convertedBuffer = await sharp(buffer).png().toBuffer();
            break;
          case 'webp':
            convertedBuffer = await sharp(buffer).webp().toBuffer();
            break;
          case 'gif':
            convertedBuffer = await sharp(buffer).gif().toBuffer();
            break;
          default:
            throw new Error(`Unsupported format: ${format}`);
        }

        console.log('API: Single file conversion complete');
        const fileName = `${file.name.split('.')[0]}_converted.${format}`;
        return new NextResponse(convertedBuffer, {
          headers: { 
            'Content-Type': `image/${format}`,
            'Content-Disposition': `attachment; filename="${fileName}"`,
          },
        });
      } else {
        // 处理多个文件
        const zip = new JSZip();

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          console.log(`API: Processing file ${i + 1}/${files.length}`);

          let convertedBuffer;
          switch (format) {
            case 'jpg':
            case 'jpeg':
              convertedBuffer = await sharp(buffer).jpeg().toBuffer();
              break;
            case 'png':
              convertedBuffer = await sharp(buffer).png().toBuffer();
              break;
            case 'webp':
              convertedBuffer = await sharp(buffer).webp().toBuffer();
              break;
            case 'gif':
              convertedBuffer = await sharp(buffer).gif().toBuffer();
              break;
            default:
              throw new Error(`Unsupported format: ${format}`);
          }

          const fileName = `${file.name.split('.')[0]}_converted.${format}`;
          zip.file(fileName, convertedBuffer);
        }

        const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
        console.log('API: Multiple files conversion complete, zip file created');

        return new NextResponse(zipBuffer, {
          headers: { 
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="converted_images.zip"`,
          },
        });
      }
    }
  } catch (error) {
    console.error('API: 转换错误:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: `转换过程中出错: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: '转换过程中出错' }, { status: 500 });
  }
}