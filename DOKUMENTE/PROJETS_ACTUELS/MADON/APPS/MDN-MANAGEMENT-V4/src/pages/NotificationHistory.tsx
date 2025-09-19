import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { 
  Bell, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  Calendar,
  User,
  Clock
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function NotificationHistory() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications } = useNotifications();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Filtrer les notifications (limiter à 50)
  const filteredNotifications = React.useMemo(() => {
    let filtered = notifications
      .filter(notification => {
        // Filtre par utilisateur et rôle
        if (notification.userId === 'all') return true;
        if (notification.userId === 'hr' && (user?.role === 'hr' || user?.role === 'admin')) return true;
        if (notification.userId === 'employee' && user?.role === 'employee') return true;
        if (notification.userId === user?.id.toString()) return true;
        return false;
      })
      .filter(notification => {
        // Filtre par recherche
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return notification.title.toLowerCase().includes(query) || 
                 notification.message.toLowerCase().includes(query);
        }
        return true;
      })
      .filter(notification => {
        // Filtre par type
        if (typeFilter !== 'all') {
          return notification.type === typeFilter;
        }
        return true;
      })
      .filter(notification => {
        // Filtre par statut
        if (statusFilter === 'read') return notification.read;
        if (statusFilter === 'unread') return !notification.read;
        return true;
      })
      .sort((a, b) => {
        // Tri par date
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
      })
      .slice(0, 50); // Limiter à 50 notifications

    return filtered;
  }, [notifications, searchQuery, typeFilter, statusFilter, sortBy]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
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

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotification(notificationId);
  };

  const handleClearAll = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes les notifications ?')) {
      clearAllNotifications();
    }
  };

  const unreadCount = filteredNotifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historique des Notifications</h1>
          <p className="text-gray-600">
            Consultez vos 50 dernières notifications
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Marquer tout comme lu
          </Button>
          <Button
            variant="outline"
            onClick={handleClearAll}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Tout supprimer
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{filteredNotifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Lues</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredNotifications.filter(n => n.read).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <EyeOff className="h-8 w-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Non lues</p>
                <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredNotifications.filter(n => {
                    const today = new Date().toDateString();
                    return new Date(n.createdAt).toDateString() === today;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher dans les notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="info">Information</SelectItem>
                <SelectItem value="success">Succès</SelectItem>
                <SelectItem value="warning">Attention</SelectItem>
                <SelectItem value="error">Erreur</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="unread">Non lues</SelectItem>
                <SelectItem value="read">Lues</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value: 'newest' | 'oldest') => setSortBy(value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Plus récentes</SelectItem>
                <SelectItem value="oldest">Plus anciennes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des notifications */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
              <p className="text-gray-500">
                {searchQuery || typeFilter !== 'all' || statusFilter !== 'all' 
                  ? 'Aucune notification ne correspond à vos critères de recherche.'
                  : 'Vous n\'avez pas encore de notifications.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card key={notification.id} className={`transition-all duration-200 hover:shadow-md ${
              !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        <Badge className={getNotificationBadgeColor(notification.type)}>
                          {notification.type}
                        </Badge>
                        {!notification.read && (
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            Non lu
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(new Date(notification.createdAt), { 
                              addSuffix: true, 
                              locale: fr 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {format(new Date(notification.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.read && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Marquer lu
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
