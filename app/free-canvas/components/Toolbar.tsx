'use client';

import React from 'react';
import {
  MousePointer2,
  Hand,
  Type,
  Square,
  Circle,
  Minus,
  Pen,
  Eraser,
  Undo2,
  Redo2,
  Copy,
  Clipboard,
  Trash2,
  Download,
  Upload,
  Save,
  Edit3,
  Grid,
  FileStack,
  Maximize,
  Maximize2,
  Fullscreen,
  Layers,
  Palette,
  HelpCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Image,
} from 'lucide-react';
import { useCanvasStore } from '../store/canvasStore';
import { Tool } from '../types';

interface ToolbarProps {
  onExport?: () => void;
  onImport?: () => void;
  onSave?: () => void;
  onRename?: () => void;
  onFullscreen?: () => void;
  onTextStyle?: () => void;
  onLayers?: () => void;
  onColorPanel?: () => void;
  onCanvasManager?: () => void;
  onHelp?: () => void;
  canvasName?: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ onExport, onImport, onSave, onRename, onFullscreen, onTextStyle, onLayers, onColorPanel, onCanvasManager, onHelp, canvasName }) => {
  const {
    currentTool,
    setTool,
    undo,
    redo,
    copy,
    paste,
    deleteElements,
    canvasState,
    setScale,
    resetView,
    toggleGrid,
    toggleSnapToGrid,
    history,
    historyIndex,
  } = useCanvasStore();

  const tools: { id: Tool; icon: React.ReactNode; label: string; shortcut?: string }[] = [
    { id: 'select', icon: <MousePointer2 size={20} />, label: '选择', shortcut: 'V' },
    { id: 'pan', icon: <Hand size={20} />, label: '平移', shortcut: 'H' },
    { id: 'text', icon: <Type size={20} />, label: '文本', shortcut: 'T' },
    { id: 'rect', icon: <Square size={20} />, label: '矩形', shortcut: 'R' },
    { id: 'circle', icon: <Circle size={20} />, label: '圆形', shortcut: 'C' },
    { id: 'line', icon: <Minus size={20} />, label: '直线', shortcut: 'L' },
    { id: 'pen', icon: <Pen size={20} />, label: '画笔', shortcut: 'P' },
    { id: 'eraser', icon: <Eraser size={20} />, label: '橡皮', shortcut: 'E' },
  ];

  const handleZoomIn = () => {
    const newScale = Math.min(10, canvasState.scale * 1.2);
    setScale(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(0.1, canvasState.scale / 1.2);
    setScale(newScale);
  };

  const handleDelete = () => {
    if (canvasState.selectedIds.length > 0) {
      deleteElements(canvasState.selectedIds);
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start">
      {/* Main Toolbar */}
      <div className="bg-white rounded-lg shadow-lg p-2 flex gap-1">
      {/* Tools */}
      <div className="flex gap-1 pr-2 border-r border-gray-200">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setTool(tool.id)}
            className={`p-2 rounded-lg transition-all relative group ${
              currentTool === tool.id
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
            title={`${tool.label} (${tool.shortcut})`}
          >
            {tool.icon}
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {tool.label} ({tool.shortcut})
            </span>
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-1 pr-2 border-r border-gray-200">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`p-2 rounded-lg transition-all group ${
            canUndo ? 'hover:bg-gray-100 text-gray-700' : 'text-gray-300 cursor-not-allowed'
          }`}
          title="撤销 (Cmd+Z)"
        >
          <Undo2 size={20} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`p-2 rounded-lg transition-all group ${
            canRedo ? 'hover:bg-gray-100 text-gray-700' : 'text-gray-300 cursor-not-allowed'
          }`}
          title="重做 (Cmd+Shift+Z)"
        >
          <Redo2 size={20} />
        </button>
        <button
          onClick={copy}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-all"
          title="复制 (Cmd+C)"
        >
          <Copy size={20} />
        </button>
        <button
          onClick={paste}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-all"
          title="粘贴 (Cmd+V)"
        >
          <Clipboard size={20} />
        </button>
        <button
          onClick={handleDelete}
          disabled={canvasState.selectedIds.length === 0}
          className={`p-2 rounded-lg transition-all ${
            canvasState.selectedIds.length > 0
              ? 'hover:bg-red-100 text-red-600'
              : 'text-gray-300 cursor-not-allowed'
          }`}
          title="删除 (Delete)"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* View */}
      <div className="flex gap-1 pr-2 border-r border-gray-200">
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-all"
          title="放大"
        >
          <ZoomIn size={20} />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-all"
          title="缩小"
        >
          <ZoomOut size={20} />
        </button>
        <button
          onClick={resetView}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-all"
          title="重置视图 (Cmd+0)"
        >
          <Maximize size={20} />
        </button>
        <div className="flex items-center px-2 text-sm text-gray-600 min-w-[60px]">
          {Math.round(canvasState.scale * 100)}%
        </div>
      </div>

      {/* Text Style */}
      {onTextStyle && (
        <div className="flex gap-1 pr-2 border-r border-gray-200">
          <button
            onClick={onTextStyle}
            className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all"
            title="文字样式"
          >
            <Type size={20} />
          </button>
        </div>
      )}

      {/* Settings */}
      <div className="flex gap-1 pr-2 border-r border-gray-200">
        <button
          onClick={toggleGrid}
          className={`p-2 rounded-lg transition-all ${
            canvasState.gridVisible
              ? 'bg-blue-100 text-blue-600'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          title="网格 (Cmd+G)"
        >
          <Grid size={20} />
        </button>
        <button
          onClick={toggleSnapToGrid}
          className={`p-2 rounded-lg transition-all ${
            canvasState.snapToGrid
              ? 'bg-blue-100 text-blue-600'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          title="吸附网格 (Cmd+Shift+G)"
        >
          <Layers size={20} />
        </button>
        {onColorPanel && (
          <button
            onClick={onColorPanel}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-all"
            title="颜色面板"
          >
            <Palette size={20} />
          </button>
        )}
        {onLayers && (
          <button
            onClick={onLayers}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-all"
            title="图层管理"
          >
            <Layers size={20} />
          </button>
        )}
      </div>

      {/* Import/Export */}
      <div className="flex gap-1">
        {onImport && (
          <button
            onClick={onImport}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-all"
            title="导入"
          >
            <Upload size={20} />
          </button>
        )}
        {onExport && (
          <button
            onClick={onExport}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-all"
            title="导出"
          >
            <Download size={20} />
          </button>
        )}
      </div>
    </div>

    {/* Title and Actions Bar */}
    <div className="bg-white rounded-lg shadow-lg px-3 py-2 flex items-center gap-3">
      {/* Canvas Name */}
      <button
        onClick={onRename}
        className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
        title="点击修改画布名称"
      >
        <Edit3 size={16} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-800">
          {canvasName || '未命名画布'}
        </span>
      </button>

      <div className="w-px h-6 bg-gray-200" />

      {/* Canvas Manager */}
      {onCanvasManager && (
        <button
          onClick={onCanvasManager}
          className="p-1.5 hover:bg-gray-100 text-gray-700 rounded transition-colors"
          title="画布管理"
        >
          <FileStack size={18} />
        </button>
      )}

      {/* Save */}
      {onSave && (
        <button
          onClick={onSave}
          className="p-1.5 hover:bg-gray-100 text-gray-700 rounded transition-colors"
          title="保存到本地 (Cmd+S)"
        >
          <Save size={18} />
        </button>
      )}

      {/* Fullscreen */}
      {onFullscreen && (
        <button
          onClick={onFullscreen}
          className="p-1.5 hover:bg-gray-100 text-gray-700 rounded transition-colors"
          title="全屏模式 (F11)"
        >
          <Fullscreen size={18} />
        </button>
      )}

      {/* Help */}
      {onHelp && (
        <button
          onClick={onHelp}
          className="p-1.5 hover:bg-gray-100 text-gray-700 rounded transition-colors"
          title="快捷键帮助"
        >
          <HelpCircle size={18} />
        </button>
      )}
    </div>
  </div>
  );
};

export default Toolbar;