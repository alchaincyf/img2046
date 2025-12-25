'use client';

import React, { useEffect } from 'react';
import { Box, Typography, AppBar, Toolbar, Button, IconButton, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';
import HistoryIcon from '@mui/icons-material/History';
import ClearIcon from '@mui/icons-material/Clear';
import EditorToolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import PropertyPanel from './components/PropertyPanel';
import { useSVGStore } from './store/svgStore';
import { useNotification } from '../hooks/useNotification';

export default function SVGEditorClient() {
  const { exportToSVG, saveToLocalStorage, loadFromLocalStorage, clear } = useSVGStore();
  const notification = useNotification();

  // Load from localStorage on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const store = useSVGStore.getState();

      // Ctrl/Cmd + Z - Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        store.undo();
      }

      // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z - Redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        store.redo();
      }

      // Delete - Delete selected
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        store.deleteSelected();
      }

      // Ctrl/Cmd + D - Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        store.duplicateSelected();
      }

      // Ctrl/Cmd + A - Select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        store.selectAll();
      }

      // Ctrl/Cmd + G - Toggle grid
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        store.toggleGrid();
      }

      // Tool shortcuts
      if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'v':
            store.setTool('select');
            break;
          case 'r':
            store.setTool('rect');
            break;
          case 'c':
            store.setTool('circle');
            break;
          case 'e':
            store.setTool('ellipse');
            break;
          case 'l':
            store.setTool('line');
            break;
          case 'p':
            store.setTool('pen');
            break;
          case 't':
            store.setTool('text');
            break;
          case 'h':
            store.setTool('pan');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleExport = () => {
    try {
      const svgString = exportToSVG();
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `svg-design-${Date.now()}.svg`;
      link.click();
      URL.revokeObjectURL(url);

      notification.success('导出成功', 'SVG 文件已下载');
    } catch (error) {
      notification.error('导出失败', '导出 SVG 时出错，请重试');
    }
  };

  const handleSave = () => {
    try {
      saveToLocalStorage();
      notification.success('保存成功', '设计已保存到本地历史记录');
    } catch (error) {
      notification.error('保存失败', '保存时出错，请重试');
    }
  };

  const handleClear = () => {
    if (confirm('确定要清空画布吗？此操作无法撤销。')) {
      clear();
      notification.info('已清空', '画布已清空');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Top bar */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar variant="dense">
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            SVG 可视化编辑器
          </Typography>

          <Tooltip title="保存到历史">
            <IconButton onClick={handleSave} color="primary">
              <SaveIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="导出 SVG">
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              sx={{ ml: 1 }}
            >
              导出
            </Button>
          </Tooltip>

          <Tooltip title="查看历史">
            <IconButton sx={{ ml: 1 }}>
              <HistoryIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="清空画布">
            <IconButton onClick={handleClear} sx={{ ml: 1 }}>
              <ClearIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Toolbar */}
        <Box
          sx={{
            width: 60,
            bgcolor: 'background.paper',
            borderRight: 1,
            borderColor: 'divider',
            p: 1,
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          <EditorToolbar />
        </Box>

        {/* Canvas area */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: '#f5f5f5',
            overflow: 'auto',
            p: 2,
          }}
        >
          <Canvas />
        </Box>

        {/* Property panel */}
        <Box
          sx={{
            borderLeft: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <PropertyPanel />
        </Box>
      </Box>

      {/* Status bar */}
      <Box
        sx={{
          height: 24,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          fontSize: '0.75rem',
          color: 'text.secondary',
        }}
      >
        <Typography variant="caption">
          提示: 使用快捷键加速操作 - V(选择) R(矩形) C(圆形) L(直线) T(文字) Ctrl+Z(撤销) Del(删除)
        </Typography>
      </Box>
    </Box>
  );
}
