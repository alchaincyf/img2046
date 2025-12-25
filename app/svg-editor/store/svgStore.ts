import { create } from 'zustand';

export type SVGElementType = 'rect' | 'circle' | 'ellipse' | 'line' | 'path' | 'text' | 'polygon';
export type ToolType = 'select' | 'rect' | 'circle' | 'ellipse' | 'line' | 'pen' | 'text' | 'pan';

export interface SVGElement {
  id: string;
  type: SVGElementType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  radiusX?: number;
  radiusY?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  points?: string;
  d?: string; // path data
  text?: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  rotation: number;
  fontSize?: number;
  fontFamily?: string;
  zIndex: number;
}

interface HistoryState {
  elements: SVGElement[];
  timestamp: number;
}

interface SVGEditorStore {
  // Canvas settings
  canvasWidth: number;
  canvasHeight: number;
  canvasBackground: string;
  scale: number;
  offsetX: number;
  offsetY: number;

  // Elements
  elements: SVGElement[];
  selectedIds: string[];

  // Current tool
  currentTool: ToolType;

  // Drawing state
  isDrawing: boolean;
  drawingElement: SVGElement | null;

  // History
  history: HistoryState[];
  historyIndex: number;
  maxHistory: number;

  // Grid and guides
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;

  // Actions - Canvas
  setCanvasSize: (width: number, height: number) => void;
  setCanvasBackground: (color: string) => void;
  setScale: (scale: number) => void;
  setOffset: (offsetX: number, offsetY: number) => void;
  resetView: () => void;

  // Actions - Tool
  setTool: (tool: ToolType) => void;

  // Actions - Elements
  addElement: (element: Omit<SVGElement, 'id' | 'zIndex'>) => void;
  updateElement: (id: string, updates: Partial<SVGElement>) => void;
  deleteElement: (id: string) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;

  // Actions - Selection
  selectElement: (id: string) => void;
  selectElements: (ids: string[]) => void;
  clearSelection: () => void;
  selectAll: () => void;

  // Actions - Drawing
  startDrawing: (element: Omit<SVGElement, 'id' | 'zIndex'>) => void;
  updateDrawing: (updates: Partial<SVGElement>) => void;
  finishDrawing: () => void;
  cancelDrawing: () => void;

  // Actions - Z-order
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;

  // Actions - History
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;

  // Actions - Grid
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;
  setGridSize: (size: number) => void;

  // Actions - Export/Import
  exportToSVG: () => string;
  importFromSVG: (svgString: string) => void;
  clear: () => void;

  // Actions - LocalStorage
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}

const DEFAULT_CANVAS_WIDTH = 800;
const DEFAULT_CANVAS_HEIGHT = 600;

export const useSVGStore = create<SVGEditorStore>((set, get) => ({
  // Initial state
  canvasWidth: DEFAULT_CANVAS_WIDTH,
  canvasHeight: DEFAULT_CANVAS_HEIGHT,
  canvasBackground: '#ffffff',
  scale: 1,
  offsetX: 0,
  offsetY: 0,

  elements: [],
  selectedIds: [],

  currentTool: 'select',

  isDrawing: false,
  drawingElement: null,

  history: [],
  historyIndex: -1,
  maxHistory: 50,

  showGrid: false,
  snapToGrid: false,
  gridSize: 20,

  // Canvas actions
  setCanvasSize: (width, height) => set({ canvasWidth: width, canvasHeight: height }),
  setCanvasBackground: (color) => set({ canvasBackground: color }),
  setScale: (scale) => set({ scale: Math.max(0.1, Math.min(5, scale)) }),
  setOffset: (offsetX, offsetY) => set({ offsetX, offsetY }),
  resetView: () => set({ scale: 1, offsetX: 0, offsetY: 0 }),

  // Tool actions
  setTool: (tool) => set({ currentTool: tool }),

  // Element actions
  addElement: (element) => {
    const state = get();
    const newElement: SVGElement = {
      ...element,
      id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      zIndex: state.elements.length,
    };
    set({ elements: [...state.elements, newElement] });
    get().saveHistory();
  },

  updateElement: (id, updates) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    }));
  },

  deleteElement: (id) => {
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedIds: state.selectedIds.filter((selectedId) => selectedId !== id),
    }));
    get().saveHistory();
  },

  deleteSelected: () => {
    const state = get();
    if (state.selectedIds.length === 0) return;

    set({
      elements: state.elements.filter((el) => !state.selectedIds.includes(el.id)),
      selectedIds: [],
    });
    get().saveHistory();
  },

  duplicateSelected: () => {
    const state = get();
    if (state.selectedIds.length === 0) return;

    const selectedElements = state.elements.filter((el) =>
      state.selectedIds.includes(el.id)
    );

    const duplicates = selectedElements.map((el) => ({
      ...el,
      id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: el.x + 20,
      y: el.y + 20,
      zIndex: state.elements.length + selectedElements.indexOf(el),
    }));

    set({
      elements: [...state.elements, ...duplicates],
      selectedIds: duplicates.map((el) => el.id),
    });
    get().saveHistory();
  },

  // Selection actions
  selectElement: (id) => set({ selectedIds: [id] }),
  selectElements: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),
  selectAll: () => set((state) => ({ selectedIds: state.elements.map((el) => el.id) })),

  // Drawing actions
  startDrawing: (element) => {
    const newElement: SVGElement = {
      ...element,
      id: `temp-${Date.now()}`,
      zIndex: get().elements.length,
    };
    set({ isDrawing: true, drawingElement: newElement });
  },

  updateDrawing: (updates) => {
    set((state) => ({
      drawingElement: state.drawingElement
        ? { ...state.drawingElement, ...updates }
        : null,
    }));
  },

  finishDrawing: () => {
    const state = get();
    if (!state.drawingElement) return;

    const finalElement: SVGElement = {
      ...state.drawingElement,
      id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    set({
      elements: [...state.elements, finalElement],
      isDrawing: false,
      drawingElement: null,
      selectedIds: [finalElement.id],
    });
    get().saveHistory();
  },

  cancelDrawing: () => set({ isDrawing: false, drawingElement: null }),

  // Z-order actions
  bringToFront: (id) => {
    set((state) => {
      const maxZIndex = Math.max(...state.elements.map((el) => el.zIndex));
      return {
        elements: state.elements.map((el) =>
          el.id === id ? { ...el, zIndex: maxZIndex + 1 } : el
        ),
      };
    });
  },

  sendToBack: (id) => {
    set((state) => {
      const minZIndex = Math.min(...state.elements.map((el) => el.zIndex));
      return {
        elements: state.elements.map((el) =>
          el.id === id ? { ...el, zIndex: minZIndex - 1 } : el
        ),
      };
    });
  },

  bringForward: (id) => {
    set((state) => {
      const element = state.elements.find((el) => el.id === id);
      if (!element) return state;

      return {
        elements: state.elements.map((el) =>
          el.id === id ? { ...el, zIndex: el.zIndex + 1 } : el
        ),
      };
    });
  },

  sendBackward: (id) => {
    set((state) => {
      const element = state.elements.find((el) => el.id === id);
      if (!element) return state;

      return {
        elements: state.elements.map((el) =>
          el.id === id ? { ...el, zIndex: el.zIndex - 1 } : el
        ),
      };
    });
  },

  // History actions
  saveHistory: () => {
    const state = get();
    const newHistoryState: HistoryState = {
      elements: JSON.parse(JSON.stringify(state.elements)),
      timestamp: Date.now(),
    };

    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(newHistoryState);

    // Keep only last maxHistory states
    if (newHistory.length > state.maxHistory) {
      newHistory.shift();
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const state = get();
    if (state.historyIndex <= 0) return;

    const newIndex = state.historyIndex - 1;
    const historyState = state.history[newIndex];

    set({
      elements: JSON.parse(JSON.stringify(historyState.elements)),
      historyIndex: newIndex,
      selectedIds: [],
    });
  },

  redo: () => {
    const state = get();
    if (state.historyIndex >= state.history.length - 1) return;

    const newIndex = state.historyIndex + 1;
    const historyState = state.history[newIndex];

    set({
      elements: JSON.parse(JSON.stringify(historyState.elements)),
      historyIndex: newIndex,
      selectedIds: [],
    });
  },

  // Grid actions
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleSnapToGrid: () => set((state) => ({ snapToGrid: !state.snapToGrid })),
  setGridSize: (size) => set({ gridSize: size }),

  // Export/Import actions
  exportToSVG: () => {
    const state = get();
    const sortedElements = [...state.elements].sort((a, b) => a.zIndex - b.zIndex);

    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${state.canvasWidth}" height="${state.canvasHeight}" viewBox="0 0 ${state.canvasWidth} ${state.canvasHeight}">\n`;

    if (state.canvasBackground !== '#ffffff') {
      svgContent += `  <rect width="100%" height="100%" fill="${state.canvasBackground}"/>\n`;
    }

    sortedElements.forEach((el) => {
      const transform = el.rotation ? ` transform="rotate(${el.rotation} ${el.x} ${el.y})"` : '';
      const opacity = el.opacity !== 1 ? ` opacity="${el.opacity}"` : '';

      switch (el.type) {
        case 'rect':
          svgContent += `  <rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="${el.fill}" stroke="${el.stroke}" stroke-width="${el.strokeWidth}"${transform}${opacity}/>\n`;
          break;
        case 'circle':
          svgContent += `  <circle cx="${el.x}" cy="${el.y}" r="${el.radius}" fill="${el.fill}" stroke="${el.stroke}" stroke-width="${el.strokeWidth}"${transform}${opacity}/>\n`;
          break;
        case 'ellipse':
          svgContent += `  <ellipse cx="${el.x}" cy="${el.y}" rx="${el.radiusX}" ry="${el.radiusY}" fill="${el.fill}" stroke="${el.stroke}" stroke-width="${el.strokeWidth}"${transform}${opacity}/>\n`;
          break;
        case 'line':
          svgContent += `  <line x1="${el.x1}" y1="${el.y1}" x2="${el.x2}" y2="${el.y2}" stroke="${el.stroke}" stroke-width="${el.strokeWidth}"${opacity}/>\n`;
          break;
        case 'path':
          svgContent += `  <path d="${el.d}" fill="${el.fill}" stroke="${el.stroke}" stroke-width="${el.strokeWidth}"${transform}${opacity}/>\n`;
          break;
        case 'text':
          svgContent += `  <text x="${el.x}" y="${el.y}" fill="${el.fill}" font-size="${el.fontSize}" font-family="${el.fontFamily}"${transform}${opacity}>${el.text}</text>\n`;
          break;
        case 'polygon':
          svgContent += `  <polygon points="${el.points}" fill="${el.fill}" stroke="${el.stroke}" stroke-width="${el.strokeWidth}"${transform}${opacity}/>\n`;
          break;
      }
    });

    svgContent += '</svg>';
    return svgContent;
  },

  importFromSVG: (svgString) => {
    // Basic SVG parsing - can be enhanced
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgString, 'image/svg+xml');
      const svgElement = doc.documentElement;

      // Parse canvas dimensions
      const width = parseInt(svgElement.getAttribute('width') || `${DEFAULT_CANVAS_WIDTH}`);
      const height = parseInt(svgElement.getAttribute('height') || `${DEFAULT_CANVAS_HEIGHT}`);

      set({
        canvasWidth: width,
        canvasHeight: height,
        elements: [], // Clear existing elements
      });

      // This is a simplified parser - a full implementation would parse all SVG elements
      // For now, users can manually create elements
    } catch (error) {
      console.error('Failed to parse SVG:', error);
    }
  },

  clear: () => {
    set({
      elements: [],
      selectedIds: [],
      history: [],
      historyIndex: -1,
    });
  },

  // LocalStorage actions
  saveToLocalStorage: () => {
    const state = get();
    const data = {
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      canvasBackground: state.canvasBackground,
      elements: state.elements,
      timestamp: Date.now(),
    };

    try {
      const history = JSON.parse(localStorage.getItem('svg_editor_history') || '[]');
      history.unshift(data);
      // Keep only last 20 saves
      const trimmedHistory = history.slice(0, 20);
      localStorage.setItem('svg_editor_history', JSON.stringify(trimmedHistory));
      localStorage.setItem('svg_editor_current', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  loadFromLocalStorage: () => {
    try {
      const saved = localStorage.getItem('svg_editor_current');
      if (saved) {
        const data = JSON.parse(saved);
        set({
          canvasWidth: data.canvasWidth,
          canvasHeight: data.canvasHeight,
          canvasBackground: data.canvasBackground,
          elements: data.elements,
        });
        get().saveHistory();
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  },
}));
