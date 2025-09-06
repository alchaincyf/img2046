'use client';

import React from 'react';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  Trash2,
  Square,
  Circle,
  Type,
  Image,
  Minus
} from 'lucide-react';
import { useCanvasStore } from '../store/canvasStore';

interface LayersPanelProps {
  onClose?: () => void;
}

const LayersPanel: React.FC<LayersPanelProps> = ({ onClose }) => {
  const {
    elements,
    canvasState,
    selectElement,
    updateElement,
    deleteElement,
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,
  } = useCanvasStore();

  // Sort elements by zIndex in reverse order (top layer first)
  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'rect':
        return <Square size={14} />;
      case 'circle':
        return <Circle size={14} />;
      case 'text':
        return <Type size={14} />;
      case 'image':
        return <Image size={14} />;
      case 'line':
        return <Minus size={14} />;
      default:
        return <Square size={14} />;
    }
  };

  const getElementName = (element: any) => {
    switch (element.type) {
      case 'rect':
        return '矩形';
      case 'circle':
        return '圆形';
      case 'text':
        return element.data.text?.substring(0, 10) || '文本';
      case 'image':
        return '图片';
      case 'line':
        return element.data.points?.length > 4 ? '画笔路径' : '直线';
      default:
        return '元素';
    }
  };

  const toggleVisibility = (id: string, currentVisibility: boolean) => {
    updateElement(id, { visible: !currentVisibility });
  };

  const toggleLock = (id: string, currentLock: boolean) => {
    updateElement(id, { locked: !currentLock });
  };

  return (
    <div className="absolute top-20 left-4 z-20 w-64 bg-white rounded-lg shadow-xl max-h-[60vh] flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Layers size={20} />
          图层管理
        </h3>
        <span className="text-xs text-gray-500">
          {elements.length} 个图层
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sortedElements.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            暂无图层
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sortedElements.map((element, index) => {
              const isSelected = canvasState.selectedIds.includes(element.id);
              const isVisible = element.visible !== false;
              const isLocked = element.locked === true;

              return (
                <div
                  key={element.id}
                  className={`
                    flex items-center gap-2 p-2 rounded cursor-pointer transition-all
                    ${isSelected 
                      ? 'bg-blue-50 border border-blue-300' 
                      : 'hover:bg-gray-50 border border-transparent'
                    }
                    ${!isVisible ? 'opacity-50' : ''}
                  `}
                  onClick={() => selectElement(element.id)}
                >
                  {/* Element Icon and Name */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className={`
                      ${isSelected ? 'text-blue-600' : 'text-gray-600'}
                    `}>
                      {getElementIcon(element.type)}
                    </span>
                    <span className={`
                      text-sm truncate
                      ${isSelected ? 'font-medium text-blue-900' : 'text-gray-700'}
                    `}>
                      {getElementName(element)}
                    </span>
                  </div>

                  {/* Layer Controls */}
                  <div className="flex items-center gap-1">
                    {/* Visibility Toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVisibility(element.id, isVisible);
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title={isVisible ? '隐藏' : '显示'}
                    >
                      {isVisible ? (
                        <Eye size={14} className="text-gray-600" />
                      ) : (
                        <EyeOff size={14} className="text-gray-400" />
                      )}
                    </button>

                    {/* Lock Toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLock(element.id, isLocked);
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title={isLocked ? '解锁' : '锁定'}
                    >
                      {isLocked ? (
                        <Lock size={14} className="text-gray-600" />
                      ) : (
                        <Unlock size={14} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Layer Actions */}
      {canvasState.selectedIds.length > 0 && (
        <div className="border-t p-2">
          <div className="flex justify-between">
            <div className="flex gap-1">
              <button
                onClick={() => canvasState.selectedIds.forEach(id => bringToFront(id))}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                title="置于顶层"
              >
                <ChevronsUp size={16} />
              </button>
              <button
                onClick={() => canvasState.selectedIds.forEach(id => bringForward(id))}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                title="上移一层"
              >
                <ChevronUp size={16} />
              </button>
              <button
                onClick={() => canvasState.selectedIds.forEach(id => sendBackward(id))}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                title="下移一层"
              >
                <ChevronDown size={16} />
              </button>
              <button
                onClick={() => canvasState.selectedIds.forEach(id => sendToBack(id))}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                title="置于底层"
              >
                <ChevronsDown size={16} />
              </button>
            </div>
            <button
              onClick={() => canvasState.selectedIds.forEach(id => deleteElement(id))}
              className="p-1.5 hover:bg-red-100 text-red-600 rounded transition-colors"
              title="删除选中图层"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayersPanel;