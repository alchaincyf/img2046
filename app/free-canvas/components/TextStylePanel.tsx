'use client';

import React, { useState, useEffect } from 'react';
import { X, Type, Palette, Square } from 'lucide-react';
import { useCanvasStore } from '../store/canvasStore';

interface TextStylePanelProps {
  onClose: () => void;
}

const fonts = {
  chinese: [
    { name: 'Noto Sans SC', label: '思源黑体', sample: '永' },
    { name: 'Noto Serif SC', label: '思源宋体', sample: '永' },
    { name: 'ZCOOL KuaiLe', label: '站酷快乐体', sample: '乐' },
    { name: 'ZCOOL QingKe HuangYou', label: '站酷庆科黄油体', sample: '酷' },
    { name: 'ZCOOL XiaoWei', label: '站酷小薇体', sample: '薇' },
    { name: 'Ma Shan Zheng', label: '马善政楷体', sample: '书' },
    { name: 'Zhi Mang Xing', label: '芝麻体', sample: '芝' },
    { name: 'Liu Jian Mao Cao', label: '刘建毛草体', sample: '草' },
  ],
  english: [
    { name: 'Roboto', label: 'Roboto', sample: 'Aa' },
    { name: 'Open Sans', label: 'Open Sans', sample: 'Aa' },
    { name: 'Montserrat', label: 'Montserrat', sample: 'Aa' },
    { name: 'Playfair Display', label: 'Playfair', sample: 'Aa' },
    { name: 'Oswald', label: 'Oswald', sample: 'Aa' },
    { name: 'Pacifico', label: 'Pacifico', sample: 'Aa' },
    { name: 'Dancing Script', label: 'Dancing', sample: 'Aa' },
  ],
};

const colors = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
  '#F8B739', '#52C234', '#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E',
];

const TextStylePanel: React.FC<TextStylePanelProps> = ({ onClose }) => {
  const { getSelectedElements, updateElement, addElement, canvasState } = useCanvasStore();
  const selectedElements = getSelectedElements();
  const textElement = selectedElements.find(el => el.type === 'text');
  
  const [fontSize, setFontSize] = useState((textElement?.data as any)?.fontSize || 16);
  const [fontFamily, setFontFamily] = useState((textElement?.data as any)?.fontFamily || 'Noto Sans SC');
  const [textColor, setTextColor] = useState((textElement?.data as any)?.fill || '#000000');
  const [backgroundColor, setBackgroundColor] = useState((textElement?.data as any)?.backgroundColor || 'transparent');
  const [bold, setBold] = useState((textElement?.data as any)?.fontWeight === 'bold');
  const [italic, setItalic] = useState((textElement?.data as any)?.fontStyle === 'italic');
  const [underline, setUnderline] = useState((textElement?.data as any)?.textDecoration === 'underline');

  // Automatically apply styles whenever they change
  useEffect(() => {
    if (textElement) {
      updateElement(textElement.id, {
        data: {
          ...textElement.data,
          fontSize,
          fontFamily,
          fill: textColor,
          backgroundColor,
          fontStyle: italic ? 'italic' : 'normal',
          fontWeight: bold ? 'bold' : 'normal',
          textDecoration: underline ? 'underline' : 'none',
        } as any,
      });
    }
  }, [fontSize, fontFamily, textColor, backgroundColor, bold, italic, underline, textElement?.id]);

  // Remove applyStyle function - no longer needed

  const createStyledText = () => {
    addElement({
      type: 'text',
      x: 100,
      y: 100,
      data: {
        type: 'text',
        text: '新建文本',
        fontSize,
        fontFamily,
        fill: textColor,
        backgroundColor,
        fontStyle: italic ? 'italic' : 'normal',
        fontWeight: bold ? 'bold' : 'normal',
        textDecoration: underline ? 'underline' : 'none',
      },
    });
  };

  return (
    <div className="absolute top-20 right-4 z-20 w-80 bg-white rounded-lg shadow-xl p-4 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Type size={20} />
          文字样式
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-4">
        {/* 字体大小 */}
        <div>
          <label className="text-sm text-gray-600 block mb-2">字体大小</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="8"
              max="144"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min="8"
              max="144"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-16 px-2 py-1 border rounded text-sm"
            />
          </div>
        </div>

        {/* 字体样式按钮 */}
        <div>
          <label className="text-sm text-gray-600 block mb-2">字体样式</label>
          <div className="flex gap-2">
            <button
              onClick={() => setBold(!bold)}
              className={`px-3 py-1 rounded border ${
                bold ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300'
              }`}
            >
              <strong>B</strong>
            </button>
            <button
              onClick={() => setItalic(!italic)}
              className={`px-3 py-1 rounded border ${
                italic ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300'
              }`}
            >
              <em>I</em>
            </button>
            <button
              onClick={() => setUnderline(!underline)}
              className={`px-3 py-1 rounded border ${
                underline ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300'
              }`}
            >
              <u>U</u>
            </button>
          </div>
        </div>

        {/* 中文字体 */}
        <div>
          <label className="text-sm text-gray-600 block mb-2">中文字体</label>
          <div className="grid grid-cols-2 gap-2">
            {fonts.chinese.map((font) => (
              <button
                key={font.name}
                onClick={() => setFontFamily(font.name)}
                className={`p-2 border rounded text-sm hover:bg-gray-50 transition-colors ${
                  fontFamily === font.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                style={{ fontFamily: font.name }}
              >
                <span className="text-lg">{font.sample}</span>
                <span className="block text-xs text-gray-500 mt-1">{font.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 英文字体 */}
        <div>
          <label className="text-sm text-gray-600 block mb-2">英文字体</label>
          <div className="grid grid-cols-2 gap-2">
            {fonts.english.map((font) => (
              <button
                key={font.name}
                onClick={() => setFontFamily(font.name)}
                className={`p-2 border rounded text-sm hover:bg-gray-50 transition-colors ${
                  fontFamily === font.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                style={{ fontFamily: font.name }}
              >
                <span className="text-lg">{font.sample}</span>
                <span className="block text-xs text-gray-500 mt-1">{font.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 文字颜色 */}
        <div>
          <label className="text-sm text-gray-600 block mb-2">
            <Palette size={14} className="inline mr-1" />
            文字颜色
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-12 h-8 border rounded cursor-pointer"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="flex-1 px-2 py-1 border rounded text-sm font-mono"
            />
          </div>
          <div className="grid grid-cols-8 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setTextColor(color)}
                className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* 背景颜色 */}
        <div>
          <label className="text-sm text-gray-600 block mb-2">
            <Square size={14} className="inline mr-1" />
            背景颜色
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="color"
              value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-12 h-8 border rounded cursor-pointer"
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="flex-1 px-2 py-1 border rounded text-sm font-mono"
            />
            <button
              onClick={() => setBackgroundColor('transparent')}
              className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
            >
              透明
            </button>
          </div>
          <div className="grid grid-cols-8 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setBackgroundColor(color)}
                className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* 预览 */}
        <div>
          <label className="text-sm text-gray-600 block mb-2">预览</label>
          <div className="p-4 border rounded bg-gray-50">
            <div
              style={{
                fontFamily,
                fontSize: `${Math.min(fontSize, 48)}px`,
                color: textColor,
                backgroundColor: backgroundColor === 'transparent' ? 'transparent' : backgroundColor,
                fontWeight: bold ? 'bold' : 'normal',
                fontStyle: italic ? 'italic' : 'normal',
                textDecoration: underline ? 'underline' : 'none',
                padding: '8px',
                borderRadius: '4px',
              }}
            >
              {fontFamily.includes('SC') || fontFamily.includes('ZCOOL') || fontFamily.includes('Ma Shan') || fontFamily.includes('Zhi Mang') || fontFamily.includes('Liu Jian')
                ? '自由画布 Creative Canvas'
                : 'Creative Canvas 自由画布'}
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 pt-2 border-t">
          {textElement ? (
            <div className="flex-1 text-center text-sm text-gray-500">
              样式已自动应用
            </div>
          ) : (
            <button
              onClick={createStyledText}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              创建文字
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextStylePanel;