'use client';

import React from 'react';
import { Rect, Circle, Line } from 'react-konva';

interface DrawingPreviewProps {
  tool: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  path?: number[];
}

const DrawingPreview: React.FC<DrawingPreviewProps> = ({ tool, start, end, path }) => {
  const minX = Math.min(start.x, end.x);
  const minY = Math.min(start.y, end.y);
  const maxX = Math.max(start.x, end.x);
  const maxY = Math.max(start.y, end.y);
  const width = maxX - minX;
  const height = maxY - minY;

  switch (tool) {
    case 'rect':
      return (
        <Rect
          x={minX}
          y={minY}
          width={width}
          height={height}
          fill="rgba(59, 130, 246, 0.2)"
          stroke="#3b82f6"
          strokeWidth={2}
          dash={[5, 5]}
        />
      );
    
    case 'circle':
      const radius = Math.sqrt(width * width + height * height) / 2;
      return (
        <Circle
          x={minX + width / 2}
          y={minY + height / 2}
          radius={radius}
          fill="rgba(59, 130, 246, 0.2)"
          stroke="#3b82f6"
          strokeWidth={2}
          dash={[5, 5]}
        />
      );
    
    case 'line':
      return (
        <Line
          points={[start.x, start.y, end.x, end.y]}
          stroke="#3b82f6"
          strokeWidth={2}
          dash={[5, 5]}
        />
      );
    
    case 'pen':
      if (path && path.length > 2) {
        return (
          <Line
            points={path}
            stroke="#3b82f6"
            strokeWidth={2}
            lineCap="round"
            lineJoin="round"
          />
        );
      }
      return null;
    
    default:
      return null;
  }
};

export default DrawingPreview;