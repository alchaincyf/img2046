import { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useCanvasStore } from '../store/canvasStore';

export const useCanvasHotkeys = () => {
  const {
    undo,
    redo,
    copy,
    paste,
    cut,
    duplicate,
    selectAll,
    clearSelection,
    deleteElements,
    canvasState,
    setTool,
    resetView,
    toggleGrid,
    toggleSnapToGrid,
  } = useCanvasStore();

  // Undo/Redo
  useHotkeys('ctrl+z, cmd+z', (e) => {
    e.preventDefault();
    undo();
  });

  useHotkeys('ctrl+shift+z, cmd+shift+z, ctrl+y, cmd+y', (e) => {
    e.preventDefault();
    redo();
  });

  // Copy/Paste/Cut
  useHotkeys('ctrl+c, cmd+c', (e) => {
    e.preventDefault();
    copy();
  });

  useHotkeys('ctrl+v, cmd+v', (e) => {
    e.preventDefault();
    paste();
  });

  useHotkeys('ctrl+x, cmd+x', (e) => {
    e.preventDefault();
    cut();
  });

  useHotkeys('ctrl+d, cmd+d', (e) => {
    e.preventDefault();
    duplicate();
  });

  // Selection
  useHotkeys('ctrl+a, cmd+a', (e) => {
    e.preventDefault();
    selectAll();
  });

  useHotkeys('escape', (e) => {
    e.preventDefault();
    clearSelection();
    setTool('select');
  });

  // Delete - Keep delete/backspace without modifier for deleting selected items
  useHotkeys('delete, backspace', (e) => {
    // Only prevent default and delete if we're not in a text input
    const target = e.target as HTMLElement;
    if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      if (canvasState.selectedIds.length > 0) {
        deleteElements(canvasState.selectedIds);
      }
    }
  });

  // Tools - All require cmd/ctrl modifier to avoid conflicts with text input
  useHotkeys('cmd+shift+v, ctrl+shift+v', () => setTool('select'));
  useHotkeys('cmd+h, ctrl+h', () => setTool('pan'));
  useHotkeys('cmd+t, ctrl+t', () => setTool('text'));
  useHotkeys('cmd+r, ctrl+r', () => setTool('rect'));
  useHotkeys('cmd+shift+c, ctrl+shift+c', () => setTool('circle'));
  useHotkeys('cmd+l, ctrl+l', () => setTool('line'));
  useHotkeys('cmd+p, ctrl+p', () => setTool('pen'));
  useHotkeys('cmd+e, ctrl+e', () => setTool('eraser'));

  // View
  useHotkeys('ctrl+0, cmd+0', (e) => {
    e.preventDefault();
    resetView();
  });

  useHotkeys('ctrl+g, cmd+g', (e) => {
    e.preventDefault();
    toggleGrid();
  });

  useHotkeys('ctrl+shift+g, cmd+shift+g', (e) => {
    e.preventDefault();
    toggleSnapToGrid();
  });

  // Layer operations
  useHotkeys('ctrl+], cmd+]', (e) => {
    e.preventDefault();
    const selectedId = canvasState.selectedIds[0];
    if (selectedId) {
      useCanvasStore.getState().bringForward(selectedId);
    }
  });

  useHotkeys('ctrl+[, cmd+[', (e) => {
    e.preventDefault();
    const selectedId = canvasState.selectedIds[0];
    if (selectedId) {
      useCanvasStore.getState().sendBackward(selectedId);
    }
  });

  useHotkeys('ctrl+shift+], cmd+shift+]', (e) => {
    e.preventDefault();
    const selectedId = canvasState.selectedIds[0];
    if (selectedId) {
      useCanvasStore.getState().bringToFront(selectedId);
    }
  });

  useHotkeys('ctrl+shift+[, cmd+shift+[', (e) => {
    e.preventDefault();
    const selectedId = canvasState.selectedIds[0];
    if (selectedId) {
      useCanvasStore.getState().sendToBack(selectedId);
    }
  });
};

export const useKeyboardPan = (
  isPanning: boolean,
  setPosition: (pos: { x: number; y: number }) => void
) => {
  useEffect(() => {
    if (!isPanning) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const step = e.shiftKey ? 50 : 10;
      const currentPosition = useCanvasStore.getState().canvasState.position;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setPosition({ ...currentPosition, y: currentPosition.y + step });
          break;
        case 'ArrowDown':
          e.preventDefault();
          setPosition({ ...currentPosition, y: currentPosition.y - step });
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setPosition({ ...currentPosition, x: currentPosition.x + step });
          break;
        case 'ArrowRight':
          e.preventDefault();
          setPosition({ ...currentPosition, x: currentPosition.x - step });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPanning, setPosition]);
};