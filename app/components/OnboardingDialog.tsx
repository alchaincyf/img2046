'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from '@mui/material';
import BrushIcon from '@mui/icons-material/Brush';
import CompressIcon from '@mui/icons-material/Compress';
import ImageIcon from '@mui/icons-material/Image';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const steps = [
  {
    title: '欢迎使用图像魔方！',
    description: '您的一站式在线图像处理工具',
    icon: <CheckCircleIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
    features: [
      { icon: <BrushIcon />, text: '自由画布 - 专业创意设计' },
      { icon: <CompressIcon />, text: '智能压缩 - 保持高质量' },
      { icon: <ImageIcon />, text: '格式转换 - 支持多种格式' },
    ],
  },
  {
    title: '为什么选择我们？',
    description: '完全免费，保护隐私，功能强大',
    icon: <SecurityIcon sx={{ fontSize: 60, color: 'success.main' }} />,
    features: [
      { icon: <SecurityIcon />, text: '本地处理 - 图片不上传服务器' },
      { icon: <SpeedIcon />, text: '批量操作 - 一次处理20张' },
      { icon: <HistoryIcon />, text: '历史记录 - 方便快速回溯' },
    ],
  },
];

export default function OnboardingDialog() {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // 检查是否是首次访问
    const hasVisited = localStorage.getItem('has_visited');
    if (!hasVisited) {
      setOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleClose = () => {
    localStorage.setItem('has_visited', 'true');
    setOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem('has_visited', 'true');
    setOpen(false);
  };

  const currentStep = steps[activeStep];

  return (
    <Dialog
      open={open}
      onClose={handleSkip}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 8,
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          {currentStep.icon}
        </Box>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          {currentStep.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {currentStep.description}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((_, index) => (
            <Step key={index}>
              <StepLabel />
            </Step>
          ))}
        </Stepper>

        <List>
          {currentStep.features.map((feature, index) => (
            <ListItem key={index}>
              <ListItemIcon sx={{ color: 'primary.main' }}>
                {feature.icon}
              </ListItemIcon>
              <ListItemText
                primary={feature.text}
                primaryTypographyProps={{
                  variant: 'body1',
                  sx: { fontWeight: 500 },
                }}
              />
            </ListItem>
          ))}
        </List>

        {activeStep === steps.length - 1 && (
          <Paper
            elevation={0}
            sx={{
              mt: 2,
              p: 2,
              bgcolor: 'info.light',
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: 'info.contrastText' }}>
              💡 <strong>小提示：</strong> 所有处理都在您的浏览器本地完成，我们无法访问您的图片数据。
            </Typography>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
        <Button onClick={handleSkip} color="inherit">
          跳过
        </Button>
        <Box>
          {activeStep > 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              上一步
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              minWidth: 100,
              borderRadius: 2,
            }}
          >
            {activeStep === steps.length - 1 ? '开始使用' : '下一步'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
