'use client';

import React from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
} from '@mui/material';
import MouseIcon from '@mui/icons-material/Mouse';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import GestureIcon from '@mui/icons-material/Gesture';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import PanToolIcon from '@mui/icons-material/PanTool';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import GridOnIcon from '@mui/icons-material/GridOn';
import { useSVGStore, ToolType } from '../store/svgStore';

export default function Toolbar() {
  const {
    currentTool,
    setTool,
    undo,
    redo,
    deleteSelected,
    duplicateSelected,
    showGrid,
    toggleGrid,
    history,
    historyIndex,
  } = useSVGStore();

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleToolChange = (_event: React.MouseEvent<HTMLElement>, newTool: ToolType | null) => {
    if (newTool) {
      setTool(newTool);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: 1,
        borderRadius: 2,
      }}
    >
      {/* Drawing tools */}
      <ToggleButtonGroup
        orientation="vertical"
        value={currentTool}
        exclusive
        onChange={handleToolChange}
        size="small"
      >
        <ToggleButton value="select">
          <Tooltip title="选择工具 (V)" placement="right">
            <MouseIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="rect">
          <Tooltip title="矩形 (R)" placement="right">
            <CropSquareIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="circle">
          <Tooltip title="圆形 (C)" placement="right">
            <CircleOutlinedIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="ellipse">
          <Tooltip title="椭圆 (E)" placement="right">
            <Box sx={{ fontSize: '1.2rem' }}>⬭</Box>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="line">
          <Tooltip title="直线 (L)" placement="right">
            <RemoveIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="pen">
          <Tooltip title="画笔 (P)" placement="right">
            <GestureIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="text">
          <Tooltip title="文字 (T)" placement="right">
            <TextFieldsIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="pan">
          <Tooltip title="平移画布 (H)" placement="right">
            <PanToolIcon />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>

      <Divider />

      {/* Edit actions */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Tooltip title="撤销 (Ctrl+Z)" placement="right">
          <span>
            <IconButton
              size="small"
              onClick={undo}
              disabled={!canUndo}
            >
              <UndoIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="重做 (Ctrl+Y)" placement="right">
          <span>
            <IconButton
              size="small"
              onClick={redo}
              disabled={!canRedo}
            >
              <RedoIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="复制 (Ctrl+D)" placement="right">
          <IconButton size="small" onClick={duplicateSelected}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="删除 (Del)" placement="right">
          <IconButton size="small" onClick={deleteSelected}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider />

      {/* View options */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Tooltip title="显示网格 (Ctrl+G)" placement="right">
          <IconButton
            size="small"
            onClick={toggleGrid}
            color={showGrid ? 'primary' : 'default'}
          >
            <GridOnIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
}
