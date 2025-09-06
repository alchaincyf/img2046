import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { CanvasElement, CanvasState, Tool, HistoryState, ElementType, ElementData } from '../types';

interface CanvasStore {
  // Canvas state
  elements: CanvasElement[];
  canvasState: CanvasState;
  currentTool: Tool;
  
  // History
  history: HistoryState[];
  historyIndex: number;
  maxHistorySize: number;
  
  // Actions
  setTool: (tool: Tool) => void;
  addElement: (element: Omit<CanvasElement, 'id' | 'zIndex'>) => CanvasElement;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  deleteElements: (ids: string[]) => void;
  
  // Selection
  selectElement: (id: string, multi?: boolean) => void;
  selectElements: (ids: string[]) => void;
  clearSelection: () => void;
  selectAll: () => void;
  
  // Canvas operations
  setScale: (scale: number) => void;
  setPosition: (position: { x: number; y: number }) => void;
  resetView: () => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;
  
  // Layer operations
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  
  // History
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
  
  // Clipboard
  clipboard: CanvasElement[];
  copy: () => void;
  paste: () => void;
  cut: () => void;
  duplicate: () => void;
  
  // Import/Export
  loadCanvas: (elements: CanvasElement[]) => void;
  clearCanvas: () => void;
  
  // Utils
  getSelectedElements: () => CanvasElement[];
  getElementById: (id: string) => CanvasElement | undefined;
}

const initialCanvasState: CanvasState = {
  scale: 1,
  position: { x: 0, y: 0 },
  gridVisible: true,
  gridSize: 20,
  snapToGrid: false,
  selectedIds: [],
};

export const useCanvasStore = create<CanvasStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      elements: [],
      canvasState: initialCanvasState,
      currentTool: 'select',
      history: [],
      historyIndex: -1,
      maxHistorySize: 50,
      clipboard: [],
      
      setTool: (tool) => set({ currentTool: tool }),
      
      addElement: (element) => {
        const elements = get().elements;
        const maxZIndex = Math.max(0, ...elements.map(e => e.zIndex));
        const newElement: CanvasElement = {
          ...element,
          id: nanoid(),
          zIndex: maxZIndex + 1,
        };
        
        set((state) => ({
          elements: [...state.elements, newElement],
          canvasState: {
            ...state.canvasState,
            selectedIds: [newElement.id],
          },
        }));
        
        get().saveHistory();
        return newElement;
      },
      
      updateElement: (id, updates) => {
        set((state) => ({
          elements: state.elements.map(el =>
            el.id === id ? { ...el, ...updates } : el
          ),
        }));
      },
      
      deleteElement: (id) => {
        set((state) => ({
          elements: state.elements.filter(el => el.id !== id),
          canvasState: {
            ...state.canvasState,
            selectedIds: state.canvasState.selectedIds.filter(sid => sid !== id),
          },
        }));
        get().saveHistory();
      },
      
      deleteElements: (ids) => {
        set((state) => ({
          elements: state.elements.filter(el => !ids.includes(el.id)),
          canvasState: {
            ...state.canvasState,
            selectedIds: state.canvasState.selectedIds.filter(sid => !ids.includes(sid)),
          },
        }));
        get().saveHistory();
      },
      
      selectElement: (id, multi = false) => {
        set((state) => ({
          canvasState: {
            ...state.canvasState,
            selectedIds: multi
              ? state.canvasState.selectedIds.includes(id)
                ? state.canvasState.selectedIds.filter(sid => sid !== id)
                : [...state.canvasState.selectedIds, id]
              : [id],
          },
        }));
      },
      
      selectElements: (ids) => {
        set((state) => ({
          canvasState: {
            ...state.canvasState,
            selectedIds: ids,
          },
        }));
      },
      
      clearSelection: () => {
        set((state) => ({
          canvasState: {
            ...state.canvasState,
            selectedIds: [],
          },
        }));
      },
      
      selectAll: () => {
        set((state) => ({
          canvasState: {
            ...state.canvasState,
            selectedIds: state.elements.map(el => el.id),
          },
        }));
      },
      
      setScale: (scale) => {
        const clampedScale = Math.max(0.1, Math.min(10, scale));
        set((state) => ({
          canvasState: {
            ...state.canvasState,
            scale: clampedScale,
          },
        }));
      },
      
      setPosition: (position) => {
        set((state) => ({
          canvasState: {
            ...state.canvasState,
            position,
          },
        }));
      },
      
      resetView: () => {
        set((state) => ({
          canvasState: {
            ...state.canvasState,
            scale: 1,
            position: { x: 0, y: 0 },
          },
        }));
      },
      
      toggleGrid: () => {
        set((state) => ({
          canvasState: {
            ...state.canvasState,
            gridVisible: !state.canvasState.gridVisible,
          },
        }));
      },
      
      toggleSnapToGrid: () => {
        set((state) => ({
          canvasState: {
            ...state.canvasState,
            snapToGrid: !state.canvasState.snapToGrid,
          },
        }));
      },
      
      bringToFront: (id) => {
        const elements = get().elements;
        const maxZIndex = Math.max(...elements.map(e => e.zIndex));
        set((state) => ({
          elements: state.elements.map(el =>
            el.id === id ? { ...el, zIndex: maxZIndex + 1 } : el
          ),
        }));
        get().saveHistory();
      },
      
      sendToBack: (id) => {
        const elements = get().elements;
        const minZIndex = Math.min(...elements.map(e => e.zIndex));
        set((state) => ({
          elements: state.elements.map(el =>
            el.id === id ? { ...el, zIndex: minZIndex - 1 } : el
          ),
        }));
        get().saveHistory();
      },
      
      bringForward: (id) => {
        const elements = get().elements.sort((a, b) => a.zIndex - b.zIndex);
        const currentIndex = elements.findIndex(el => el.id === id);
        if (currentIndex < elements.length - 1) {
          const nextElement = elements[currentIndex + 1];
          set((state) => ({
            elements: state.elements.map(el => {
              if (el.id === id) return { ...el, zIndex: nextElement.zIndex };
              if (el.id === nextElement.id) return { ...el, zIndex: elements[currentIndex].zIndex };
              return el;
            }),
          }));
          get().saveHistory();
        }
      },
      
      sendBackward: (id) => {
        const elements = get().elements.sort((a, b) => a.zIndex - b.zIndex);
        const currentIndex = elements.findIndex(el => el.id === id);
        if (currentIndex > 0) {
          const prevElement = elements[currentIndex - 1];
          set((state) => ({
            elements: state.elements.map(el => {
              if (el.id === id) return { ...el, zIndex: prevElement.zIndex };
              if (el.id === prevElement.id) return { ...el, zIndex: elements[currentIndex].zIndex };
              return el;
            }),
          }));
          get().saveHistory();
        }
      },
      
      saveHistory: () => {
        const { elements, canvasState, history, historyIndex, maxHistorySize } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({
          elements: [...elements],
          canvasState: { ...canvasState },
          timestamp: Date.now(),
        });
        
        if (newHistory.length > maxHistorySize) {
          newHistory.shift();
        }
        
        set({
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },
      
      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          const prevState = history[historyIndex - 1];
          set({
            elements: prevState.elements,
            canvasState: prevState.canvasState,
            historyIndex: historyIndex - 1,
          });
        }
      },
      
      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          const nextState = history[historyIndex + 1];
          set({
            elements: nextState.elements,
            canvasState: nextState.canvasState,
            historyIndex: historyIndex + 1,
          });
        }
      },
      
      copy: () => {
        const selectedElements = get().getSelectedElements();
        set({ clipboard: selectedElements });
      },
      
      paste: () => {
        const { clipboard } = get();
        if (clipboard.length === 0) return;
        
        const offset = 20;
        const newElements = clipboard.map(el => ({
          ...el,
          id: nanoid(),
          x: el.x + offset,
          y: el.y + offset,
        }));
        
        set((state) => ({
          elements: [...state.elements, ...newElements],
          canvasState: {
            ...state.canvasState,
            selectedIds: newElements.map(el => el.id),
          },
        }));
        
        get().saveHistory();
      },
      
      cut: () => {
        get().copy();
        const selectedIds = get().canvasState.selectedIds;
        get().deleteElements(selectedIds);
      },
      
      duplicate: () => {
        get().copy();
        get().paste();
      },
      
      loadCanvas: (elements) => {
        set({
          elements,
          canvasState: initialCanvasState,
        });
        get().saveHistory();
      },
      
      clearCanvas: () => {
        set({
          elements: [],
          canvasState: initialCanvasState,
        });
        get().saveHistory();
      },
      
      getSelectedElements: () => {
        const { elements, canvasState } = get();
        return elements.filter(el => canvasState.selectedIds.includes(el.id));
      },
      
      getElementById: (id) => {
        return get().elements.find(el => el.id === id);
      },
    }))
  )
);