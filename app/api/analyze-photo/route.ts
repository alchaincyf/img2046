import { NextRequest, NextResponse } from 'next/server';

const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const ZHIPU_API_KEY = 'c2c60c4954b745f984d00a1fccc3622b.rSzpts69xVegxKYG';

interface Word {
  word: string;
  translation: string;
  pronunciation?: string;
  example?: string;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '请上传图片文件' }, { status: 400 });
    }

    // 将图片转换为base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';

    // 调用智谱AI API进行图像识别
    const response = await fetch(ZHIPU_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ZHIPU_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "glm-4-6v", // 使用4.6v内测版本
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`
                }
              },
              {
                type: "text",
                text: `请分析这张图片的主体内容和氛围，然后生成10个与这张图片相关的英语单词。

要求：
1. 单词应该与图片的主体、场景、氛围、颜色、情感等相关
2. 难度适中，适合英语学习者
3. 包含名词、形容词、动词等不同词性
4. 每个单词需要提供：英文单词、中文翻译、音标（可选）、例句（可选）

请以JSON格式返回，格式如下：
{
  "description": "图片描述（中文，50字以内）",
  "words": [
    {
      "word": "英文单词",
      "translation": "中文翻译",
      "pronunciation": "音标",
      "example": "例句"
    }
  ]
}

只返回JSON，不要有其他文字说明。`
              }
            ]
          }
        ],
        temperature: 0.7,
        top_p: 0.8,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // 解析AI返回的内容
    const aiResponse = data.choices[0].message.content;
    console.log('AI Response:', aiResponse);

    // 尝试从响应中提取JSON
    let result;
    try {
      // 如果响应包含代码块，提取JSON部分
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) ||
                        aiResponse.match(/```\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1]);
      } else {
        result = JSON.parse(aiResponse);
      }
    } catch (parseError) {
      console.error('JSON解析错误:', parseError);
      // 如果解析失败，返回原始内容
      return NextResponse.json({
        error: 'AI返回格式错误',
        rawResponse: aiResponse
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      description: result.description || '图片分析完成',
      words: result.words || []
    });

  } catch (error) {
    console.error('图片分析错误:', error);
    return NextResponse.json({
      error: '图片分析过程中发生错误: ' + (error as Error).message
    }, { status: 500 });
  }
}
