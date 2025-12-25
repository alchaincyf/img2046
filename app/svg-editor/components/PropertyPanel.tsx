'use client';

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Button,
  Stack,
} from '@mui/material';
import { useSVGStore } from '../store/svgStore';

export default function PropertyPanel() {
  const {
    elements,
    selectedIds,
    updateElement,
    canvasWidth,
    canvasHeight,
    setCanvasSize,
    canvasBackground,
    setCanvasBackground,
    exportToSVG,
    saveToLocalStorage,
  } = useSVGStore();

  const selectedElement = selectedIds.length === 1
    ? elements.find((el) => el.id === selectedIds[0])
    : null;

  const handleExport = () => {
    const svgString = exportToSVG();
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `design-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    saveToLocalStorage();
    // Show success notification
    if (typeof window !== 'undefined') {
      alert('已保存到本地历史记录');
    }
  };

  if (!selectedElement) {
    return (
      <Paper
        elevation={3}
        sx={{
          width: 280,
          height: '100%',
          p: 2,
          overflowY: 'auto',
        }}
      >
        <Typography variant="h6" gutterBottom>
          画布设置
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Stack spacing={2}>
          <TextField
            label="宽度"
            type="number"
            value={canvasWidth}
            onChange={(e) => setCanvasSize(Number(e.target.value), canvasHeight)}
            fullWidth
            size="small"
          />
          <TextField
            label="高度"
            type="number"
            value={canvasHeight}
            onChange={(e) => setCanvasSize(canvasWidth, Number(e.target.value))}
            fullWidth
            size="small"
          />
          <Box>
            <Typography variant="body2" gutterBottom>
              背景颜色
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <input
                type="color"
                value={canvasBackground}
                onChange={(e) => setCanvasBackground(e.target.value)}
                style={{ width: 50, height: 30, border: 'none', cursor: 'pointer' }}
              />
              <TextField
                value={canvasBackground}
                onChange={(e) => setCanvasBackground(e.target.value)}
                size="small"
                fullWidth
              />
            </Box>
          </Box>

          <Divider />

          <Button variant="contained" onClick={handleSave} fullWidth>
            保存到历史
          </Button>
          <Button variant="outlined" onClick={handleExport} fullWidth>
            导出 SVG
          </Button>
        </Stack>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            💡 选择一个元素以编辑其属性
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        width: 280,
        height: '100%',
        p: 2,
        overflowY: 'auto',
      }}
    >
      <Typography variant="h6" gutterBottom>
        属性
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Stack spacing={2}>
        {/* Position */}
        <TextField
          label="X 位置"
          type="number"
          value={Math.round(selectedElement.x)}
          onChange={(e) => updateElement(selectedElement.id, { x: Number(e.target.value) })}
          fullWidth
          size="small"
        />
        <TextField
          label="Y 位置"
          type="number"
          value={Math.round(selectedElement.y)}
          onChange={(e) => updateElement(selectedElement.id, { y: Number(e.target.value) })}
          fullWidth
          size="small"
        />

        {/* Size */}
        {selectedElement.type === 'rect' && (
          <>
            <TextField
              label="宽度"
              type="number"
              value={Math.round(selectedElement.width || 0)}
              onChange={(e) => updateElement(selectedElement.id, { width: Number(e.target.value) })}
              fullWidth
              size="small"
            />
            <TextField
              label="高度"
              type="number"
              value={Math.round(selectedElement.height || 0)}
              onChange={(e) => updateElement(selectedElement.id, { height: Number(e.target.value) })}
              fullWidth
              size="small"
            />
          </>
        )}

        {selectedElement.type === 'circle' && (
          <TextField
            label="半径"
            type="number"
            value={Math.round(selectedElement.radius || 0)}
            onChange={(e) => updateElement(selectedElement.id, { radius: Number(e.target.value) })}
            fullWidth
            size="small"
          />
        )}

        {selectedElement.type === 'ellipse' && (
          <>
            <TextField
              label="水平半径"
              type="number"
              value={Math.round(selectedElement.radiusX || 0)}
              onChange={(e) => updateElement(selectedElement.id, { radiusX: Number(e.target.value) })}
              fullWidth
              size="small"
            />
            <TextField
              label="垂直半径"
              type="number"
              value={Math.round(selectedElement.radiusY || 0)}
              onChange={(e) => updateElement(selectedElement.id, { radiusY: Number(e.target.value) })}
              fullWidth
              size="small"
            />
          </>
        )}

        {selectedElement.type === 'text' && (
          <>
            <TextField
              label="文字内容"
              value={selectedElement.text || ''}
              onChange={(e) => updateElement(selectedElement.id, { text: e.target.value })}
              fullWidth
              size="small"
              multiline
              rows={2}
            />
            <TextField
              label="字体大小"
              type="number"
              value={selectedElement.fontSize || 24}
              onChange={(e) => updateElement(selectedElement.id, { fontSize: Number(e.target.value) })}
              fullWidth
              size="small"
            />
            <FormControl fullWidth size="small">
              <InputLabel>字体</InputLabel>
              <Select
                value={selectedElement.fontFamily || 'Arial'}
                label="字体"
                onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value })}
              >
                <MenuItem value="Arial">Arial</MenuItem>
                <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                <MenuItem value="Courier New">Courier New</MenuItem>
                <MenuItem value="Georgia">Georgia</MenuItem>
                <MenuItem value="Verdana">Verdana</MenuItem>
              </Select>
            </FormControl>
          </>
        )}

        <Divider />

        {/* Colors */}
        {selectedElement.type !== 'line' && (
          <Box>
            <Typography variant="body2" gutterBottom>
              填充颜色
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <input
                type="color"
                value={selectedElement.fill}
                onChange={(e) => updateElement(selectedElement.id, { fill: e.target.value })}
                style={{ width: 50, height: 30, border: 'none', cursor: 'pointer' }}
              />
              <TextField
                value={selectedElement.fill}
                onChange={(e) => updateElement(selectedElement.id, { fill: e.target.value })}
                size="small"
                fullWidth
              />
            </Box>
          </Box>
        )}

        {selectedElement.type !== 'text' && (
          <>
            <Box>
              <Typography variant="body2" gutterBottom>
                边框颜色
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <input
                  type="color"
                  value={selectedElement.stroke}
                  onChange={(e) => updateElement(selectedElement.id, { stroke: e.target.value })}
                  style={{ width: 50, height: 30, border: 'none', cursor: 'pointer' }}
                />
                <TextField
                  value={selectedElement.stroke}
                  onChange={(e) => updateElement(selectedElement.id, { stroke: e.target.value })}
                  size="small"
                  fullWidth
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="body2" gutterBottom>
                边框宽度: {selectedElement.strokeWidth}px
              </Typography>
              <Slider
                value={selectedElement.strokeWidth}
                onChange={(_e, value) => updateElement(selectedElement.id, { strokeWidth: value as number })}
                min={0}
                max={20}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Box>
          </>
        )}

        <Divider />

        {/* Transform */}
        <Box>
          <Typography variant="body2" gutterBottom>
            旋转: {Math.round(selectedElement.rotation)}°
          </Typography>
          <Slider
            value={selectedElement.rotation}
            onChange={(_e, value) => updateElement(selectedElement.id, { rotation: value as number })}
            min={0}
            max={360}
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>

        <Box>
          <Typography variant="body2" gutterBottom>
            透明度: {Math.round(selectedElement.opacity * 100)}%
          </Typography>
          <Slider
            value={selectedElement.opacity}
            onChange={(_e, value) => updateElement(selectedElement.id, { opacity: value as number })}
            min={0}
            max={1}
            step={0.01}
            valueLabelDisplay="auto"
          />
        </Box>
      </Stack>
    </Paper>
  );
}
