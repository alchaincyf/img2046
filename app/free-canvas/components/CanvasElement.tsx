'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Rect, Circle, Text, Line, Path, Image, Transformer, Group } from 'react-konva';
import Konva from 'konva';
import { CanvasElement as CanvasElementType } from '../types';
import { useCanvasStore } from '../store/canvasStore';
import { loadImageElement } from '../utils/canvas';
import { createPortal } from 'react-dom';
import { findAlignmentGuides, findResizeGuides } from '../utils/alignmentDetection';
import { AlignmentGuide, SizeGuide } from './AlignmentGuides';

interface CanvasElementProps {
  element: CanvasElementType;
  isSelected: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onAlignmentGuides?: (guides: AlignmentGuide[], sizeGuides: SizeGuide[]) => void;
}

const CanvasElement: React.FC<CanvasElementProps> = ({ element, isSelected, isEditing, onEdit, onAlignmentGuides }) => {
  const shapeRef = useRef<any>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  
  const { updateElement, selectElement, canvasState, currentTool, elements } = useCanvasStore();

  // Load image if element is image type
  useEffect(() => {
    if (element.type === 'image' && element.data.type === 'image') {
      loadImageElement(element.data.src).then(setImage).catch(console.error);
    }
  }, [element]);

  // Attach transformer to selected elements
  useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleSelect = (e: any) => {
    if (currentTool !== 'select') return;
    
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    selectElement(element.id, metaPressed);
  };

  const handleDragMove = (e: any) => {
    const node = e.target;
    const dragPos = { x: node.x(), y: node.y() };
    
    // Find alignment guides
    const { guides, sizeGuides, snapPosition } = findAlignmentGuides(
      element,
      elements,
      dragPos
    );
    
    // Apply snap if found
    if (snapPosition) {
      node.x(snapPosition.x);
      node.y(snapPosition.y);
    }
    
    // Show guides
    if (onAlignmentGuides) {
      onAlignmentGuides(guides, sizeGuides);
    }
  };
  
  const handleDragEnd = (e: any) => {
    const node = e.target;
    const finalPos = { x: node.x(), y: node.y() };
    
    // Clear guides
    if (onAlignmentGuides) {
      onAlignmentGuides([], []);
    }
    
    // Apply grid snap if enabled and no alignment snap was used
    const snapPos = canvasState.snapToGrid
      ? {
          x: Math.round(finalPos.x / canvasState.gridSize) * canvasState.gridSize,
          y: Math.round(finalPos.y / canvasState.gridSize) * canvasState.gridSize,
        }
      : finalPos;

    updateElement(element.id, snapPos);
  };

  const handleTransform = (e: any) => {
    const node = shapeRef.current;
    if (!node) return;
    
    // For text elements, directly update size without scale
    if (element.type === 'text') {
      const transformer = transformerRef.current;
      if (transformer) {
        // Get the new width and height from the transformer
        const box = transformer.getClientRect();
        updateElement(element.id, {
          width: Math.round(box.width),
          height: Math.round(box.height),
        });
      }
    }
    
    // Calculate new dimensions for guides
    const newWidth = node.width() * node.scaleX();
    const newHeight = node.height() * node.scaleY();
    
    // Find resize guides
    const { guides, sizeGuides } = findResizeGuides(
      element,
      elements,
      newWidth,
      newHeight
    );
    
    // Show guides
    if (onAlignmentGuides) {
      onAlignmentGuides(guides, sizeGuides);
    }
  };
  
  const handleTransformEnd = (e: any) => {
    // Clear guides
    if (onAlignmentGuides) {
      onAlignmentGuides([], []);
    }
    const node = shapeRef.current;
    if (!node) return;

    const updates: Partial<CanvasElementType> = {
      x: Math.round(node.x()),
      y: Math.round(node.y()),
      rotation: node.rotation(),
    };

    // Handle different element types
    if (element.type === 'text') {
      // For text, the size has already been updated during transform
      // Just ensure scale is reset
      updates.scaleX = 1;
      updates.scaleY = 1;
      
      // Reset the node's scale (should already be 1)
      node.scaleX(1);
      node.scaleY(1);
    } else if (element.type === 'rect' || element.type === 'image') {
      // Apply scale to dimensions and reset scale
      updates.width = Math.round(node.width() * node.scaleX());
      updates.height = Math.round(node.height() * node.scaleY());
      updates.scaleX = 1;
      updates.scaleY = 1;
      
      // Reset the node's scale after applying to dimensions
      node.scaleX(1);
      node.scaleY(1);
    } else if (element.type === 'circle') {
      // For circles, update radius based on scale
      const avgScale = (node.scaleX() + node.scaleY()) / 2;
      const newRadius = Math.round((element.data as any).radius * avgScale);
      updates.data = { ...element.data, radius: newRadius };
      updates.scaleX = 1;
      updates.scaleY = 1;
      
      // Reset the node's scale
      node.scaleX(1);
      node.scaleY(1);
    } else {
      // For other types, just update scale
      updates.scaleX = node.scaleX();
      updates.scaleY = node.scaleY();
    }

    updateElement(element.id, updates);
  };

  const commonProps = {
    ref: shapeRef,
    x: element.x,
    y: element.y,
    rotation: element.rotation || 0,
    // For text, never apply scale during transform to avoid distortion
    scaleX: element.type === 'text' ? 1 : (element.scaleX || 1),
    scaleY: element.type === 'text' ? 1 : (element.scaleY || 1),
    opacity: element.opacity || 1,
    draggable: !element.locked && currentTool === 'select',
    onClick: handleSelect,
    onTap: handleSelect,
    onDragMove: handleDragMove,
    onDragEnd: handleDragEnd,
    onTransform: handleTransform,
    onTransformEnd: handleTransformEnd,
  };

  const renderElement = () => {
    const { data } = element;

    switch (element.type) {
      case 'rect':
        if (data.type !== 'rect') return null;
        return (
          <Rect
            {...commonProps}
            width={element.width || 100}
            height={element.height || 100}
            fill={data.fill || '#3b82f6'}
            stroke={data.stroke || '#1e40af'}
            strokeWidth={data.strokeWidth || 2}
            cornerRadius={data.cornerRadius || 0}
          />
        );

      case 'circle':
        if (data.type !== 'circle') return null;
        return (
          <Circle
            {...commonProps}
            radius={data.radius}
            fill={data.fill || '#3b82f6'}
            stroke={data.stroke || '#1e40af'}
            strokeWidth={data.strokeWidth || 2}
          />
        );

      case 'text':
        if (data.type !== 'text') return null;
        
        // Create a group with background rect and text
        return (
          <Group {...commonProps} opacity={isEditing ? 0 : (commonProps.opacity || 1)}>
            {/* Background rectangle if backgroundColor is set */}
            {data.backgroundColor && data.backgroundColor !== 'transparent' && (
              <Rect
                x={0}
                y={0}
                width={element.width || 100}
                height={element.height || (data.fontSize || 16) * 1.5}
                fill={data.backgroundColor}
                cornerRadius={2}
              />
            )}
            <Text
              text={data.text}
              fontSize={data.fontSize || 16}
              fontFamily={data.fontFamily || 'Arial'}
              fontStyle={data.fontStyle || 'normal'}
              fontWeight={data.fontWeight || 'normal'}
              textDecoration={data.textDecoration || 'none'}
              fill={data.fill || '#000000'}
              stroke={data.stroke}
              strokeWidth={data.strokeWidth}
              align={data.align || 'left'}
              lineHeight={data.lineHeight || 1.2}
              width={element.width}
              height={element.height}
              wrap="word"
              ellipsis={false}
              padding={data.backgroundColor ? 4 : 0}
              onDblClick={() => onEdit && onEdit()}
              onDblTap={() => onEdit && onEdit()}
            />
          </Group>
        );

      case 'line':
        if (data.type !== 'line') return null;
        return (
          <Line
            {...commonProps}
            points={data.points}
            stroke={data.stroke || '#000000'}
            strokeWidth={data.strokeWidth || 2}
            lineCap={data.lineCap || 'round'}
            lineJoin={data.lineJoin || 'round'}
          />
        );

      case 'path':
        if (data.type !== 'path') return null;
        const pathData = data.points
          .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
          .join(' ');
        return (
          <Path
            {...commonProps}
            data={pathData + (data.closed ? ' Z' : '')}
            stroke={data.stroke || '#000000'}
            strokeWidth={data.strokeWidth || 2}
            fill={data.fill}
          />
        );

      case 'image':
        if (data.type !== 'image' || !image) return null;
        return (
          <Image
            {...commonProps}
            image={image}
            width={element.width || image.naturalWidth}
            height={element.height || image.naturalHeight}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {renderElement()}
      {isSelected && currentTool === 'select' && (
        <Transformer
          ref={transformerRef}
          anchorStroke="#3b82f6"
          anchorFill="#ffffff"
          anchorSize={8}
          borderStroke="#3b82f6"
          borderStrokeWidth={1}
          borderDash={[4, 4]}
          anchorCornerRadius={2}
          rotateAnchorOffset={20}
          rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
          rotationSnapTolerance={5}
          enabledAnchors={
            element.type === 'circle'
              ? ['top-left', 'top-right', 'bottom-left', 'bottom-right']
              : undefined
          }
          keepRatio={element.type === 'circle' || element.type === 'image'}
          ignoreStroke={true}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit minimum size
            const minSize = 10;
            if (Math.abs(newBox.width) < minSize) {
              newBox.width = oldBox.width > 0 ? minSize : -minSize;
            }
            if (Math.abs(newBox.height) < minSize) {
              newBox.height = oldBox.height > 0 ? minSize : -minSize;
            }
            
            // For image, maintain aspect ratio
            if (element.type === 'image') {
              const aspectRatio = oldBox.width / oldBox.height;
              // Determine which dimension changed more
              const widthChange = Math.abs(newBox.width - oldBox.width);
              const heightChange = Math.abs(newBox.height - oldBox.height);
              
              if (widthChange > heightChange) {
                // Width changed more, adjust height
                newBox.height = newBox.width / aspectRatio;
              } else {
                // Height changed more, adjust width  
                newBox.width = newBox.height * aspectRatio;
              }
            }
            
            // For text, don't apply any scale transformation
            if (element.type === 'text') {
              return {
                ...newBox,
                rotation: oldBox.rotation
              };
            }
            
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default CanvasElement;