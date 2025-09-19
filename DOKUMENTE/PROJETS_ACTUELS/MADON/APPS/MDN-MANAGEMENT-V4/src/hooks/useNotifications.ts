import { useState, useEffect, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  userId: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: {
    employeeId?: string;
    leaveRequestId?: string;
    taskId?: string;
    documentId?: string;
    mentionedBy?: string;
  };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Charger les notifications depuis localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        setNotifications(parsedNotifications);
        setUnreadCount(parsedNotifications.filter((n: Notification) => !n.read).length);
      } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error);
      }
    }
  }, []);

  // Sauvegarder les notifications dans localStorage
  const saveNotifications = useCallback((newNotifications: Notification[]) => {
    localStorage.setItem('notifications', JSON.stringify(newNotifications));
    setNotifications(newNotifications);
    setUnreadCount(newNotifications.filter(n => !n.read).length);
  }, []);

  // Créer une nouvelle notification
  const createNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      read: false
    };

    const updatedNotifications = [newNotification, ...notifications];
    saveNotifications(updatedNotifications);

    // Déclencher un événement pour notifier les autres composants
    window.dispatchEvent(new CustomEvent('notificationCreated', { 
      detail: { notification: newNotification } 
    }));

    console.log('🔔 Notification créée:', newNotification.title);
    return newNotification;
  }, [notifications, saveNotifications]);

  // Marquer une notification comme lue
  const markAsRead = useCallback((notificationId: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(() => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);

  // Supprimer une notification
  const deleteNotification = useCallback((notificationId: string) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== notificationId);
    saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);

  // Supprimer toutes les notifications
  const clearAllNotifications = useCallback(() => {
    saveNotifications([]);
  }, [saveNotifications]);

  // Notifications spécifiques par type
  const createProfileUpdateNotification = useCallback((employeeName: string, updatedBy: string) => {
    return createNotification({
      type: 'info',
      title: 'Profil modifié',
      message: `Le profil de ${employeeName} a été modifié par ${updatedBy}`,
      userId: 'all', // Visible par tous les utilisateurs
      actionUrl: '/employees'
    });
  }, [createNotification]);

  const createLeaveRequestNotification = useCallback((employeeName: string, leaveType: string, startDate: string) => {
    return createNotification({
      type: 'info',
      title: 'Nouvelle demande de congé',
      message: `${employeeName} a demandé un congé ${leaveType} du ${startDate}`,
      userId: 'hr', // Visible par les RH et managers
      actionUrl: '/employees?tab=absences'
    });
  }, [createNotification]);

  const createLeaveStatusNotification = useCallback((employeeName: string, status: 'approved' | 'rejected', leaveType: string) => {
    return createNotification({
      type: status === 'approved' ? 'success' : 'warning',
      title: `Demande de congé ${status === 'approved' ? 'approuvée' : 'rejetée'}`,
      message: `Votre demande de congé ${leaveType} a été ${status === 'approved' ? 'approuvée' : 'rejetée'}`,
      userId: 'employee', // Visible par l'employé concerné
      actionUrl: '/employees?tab=absences'
    });
  }, [createNotification]);

  const createTaskAssignedNotification = useCallback((taskTitle: string, assignedBy: string, assignedTo: string) => {
    return createNotification({
      type: 'info',
      title: 'Nouvelle tâche assignée',
      message: `Une nouvelle tâche "${taskTitle}" vous a été assignée par ${assignedBy}`,
      userId: assignedTo,
      actionUrl: '/tasks'
    });
  }, [createNotification]);

  const createDocumentCreatedNotification = useCallback((documentTitle: string, createdBy: string) => {
    return createNotification({
      type: 'success',
      title: 'Nouveau document créé',
      message: `Un nouveau document "${documentTitle}" a été créé par ${createdBy}`,
      userId: 'all',
      actionUrl: '/documents'
    });
  }, [createNotification]);

  const createMentionNotification = useCallback((documentTitle: string, mentionedBy: string, mentionedUser: string) => {
    return createNotification({
      type: 'warning',
      title: 'Vous avez été mentionné',
      message: `${mentionedBy} vous a mentionné dans le document "${documentTitle}"`,
      userId: mentionedUser,
      actionUrl: '/documents',
      metadata: {
        mentionedBy
      }
    });
  }, [createNotification]);

  // Fonctions de notification simplifiées
  const notifySuccess = useCallback((message: string, title?: string) => {
    return createNotification({
      type: 'success',
      title: title || 'Succès',
      message,
      userId: 'current-user' // Sera remplacé par l'ID réel de l'utilisateur
    });
  }, [createNotification]);

  const notifyError = useCallback((message: string, title?: string) => {
    return createNotification({
      type: 'error',
      title: title || 'Erreur',
      message,
      userId: 'current-user'
    });
  }, [createNotification]);

  const notifyInfo = useCallback((message: string, title?: string) => {
    return createNotification({
      type: 'info',
      title: title || 'Information',
      message,
      userId: 'current-user'
    });
  }, [createNotification]);

  const notifyWarning = useCallback((message: string, title?: string) => {
    return createNotification({
      type: 'warning',
      title: title || 'Attention',
      message,
      userId: 'current-user'
    });
  }, [createNotification]);

  return {
    notifications,
    unreadCount,
    addNotification: createNotification,
    createNotification,
    createProfileUpdateNotification,
    createLeaveRequestNotification,
    createLeaveStatusNotification,
    createTaskAssignedNotification,
    createDocumentCreatedNotification,
    createMentionNotification,
    markAsRead,
    markAllAsRead,
    removeNotification: deleteNotification,
    clearAllNotifications,
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning
  };
}