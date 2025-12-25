'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Circle, Ellipse, Line, Text, Transformer } from 'react-konva';
import { Box } from '@mui/material';
import { useSVGStore } from '../store/svgStore';
import Konva from 'konva';

export default function Canvas() {
  const {
    canvasWidth,
    canvasHeight,
    canvasBackground,
    elements,
    selectedIds,
    currentTool,
    showGrid,
    gridSize,
    snapToGrid,
    isDrawing,
    drawingElement,
    selectElement,
    selectElements,
    clearSelection,
    updateElement,
    startDrawing,
    updateDrawing,
    finishDrawing,
    cancelDrawing,
  } = useSVGStore();

  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 });

  // Update transformer when selection changes
  React.useEffect(() => {
    if (transformerRef.current && stageRef.current) {
      const selectedNodes = selectedIds
        .map((id) => stageRef.current?.findOne(`#${id}`))
        .filter((node): node is Konva.Node => node !== null && node !== undefined);

      transformerRef.current.nodes(selectedNodes);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedIds]);

  const snapToGridValue = useCallback((value: number) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  }, [snapToGrid, gridSize]);

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Click on stage background
    if (e.target === e.target.getStage()) {
      // Pan tool
      if (currentTool === 'pan') {
        setIsPanning(true);
        const pos = e.target.getStage()!.getPointerPosition();
        setLastPanPosition(pos!);
        return;
      }

      // Clear selection on background click
      if (currentTool === 'select') {
        clearSelection();
        return;
      }

      // Start drawing
      const pos = e.target.getStage()!.getPointerPosition();
      if (!pos) return;

      const x = snapToGridValue(pos.x);
      const y = snapToGridValue(pos.y);

      switch (currentTool) {
        case 'rect':
          startDrawing({
            type: 'rect',
            x,
            y,
            width: 0,
            height: 0,
            fill: '#3498db',
            stroke: '#2c3e50',
            strokeWidth: 2,
            opacity: 1,
            rotation: 0,
          });
          break;
        case 'circle':
          startDrawing({
            type: 'circle',
            x,
            y,
            radius: 0,
            fill: '#e74c3c',
            stroke: '#2c3e50',
            strokeWidth: 2,
            opacity: 1,
            rotation: 0,
          });
          break;
        case 'ellipse':
          startDrawing({
            type: 'ellipse',
            x,
            y,
            radiusX: 0,
            radiusY: 0,
            fill: '#9b59b6',
            stroke: '#2c3e50',
            strokeWidth: 2,
            opacity: 1,
            rotation: 0,
          });
          break;
        case 'line':
          startDrawing({
            type: 'line',
            x1: x,
            y1: y,
            x2: x,
            y2: y,
            x,
            y,
            fill: 'none',
            stroke: '#2c3e50',
            strokeWidth: 2,
            opacity: 1,
            rotation: 0,
          });
          break;
        case 'text':
          startDrawing({
            type: 'text',
            x,
            y,
            text: '双击编辑文字',
            fill: '#2c3e50',
            stroke: 'none',
            strokeWidth: 0,
            opacity: 1,
            rotation: 0,
            fontSize: 24,
            fontFamily: 'Arial',
          });
          finishDrawing(); // Text is created immediately
          break;
      }
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;

    // Handle panning
    if (isPanning && currentTool === 'pan') {
      const pos = stage.getPointerPosition();
      if (pos && lastPanPosition) {
        const dx = pos.x - lastPanPosition.x;
        const dy = pos.y - lastPanPosition.y;

        const newX = stage.x() + dx;
        const newY = stage.y() + dy;

        stage.position({ x: newX, y: newY });
        stage.batchDraw();
      }
      return;
    }

    // Handle drawing
    if (!isDrawing || !drawingElement) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    const x = snapToGridValue(pos.x);
    const y = snapToGridValue(pos.y);

    switch (drawingElement.type) {
      case 'rect':
        updateDrawing({
          width: Math.abs(x - drawingElement.x),
          height: Math.abs(y - drawingElement.y),
          x: Math.min(x, drawingElement.x),
          y: Math.min(y, drawingElement.y),
        });
        break;
      case 'circle':
        const radius = Math.sqrt(
          Math.pow(x - drawingElement.x, 2) + Math.pow(y - drawingElement.y, 2)
        );
        updateDrawing({ radius });
        break;
      case 'ellipse':
        updateDrawing({
          radiusX: Math.abs(x - drawingElement.x),
          radiusY: Math.abs(y - drawingElement.y),
        });
        break;
      case 'line':
        updateDrawing({ x2: x, y2: y });
        break;
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (isDrawing && drawingElement) {
      // Only finish if shape has meaningful size
      const hasSize =
        (drawingElement.width && drawingElement.width > 5) ||
        (drawingElement.height && drawingElement.height > 5) ||
        (drawingElement.radius && drawingElement.radius > 5) ||
        (drawingElement.radiusX && drawingElement.radiusX > 5);

      if (hasSize || drawingElement.type === 'line') {
        finishDrawing();
      } else {
        cancelDrawing();
      }
    }
  };

  const handleShapeClick = (id: string, e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;

    if (currentTool !== 'select') return;

    if (e.evt.shiftKey) {
      // Add to selection
      if (selectedIds.includes(id)) {
        selectElements(selectedIds.filter((selectedId) => selectedId !== id));
      } else {
        selectElements([...selectedIds, id]);
      }
    } else {
      selectElement(id);
    }
  };

  const handleTransform = (id: string, node: Konva.Node) => {
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Reset scale and update dimensions
    node.scaleX(1);
    node.scaleY(1);

    updateElement(id, {
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      ...(node instanceof Konva.Rect && {
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
      }),
      ...(node instanceof Konva.Circle && {
        radius: Math.max(5, node.radius() * Math.max(scaleX, scaleY)),
      }),
      ...(node instanceof Konva.Ellipse && {
        radiusX: Math.max(5, node.radiusX() * scaleX),
        radiusY: Math.max(5, node.radiusY() * scaleY),
      }),
    });
  };

  // Render grid
  const renderGrid = () => {
    if (!showGrid) return null;

    const lines = [];
    const width = canvasWidth;
    const height = canvasHeight;

    // Vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i, 0, i, height]}
          stroke="#e0e0e0"
          strokeWidth={1}
          listening={false}
        />
      );
    }

    // Horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      lines.push(
        <Line
          key={`h-${i}`}
          points={[0, i, width, i]}
          stroke="#e0e0e0"
          strokeWidth={1}
          listening={false}
        />
      );
    }

    return lines;
  };

  // Render elements
  const renderElement = (el: typeof elements[0]) => {
    const commonProps = {
      id: el.id,
      key: el.id,
      draggable: currentTool === 'select' && selectedIds.includes(el.id),
      onClick: (e: Konva.KonvaEventObject<MouseEvent>) => handleShapeClick(el.id, e),
      onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
        updateElement(el.id, {
          x: snapToGridValue(e.target.x()),
          y: snapToGridValue(e.target.y()),
        });
      },
      onTransformEnd: (e: Konva.KonvaEventObject<Event>) => {
        handleTransform(el.id, e.target);
      },
    };

    switch (el.type) {
      case 'rect':
        return (
          <Rect
            {...commonProps}
            x={el.x}
            y={el.y}
            width={el.width}
            height={el.height}
            fill={el.fill}
            stroke={el.stroke}
            strokeWidth={el.strokeWidth}
            opacity={el.opacity}
            rotation={el.rotation}
          />
        );
      case 'circle':
        return (
          <Circle
            {...commonProps}
            x={el.x}
            y={el.y}
            radius={el.radius}
            fill={el.fill}
            stroke={el.stroke}
            strokeWidth={el.strokeWidth}
            opacity={el.opacity}
            rotation={el.rotation}
          />
        );
      case 'ellipse':
        return (
          <Ellipse
            {...commonProps}
            x={el.x}
            y={el.y}
            radiusX={el.radiusX}
            radiusY={el.radiusY}
            fill={el.fill}
            stroke={el.stroke}
            strokeWidth={el.strokeWidth}
            opacity={el.opacity}
            rotation={el.rotation}
          />
        );
      case 'line':
        return (
          <Line
            {...commonProps}
            points={[el.x1!, el.y1!, el.x2!, el.y2!]}
            stroke={el.stroke}
            strokeWidth={el.strokeWidth}
            opacity={el.opacity}
          />
        );
      case 'text':
        return (
          <Text
            {...commonProps}
            x={el.x}
            y={el.y}
            text={el.text}
            fill={el.fill}
            fontSize={el.fontSize}
            fontFamily={el.fontFamily}
            opacity={el.opacity}
            rotation={el.rotation}
          />
        );
      default:
        return null;
    }
  };

  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        bgcolor: '#f5f5f5',
        position: 'relative',
      }}
    >
      <Stage
        ref={stageRef}
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          cursor: currentTool === 'pan' ? 'grab' : 'default',
        }}
      >
        <Layer>
          {/* Background */}
          <Rect
            x={0}
            y={0}
            width={canvasWidth}
            height={canvasHeight}
            fill={canvasBackground}
            listening={false}
          />

          {/* Grid */}
          {renderGrid()}

          {/* Elements */}
          {sortedElements.map(renderElement)}

          {/* Drawing element */}
          {isDrawing && drawingElement && renderElement(drawingElement)}

          {/* Transformer */}
          {currentTool === 'select' && (
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                // Limit resize
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          )}
        </Layer>
      </Stage>
    </Box>
  );
}
