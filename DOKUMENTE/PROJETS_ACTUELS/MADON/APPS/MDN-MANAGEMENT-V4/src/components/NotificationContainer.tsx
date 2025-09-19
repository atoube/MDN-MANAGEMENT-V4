import React from 'react';
import { useNotification, NotificationType } from '../hooks/useNotification';

const getNotificationStyles = (type: NotificationType) => {
  const baseStyles = 'p-4 rounded-lg shadow-lg mb-4 flex items-center justify-between';
  
  switch (type) {
    case 'success':
      return `${baseStyles} bg-green-50 text-green-800 border border-green-200`;
    case 'error':
      return `${baseStyles} bg-red-50 text-red-800 border border-red-200`;
    case 'warning':
      return `${baseStyles} bg-yellow-50 text-yellow-800 border border-yellow-200`;
    case 'info':
      return `${baseStyles} bg-blue-50 text-blue-800 border border-blue-200`;
    default:
      return baseStyles;
  }
};

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '⚠';
    case 'info':
      return 'ℹ';
    default:
      return '';
  }
};

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={getNotificationStyles(notification.type)}
          role="alert"
        >
          <div className="flex items-center">
            <span className="mr-2">{getIcon(notification.type)}</span>
            <p>{notification.message}</p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
} 