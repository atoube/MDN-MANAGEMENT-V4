import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration?: number; // en minutes
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskTimeStats {
  totalTime: number; // en minutes
  todayTime: number;
  weekTime: number;
  averageTime: number;
  entries: TimeEntry[];
}

export function useTimeTracking() {
  const { user } = useAuth();
  const [activeTimers, setActiveTimers] = useState<Map<string, TimeEntry>>(new Map());
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les entrées de temps depuis localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('timeEntries');
    const savedActiveTimers = localStorage.getItem('activeTimers');
    
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries);
        setTimeEntries(parsedEntries);
      } catch (error) {
        console.error('Erreur lors du chargement des entrées de temps:', error);
      }
    }

    if (savedActiveTimers) {
      try {
        const parsedTimers = JSON.parse(savedActiveTimers);
        setActiveTimers(new Map(parsedTimers));
      } catch (error) {
        console.error('Erreur lors du chargement des timers actifs:', error);
      }
    }
  }, []);

  // Sauvegarder les entrées de temps
  const saveTimeEntries = useCallback((entries: TimeEntry[]) => {
    localStorage.setItem('timeEntries', JSON.stringify(entries));
    setTimeEntries(entries);
  }, []);

  // Sauvegarder les timers actifs
  const saveActiveTimers = useCallback((timers: Map<string, TimeEntry>) => {
    localStorage.setItem('activeTimers', JSON.stringify(Array.from(timers.entries())));
    setActiveTimers(timers);
  }, []);

  // Démarrer un timer pour une tâche
  const startTimer = useCallback((taskId: string, description?: string) => {
    if (!user) return;

    // Arrêter tous les autres timers actifs
    stopAllTimers();

    const newEntry: TimeEntry = {
      id: `time-${Date.now()}`,
      taskId,
      userId: user.id.toString(),
      startTime: new Date().toISOString(),
      description,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newActiveTimers = new Map(activeTimers);
    newActiveTimers.set(taskId, newEntry);
    saveActiveTimers(newActiveTimers);

    console.log('⏱️ Timer démarré pour la tâche:', taskId);
    return newEntry;
  }, [user, activeTimers, saveActiveTimers]);

  // Arrêter un timer
  const stopTimer = useCallback((taskId: string) => {
    const timer = activeTimers.get(taskId);
    if (!timer) return;

    const endTime = new Date().toISOString();
    const duration = Math.floor((new Date(endTime).getTime() - new Date(timer.startTime).getTime()) / (1000 * 60));

    const completedEntry: TimeEntry = {
      ...timer,
      endTime,
      duration,
      isActive: false,
      updatedAt: endTime
    };

    // Ajouter à la liste des entrées
    const updatedEntries = [...timeEntries, completedEntry];
    saveTimeEntries(updatedEntries);

    // Retirer du timer actif
    const newActiveTimers = new Map(activeTimers);
    newActiveTimers.delete(taskId);
    saveActiveTimers(newActiveTimers);

    console.log('⏹️ Timer arrêté pour la tâche:', taskId, 'Durée:', duration, 'minutes');
    return completedEntry;
  }, [activeTimers, timeEntries, saveTimeEntries, saveActiveTimers]);

  // Arrêter tous les timers actifs
  const stopAllTimers = useCallback(() => {
    activeTimers.forEach((timer, taskId) => {
      stopTimer(taskId);
    });
  }, [activeTimers, stopTimer]);

  // Obtenir le temps écoulé d'un timer actif
  const getElapsedTime = useCallback((taskId: string) => {
    const timer = activeTimers.get(taskId);
    if (!timer) return 0;

    const now = new Date().getTime();
    const start = new Date(timer.startTime).getTime();
    return Math.floor((now - start) / (1000 * 60)); // en minutes
  }, [activeTimers]);

  // Obtenir les statistiques de temps pour une tâche
  const getTaskTimeStats = useCallback((taskId: string): TaskTimeStats => {
    const taskEntries = timeEntries.filter(entry => entry.taskId === taskId);
    const totalTime = taskEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = taskEntries
      .filter(entry => new Date(entry.startTime) >= today)
      .reduce((sum, entry) => sum + (entry.duration || 0), 0);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekTime = taskEntries
      .filter(entry => new Date(entry.startTime) >= weekAgo)
      .reduce((sum, entry) => sum + (entry.duration || 0), 0);

    const averageTime = taskEntries.length > 0 ? totalTime / taskEntries.length : 0;

    return {
      totalTime,
      todayTime,
      weekTime,
      averageTime,
      entries: taskEntries
    };
  }, [timeEntries]);

  // Obtenir les statistiques de temps pour un utilisateur
  const getUserTimeStats = useCallback((userId?: string) => {
    const targetUserId = userId || user?.id.toString();
    if (!targetUserId) return null;

    const userEntries = timeEntries.filter(entry => entry.userId === targetUserId);
    const totalTime = userEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = userEntries
      .filter(entry => new Date(entry.startTime) >= today)
      .reduce((sum, entry) => sum + (entry.duration || 0), 0);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekTime = userEntries
      .filter(entry => new Date(entry.startTime) >= weekAgo)
      .reduce((sum, entry) => sum + (entry.duration || 0), 0);

    return {
      totalTime,
      todayTime,
      weekTime,
      entries: userEntries
    };
  }, [timeEntries, user]);

  // Supprimer une entrée de temps
  const deleteTimeEntry = useCallback((entryId: string) => {
    const updatedEntries = timeEntries.filter(entry => entry.id !== entryId);
    saveTimeEntries(updatedEntries);
    console.log('🗑️ Entrée de temps supprimée:', entryId);
  }, [timeEntries, saveTimeEntries]);

  // Modifier une entrée de temps
  const updateTimeEntry = useCallback((entryId: string, updates: Partial<TimeEntry>) => {
    const updatedEntries = timeEntries.map(entry =>
      entry.id === entryId
        ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
        : entry
    );
    saveTimeEntries(updatedEntries);
    console.log('✏️ Entrée de temps modifiée:', entryId);
  }, [timeEntries, saveTimeEntries]);

  // Formater le temps en heures:minutes
  const formatTime = useCallback((minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toString().padStart(2, '0')}m`;
  }, []);

  // Vérifier si un timer est actif pour une tâche
  const isTimerActive = useCallback((taskId: string) => {
    return activeTimers.has(taskId);
  }, [activeTimers]);

  return {
    activeTimers,
    timeEntries,
    isLoading,
    startTimer,
    stopTimer,
    stopAllTimers,
    getElapsedTime,
    getTaskTimeStats,
    getUserTimeStats,
    deleteTimeEntry,
    updateTimeEntry,
    formatTime,
    isTimerActive
  };
}
