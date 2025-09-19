import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Bell, Check, AlertTriangle, Calendar, Package } from 'lucide-react';
import { Notification } from '@/types/dashboard';

interface NotificationCenterProps {
  notifications: Notification[];
}

export function NotificationCenter({ notifications }: NotificationCenterProps) {
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'task':
        return <Check className="h-4 w-4" />;
      case 'delivery':
        return <Package className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Notifications
        </CardTitle>
        <Bell className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`flex items-start space-x-3 p-3 rounded-lg ${
                notification.read ? 'bg-gray-50' : 'bg-blue-50'
              }`}
            >
              <div className={`mt-1 ${getPriorityColor(notification.priority)}`}>
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{notification.title}</h4>
                <p className="text-sm text-gray-500">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notification.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 