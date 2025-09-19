import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  Trash2, 
  ExternalLink, 
  History, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  Eye
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export function NotificationCenter() {
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);

  // Filtrer les notifications selon l'utilisateur et son rôle
  const filteredNotifications = notifications.filter(notification => {
    if (notification.userId === 'all') return true;
    if (notification.userId === 'hr' && (user?.role === 'hr' || user?.role === 'admin')) return true;
    if (notification.userId === 'employee' && user?.role === 'employee') return true;
    if (notification.userId === user?.id.toString()) return true;
    return false;
  });

  // Calculer le nombre de notifications non lues pour cet utilisateur
  const userUnreadCount = filteredNotifications.filter(notification => !notification.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true, 
      locale: fr 
    });
  };

  return (
    <div className="relative">
      {/* Bouton de notification */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2"
      >
        <Bell className="h-5 w-5" />
        {userUnreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {userUnreadCount > 99 ? '99+' : userUnreadCount}
          </Badge>
        )}
      </Button>

      {/* Panel des notifications */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Notifications</CardTitle>
                <div className="flex gap-2">
                  {userUnreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Tout marquer comme lu
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllNotifications}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Effacer tout
                  </Button>
                  <Link to="/notifications">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                    >
                      <History className="h-3 w-3 mr-1" />
                      Historique
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 max-h-96 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>Aucune notification</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredNotifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50/30 border-l-2 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </h4>
                            <Badge className={`text-xs ${getNotificationBadgeColor(notification.type)}`}>
                              {notification.type}
                            </Badge>
                            {!notification.read && (
                              <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                                Non lu
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {formatDate(notification.createdAt)}
                            </span>
                            
                            <div className="flex gap-1">
                              {notification.actionUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    window.location.href = notification.actionUrl!;
                                    setIsOpen(false);
                                  }}
                                  className="text-xs p-1 h-6"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              )}
                              
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs p-1 h-6 text-green-600 hover:text-green-700"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              )}
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="text-xs p-1 h-6 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredNotifications.length > 10 && (
                    <div className="p-3 text-center border-t border-gray-100">
                      <Link to="/notifications">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-blue-600 hover:text-blue-700"
                          onClick={() => setIsOpen(false)}
                        >
                          Voir toutes les notifications ({filteredNotifications.length})
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
