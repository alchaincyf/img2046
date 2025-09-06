'use client';

import React from 'react';
import { X } from 'lucide-react';
import { useCanvasStore } from '../store/canvasStore';

interface PropertyPanelProps {
  onClose: () => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ onClose }) => {
  const { getSelectedElements, updateElement } = useCanvasStore();
  const selectedElements = getSelectedElements();

  if (selectedElements.length === 0) {
    return null;
  }

  const element = selectedElements[0]; // For now, show properties of first selected element

  const handleColorChange = (property: string, value: string) => {
    updateElement(element.id, {
      data: {
        ...element.data,
        [property]: value,
      },
    });
  };

  const handleNumberChange = (property: string, value: number) => {
    updateElement(element.id, {
      data: {
        ...element.data,
        [property]: value,
      },
    });
  };

  const handlePositionChange = (property: 'x' | 'y' | 'width' | 'height', value: number) => {
    updateElement(element.id, {
      [property]: value,
    });
  };

  return (
    <div className="absolute top-20 right-4 z-10 w-64 bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">属性</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {/* Position */}
        <div>
          <label className="text-xs text-gray-600 block mb-1">位置</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={Math.round(element.x)}
              onChange={(e) => handlePositionChange('x', Number(e.target.value))}
              className="px-2 py-1 border rounded text-sm"
              placeholder="X"
            />
            <input
              type="number"
              value={Math.round(element.y)}
              onChange={(e) => handlePositionChange('y', Number(e.target.value))}
              className="px-2 py-1 border rounded text-sm"
              placeholder="Y"
            />
          </div>
        </div>

        {/* Size */}
        {(element.width !== undefined || element.height !== undefined) && (
          <div>
            <label className="text-xs text-gray-600 block mb-1">尺寸</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={Math.round(element.width || 0)}
                onChange={(e) => handlePositionChange('width', Number(e.target.value))}
                className="px-2 py-1 border rounded text-sm"
                placeholder="宽度"
              />
              <input
                type="number"
                value={Math.round(element.height || 0)}
                onChange={(e) => handlePositionChange('height', Number(e.target.value))}
                className="px-2 py-1 border rounded text-sm"
                placeholder="高度"
              />
            </div>
          </div>
        )}

        {/* Fill Color */}
        {element.data.type !== 'image' && 'fill' in element.data && (
          <div>
            <label className="text-xs text-gray-600 block mb-1">填充颜色</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={element.data.fill || '#000000'}
                onChange={(e) => handleColorChange('fill', e.target.value)}
                className="w-12 h-8 border rounded cursor-pointer"
              />
              <input
                type="text"
                value={element.data.fill || '#000000'}
                onChange={(e) => handleColorChange('fill', e.target.value)}
                className="flex-1 px-2 py-1 border rounded text-sm"
              />
            </div>
          </div>
        )}

        {/* Stroke Color */}
        {'stroke' in element.data && (
          <div>
            <label className="text-xs text-gray-600 block mb-1">描边颜色</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={element.data.stroke || '#000000'}
                onChange={(e) => handleColorChange('stroke', e.target.value)}
                className="w-12 h-8 border rounded cursor-pointer"
              />
              <input
                type="text"
                value={element.data.stroke || '#000000'}
                onChange={(e) => handleColorChange('stroke', e.target.value)}
                className="flex-1 px-2 py-1 border rounded text-sm"
              />
            </div>
          </div>
        )}

        {/* Stroke Width */}
        {'strokeWidth' in element.data && (
          <div>
            <label className="text-xs text-gray-600 block mb-1">描边宽度</label>
            <input
              type="range"
              min="1"
              max="20"
              value={element.data.strokeWidth || 2}
              onChange={(e) => handleNumberChange('strokeWidth', Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-xs text-gray-600">
              {element.data.strokeWidth || 2}px
            </div>
          </div>
        )}

        {/* Opacity */}
        <div>
          <label className="text-xs text-gray-600 block mb-1">透明度</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={element.opacity || 1}
            onChange={(e) => updateElement(element.id, { opacity: Number(e.target.value) })}
            className="w-full"
          />
          <div className="text-center text-xs text-gray-600">
            {Math.round((element.opacity || 1) * 100)}%
          </div>
        </div>

        {/* Text Properties */}
        {element.data.type === 'text' && (
          <>
            <div>
              <label className="text-xs text-gray-600 block mb-1">文本内容</label>
              <textarea
                value={element.data.text}
                onChange={(e) => handleColorChange('text', e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
                rows={3}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">字体大小</label>
              <input
                type="number"
                value={element.data.fontSize || 16}
                onChange={(e) => handleNumberChange('fontSize', Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyPanel;