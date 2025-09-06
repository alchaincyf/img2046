'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Palette, Maximize2, Type } from 'lucide-react';
import { CanvasElement } from '../types';

interface FloatingActionsProps {
  element: CanvasElement;
  onSizeClick: () => void;
  onStyleClick: () => void;
  stageRef: React.RefObject<any>;
}

const FloatingActions: React.FC<FloatingActionsProps> = ({
  element,
  onSizeClick,
  onStyleClick,
  stageRef,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (!stageRef.current) return;
      
      const stage = stageRef.current;
      const container = stage.container();
      const rect = container.getBoundingClientRect();
      
      // Get stage scale and position
      const stageScale = stage.scaleX();
      const stagePos = stage.position();
      
      // Calculate element bounds based on type
      let elementX = element.x;
      let elementY = element.y;
      
      // For circles, adjust position to get the bounding box top-left
      if (element.type === 'circle' && element.data.type === 'circle') {
        const radius = (element.data as any).radius || 50;
        elementX = element.x - radius;
        elementY = element.y - radius;
      }
      
      // Calculate absolute position on screen
      const absX = rect.left + (elementX * stageScale) + stagePos.x;
      const absY = rect.top + (elementY * stageScale) + stagePos.y;
      
      // Position buttons above and slightly to the left
      setPosition({
        x: absX - 5,
        y: absY - 35,
      });
    };

    updatePosition();
    
    // Update position when stage changes
    const handleStageChange = () => updatePosition();
    if (stageRef.current) {
      const stage = stageRef.current;
      stage.on('dragmove', handleStageChange);
      stage.on('wheel', handleStageChange);
      stage.on('scaleChange', handleStageChange);
      
      return () => {
        stage.off('dragmove', handleStageChange);
        stage.off('wheel', handleStageChange);
        stage.off('scaleChange', handleStageChange);
      };
    }
  }, [element, stageRef]);

  // Determine which buttons to show based on element type
  const showSizeButton = element.type === 'rect' || element.type === 'circle' || element.type === 'image' || element.type === 'text';
  const showStyleButton = element.type === 'rect' || element.type === 'circle' || element.type === 'line' || element.type === 'path';
  const showTextStyleButton = element.type === 'text';

  return (
    <div
      className="fixed flex gap-1 z-30"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {showSizeButton && (
        <button
          onClick={onSizeClick}
          className="p-1.5 bg-white rounded-md shadow-md hover:shadow-lg hover:bg-gray-50 transition-all border border-gray-200"
          title="调整尺寸"
        >
          <Maximize2 size={14} className="text-gray-700" />
        </button>
      )}
      
      {showStyleButton && (
        <button
          onClick={onStyleClick}
          className="p-1.5 bg-white rounded-md shadow-md hover:shadow-lg hover:bg-gray-50 transition-all border border-gray-200"
          title="调整样式"
        >
          <Palette size={14} className="text-gray-700" />
        </button>
      )}
      
      {showTextStyleButton && (
        <button
          onClick={onStyleClick}
          className="p-1.5 bg-white rounded-md shadow-md hover:shadow-lg hover:bg-gray-50 transition-all border border-gray-200"
          title="文字样式"
        >
          <Type size={14} className="text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default FloatingActions;