'use client';

import React, { useState, useEffect } from 'react';
import { Palette, Pipette, X } from 'lucide-react';
import { useCanvasStore } from '../store/canvasStore';
import { useMultiCanvasStore } from '../store/multiCanvasStore';

interface ColorPanelProps {
  onClose?: () => void;
}

const ColorPanel: React.FC<ColorPanelProps> = ({ onClose }) => {
  const { canvasState, getSelectedElements, updateElement } = useCanvasStore();
  const { drawingStyle, setDrawingStyle } = useMultiCanvasStore();
  
  const selectedElements = getSelectedElements();
  const selectedElement = selectedElements.length === 1 ? selectedElements[0] : null;
  
  // Initialize from selected element or drawing style
  const initFillColor = (selectedElement?.data as any)?.fill || drawingStyle?.fill || '#ffffff';
  const initStrokeColor = (selectedElement?.data as any)?.stroke || drawingStyle?.stroke || '#94a3b8';
  const initStrokeWidth = (selectedElement?.data as any)?.strokeWidth || drawingStyle?.strokeWidth || 1;
  
  const [fillColor, setFillColor] = useState(initFillColor);
  const [strokeColor, setStrokeColor] = useState(initStrokeColor);
  const [strokeWidth, setStrokeWidth] = useState(initStrokeWidth);
  const [fillEnabled, setFillEnabled] = useState(fillColor !== 'transparent');
  const [strokeEnabled, setStrokeEnabled] = useState(strokeColor !== 'transparent');

  // Update when selection changes
  useEffect(() => {
    if (selectedElement) {
      const data = selectedElement.data as any;
      setFillColor(data.fill || '#ffffff');
      setStrokeColor(data.stroke || '#94a3b8');
      setStrokeWidth(data.strokeWidth || 1);
      setFillEnabled(data.fill !== 'transparent' && data.fill !== undefined);
      setStrokeEnabled(data.stroke !== 'transparent' && data.stroke !== undefined);
    }
  }, [selectedElement?.id]);

  const presetColors = [
    '#ffffff', '#000000', '#94a3b8', '#64748b', '#475569',
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e', '#fb7185', '#fbbf24', '#fde047',
  ];

  const applyStyles = () => {
    const newFill = fillEnabled ? fillColor : 'transparent';
    const newStroke = strokeEnabled ? strokeColor : 'transparent';
    
    // Apply to selected elements
    if (selectedElements.length > 0) {
      selectedElements.forEach((element) => {
        if (element.type === 'rect' || element.type === 'circle' || element.type === 'line' || element.type === 'path') {
          updateElement(element.id, {
            data: {
              ...element.data,
              fill: newFill,
              stroke: newStroke,
              strokeWidth,
            } as any,
          });
        }
      });
    }
    
    // Update default drawing style
    setDrawingStyle({
      fill: newFill,
      stroke: newStroke,
      strokeWidth,
    });
  };

  const handleFillChange = (color: string) => {
    setFillColor(color);
  };

  const handleStrokeChange = (color: string) => {
    setStrokeColor(color);
  };

  const handleStrokeWidthChange = (width: number) => {
    setStrokeWidth(width);
  };

  // Apply on every change
  useEffect(() => {
    applyStyles();
  }, [fillColor, strokeColor, strokeWidth, fillEnabled, strokeEnabled]);

  return (
    <div className="absolute top-20 right-4 z-20 w-72 bg-white rounded-lg shadow-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Palette size={20} />
          {selectedElements.length > 0 ? '编辑样式' : '绘制样式'}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Fill Color */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">填充颜色</label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={fillEnabled}
                onChange={(e) => setFillEnabled(e.target.checked)}
                className="rounded"
              />
              <span className="text-xs text-gray-600">启用</span>
            </label>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="relative">
              <input
                type="color"
                value={fillColor}
                onChange={(e) => handleFillChange(e.target.value)}
                disabled={!fillEnabled}
                className="w-12 h-8 border rounded cursor-pointer disabled:opacity-50"
              />
            </div>
            <input
              type="text"
              value={fillColor}
              onChange={(e) => handleFillChange(e.target.value)}
              disabled={!fillEnabled}
              className="flex-1 px-2 py-1 border rounded text-sm font-mono disabled:opacity-50"
              placeholder="#000000"
            />
          </div>
          
          <div className="grid grid-cols-10 gap-1">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => handleFillChange(color)}
                disabled={!fillEnabled}
                className="w-6 h-6 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors disabled:opacity-50"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Stroke Color */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">边框颜色</label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={strokeEnabled}
                onChange={(e) => setStrokeEnabled(e.target.checked)}
                className="rounded"
              />
              <span className="text-xs text-gray-600">启用</span>
            </label>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="relative">
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => handleStrokeChange(e.target.value)}
                disabled={!strokeEnabled}
                className="w-12 h-8 border rounded cursor-pointer disabled:opacity-50"
              />
            </div>
            <input
              type="text"
              value={strokeColor}
              onChange={(e) => handleStrokeChange(e.target.value)}
              disabled={!strokeEnabled}
              className="flex-1 px-2 py-1 border rounded text-sm font-mono disabled:opacity-50"
              placeholder="#000000"
            />
          </div>
          
          <div className="grid grid-cols-10 gap-1">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => handleStrokeChange(color)}
                disabled={!strokeEnabled}
                className="w-6 h-6 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors disabled:opacity-50"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Stroke Width */}
        {strokeEnabled && (
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              边框宽度: {strokeWidth}px
            </label>
            <input
              type="range"
              min="0.5"
              max="20"
              step="0.5"
              value={strokeWidth}
              onChange={(e) => handleStrokeWidthChange(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.5</span>
              <span>10</span>
              <span>20</span>
            </div>
          </div>
        )}

        {/* Quick Presets */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">快速预设</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                setFillColor('transparent');
                setStrokeColor('#3b82f6');
                setStrokeWidth(2);
                setFillEnabled(false);
                setStrokeEnabled(true);
              }}
              className="p-2 text-xs border rounded hover:bg-gray-50 transition-colors"
            >
              仅边框
            </button>
            <button
              onClick={() => {
                setFillColor('#3b82f6');
                setStrokeColor('transparent');
                setStrokeWidth(0);
                setFillEnabled(true);
                setStrokeEnabled(false);
              }}
              className="p-2 text-xs border rounded hover:bg-gray-50 transition-colors"
            >
              仅填充
            </button>
            <button
              onClick={() => {
                setFillColor('#fef3c7');
                setStrokeColor('#f59e0b');
                setStrokeWidth(2);
                setFillEnabled(true);
                setStrokeEnabled(true);
              }}
              className="p-2 text-xs border rounded hover:bg-gray-50 transition-colors"
            >
              填充+边框
            </button>
          </div>
        </div>

        {/* Info */}
        {selectedElements.length > 0 && (
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            正在编辑 {selectedElements.length} 个选中元素的样式
          </div>
        )}
        {selectedElements.length === 0 && (
          <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
            设置新建图形的默认样式
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPanel;