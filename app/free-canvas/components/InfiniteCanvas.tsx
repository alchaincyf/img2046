'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Line, Circle, Text } from 'react-konva';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useCanvasStore } from '../store/canvasStore';
import { useMultiCanvasStore } from '../store/multiCanvasStore';
import { getPointerPosition, snapToGrid, throttle } from '../utils/canvas';
import { useCanvasHotkeys } from '../hooks/useHotkeys';
import CanvasElement from './CanvasElement';
import SelectionBox from './SelectionBox';
import InlineTextEditor from './InlineTextEditor';
import DrawingPreview from './DrawingPreview';
import AlignmentGuides, { AlignmentGuide, SizeGuide } from './AlignmentGuides';

interface InfiniteCanvasProps {
  width: number;
  height: number;
}

const InfiniteCanvas: React.FC<InfiniteCanvasProps> = ({ width, height }) => {
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPointerPosition, setLastPointerPosition] = useState({ x: 0, y: 0 });
  
  // Drawing states
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingStart, setDrawingStart] = useState({ x: 0, y: 0 });
  const [drawingEnd, setDrawingEnd] = useState({ x: 0, y: 0 });
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  
  // Text editing state
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [creatingText, setCreatingText] = useState<{ x: number; y: number } | null>(null);
  const [alignmentGuides, setAlignmentGuides] = useState<AlignmentGuide[]>([]);
  const [sizeGuides, setSizeGuides] = useState<SizeGuide[]>([]);

  const {
    elements,
    canvasState,
    currentTool,
    setScale,
    setPosition,
    selectElement,
    selectElements,
    clearSelection,
    addElement,
    updateElement,
    setTool: originalSetTool,
  } = useCanvasStore();

  // Wrap setTool to add logging
  const setTool = (tool: any) => {
    console.log('[TOOL] Switching from', currentTool, 'to', tool);
    originalSetTool(tool);
  };

  useCanvasHotkeys();

  // Grid rendering
  const renderGrid = () => {
    if (!canvasState.gridVisible) return null;

    const gridSize = canvasState.gridSize;
    const scale = canvasState.scale;
    const stage = stageRef.current;
    if (!stage) return null;

    const width = stage.width();
    const height = stage.height();
    const position = canvasState.position;

    const startX = Math.floor((-position.x / scale) / gridSize) * gridSize;
    const endX = Math.ceil((-position.x / scale + width / scale) / gridSize) * gridSize;
    const startY = Math.floor((-position.y / scale) / gridSize) * gridSize;
    const endY = Math.ceil((-position.y / scale + height / scale) / gridSize) * gridSize;

    const lines = [];

    // Vertical lines
    for (let x = startX; x <= endX; x += gridSize) {
      lines.push(
        <Line
          key={`v-${x}`}
          points={[x, startY, x, endY]}
          stroke="#e2e8f0"
          strokeWidth={1 / scale}
          listening={false}
        />
      );
    }

    // Horizontal lines
    for (let y = startY; y <= endY; y += gridSize) {
      lines.push(
        <Line
          key={`h-${y}`}
          points={[startX, y, endX, y]}
          stroke="#e2e8f0"
          strokeWidth={1 / scale}
          listening={false}
        />
      );
    }

    // Origin lines
    lines.push(
      <Line
        key="origin-x"
        points={[startX, 0, endX, 0]}
        stroke="#cbd5e1"
        strokeWidth={2 / scale}
        listening={false}
      />
    );
    lines.push(
      <Line
        key="origin-y"
        points={[0, startY, 0, endY]}
        stroke="#cbd5e1"
        strokeWidth={2 / scale}
        listening={false}
      />
    );

    return lines;
  };

  // Handle wheel zoom and trackpad gestures
  const handleWheel = useCallback((e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    // Check if it's a pinch gesture (ctrl key is pressed on trackpad pinch)
    const isPinch = e.evt.ctrlKey;
    
    if (isPinch) {
      // Handle zoom (pinch gesture or ctrl+wheel)
      const oldScale = canvasState.scale;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const mousePointTo = {
        x: (pointer.x - canvasState.position.x) / oldScale,
        y: (pointer.y - canvasState.position.y) / oldScale,
      };

      const direction = e.evt.deltaY > 0 ? -1 : 1;
      const scaleBy = 1.1;
      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      setScale(newScale);
      setPosition({
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      });
    } else {
      // Handle pan (two-finger swipe on trackpad)
      const dx = -e.evt.deltaX;
      const dy = -e.evt.deltaY;
      
      setPosition({
        x: canvasState.position.x + dx,
        y: canvasState.position.y + dy,
      });
    }
  }, [canvasState.scale, canvasState.position, setScale, setPosition]);

  // Handle mouse down
  const handleMouseDown = useCallback((e: KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;

    const pos = getPointerPosition(stage);
    if (!pos) return;

    // Pan tool or middle mouse button or space key
    if (currentTool === 'pan' || e.evt.button === 1 || e.evt.shiftKey) {
      setIsPanning(true);
      const pointer = stage.getPointerPosition();
      if (pointer) {
        setLastPointerPosition(pointer);
      }
      stage.container().style.cursor = 'grabbing';
      return;
    }

    const clickedOnEmpty = e.target === e.target.getStage();

    // Text tool - create text on click
    if (currentTool === 'text' && clickedOnEmpty) {
      console.log('[TEXT TOOL] Creating new text at position:', pos);
      const snapPos = canvasState.snapToGrid
        ? { x: snapToGrid(pos.x, canvasState.gridSize), y: snapToGrid(pos.y, canvasState.gridSize) }
        : pos;
      
      // Create text element immediately with default text
      const textElement = addElement({
        type: 'text',
        x: snapPos.x,
        y: snapPos.y,
        width: 100,  // Set initial width
        height: 24,  // Set initial height based on fontSize
        data: {
          type: 'text',
          text: '花生真帅',
          fontSize: 16,
          fontFamily: 'Arial',
          fill: '#000000',
        },
      });
      
      // Start editing immediately if element was created
      if (textElement && textElement.id) {
        setEditingTextId(textElement.id);
      }
      
      // Always switch back to select tool after adding text
      setTool('select');
      return;
    }

    // Selection tool
    if (currentTool === 'select') {
      if (clickedOnEmpty) {
        if (!e.evt.ctrlKey && !e.evt.metaKey) {
          clearSelection();
        }
        setIsSelecting(true);
        setSelectionRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
      }
      return;
    }

    // Shape drawing tools - start drawing on mouse down
    if (['rect', 'circle', 'line', 'pen'].includes(currentTool)) {
      const snapPos = canvasState.snapToGrid
        ? { x: snapToGrid(pos.x, canvasState.gridSize), y: snapToGrid(pos.y, canvasState.gridSize) }
        : pos;
      
      setIsDrawing(true);
      setDrawingStart(snapPos);
      setDrawingEnd(snapPos);
      
      if (currentTool === 'pen') {
        setCurrentPath([snapPos.x, snapPos.y]);
      }
    }
  }, [currentTool, canvasState, clearSelection, setTool]);

  // Handle mouse move
  const handleMouseMove = useCallback(
    throttle((e: KonvaEventObject<MouseEvent>) => {
      const stage = stageRef.current;
      if (!stage) return;

      // Panning - use raw pointer position for smoother movement
      if (isPanning) {
        const pointer = stage.getPointerPosition();
        if (!pointer) return;
        
        const dx = pointer.x - lastPointerPosition.x;
        const dy = pointer.y - lastPointerPosition.y;
        
        setPosition({
          x: canvasState.position.x + dx,
          y: canvasState.position.y + dy,
        });
        
        setLastPointerPosition(pointer);
        return;
      }

      const pos = getPointerPosition(stage);
      if (!pos) return;

      // Drawing shapes
      if (isDrawing) {
        const snapPos = canvasState.snapToGrid
          ? { x: snapToGrid(pos.x, canvasState.gridSize), y: snapToGrid(pos.y, canvasState.gridSize) }
          : pos;
        
        setDrawingEnd(snapPos);
        
        if (currentTool === 'pen') {
          setCurrentPath(prev => [...prev, snapPos.x, snapPos.y]);
        }
        return;
      }

      // Selection box
      if (isSelecting) {
        const startX = selectionRect.x;
        const startY = selectionRect.y;
        const width = pos.x - startX;
        const height = pos.y - startY;
        
        setSelectionRect({
          x: width < 0 ? pos.x : startX,
          y: height < 0 ? pos.y : startY,
          width: Math.abs(width),
          height: Math.abs(height),
        });

        // Find elements within selection
        const selectedIds = elements
          .filter((element) => {
            // Calculate proper bounds for each element type
            let elementBounds = {
              x: element.x,
              y: element.y,
              width: element.width || 100,
              height: element.height || 100,
            };

            // Special handling for circles
            if (element.type === 'circle' && element.data.type === 'circle') {
              const radius = element.data.radius || 50;
              elementBounds = {
                x: element.x - radius,
                y: element.y - radius,
                width: radius * 2,
                height: radius * 2,
              };
            }
            
            // Special handling for lines
            if (element.type === 'line' && element.data.type === 'line') {
              const points = (element.data as any).points || [];
              if (points.length >= 4) {
                const minX = Math.min(points[0], points[2]);
                const maxX = Math.max(points[0], points[2]);
                const minY = Math.min(points[1], points[3]);
                const maxY = Math.max(points[1], points[3]);
                elementBounds = {
                  x: minX,
                  y: minY,
                  width: maxX - minX || 10,
                  height: maxY - minY || 10,
                };
              }
            }
            
            // Special handling for pen/path
            if ((element.type === 'line' && element.data.type === 'line' && element.data.points.length > 4) || 
                element.type === 'path') {
              const points = (element.data as any).points || [];
              let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
              
              for (let i = 0; i < points.length; i += 2) {
                minX = Math.min(minX, points[i]);
                maxX = Math.max(maxX, points[i]);
                minY = Math.min(minY, points[i + 1]);
                maxY = Math.max(maxY, points[i + 1]);
              }
              
              if (minX !== Infinity) {
                elementBounds = {
                  x: minX,
                  y: minY,
                  width: maxX - minX || 10,
                  height: maxY - minY || 10,
                };
              }
            }

            const selectionBounds = {
              x: Math.min(startX, pos.x),
              y: Math.min(startY, pos.y),
              width: Math.abs(width),
              height: Math.abs(height),
            };

            // Check if element bounds intersect with selection bounds
            return (
              elementBounds.x < selectionBounds.x + selectionBounds.width &&
              elementBounds.x + elementBounds.width > selectionBounds.x &&
              elementBounds.y < selectionBounds.y + selectionBounds.height &&
              elementBounds.y + elementBounds.height > selectionBounds.y
            );
          })
          .map((el) => el.id);

        selectElements(selectedIds);
      }
    }, 16),
    [isPanning, isDrawing, isSelecting, selectionRect, lastPointerPosition, canvasState, elements, currentTool, setPosition, selectElements]
  );

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    const stage = stageRef.current;
    if (stage) {
      stage.container().style.cursor = currentTool === 'pan' ? 'grab' : 'default';
    }
    
    // Complete drawing
    if (isDrawing && drawingStart.x !== drawingEnd.x && drawingStart.y !== drawingEnd.y) {
      const minX = Math.min(drawingStart.x, drawingEnd.x);
      const minY = Math.min(drawingStart.y, drawingEnd.y);
      const maxX = Math.max(drawingStart.x, drawingEnd.x);
      const maxY = Math.max(drawingStart.y, drawingEnd.y);
      const width = maxX - minX;
      const height = maxY - minY;

      if (currentTool === 'rect') {
        const { drawingStyle } = useMultiCanvasStore.getState();
        addElement({
          type: 'rect',
          x: minX,
          y: minY,
          width,
          height,
          data: {
            type: 'rect',
            fill: drawingStyle?.fill || '#ffffff',
            stroke: drawingStyle?.stroke || '#94a3b8',
            strokeWidth: drawingStyle?.strokeWidth || 1,
          },
        });
        setTool('select'); // Switch back to select tool
      } else if (currentTool === 'circle') {
        const { drawingStyle } = useMultiCanvasStore.getState();
        const radius = Math.sqrt(width * width + height * height) / 2;
        addElement({
          type: 'circle',
          x: minX + width / 2,
          y: minY + height / 2,
          data: {
            type: 'circle',
            radius,
            fill: drawingStyle?.fill || '#ffffff',
            stroke: drawingStyle?.stroke || '#94a3b8',
            strokeWidth: drawingStyle?.strokeWidth || 1,
          },
        });
        setTool('select'); // Switch back to select tool
      } else if (currentTool === 'line') {
        const { drawingStyle } = useMultiCanvasStore.getState();
        addElement({
          type: 'line',
          x: 0,
          y: 0,
          data: {
            type: 'line',
            points: [drawingStart.x, drawingStart.y, drawingEnd.x, drawingEnd.y],
            stroke: drawingStyle?.stroke || '#94a3b8',
            strokeWidth: drawingStyle?.strokeWidth || 2,
          },
        });
        setTool('select'); // Switch back to select tool
      } else if (currentTool === 'pen' && currentPath.length > 2) {
        const { drawingStyle } = useMultiCanvasStore.getState();
        addElement({
          type: 'line',
          x: 0,
          y: 0,
          data: {
            type: 'line',
            points: currentPath,
            stroke: drawingStyle?.stroke || '#1e40af',
            strokeWidth: drawingStyle?.strokeWidth || 2,
            lineCap: 'round',
            lineJoin: 'round',
          },
        });
      }
    }
    
    setIsPanning(false);
    setIsSelecting(false);
    setIsDrawing(false);
    setSelectionRect({ x: 0, y: 0, width: 0, height: 0 });
    setCurrentPath([]);
  }, [currentTool, isDrawing, drawingStart, drawingEnd, currentPath, addElement, setTool]);

  // Remove creatingText state as we now create text immediately
  useEffect(() => {
    setCreatingText(null);
  }, []);

  // Update cursor based on tool
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const container = stage.container();
    switch (currentTool) {
      case 'pan':
        container.style.cursor = 'grab';
        break;
      case 'text':
        container.style.cursor = 'text';
        break;
      case 'pen':
      case 'eraser':
        container.style.cursor = 'crosshair';
        break;
      default:
        container.style.cursor = 'default';
    }
  }, [currentTool]);

  // Handle context menu
  const handleContextMenu = useCallback((e: KonvaEventObject<PointerEvent>) => {
    e.evt.preventDefault();
  }, []);

  return (
    <>
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={handleContextMenu}
        scaleX={canvasState.scale}
        scaleY={canvasState.scale}
        x={canvasState.position.x}
        y={canvasState.position.y}
      >
        <Layer ref={layerRef}>
          {/* Grid */}
          {renderGrid()}

          {/* Canvas Elements */}
          {elements
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((element) => (
              <CanvasElement
                key={element.id}
                element={element}
                isSelected={canvasState.selectedIds.includes(element.id)}
                isEditing={editingTextId === element.id}
                onEdit={() => {
                  console.log('[TEXT TOOL] Starting inline edit for text:', element.id);
                  setEditingTextId(element.id);
                }}
                onAlignmentGuides={(guides, sizeGuides) => {
                  setAlignmentGuides(guides);
                  setSizeGuides(sizeGuides);
                }}
              />
            ))}

          {/* Drawing Preview */}
          {isDrawing && (
            <DrawingPreview
              tool={currentTool}
              start={drawingStart}
              end={drawingEnd}
              path={currentPath}
            />
          )}

          {/* Alignment Guides */}
          <AlignmentGuides 
            guides={alignmentGuides} 
            sizeGuides={sizeGuides} 
            scale={canvasState.scale} 
          />

          {/* Selection Box */}
          {isSelecting && (
            <SelectionBox
              x={selectionRect.x}
              y={selectionRect.y}
              width={selectionRect.width}
              height={selectionRect.height}
            />
          )}
        </Layer>
      </Stage>

      {/* Inline Text Editor for editing existing text */}
      {editingTextId && (() => {
        const element = elements.find(el => el.id === editingTextId);
        if (!element) return null;
        const data = element.data as any;
        
        return (
          <InlineTextEditor
            text={data.text || ''}
            x={element.x}
            y={element.y}
            fontSize={data.fontSize || 16}
            fontFamily={data.fontFamily || 'Arial'}
            fill={data.fill || '#000000'}
            backgroundColor={data.backgroundColor}
            fontWeight={data.fontWeight}
            fontStyle={data.fontStyle}
            textDecoration={data.textDecoration}
            width={element.width}
            height={element.height}
            scale={canvasState.scale}
            stageRef={stageRef}
            onTextChange={(text) => {
              updateElement(editingTextId, { 
                data: { ...element.data, text } as any 
              });
            }}
            onEditEnd={() => {
              setEditingTextId(null);
            }}
          />
        );
      })()}
    </>
  );
};

export default InfiniteCanvas;