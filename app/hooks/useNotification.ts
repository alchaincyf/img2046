import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number; // 0 表示不自动关闭
  timestamp: number;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now(),
      duration: notification.duration ?? 6000, // 默认6秒
    };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // 自动移除（如果有duration）
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, newNotification.duration);
    }
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearAll: () => set({ notifications: [] }),
}));

// 便捷的 hook
export const useNotification = () => {
  const addNotification = useNotificationStore((state) => state.addNotification);

  return {
    success: (title: string, message: string, options?: { action?: Notification['action']; duration?: number }) => {
      addNotification({
        type: 'success',
        title,
        message,
        ...options,
      });
    },

    error: (title: string, message: string, options?: { action?: Notification['action']; duration?: number }) => {
      addNotification({
        type: 'error',
        title,
        message,
        duration: options?.duration ?? 8000, // 错误消息默认显示更长
        ...options,
      });
    },

    warning: (title: string, message: string, options?: { action?: Notification['action']; duration?: number }) => {
      addNotification({
        type: 'warning',
        title,
        message,
        ...options,
      });
    },

    info: (title: string, message: string, options?: { action?: Notification['action']; duration?: number }) => {
      addNotification({
        type: 'info',
        title,
        message,
        ...options,
      });
    },

    // 错误处理专用
    handleError: (error: Error | string, retryFn?: () => void) => {
      const errorMessage = typeof error === 'string' ? error : getErrorMessage(error);
      const errorTitle = typeof error === 'string' ? '操作失败' : error.name || '错误';

      addNotification({
        type: 'error',
        title: errorTitle,
        message: errorMessage,
        duration: 8000,
        action: retryFn ? { label: '重试', onClick: retryFn } : undefined,
      });
    },
  };
};

// 错误类型识别
function getErrorMessage(error: Error): string {
  const errorName = error.name || error.constructor.name;

  // 网络错误
  if (errorName === 'NetworkError' || error.message.includes('network')) {
    return '网络连接失败，请检查网络后重试';
  }

  // 超时错误
  if (errorName === 'TimeoutError' || error.message.includes('timeout')) {
    return '处理超时，请稍后再试';
  }

  // 文件大小错误
  if (error.message.includes('file size') || error.message.includes('too large')) {
    return '文件大小超过限制';
  }

  // 格式不支持
  if (error.message.includes('unsupported') || error.message.includes('format')) {
    return '不支持此文件格式';
  }

  // Canvas 错误
  if (error.message.includes('canvas') || error.message.includes('context')) {
    return '图像处理失败，请尝试其他图片';
  }

  // 权限错误
  if (error.message.includes('permission') || error.message.includes('denied')) {
    return '权限不足，请检查浏览器设置';
  }

  // 默认错误消息
  return error.message || '发生未知错误，请重试或联系客服';
}
