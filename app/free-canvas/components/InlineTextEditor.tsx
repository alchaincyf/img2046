'use client';

import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface InlineTextEditorProps {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  backgroundColor?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  width?: number;
  height?: number;
  scale: number;
  stageRef: React.RefObject<any>;
  onTextChange: (text: string) => void;
  onEditEnd: () => void;
}

const InlineTextEditor: React.FC<InlineTextEditorProps> = ({
  text,
  x,
  y,
  fontSize,
  fontFamily,
  fill,
  backgroundColor,
  fontWeight,
  fontStyle,
  textDecoration,
  width,
  height,
  scale,
  stageRef,
  onTextChange,
  onEditEnd,
}) => {
  const [editValue, setEditValue] = useState(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaPosition, setTextareaPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Calculate the absolute position of the text on the screen
    if (stageRef.current) {
      const stage = stageRef.current;
      const container = stage.container();
      const rect = container.getBoundingClientRect();
      
      // Get stage position and scale
      const stagePos = stage.position();
      const stageScale = stage.scaleX(); // Assuming uniform scale
      
      // Calculate absolute position
      const absX = rect.left + (x * stageScale) + stagePos.x;
      const absY = rect.top + (y * stageScale) + stagePos.y;
      
      setTextareaPosition({ x: absX, y: absY });
    }

    // Focus and select text
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [x, y, scale, stageRef]);

  // Auto-resize textarea
  useEffect(() => {
    const resize = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    if (textareaRef.current) {
      resize();
      const textarea = textareaRef.current;
      textarea.addEventListener('input', resize);
      return () => {
        textarea.removeEventListener('input', resize);
      };
    }
  }, [editValue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onEditEnd();
    }
    // Don't end edit on Enter, allow multiline
    e.stopPropagation();
  };

  const handleBlur = () => {
    if (editValue.trim()) {
      onTextChange(editValue);
    }
    onEditEnd();
  };

  // Get the current scale from stage
  const currentScale = stageRef.current?.scaleX() || 1;

  const textareaElement = (
    <textarea
      ref={textareaRef}
      value={editValue}
      onChange={(e) => {
        setEditValue(e.target.value);
        onTextChange(e.target.value); // Real-time update
      }}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      style={{
        position: 'fixed',
        left: `${textareaPosition.x}px`,
        top: `${textareaPosition.y}px`,
        fontSize: `${fontSize * currentScale}px`,
        fontFamily,
        fontWeight: fontWeight || 'normal',
        fontStyle: fontStyle || 'normal',
        textDecoration: textDecoration || 'none',
        color: fill,
        backgroundColor: backgroundColor || 'transparent',
        border: 'none',
        borderRadius: '2px',
        padding: backgroundColor && backgroundColor !== 'transparent' ? `${4 * currentScale}px` : 0,
        margin: 0,
        outline: 'none',
        resize: 'none',
        overflow: 'hidden',
        minWidth: width ? `${width * currentScale}px` : `${100 * currentScale}px`,
        minHeight: `${fontSize * currentScale * 1.5}px`,
        lineHeight: 1.2,
        zIndex: 10000,
        boxSizing: 'border-box',
        caretColor: fill,  // Cursor color matches text color
      }}
      placeholder="输入文字..."
    />
  );

  // Use React Portal to render outside of canvas container
  if (typeof document !== 'undefined') {
    return ReactDOM.createPortal(textareaElement, document.body);
  }

  return null;
};

export default InlineTextEditor;