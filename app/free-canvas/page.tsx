'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useCanvasStore } from './store/canvasStore';
import PropertyPanel from './components/PropertyPanel';
import ImageUploader from './components/ImageUploader';
import TextStylePanel from './components/TextStylePanel';
import { useMultiCanvasStore } from './store/multiCanvasStore';
import { FileStack, Minimize2 } from 'lucide-react';
import { downloadCanvas, exportCanvasAsJSON } from './utils/canvas';
import Konva from 'konva';
import { useHotkeys } from 'react-hotkeys-hook';

const InfiniteCanvas = dynamic(() => import('./components/InfiniteCanvas'), {
  ssr: false,
});

const Toolbar = dynamic(() => import('./components/Toolbar'), {
  ssr: false,
});

const MiniMap = dynamic(() => import('./components/MiniMap'), {
  ssr: false,
});

const CanvasManager = dynamic(() => import('./components/CanvasManager'), {
  ssr: false,
});

const ColorPanel = dynamic(() => import('./components/ColorPanel'), {
  ssr: false,
});

const LayersPanel = dynamic(() => import('./components/LayersPanel'), {
  ssr: false,
});

const SizePanel = dynamic(() => import('./components/SizePanel'), {
  ssr: false,
});

const FloatingActions = dynamic(() => import('./components/FloatingActions'), {
  ssr: false,
});

export default function FreeCanvasPage() {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [showPropertyPanel, setShowPropertyPanel] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [showTextStylePanel, setShowTextStylePanel] = useState(false);
  const [showLayersPanel, setShowLayersPanel] = useState(false);
  const [showColorPanel, setShowColorPanel] = useState(false);
  const [showCanvasManager, setShowCanvasManager] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMinimalUI, setShowMinimalUI] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showSizePanel, setShowSizePanel] = useState(false);
  const [selectedForPanel, setSelectedForPanel] = useState<string | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  
  const { elements, canvasState, loadCanvas, addElement, currentTool } = useCanvasStore();
  
  // Close panels when selection changes
  useEffect(() => {
    if (canvasState.selectedIds.length === 0 || 
        (selectedForPanel && !canvasState.selectedIds.includes(selectedForPanel))) {
      setShowSizePanel(false);
      setShowColorPanel(false);
      setShowTextStylePanel(false);
      setSelectedForPanel(null);
    }
  }, [canvasState.selectedIds, selectedForPanel]);
  const { 
    getCurrentCanvas, 
    updateCurrentCanvas, 
    renameCanvas: renameCurrentCanvas,
    currentCanvasId,
    createCanvas,
    canvases
  } = useMultiCanvasStore();
  
  const currentCanvas = getCurrentCanvas();
  const canvasName = currentCanvas?.name || '未命名画布';

  // Initialize canvas if none exists - with proper hydration handling
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      
      // Only create canvas if we truly have none after hydration
      if (canvases.length === 0) {
        createCanvas('我的画布');
      } else if (!currentCanvasId && canvases.length > 0) {
        // Select first canvas if none selected
        useMultiCanvasStore.getState().switchCanvas(canvases[0].id);
      }
    }
  }, [isInitialized, canvases.length, currentCanvasId]);

  // Update canvas dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Handle export
  const handleExport = useCallback(() => {
    // For now, export as JSON
    exportCanvasAsJSON(elements, canvasState);
  }, [elements, canvasState]);

  // Handle save
  const handleSave = useCallback(() => {
    const saveData = {
      name: canvasName,
      elements,
      canvasState: {
        position: canvasState.position,
        scale: canvasState.scale,
        gridVisible: canvasState.gridVisible,
        snapToGrid: canvasState.snapToGrid
      },
      timestamp: Date.now()
    };
    
    const dataStr = JSON.stringify(saveData);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${canvasName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setLastSaved(new Date());
    
    // Show success message
    const message = document.createElement('div');
    message.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    message.textContent = '保存成功！';
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 2000);
  }, [canvasName, elements, canvasState]);

  // Handle rename
  const handleRename = useCallback(() => {
    if (!currentCanvasId) return;
    const newName = prompt('请输入画布名称：', canvasName);
    if (newName && newName.trim()) {
      renameCurrentCanvas(currentCanvasId, newName.trim());
    }
  }, [canvasName, currentCanvasId, renameCurrentCanvas]);

  // Handle fullscreen
  const handleFullscreen = useCallback(() => {
    const canvasContainer = document.getElementById('canvas-container');
    if (!canvasContainer) return;
    
    if (!document.fullscreenElement) {
      canvasContainer.requestFullscreen().catch(err => {
        console.error('Failed to enter fullscreen:', err);
      });
      setShowMinimalUI(true);
    } else {
      document.exitFullscreen();
      setShowMinimalUI(false);
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle import
  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,image/*';
    
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.type === 'application/json') {
        // Import canvas JSON
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            if (data.elements && Array.isArray(data.elements)) {
              loadCanvas(data.elements);
            }
          } catch (err) {
            console.error('Failed to parse JSON:', err);
            alert('无法解析文件，请确保是有效的画布文件');
          }
        };
        reader.readAsText(file);
      } else if (file.type.startsWith('image/')) {
        // Import image
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          const img = new Image();
          img.onload = () => {
            addElement({
              type: 'image',
              x: 100,
              y: 100,
              width: img.naturalWidth,
              height: img.naturalHeight,
              data: {
                type: 'image',
                src: dataUrl,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
              },
            });
          };
          img.src = dataUrl;
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  }, [loadCanvas, addElement]);

  // Handle drop files
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          const img = new Image();
          img.onload = () => {
            // Calculate drop position
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            const x = (e.clientX - rect.left - canvasState.position.x) / canvasState.scale;
            const y = (e.clientY - rect.top - canvasState.position.y) / canvasState.scale;

            addElement({
              type: 'image',
              x,
              y,
              width: Math.min(img.naturalWidth, 500),
              height: Math.min(img.naturalHeight, 500),
              data: {
                type: 'image',
                src: dataUrl,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
              },
            });
          };
          img.src = dataUrl;
        };
        reader.readAsDataURL(file);
      }
    });
  }, [addElement, canvasState]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Keyboard shortcuts
  useHotkeys('cmd+s, ctrl+s', (e) => {
    e.preventDefault();
    handleSave();
  }, [handleSave]);

  useHotkeys('f11', (e) => {
    e.preventDefault();
    handleFullscreen();
  }, [handleFullscreen]);

  // Improved auto-save with debounce and compression
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (elements.length > 0) {
        try {
          const saveData = {
            name: canvasName,
            elements: elements.map(el => {
              // Compress image data
              if (el.type === 'image' && el.data.type === 'image') {
                return {
                  ...el,
                  data: {
                    ...el.data,
                    src: el.data.src?.length > 1000 ? '[IMAGE_DATA_EXCLUDED]' : el.data.src
                  }
                };
              }
              return el;
            }),
            canvasState: {
              position: canvasState.position,
              scale: canvasState.scale,
              gridVisible: canvasState.gridVisible,
              snapToGrid: canvasState.snapToGrid
            },
            timestamp: Date.now(),
          };
          
          const dataStr = JSON.stringify(saveData);
          // Only save if under 4MB
          if (dataStr.length < 4 * 1024 * 1024) {
            localStorage.setItem('canvas-autosave', dataStr);
            setLastSaved(new Date());
          }
        } catch (err) {
          console.error('Auto-save failed:', err);
        }
      }
    }, 2000); // Increased debounce time

    return () => clearTimeout(saveTimeout);
  }, [elements, canvasState, canvasName]);

  // Load auto-save on mount
  useEffect(() => {
    const savedData = localStorage.getItem('canvas-autosave');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (data.elements && Array.isArray(data.elements)) {
          // Ask user if they want to restore
          const shouldRestore = window.confirm('检测到未保存的画布，是否要恢复？');
          if (shouldRestore) {
            loadCanvas(data.elements);
          }
        }
      } catch (err) {
        console.error('Failed to load autosave:', err);
      }
    }
  }, []);

  return (
    <div 
      id="canvas-container"
      className={`w-full h-screen overflow-hidden relative ${
        isFullscreen ? 'bg-gray-900' : 'bg-gray-50'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Toolbar */}
      {!showMinimalUI && (
        <Toolbar 
          onExport={handleExport} 
          onImport={handleImport}
          onSave={handleSave}
          onRename={handleRename}
          onFullscreen={handleFullscreen}
          onTextStyle={() => setShowTextStylePanel(!showTextStylePanel)}
          onLayers={() => setShowLayersPanel(!showLayersPanel)}
          onColorPanel={() => setShowColorPanel(!showColorPanel)}
          onCanvasManager={() => setShowCanvasManager(true)}
          onHelp={() => setShowHelp(!showHelp)}
          canvasName={canvasName}
        />
      )}

      {/* Minimal UI for fullscreen mode */}
      {showMinimalUI && (
        <div className="absolute top-0 left-0 right-0 z-30">
          {/* Floating minimal toolbar */}
          <div className="flex justify-between items-start p-4">
            {/* Left: Essential tools */}
            <div className="bg-black/80 backdrop-blur-sm rounded-lg shadow-lg p-2 flex gap-1">
              <button
                onClick={() => useCanvasStore.getState().setTool('select')}
                className={`p-2 rounded transition-colors ${
                  currentTool === 'select'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/20'
                }`}
                title="选择 (V)"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={() => useCanvasStore.getState().setTool('rect')}
                className={`p-2 rounded transition-colors ${
                  currentTool === 'rect'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/20'
                }`}
                title="矩形 (R)"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
                </svg>
              </button>
              <button
                onClick={() => useCanvasStore.getState().setTool('circle')}
                className={`p-2 rounded transition-colors ${
                  currentTool === 'circle'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/20'
                }`}
                title="圆形 (O)"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="9" strokeWidth="2"/>
                </svg>
              </button>
              <button
                onClick={() => useCanvasStore.getState().setTool('text')}
                className={`p-2 rounded transition-colors ${
                  currentTool === 'text'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/20'
                }`}
                title="文本 (T)"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 7V4h16v3M9 20h6M12 4v16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={() => useCanvasStore.getState().setTool('pen')}
                className={`p-2 rounded transition-colors ${
                  currentTool === 'pen'
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/20'
                }`}
                title="画笔 (P)"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 19l7-7 3 3-7 7-3-3z M12 19l-7-7-3 3 7 7 3-3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {/* Center: Canvas name */}
            <div className="bg-black/80 backdrop-blur-sm rounded-lg shadow-lg px-4 py-2">
              <h2 className="text-white font-medium">{canvasName}</h2>
            </div>
            
            {/* Right: Exit fullscreen */}
            <div className="bg-black/80 backdrop-blur-sm rounded-lg shadow-lg p-2 flex gap-1">
              <button
                onClick={handleSave}
                className="p-2 text-white hover:bg-white/20 rounded transition-colors"
                title="保存 (⌘S)"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 21v-8H7v8M7 3v5h8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={handleFullscreen}
                className="p-2 text-white hover:bg-white/20 rounded transition-colors"
                title="退出全屏 (F11)"
              >
                <Minimize2 size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg px-3 py-2 text-sm text-gray-600 flex items-center gap-4">
        <span>画布: {dimensions.width} × {dimensions.height}</span>
        <span>缩放: {Math.round(canvasState.scale * 100)}%</span>
        <span>位置: ({Math.round(canvasState.position.x)}, {Math.round(canvasState.position.y)})</span>
        <span>元素: {elements.length}</span>
        {canvasState.selectedIds.length > 0 && (
          <span className="text-blue-600">选中: {canvasState.selectedIds.length}</span>
        )}
        {lastSaved && (
          <span className="text-green-600">
            已保存 {new Date(lastSaved).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {/* Mini Map */}
      <MiniMap canvasWidth={dimensions.width} canvasHeight={dimensions.height} />

      {/* Canvas */}
      <InfiniteCanvas width={dimensions.width} height={dimensions.height} />

      {/* Property Panel */}
      {showPropertyPanel && (
        <PropertyPanel onClose={() => setShowPropertyPanel(false)} />
      )}

      {/* Image Uploader Modal */}
      {showImageUploader && (
        <ImageUploader onClose={() => setShowImageUploader(false)} />
      )}

      {/* Text Style Panel */}
      {showTextStylePanel && (
        <TextStylePanel onClose={() => setShowTextStylePanel(false)} />
      )}

      {/* Layers Panel */}
      {showLayersPanel && <LayersPanel />}

      {/* Color Panel */}
      {showColorPanel && (
        <ColorPanel onClose={() => setShowColorPanel(false)} />
      )}

      {/* Canvas Manager */}
      {showCanvasManager && (
        <CanvasManager onClose={() => setShowCanvasManager(false)} />
      )}

      {/* Floating Actions for selected element */}
      {canvasState.selectedIds.length === 1 && (() => {
        const selectedElement = elements.find(el => el.id === canvasState.selectedIds[0]);
        if (selectedElement && currentTool === 'select') {
          return (
            <FloatingActions
              element={selectedElement}
              onSizeClick={() => {
                setShowSizePanel(true);
                setSelectedForPanel(selectedElement.id);
                setShowColorPanel(false);
                setShowTextStylePanel(false);
              }}
              onStyleClick={() => {
                if (selectedElement.type === 'text') {
                  setShowTextStylePanel(true);
                  setShowColorPanel(false);
                } else {
                  setShowColorPanel(true);
                  setShowTextStylePanel(false);
                }
                setShowSizePanel(false);
                setSelectedForPanel(selectedElement.id);
              }}
              stageRef={stageRef}
            />
          );
        }
        return null;
      })()}
      
      {/* Size Panel - Show when requested */}
      {showSizePanel && selectedForPanel && (() => {
        const element = elements.find(el => el.id === selectedForPanel);
        if (element) {
          return <SizePanel element={element} />;
        }
        return null;
      })()}

      {/* Help Info */}
      {showHelp && (
        <div className="absolute top-16 right-4 z-20 bg-white rounded-lg shadow-xl p-4 max-w-xs">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-sm">快捷键帮助</h3>
            <button 
              onClick={() => setShowHelp(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="text-xs text-gray-600 space-y-1.5">
            <div className="font-semibold text-gray-700 mt-2">工具快捷键</div>
            <div>Cmd+Shift+V - 选择工具</div>
            <div>Cmd+H - 平移工具</div>
            <div>Cmd+R - 矩形 | Cmd+Shift+C - 圆形</div>
            <div>Cmd+T - 文本 | Cmd+L - 直线</div>
            <div>Cmd+P - 画笔 | Cmd+E - 橡皮</div>
            <div className="font-semibold text-gray-700 mt-2">编辑快捷键</div>
            <div>Cmd+Z - 撤销 | Cmd+Shift+Z - 重做</div>
            <div>Cmd+C/V/X - 复制/粘贴/剪切</div>
            <div>Cmd+D - 复制选中元素</div>
            <div>Delete - 删除选中元素</div>
            <div>Cmd+A - 全选 | Esc - 取消选择</div>
            <div className="font-semibold text-gray-700 mt-2">视图快捷键</div>
            <div>Cmd+0 - 重置视图</div>
            <div>Cmd+G - 显示/隐藏网格</div>
            <div>Cmd+Shift+G - 开启/关闭吸附</div>
            <div>滚轮 - 缩放画布</div>
            <div>Shift+拖动 - 平移画布</div>
          </div>
        </div>
      )}
    </div>
  );
}