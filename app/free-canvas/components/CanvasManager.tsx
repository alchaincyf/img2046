'use client';

import React, { useState } from 'react';
import { 
  Grid3x3, 
  Plus, 
  Trash2, 
  Edit3, 
  FileText,
  Clock,
  X,
  FolderOpen,
  Image as ImageIcon
} from 'lucide-react';
import { useMultiCanvasStore } from '../store/multiCanvasStore';
import { useCanvasStore } from '../store/canvasStore';

interface CanvasManagerProps {
  onClose?: () => void;
}

const CanvasManager: React.FC<CanvasManagerProps> = ({ onClose }) => {
  const { 
    canvases, 
    currentCanvasId, 
    createCanvas, 
    deleteCanvas, 
    renameCanvas, 
    switchCanvas 
  } = useMultiCanvasStore();
  
  const { loadCanvas } = useCanvasStore();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newCanvasName, setNewCanvasName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleCreateCanvas = () => {
    if (newCanvasName.trim()) {
      createCanvas(newCanvasName.trim());
      setNewCanvasName('');
      setIsCreating(false);
    }
  };

  const handleSwitchCanvas = (id: string) => {
    const canvas = canvases.find(c => c.id === id);
    if (canvas) {
      switchCanvas(id);
      loadCanvas(canvas.elements);
      onClose?.();
    }
  };

  const handleRenameCanvas = (id: string) => {
    if (editingName.trim()) {
      renameCanvas(id, editingName.trim());
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleDeleteCanvas = (id: string) => {
    if (confirm('确定要删除这个画布吗？此操作无法撤销。')) {
      deleteCanvas(id);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-[900px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Grid3x3 size={28} />
            画布管理
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* New Canvas Button */}
          <div className="mb-6">
            {isCreating ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCanvasName}
                  onChange={(e) => setNewCanvasName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateCanvas()}
                  placeholder="输入画布名称"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={handleCreateCanvas}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  创建
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewCanvasName('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
              >
                <Plus size={20} />
                创建新画布
              </button>
            )}
          </div>

          {/* Canvas List */}
          {canvases.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">暂无画布</p>
              <p className="text-gray-400 text-sm mt-2">创建你的第一个画布开始绘制</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {canvases.map((canvas) => (
                <div
                  key={canvas.id}
                  className={`relative group border rounded-lg overflow-hidden transition-all ${
                    canvas.id === currentCanvasId
                      ? 'border-blue-500 shadow-lg ring-2 ring-blue-500 ring-opacity-50'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => handleSwitchCanvas(canvas.id)}
                    className="h-40 bg-gray-50 cursor-pointer flex items-center justify-center"
                  >
                    {canvas.thumbnail ? (
                      <img 
                        src={canvas.thumbnail} 
                        alt={canvas.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <ImageIcon size={48} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-xs text-gray-400">
                          {canvas.elements.length} 个元素
                        </p>
                      </div>
                    )}
                    {canvas.id === currentCanvasId && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        当前画布
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    {editingId === canvas.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleRenameCanvas(canvas.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        onBlur={() => handleRenameCanvas(canvas.id)}
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <h3 className="font-semibold text-gray-800 mb-1 truncate">
                        {canvas.name}
                      </h3>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock size={12} />
                      {formatDate(canvas.updatedAt)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(canvas.id);
                        setEditingName(canvas.name);
                      }}
                      className="p-1.5 bg-white rounded shadow hover:bg-gray-100 transition-colors"
                      title="重命名"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCanvas(canvas.id);
                      }}
                      className="p-1.5 bg-white rounded shadow hover:bg-red-100 hover:text-red-600 transition-colors"
                      title="删除"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between items-center bg-gray-50">
          <div className="text-sm text-gray-600">
            共 {canvases.length} 个画布
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default CanvasManager;