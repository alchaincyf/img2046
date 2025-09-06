import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { CanvasElement, CanvasState } from '../types';

export interface DrawingStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface Canvas {
  id: string;
  name: string;
  elements: CanvasElement[];
  canvasState: CanvasState;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

interface MultiCanvasStore {
  // Canvases
  canvases: Canvas[];
  currentCanvasId: string | null;
  
  // Drawing style
  drawingStyle: DrawingStyle;
  
  // Actions
  createCanvas: (name: string) => string;
  deleteCanvas: (id: string) => void;
  renameCanvas: (id: string, name: string) => void;
  switchCanvas: (id: string) => void;
  updateCurrentCanvas: (elements: CanvasElement[], canvasState: CanvasState) => void;
  clearAllCanvases: () => void;
  
  // Drawing style
  setDrawingStyle: (style: Partial<DrawingStyle>) => void;
  
  // Thumbnails
  updateThumbnail: (id: string, dataUrl: string) => void;
  
  // Get methods
  getCurrentCanvas: () => Canvas | null;
  getCanvasById: (id: string) => Canvas | undefined;
}

const MAX_STORAGE_SIZE = 100 * 1024 * 1024; // 100MB

export const useMultiCanvasStore = create<MultiCanvasStore>()(
  devtools(
    persist(
      (set, get) => ({
        canvases: [],
        currentCanvasId: null,
        
        drawingStyle: {
          fill: '#ffffff',
          stroke: '#94a3b8',
          strokeWidth: 1,
        },
        
        createCanvas: (name) => {
          const id = nanoid();
          const newCanvas: Canvas = {
            id,
            name,
            elements: [],
            canvasState: {
              scale: 1,
              position: { x: 0, y: 0 },
              selectedIds: [],
              gridVisible: false,
              snapToGrid: false,
              gridSize: 20,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          set((state) => ({
            canvases: [...state.canvases, newCanvas],
            currentCanvasId: id,
          }));
          
          return id;
        },
        
        deleteCanvas: (id) => {
          set((state) => {
            const newCanvases = state.canvases.filter(c => c.id !== id);
            const newCurrentId = state.currentCanvasId === id 
              ? (newCanvases.length > 0 ? newCanvases[0].id : null)
              : state.currentCanvasId;
            
            return {
              canvases: newCanvases,
              currentCanvasId: newCurrentId,
            };
          });
        },
        
        renameCanvas: (id, name) => {
          set((state) => ({
            canvases: state.canvases.map(c => 
              c.id === id 
                ? { ...c, name, updatedAt: new Date().toISOString() } 
                : c
            ),
          }));
        },
        
        switchCanvas: (id) => {
          const canvas = get().canvases.find(c => c.id === id);
          if (canvas) {
            set({ currentCanvasId: id });
          }
        },
        
        updateCurrentCanvas: (elements, canvasState) => {
          const currentId = get().currentCanvasId;
          if (!currentId) return;
          
          set((state) => ({
            canvases: state.canvases.map(c => 
              c.id === currentId
                ? {
                    ...c,
                    elements,
                    canvasState,
                    updatedAt: new Date().toISOString(),
                  }
                : c
            ),
          }));
        },
        
        clearAllCanvases: () => {
          set({
            canvases: [],
            currentCanvasId: null,
          });
        },
        
        setDrawingStyle: (style) => {
          set((state) => ({
            drawingStyle: {
              ...state.drawingStyle,
              ...style,
            },
          }));
        },
        
        updateThumbnail: (id, dataUrl) => {
          set((state) => ({
            canvases: state.canvases.map(c => 
              c.id === id 
                ? { ...c, thumbnail: dataUrl }
                : c
            ),
          }));
        },
        
        getCurrentCanvas: () => {
          const state = get();
          return state.canvases.find(c => c.id === state.currentCanvasId) || null;
        },
        
        getCanvasById: (id) => {
          return get().canvases.find(c => c.id === id);
        },
      }),
      {
        name: 'multi-canvas-storage',
        partialize: (state) => ({
          canvases: state.canvases.map(c => ({
            ...c,
            // Exclude large image data from persistence
            elements: c.elements.map(el => {
              if (el.type === 'image' && el.data.type === 'image') {
                return {
                  ...el,
                  data: {
                    ...el.data,
                    src: el.data.src?.length > 1000 ? '[IMAGE_DATA_EXCLUDED]' : el.data.src,
                  },
                };
              }
              return el;
            }),
          })),
          currentCanvasId: state.currentCanvasId,
          drawingStyle: state.drawingStyle,
        }),
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str) return null;
            
            // Check size limit
            if (str.length > MAX_STORAGE_SIZE) {
              console.warn('Storage size exceeded, clearing old data');
              return null;
            }
            
            return JSON.parse(str);
          },
          setItem: (name, value) => {
            const str = JSON.stringify(value);
            
            // Check size before saving
            if (str.length <= MAX_STORAGE_SIZE) {
              localStorage.setItem(name, str);
            } else {
              console.error('Canvas data too large to save');
            }
          },
          removeItem: (name) => {
            localStorage.removeItem(name);
          },
        },
      }
    )
  )
);