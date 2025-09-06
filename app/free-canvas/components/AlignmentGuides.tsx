'use client';

import React from 'react';
import { Line, Text, Group } from 'react-konva';

export interface AlignmentGuide {
  type: 'vertical' | 'horizontal';
  position: number;
  start: number;
  end: number;
  snap?: boolean;
  color?: string;
}

export interface SizeGuide {
  type: 'width' | 'height';
  size: number;
  position: { x: number; y: number };
  targetPosition: { x: number; y: number };
}

interface AlignmentGuidesProps {
  guides: AlignmentGuide[];
  sizeGuides: SizeGuide[];
  scale: number;
}

const AlignmentGuides: React.FC<AlignmentGuidesProps> = ({ guides, sizeGuides, scale }) => {
  return (
    <>
      {/* Alignment Lines */}
      {guides.map((guide, index) => {
        const points = guide.type === 'vertical'
          ? [guide.position, guide.start, guide.position, guide.end]
          : [guide.start, guide.position, guide.end, guide.position];

        return (
          <Line
            key={`guide-${index}`}
            points={points}
            stroke={guide.color || '#FF00FF'}
            strokeWidth={1 / scale}
            dash={guide.snap ? [5 / scale, 5 / scale] : undefined}
            opacity={0.8}
            listening={false}
          />
        );
      })}

      {/* Size Match Indicators */}
      {sizeGuides.map((guide, index) => {
        const isWidth = guide.type === 'width';
        const points = isWidth
          ? [guide.position.x, guide.position.y, guide.targetPosition.x, guide.targetPosition.y]
          : [guide.position.x, guide.position.y, guide.targetPosition.x, guide.targetPosition.y];

        return (
          <Group key={`size-guide-${index}`}>
            <Line
              points={points}
              stroke="#00FF00"
              strokeWidth={1 / scale}
              dash={[3 / scale, 3 / scale]}
              opacity={0.6}
              listening={false}
            />
            <Text
              x={(guide.position.x + guide.targetPosition.x) / 2}
              y={(guide.position.y + guide.targetPosition.y) / 2}
              text={`${Math.round(guide.size)}px`}
              fontSize={10 / scale}
              fill="#00FF00"
              align="center"
              listening={false}
            />
          </Group>
        );
      })}
    </>
  );
};

export default AlignmentGuides;