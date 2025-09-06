'use client';

import React, { useRef, useEffect, useState } from 'react';

interface EditableTextProps {
  x: number;
  y: number;
  initialText?: string;
  onSave: (text: string) => void;
  onCancel: () => void;
  scale: number;
  stagePosition: { x: number; y: number };
}

const EditableText: React.FC<EditableTextProps> = ({
  x,
  y,
  initialText = '',
  onSave,
  onCancel,
  scale,
  stagePosition,
}) => {
  // Use default text if no initial text provided
  const defaultText = '花生真帅';
  const [text, setText] = useState(initialText || defaultText);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hasUserTyped, setHasUserTyped] = useState(false);

  console.log('[EditableText] Component rendered at position:', { x, y });
  console.log('[EditableText] Scale:', scale, 'Stage position:', stagePosition);

  useEffect(() => {
    console.log('[EditableText] Mounting, focusing textarea and selecting all text');
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Select all text so user can type to replace
      textareaRef.current.select();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    console.log('[EditableText] Key pressed:', e.key);
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleSave = () => {
    console.log('[EditableText] handleSave called with text:', text);
    if (text.trim() && text !== defaultText) {
      console.log('[EditableText] Saving text');
      onSave(text);
    } else if (text === defaultText && !hasUserTyped) {
      // User kept default text, save it
      console.log('[EditableText] Saving default text');
      onSave(text);
    } else if (text.trim()) {
      onSave(text);
    }
  };

  const handleCancel = () => {
    console.log('[EditableText] handleCancel called');
    onCancel();
  };

  // Handle click outside to save or cancel
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Check if clicked outside the textarea
      if (textareaRef.current && !textareaRef.current.contains(e.target as Node)) {
        console.log('[EditableText] Clicked outside');
        // Save the text even if it's the default text
        if (text && text.trim()) {
          handleSave();
        } else {
          handleCancel();
        }
      }
    };

    // Add longer delay to avoid immediate trigger when component mounts
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 500); // Increased delay to 500ms

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [text, handleSave, handleCancel]);

  // Calculate position considering scale and stage position
  const absoluteX = x * scale + stagePosition.x;
  const absoluteY = y * scale + stagePosition.y;

  return (
    <div
      className="fixed z-50"
      style={{
        left: `${absoluteX}px`,
        top: `${absoluteY}px`,
      }}
    >
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setHasUserTyped(true);
        }}
        onKeyDown={handleKeyDown}
        onBlur={(e) => {
          console.log('[EditableText] onBlur triggered, text:', text);
          // Don't auto-close on blur, let user click back if needed
          // User must press Enter to save or Esc to cancel
        }}
        className="p-2 border-2 border-blue-500 rounded bg-white shadow-xl resize-none outline-none ring-4 ring-blue-200"
        style={{
          fontSize: `${16 * scale}px`,
          minWidth: '200px',
          minHeight: '40px',
          transform: `scale(${1})`,
          transformOrigin: 'top left',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
        placeholder="输入文字..."
        autoFocus
      />
      <div className="absolute -bottom-8 left-0 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
        Enter 保存 | Esc 取消 | Shift+Enter 换行
      </div>
    </div>
  );
};

export default EditableText;