import { KonvaEventObject } from 'konva/lib/Node';

export type ElementType = 'image' | 'text' | 'rect' | 'circle' | 'line' | 'path';

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  visible?: boolean;
  locked?: boolean;
  opacity?: number;
  zIndex: number;
  data: ElementData;
}

export type ElementData = 
  | ImageElementData
  | TextElementData
  | RectElementData
  | CircleElementData
  | LineElementData
  | PathElementData;

export interface ImageElementData {
  type: 'image';
  src: string;
  naturalWidth?: number;
  naturalHeight?: number;
  filters?: string[];
}

export interface TextElementData {
  type: 'text';
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: 'normal' | 'bold' | 'italic';
  fontWeight?: string;
  textDecoration?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  align?: 'left' | 'center' | 'right';
  lineHeight?: number;
  backgroundColor?: string;
}

export interface RectElementData {
  type: 'rect';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  cornerRadius?: number;
}

export interface CircleElementData {
  type: 'circle';
  radius: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface LineElementData {
  type: 'line';
  points: number[];
  stroke?: string;
  strokeWidth?: number;
  lineCap?: 'butt' | 'round' | 'square';
  lineJoin?: 'miter' | 'round' | 'bevel';
}

export interface PathElementData {
  type: 'path';
  points: { x: number; y: number }[];
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  closed?: boolean;
}

export interface CanvasState {
  scale: number;
  position: { x: number; y: number };
  gridVisible: boolean;
  gridSize: number;
  snapToGrid: boolean;
  selectedIds: string[];
}

export interface HistoryState {
  elements: CanvasElement[];
  canvasState: CanvasState;
  timestamp: number;
}

export type Tool = 
  | 'select' 
  | 'pan' 
  | 'text' 
  | 'rect' 
  | 'circle' 
  | 'line' 
  | 'pen'
  | 'eraser';

export interface Point {
  x: number;
  y: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}