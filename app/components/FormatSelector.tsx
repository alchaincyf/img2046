'use client';

import { ButtonGroup, Button } from '@mui/material';
import { useState } from 'react';

const formats = ['JPG', 'PNG', 'GIF', 'WebP', 'PDF'];

interface FormatSelectorProps {
  onFormatSelected: (format: string) => void;
}

export default function FormatSelector({ onFormatSelected }: FormatSelectorProps) {
  const [selectedFormat, setSelectedFormat] = useState(formats[0]);

  const handleFormatChange = (format: string) => {
    setSelectedFormat(format);
    onFormatSelected(format);
  };

  return (
    <ButtonGroup variant="contained" aria-label="选择目标格式" fullWidth>
      {formats.map(format => (
        <Button
          key={format}
          onClick={() => handleFormatChange(format)}
          variant={selectedFormat === format ? "contained" : "outlined"}
        >
          {format}
        </Button>
      ))}
    </ButtonGroup>
  );
}