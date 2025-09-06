import { CanvasElement } from '../types';
import { AlignmentGuide, SizeGuide } from '../components/AlignmentGuides';

interface ElementBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

const SNAP_THRESHOLD = 5; // Pixels within which to snap
const GUIDE_OFFSET = 1000; // How far guides extend beyond objects

export function getElementBounds(element: CanvasElement): ElementBounds {
  let left = element.x;
  let top = element.y;
  let width = element.width || 100;
  let height = element.height || 100;

  // Special handling for circles
  if (element.type === 'circle' && element.data.type === 'circle') {
    const radius = (element.data as any).radius || 50;
    left = element.x - radius;
    top = element.y - radius;
    width = radius * 2;
    height = radius * 2;
  }

  // Special handling for text
  if (element.type === 'text') {
    // Text position is already top-left
    width = element.width || 100;
    height = element.height || 24;
  }

  return {
    left,
    right: left + width,
    top,
    bottom: top + height,
    centerX: left + width / 2,
    centerY: top + height / 2,
    width,
    height,
  };
}

export function findAlignmentGuides(
  movingElement: CanvasElement,
  allElements: CanvasElement[],
  dragPos?: { x: number; y: number }
): { guides: AlignmentGuide[]; sizeGuides: SizeGuide[]; snapPosition?: { x: number; y: number } } {
  const guides: AlignmentGuide[] = [];
  const sizeGuides: SizeGuide[] = [];
  
  // Get bounds of the moving element (with potential drag position)
  const movingBounds = getElementBounds(movingElement);
  if (dragPos) {
    const dx = dragPos.x - movingElement.x;
    const dy = dragPos.y - movingElement.y;
    movingBounds.left += dx;
    movingBounds.right += dx;
    movingBounds.top += dy;
    movingBounds.bottom += dy;
    movingBounds.centerX += dx;
    movingBounds.centerY += dy;
  }

  let snapX: number | null = null;
  let snapY: number | null = null;

  // Check against all other elements
  allElements.forEach((element) => {
    if (element.id === movingElement.id) return;
    
    const targetBounds = getElementBounds(element);

    // Vertical alignment checks (left, center, right)
    const verticalChecks = [
      { moving: movingBounds.left, target: targetBounds.left, type: 'left' },
      { moving: movingBounds.left, target: targetBounds.right, type: 'left-to-right' },
      { moving: movingBounds.centerX, target: targetBounds.centerX, type: 'center' },
      { moving: movingBounds.right, target: targetBounds.left, type: 'right-to-left' },
      { moving: movingBounds.right, target: targetBounds.right, type: 'right' },
    ];

    verticalChecks.forEach((check) => {
      const diff = Math.abs(check.moving - check.target);
      if (diff < SNAP_THRESHOLD) {
        guides.push({
          type: 'vertical',
          position: check.target,
          start: Math.min(movingBounds.top, targetBounds.top) - GUIDE_OFFSET,
          end: Math.max(movingBounds.bottom, targetBounds.bottom) + GUIDE_OFFSET,
          snap: true,
          color: check.type === 'center' ? '#FF00FF' : '#00FFFF',
        });
        
        if (snapX === null) {
          snapX = check.target - (check.moving - movingBounds.left);
        }
      }
    });

    // Horizontal alignment checks (top, middle, bottom)
    const horizontalChecks = [
      { moving: movingBounds.top, target: targetBounds.top, type: 'top' },
      { moving: movingBounds.top, target: targetBounds.bottom, type: 'top-to-bottom' },
      { moving: movingBounds.centerY, target: targetBounds.centerY, type: 'middle' },
      { moving: movingBounds.bottom, target: targetBounds.top, type: 'bottom-to-top' },
      { moving: movingBounds.bottom, target: targetBounds.bottom, type: 'bottom' },
    ];

    horizontalChecks.forEach((check) => {
      const diff = Math.abs(check.moving - check.target);
      if (diff < SNAP_THRESHOLD) {
        guides.push({
          type: 'horizontal',
          position: check.target,
          start: Math.min(movingBounds.left, targetBounds.left) - GUIDE_OFFSET,
          end: Math.max(movingBounds.right, targetBounds.right) + GUIDE_OFFSET,
          snap: true,
          color: check.type === 'middle' ? '#FF00FF' : '#00FFFF',
        });
        
        if (snapY === null) {
          snapY = check.target - (check.moving - movingBounds.top);
        }
      }
    });

    // Size matching checks
    const widthDiff = Math.abs(movingBounds.width - targetBounds.width);
    const heightDiff = Math.abs(movingBounds.height - targetBounds.height);

    if (widthDiff < SNAP_THRESHOLD) {
      sizeGuides.push({
        type: 'width',
        size: targetBounds.width,
        position: { x: movingBounds.centerX, y: movingBounds.bottom + 20 },
        targetPosition: { x: targetBounds.centerX, y: targetBounds.bottom + 20 },
      });
    }

    if (heightDiff < SNAP_THRESHOLD) {
      sizeGuides.push({
        type: 'height',
        size: targetBounds.height,
        position: { x: movingBounds.right + 20, y: movingBounds.centerY },
        targetPosition: { x: targetBounds.right + 20, y: targetBounds.centerY },
      });
    }
  });

  // Calculate snap position if we found alignment points
  const snapPosition = (snapX !== null || snapY !== null) ? {
    x: snapX !== null ? snapX : (dragPos?.x || movingElement.x),
    y: snapY !== null ? snapY : (dragPos?.y || movingElement.y),
  } : undefined;

  return { guides, sizeGuides, snapPosition };
}

// Function to find guides during resize/transform
export function findResizeGuides(
  element: CanvasElement,
  allElements: CanvasElement[],
  newWidth: number,
  newHeight: number
): { guides: AlignmentGuide[]; sizeGuides: SizeGuide[] } {
  const guides: AlignmentGuide[] = [];
  const sizeGuides: SizeGuide[] = [];
  
  const elementBounds = getElementBounds(element);
  elementBounds.width = newWidth;
  elementBounds.height = newHeight;
  elementBounds.right = elementBounds.left + newWidth;
  elementBounds.bottom = elementBounds.top + newHeight;

  // Check against all other elements for size matching
  allElements.forEach((other) => {
    if (other.id === element.id) return;
    
    const otherBounds = getElementBounds(other);

    // Check for matching width
    if (Math.abs(newWidth - otherBounds.width) < SNAP_THRESHOLD) {
      sizeGuides.push({
        type: 'width',
        size: otherBounds.width,
        position: { x: elementBounds.centerX, y: elementBounds.bottom + 20 },
        targetPosition: { x: otherBounds.centerX, y: otherBounds.bottom + 20 },
      });
    }

    // Check for matching height
    if (Math.abs(newHeight - otherBounds.height) < SNAP_THRESHOLD) {
      sizeGuides.push({
        type: 'height',
        size: otherBounds.height,
        position: { x: elementBounds.right + 20, y: elementBounds.centerY },
        targetPosition: { x: otherBounds.right + 20, y: otherBounds.centerY },
      });
    }
  });

  return { guides, sizeGuides };
}