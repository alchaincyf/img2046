'use client';

import React from 'react';

interface RatioButtonsProps {
  elementId: string;
  currentWidth: number;
  currentHeight: number;
  onResize: (width: number, height: number) => void;
}

const RatioButtons: React.FC<RatioButtonsProps> = ({
  elementId,
  currentWidth,
  currentHeight,
  onResize,
}) => {
  const ratios = [
    { label: '3:4', width: 3, height: 4 },
    { label: '4:3', width: 4, height: 3 },
    { label: '16:9', width: 16, height: 9 },
    { label: '9:16', width: 9, height: 16 },
    { label: '1:1', width: 1, height: 1 },
  ];

  const applyRatio = (ratioWidth: number, ratioHeight: number) => {
    // Keep the larger dimension and adjust the other
    const currentRatio = currentWidth / currentHeight;
    const targetRatio = ratioWidth / ratioHeight;
    
    let newWidth = currentWidth;
    let newHeight = currentHeight;
    
    if (currentRatio > targetRatio) {
      // Width is larger, adjust height
      newHeight = currentWidth / targetRatio;
    } else {
      // Height is larger, adjust width
      newWidth = currentHeight * targetRatio;
    }
    
    onResize(Math.round(newWidth), Math.round(newHeight));
  };

  return (
    <div className="absolute -top-8 left-0 flex gap-1 bg-white rounded shadow-lg p-1 z-50">
      {ratios.map((ratio) => (
        <button
          key={ratio.label}
          onClick={() => applyRatio(ratio.width, ratio.height)}
          className="px-2 py-1 text-xs bg-gray-100 hover:bg-blue-500 hover:text-white rounded transition-colors"
          title={`调整为 ${ratio.label} 比例`}
        >
          {ratio.label}
        </button>
      ))}
    </div>
  );
};

export default RatioButtons;