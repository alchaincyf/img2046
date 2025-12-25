'use client';

import React from 'react';
import { Box, Alert, AlertTitle, IconButton, Button, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNotificationStore } from '../hooks/useNotification';

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 80,
        right: 20,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: { xs: 'calc(100vw - 40px)', sm: '400px' },
      }}
    >
      {notifications.map((notification) => (
        <Slide
          key={notification.id}
          direction="left"
          in={true}
          mountOnEnter
          unmountOnExit
        >
          <Alert
            severity={notification.type}
            action={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {notification.action && (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => {
                      notification.action?.onClick();
                      removeNotification(notification.id);
                    }}
                    sx={{ minWidth: 'auto' }}
                  >
                    {notification.action.label}
                  </Button>
                )}
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => removeNotification(notification.id)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            }
            sx={{
              boxShadow: 3,
              '& .MuiAlert-message': {
                width: '100%',
              },
            }}
          >
            <AlertTitle sx={{ fontWeight: 'bold' }}>{notification.title}</AlertTitle>
            {notification.message}
          </Alert>
        </Slide>
      ))}
    </Box>
  );
}
