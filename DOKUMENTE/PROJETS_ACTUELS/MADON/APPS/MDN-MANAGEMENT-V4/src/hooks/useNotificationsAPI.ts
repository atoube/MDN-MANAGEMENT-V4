import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  created_at: string;
}

const API_BASE_URL = 'https://management.themadon.com/.netlify/functions';

export function useNotificationsAPI() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Charger les notifications depuis l'API
  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/notifications?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
      } else {
        console.error('Erreur lors du chargement des notifications:', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Charger les notifications au montage du composant
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Créer une nouvelle notification
  const createNotification = useCallback(async (notification: Omit<Notification, 'id' | 'created_at'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });

      if (response.ok) {
        const newNotification = await response.json();
        setNotifications(prev => [newNotification, ...prev]);
        if (!newNotification.is_read) {
          setUnreadCount(prev => prev + 1);
        }
        return newNotification;
      } else {
        console.error('Erreur lors de la création de la notification:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
      return null;
    }
  }, []);

  // Marquer une notification comme lue
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_read: true }),
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        console.error('Erreur lors de la mise à jour de la notification:', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la notification:', error);
    }
  }, []);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.is_read);
      const promises = unreadNotifications.map(n => markAsRead(n.id));
      await Promise.all(promises);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de toutes les notifications:', error);
    }
  }, [notifications, markAsRead]);

  // Supprimer une notification
  const deleteNotification = useCallback(async (notificationId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotifications(prev => {
          const notification = prev.find(n => n.id === notificationId);
          const newNotifications = prev.filter(n => n.id !== notificationId);
          if (notification && !notification.is_read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
          return newNotifications;
        });
      } else {
        console.error('Erreur lors de la suppression de la notification:', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
    }
  }, []);

  // Supprimer toutes les notifications
  const clearAllNotifications = useCallback(async () => {
    try {
      const promises = notifications.map(n => deleteNotification(n.id));
      await Promise.all(promises);
    } catch (error) {
      console.error('Erreur lors de la suppression de toutes les notifications:', error);
    }
  }, [notifications, deleteNotification]);

  // Fonctions de notification simplifiées
  const notifySuccess = useCallback((message: string, title?: string) => {
    if (!user?.id) return;
    return createNotification({
      user_id: user.id,
      title: title || 'Succès',
      message,
      type: 'success',
      is_read: false
    });
  }, [user?.id, createNotification]);

  const notifyError = useCallback((message: string, title?: string) => {
    if (!user?.id) return;
    return createNotification({
      user_id: user.id,
      title: title || 'Erreur',
      message,
      type: 'error',
      is_read: false
    });
  }, [user?.id, createNotification]);

  const notifyInfo = useCallback((message: string, title?: string) => {
    if (!user?.id) return;
    return createNotification({
      user_id: user.id,
      title: title || 'Information',
      message,
      type: 'info',
      is_read: false
    });
  }, [user?.id, createNotification]);

  const notifyWarning = useCallback((message: string, title?: string) => {
    if (!user?.id) return;
    return createNotification({
      user_id: user.id,
      title: title || 'Attention',
      message,
      type: 'warning',
      is_read: false
    });
  }, [user?.id, createNotification]);

  return {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning
  };
}
