import React, { useState } from 'react';
import axios from 'axios';

export default function MainComponent() {
  const [inputType, setInputType] = useState<'svg' | 'article'>('svg');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (inputType === 'svg') {
        // 原有的SVG处理逻辑
        // ...
      } else {
        const response = await axios.post('/api/article-to-svg', { article: input });
        setResult(response.data.svg);
      }
    } catch (error) {
      console.error('处理错误:', error);
      setResult('处理失败,请重试。');
    }
  };

  return (
    <div>
      <select value={inputType} onChange={(e) => setInputType(e.target.value as 'svg' | 'article')}>
        <option value="svg">SVG代码</option>
        <option value="article">文章</option>
      </select>
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={inputType === 'svg' ? '输入SVG代码' : '输入文章内容'}
        />
        <button type="submit">生成</button>
      </form>
      <div>
        {result && <div dangerouslySetInnerHTML={{ __html: result }} />}
      </div>
    </div>
  );
}