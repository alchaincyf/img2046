'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload } from 'lucide-react';
import { useCanvasStore } from '../store/canvasStore';

interface ImageUploaderProps {
  onClose: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onClose }) => {
  const { addElement } = useCanvasStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          addElement({
            type: 'image',
            x: Math.random() * 400 + 100,
            y: Math.random() * 300 + 100,
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
    });
    onClose();
  }, [addElement, onClose]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'],
    },
    multiple: true,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">上传图片</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-2">
            {isDragActive ? '释放以上传' : '拖拽图片到这里，或点击选择'}
          </p>
          <p className="text-xs text-gray-500">
            支持 PNG, JPG, JPEG, GIF, SVG, WebP
          </p>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;