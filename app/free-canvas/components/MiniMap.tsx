'use client';

import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Line, Text } from 'react-konva';
import { useCanvasStore } from '../store/canvasStore';

interface MiniMapProps {
  canvasWidth: number;
  canvasHeight: number;
}

const MiniMap: React.FC<MiniMapProps> = ({ canvasWidth, canvasHeight }) => {
  const stageRef = useRef<any>(null);
  const { elements, canvasState, setPosition, setScale } = useCanvasStore();

  const miniMapWidth = 192; // 48 * 4 (w-48 in Tailwind)
  const miniMapHeight = 128; // 32 * 4 (h-32 in Tailwind)

  // Calculate scale to fit canvas in minimap
  const scaleX = miniMapWidth / 2000; // Assuming max canvas area of 2000px
  const scaleY = miniMapHeight / 2000;
  const miniScale = Math.min(scaleX, scaleY) * 0.8; // 80% to leave some padding

  // Calculate viewport rectangle
  const viewportWidth = (canvasWidth / canvasState.scale) * miniScale;
  const viewportHeight = (canvasHeight / canvasState.scale) * miniScale;
  const viewportX = (-canvasState.position.x / canvasState.scale) * miniScale + miniMapWidth / 2;
  const viewportY = (-canvasState.position.y / canvasState.scale) * miniScale + miniMapHeight / 2;

  // Handle click on minimap to jump to position
  const handleMiniMapClick = (e: any) => {
    const stage = stageRef.current;
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    // Convert minimap coordinates to canvas coordinates
    const newX = -(pos.x - miniMapWidth / 2) / miniScale * canvasState.scale;
    const newY = -(pos.y - miniMapHeight / 2) / miniScale * canvasState.scale;

    setPosition({ x: newX, y: newY });
  };

  const renderMiniElement = (element: any) => {
    const props = {
      x: element.x * miniScale + miniMapWidth / 2,
      y: element.y * miniScale + miniMapHeight / 2,
      opacity: 0.6,
    };

    switch (element.type) {
      case 'rect':
        return (
          <Rect
            key={element.id}
            {...props}
            width={(element.width || 100) * miniScale}
            height={(element.height || 100) * miniScale}
            fill={element.data.fill || '#3b82f6'}
          />
        );
      case 'circle':
        return (
          <Circle
            key={element.id}
            {...props}
            radius={element.data.radius * miniScale}
            fill={element.data.fill || '#3b82f6'}
          />
        );
      case 'text':
        return (
          <Rect
            key={element.id}
            {...props}
            width={50 * miniScale}
            height={20 * miniScale}
            fill="#666"
          />
        );
      case 'image':
        return (
          <Rect
            key={element.id}
            {...props}
            width={(element.width || 100) * miniScale}
            height={(element.height || 100) * miniScale}
            fill="#e5e7eb"
            stroke="#9ca3af"
            strokeWidth={0.5}
          />
        );
      case 'line':
        if (element.data.points && element.data.points.length >= 4) {
          const scaledPoints = element.data.points.map((p: number, i: number) => 
            i % 2 === 0 
              ? p * miniScale + miniMapWidth / 2
              : p * miniScale + miniMapHeight / 2
          );
          return (
            <Line
              key={element.id}
              points={scaledPoints}
              stroke={element.data.stroke || '#000'}
              strokeWidth={Math.max(0.5, (element.data.strokeWidth || 2) * miniScale)}
              opacity={0.6}
            />
          );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="absolute bottom-4 right-4 z-10 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-1 border-b border-gray-200 bg-gray-50">
        <span className="text-xs text-gray-600 font-medium px-1">小地图</span>
      </div>
      <Stage
        ref={stageRef}
        width={miniMapWidth}
        height={miniMapHeight}
        onClick={handleMiniMapClick}
        style={{ cursor: 'pointer' }}
      >
        <Layer>
          {/* Background */}
          <Rect
            x={0}
            y={0}
            width={miniMapWidth}
            height={miniMapHeight}
            fill="#f9fafb"
          />

          {/* Canvas elements */}
          {elements
            .filter(el => el.visible !== false)
            .map(renderMiniElement)}

          {/* Viewport indicator */}
          <Rect
            x={viewportX - viewportWidth / 2}
            y={viewportY - viewportHeight / 2}
            width={viewportWidth}
            height={viewportHeight}
            stroke="#3b82f6"
            strokeWidth={2}
            fill="transparent"
            dash={[4, 4]}
          />

          {/* Center crosshair */}
          <Line
            points={[miniMapWidth / 2 - 5, miniMapHeight / 2, miniMapWidth / 2 + 5, miniMapHeight / 2]}
            stroke="#6b7280"
            strokeWidth={0.5}
          />
          <Line
            points={[miniMapWidth / 2, miniMapHeight / 2 - 5, miniMapWidth / 2, miniMapHeight / 2 + 5]}
            stroke="#6b7280"
            strokeWidth={0.5}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default MiniMap;