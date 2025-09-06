'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Maximize, Move } from 'lucide-react';
import { useCanvasStore } from '../store/canvasStore';
import { CanvasElement } from '../types';

interface SizePanelProps {
  element: CanvasElement;
}

const SizePanel: React.FC<SizePanelProps> = ({ element }) => {
  const { updateElement } = useCanvasStore();
  
  // Calculate actual dimensions based on element type
  const getElementDimensions = () => {
    if (element.type === 'circle' && element.data.type === 'circle') {
      const radius = element.data.radius || 50;
      return { width: radius * 2, height: radius * 2 };
    }
    return {
      width: element.width || 100,
      height: element.height || 100,
    };
  };

  const dimensions = getElementDimensions();
  const [width, setWidth] = useState(Math.round(dimensions.width));
  const [height, setHeight] = useState(Math.round(dimensions.height));
  const [x, setX] = useState(Math.round(element.x));
  const [y, setY] = useState(Math.round(element.y));
  // Default to locked for images, unlocked for other elements
  const [aspectRatioLocked, setAspectRatioLocked] = useState(element.type === 'image');
  const [aspectRatio, setAspectRatio] = useState(dimensions.width / dimensions.height);

  // Update local state when element changes
  useEffect(() => {
    const dims = getElementDimensions();
    setWidth(Math.round(dims.width));
    setHeight(Math.round(dims.height));
    setX(Math.round(element.x));
    setY(Math.round(element.y));
    setAspectRatio(dims.width / dims.height);
    // Reset aspect ratio lock based on element type
    setAspectRatioLocked(element.type === 'image');
  }, [element.id, element.x, element.y, element.width, element.height, element.type]);

  const handleWidthChange = (newWidth: number) => {
    if (isNaN(newWidth) || newWidth <= 0) return;
    
    setWidth(newWidth);
    
    let newHeight = height;
    if (aspectRatioLocked) {
      newHeight = Math.round(newWidth / aspectRatio);
      setHeight(newHeight);
    }
    
    applySize(newWidth, aspectRatioLocked ? newHeight : height);
  };

  const handleHeightChange = (newHeight: number) => {
    if (isNaN(newHeight) || newHeight <= 0) return;
    
    setHeight(newHeight);
    
    let newWidth = width;
    if (aspectRatioLocked) {
      newWidth = Math.round(newHeight * aspectRatio);
      setWidth(newWidth);
    }
    
    applySize(aspectRatioLocked ? newWidth : width, newHeight);
  };

  const handlePositionChange = (newX: number, newY: number) => {
    setX(newX);
    setY(newY);
    updateElement(element.id, { x: newX, y: newY });
  };

  const applySize = (w: number, h: number) => {
    if (element.type === 'text') {
      // For text, only update the box size, NOT the font size
      // This gives users control over text wrapping
      updateElement(element.id, {
        width: w,
        height: h,
        scaleX: 1,
        scaleY: 1,
      });
    } else if (element.type === 'circle' && element.data.type === 'circle') {
      // For circles, use the average as radius
      const radius = Math.round((w + h) / 4);
      updateElement(element.id, {
        data: { ...element.data, radius }
      });
    } else {
      // For rectangles and images
      updateElement(element.id, {
        width: w,
        height: h,
        scaleX: 1,
        scaleY: 1,
      });
    }
  };

  // Quick resize buttons
  const quickResize = (ratio: { w: number; h: number }) => {
    const currentMax = Math.max(width, height);
    const newWidth = Math.round((currentMax * ratio.w) / Math.max(ratio.w, ratio.h));
    const newHeight = Math.round((currentMax * ratio.h) / Math.max(ratio.w, ratio.h));
    
    setWidth(newWidth);
    setHeight(newHeight);
    setAspectRatio(newWidth / newHeight);
    applySize(newWidth, newHeight);
  };

  return (
    <div className="absolute top-20 left-4 z-20 bg-white rounded-lg shadow-xl p-4 w-72">
      <div className="space-y-4">
        {/* Position */}
        <div>
          <h4 className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
            <Move size={12} />
            位置
          </h4>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500">X</label>
              <input
                type="number"
                value={x}
                onChange={(e) => handlePositionChange(Number(e.target.value), y)}
                className="w-full px-2 py-1 text-sm border rounded"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500">Y</label>
              <input
                type="number"
                value={y}
                onChange={(e) => handlePositionChange(x, Number(e.target.value))}
                className="w-full px-2 py-1 text-sm border rounded"
              />
            </div>
          </div>
        </div>

        {/* Size */}
        <div>
          <h4 className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
            <Maximize size={12} />
            尺寸
          </h4>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="text-xs text-gray-500">宽度</label>
              <input
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                className="w-full px-2 py-1 text-sm border rounded"
              />
            </div>
            <button
              onClick={() => setAspectRatioLocked(!aspectRatioLocked)}
              className={`p-1.5 rounded transition-colors ${
                aspectRatioLocked 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={aspectRatioLocked ? '解锁比例' : '锁定比例'}
            >
              {aspectRatioLocked ? <Lock size={16} /> : <Unlock size={16} />}
            </button>
            <div className="flex-1">
              <label className="text-xs text-gray-500">高度</label>
              <input
                type="number"
                value={height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className="w-full px-2 py-1 text-sm border rounded"
              />
            </div>
          </div>
        </div>

        {/* Quick Ratios */}
        <div>
          <h4 className="text-xs font-semibold text-gray-600 mb-2">快速比例</h4>
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => quickResize({ w: 1, h: 1 })}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              1:1
            </button>
            <button
              onClick={() => quickResize({ w: 4, h: 3 })}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              4:3
            </button>
            <button
              onClick={() => quickResize({ w: 3, h: 4 })}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              3:4
            </button>
            <button
              onClick={() => quickResize({ w: 16, h: 9 })}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              16:9
            </button>
            <button
              onClick={() => quickResize({ w: 9, h: 16 })}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              9:16
            </button>
            <button
              onClick={() => quickResize({ w: 3, h: 2 })}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              3:2
            </button>
            <button
              onClick={() => quickResize({ w: 2, h: 3 })}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              2:3
            </button>
            <button
              onClick={() => quickResize({ w: Math.round(width), h: Math.round(height) })}
              className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
            >
              当前
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizePanel;