import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from './useTasks';
import { useTimeTracking } from './useTimeTracking';
import { useComments } from './useComments';
import { useTags } from './useTags';
import { useEmployees } from './useEmployees';

export interface TaskMetrics {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  overdue: number;
  completionRate: number;
  averageCompletionTime: number; // en heures
}

export interface TimeMetrics {
  totalTime: number; // en minutes
  todayTime: number;
  weekTime: number;
  monthTime: number;
  averageSessionTime: number;
  mostProductiveDay: string;
  productivityTrend: 'up' | 'down' | 'stable';
}

export interface TeamMetrics {
  totalMembers: number;
  activeMembers: number;
  tasksPerMember: number;
  averageCompletionRate: number;
  topPerformers: Array<{
    userId: string;
    name: string;
    completedTasks: number;
    totalTime: number;
  }>;
}

export interface CommentMetrics {
  totalComments: number;
  averageCommentsPerTask: number;
  mostActiveCommenters: Array<{
    userId: string;
    name: string;
    commentCount: number;
  }>;
  responseRate: number; // pourcentage de commentaires avec réponses
}

export interface TagMetrics {
  totalTags: number;
  mostUsedTags: Array<{
    tagId: string;
    name: string;
    usageCount: number;
    color: string;
  }>;
  averageTagsPerTask: number;
}

export interface ProductivityMetrics {
  tasksCompletedToday: number;
  tasksCompletedThisWeek: number;
  tasksCompletedThisMonth: number;
  timeSpentToday: number;
  timeSpentThisWeek: number;
  timeSpentThisMonth: number;
  efficiency: number; // tâches par heure
  focus: number; // temps moyen par session
}

export interface DashboardData {
  taskMetrics: TaskMetrics;
  timeMetrics: TimeMetrics;
  teamMetrics: TeamMetrics;
  commentMetrics: CommentMetrics;
  tagMetrics: TagMetrics;
  productivityMetrics: ProductivityMetrics;
  lastUpdated: string;
}

export function useMetrics() {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const { tasks, filteredTasks } = useTasks('default-project');
  const { timeEntries, getUserTimeStats } = useTimeTracking();
  const { comments, getCommentStats } = useComments();
  const { tags, getMostUsedTags } = useTags();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setIsLoading] = useState(false);

  // Calculer les métriques des tâches
  const calculateTaskMetrics = useCallback((): TaskMetrics => {
    const now = new Date();
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in_progress').length;
    const pending = tasks.filter(task => task.status === 'todo').length;
    const overdue = tasks.filter(task => {
      if (!task.due_date) return false;
      return new Date(task.due_date) < now && task.status !== 'completed';
    }).length;

    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    // Calculer le temps moyen de completion (simulation)
    const averageCompletionTime = completed > 0 ? 24 : 0; // 24 heures par défaut

    return {
      total,
      completed,
      inProgress,
      pending,
      overdue,
      completionRate,
      averageCompletionTime
    };
  }, [tasks]);

  // Calculer les métriques de temps
  const calculateTimeMetrics = useCallback((): TimeMetrics => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalTime = timeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    const todayTime = timeEntries
      .filter(entry => new Date(entry.startTime) >= today)
      .reduce((sum, entry) => sum + (entry.duration || 0), 0);
    const weekTime = timeEntries
      .filter(entry => new Date(entry.startTime) >= weekAgo)
      .reduce((sum, entry) => sum + (entry.duration || 0), 0);
    const monthTime = timeEntries
      .filter(entry => new Date(entry.startTime) >= monthAgo)
      .reduce((sum, entry) => sum + (entry.duration || 0), 0);

    const averageSessionTime = timeEntries.length > 0 ? totalTime / timeEntries.length : 0;

    // Trouver le jour le plus productif
    const dayStats = new Map<string, number>();
    timeEntries.forEach(entry => {
      const day = new Date(entry.startTime).toLocaleDateString('fr-FR', { weekday: 'long' });
      const current = dayStats.get(day) || 0;
      dayStats.set(day, current + (entry.duration || 0));
    });

    const mostProductiveDay = Array.from(dayStats.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Lundi';

    // Tendance de productivité (simulation)
    const productivityTrend: 'up' | 'down' | 'stable' = 
      weekTime > monthTime / 4 ? 'up' : 
      weekTime < monthTime / 4 ? 'down' : 'stable';

    return {
      totalTime,
      todayTime,
      weekTime,
      monthTime,
      averageSessionTime,
      mostProductiveDay,
      productivityTrend
    };
  }, [timeEntries]);

  // Calculer les métriques d'équipe
  const calculateTeamMetrics = useCallback((): TeamMetrics => {
    const totalMembers = employees.length;
    const activeMembers = employees.filter(emp => {
      // Un membre est actif s'il a des tâches assignées ou a créé des tâches
      return tasks.some(task => 
        task.assigned_to === emp.id.toString() || 
        task.created_by === emp.id.toString()
      );
    }).length;

    const tasksPerMember = totalMembers > 0 ? tasks.length / totalMembers : 0;

    // Top performers
    const userStats = new Map<string, { completedTasks: number; totalTime: number }>();
    
    tasks.forEach(task => {
      if (task.status === 'completed' && task.assigned_to) {
        const current = userStats.get(task.assigned_to) || { completedTasks: 0, totalTime: 0 };
        userStats.set(task.assigned_to, {
          ...current,
          completedTasks: current.completedTasks + 1
        });
      }
    });

    timeEntries.forEach(entry => {
      const current = userStats.get(entry.userId) || { completedTasks: 0, totalTime: 0 };
      userStats.set(entry.userId, {
        ...current,
        totalTime: current.totalTime + (entry.duration || 0)
      });
    });

    const topPerformers = Array.from(userStats.entries())
      .map(([userId, stats]) => {
        const employee = employees.find(emp => emp.id.toString() === userId);
        return {
          userId,
          name: employee ? `${employee.first_name} ${employee.last_name}` : 'Utilisateur inconnu',
          ...stats
        };
      })
      .sort((a, b) => b.completedTasks - a.completedTasks)
      .slice(0, 5);

    const averageCompletionRate = totalMembers > 0 ? 
      topPerformers.reduce((sum, perf) => sum + perf.completedTasks, 0) / totalMembers : 0;

    return {
      totalMembers,
      activeMembers,
      tasksPerMember,
      averageCompletionRate,
      topPerformers
    };
  }, [employees, tasks, timeEntries]);

  // Calculer les métriques de commentaires
  const calculateCommentMetrics = useCallback((): CommentMetrics => {
    const stats = getCommentStats();
    const totalComments = stats.totalComments;
    const averageCommentsPerTask = tasks.length > 0 ? totalComments / tasks.length : 0;

    // Commentateurs les plus actifs
    const commenterStats = new Map<string, number>();
    comments.forEach(comment => {
      const current = commenterStats.get(comment.userId) || 0;
      commenterStats.set(comment.userId, current + 1);
    });

    const mostActiveCommenters = Array.from(commenterStats.entries())
      .map(([userId, commentCount]) => {
        const employee = employees.find(emp => emp.id.toString() === userId);
        return {
          userId,
          name: employee ? `${employee.first_name} ${employee.last_name}` : 'Utilisateur inconnu',
          commentCount
        };
      })
      .sort((a, b) => b.commentCount - a.commentCount)
      .slice(0, 5);

    // Taux de réponse (commentaires avec des réponses)
    const commentsWithReplies = comments.filter(comment => 
      comments.some(reply => reply.parentId === comment.id)
    ).length;
    const responseRate = totalComments > 0 ? (commentsWithReplies / totalComments) * 100 : 0;

    return {
      totalComments,
      averageCommentsPerTask,
      mostActiveCommenters,
      responseRate
    };
  }, [comments, tasks, employees, getCommentStats]);

  // Calculer les métriques de tags
  const calculateTagMetrics = useCallback((): TagMetrics => {
    const totalTags = tags.length;
    const mostUsedTags = getMostUsedTags(10).map(tag => ({
      tagId: tag.id,
      name: tag.name,
      usageCount: tag.usageCount,
      color: tag.color
    }));

    const tasksWithTags = tasks.filter(task => {
      // Vérifier si la tâche a des tags (simulation)
      return Math.random() > 0.5; // 50% des tâches ont des tags
    }).length;

    const averageTagsPerTask = tasks.length > 0 ? tasksWithTags / tasks.length : 0;

    return {
      totalTags,
      mostUsedTags,
      averageTagsPerTask
    };
  }, [tags, tasks, getMostUsedTags]);

  // Calculer les métriques de productivité
  const calculateProductivityMetrics = useCallback((): ProductivityMetrics => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const tasksCompletedToday = tasks.filter(task => 
      task.status === 'completed' && 
      new Date(task.updated_at) >= today
    ).length;

    const tasksCompletedThisWeek = tasks.filter(task => 
      task.status === 'completed' && 
      new Date(task.updated_at) >= weekAgo
    ).length;

    const tasksCompletedThisMonth = tasks.filter(task => 
      task.status === 'completed' && 
      new Date(task.updated_at) >= monthAgo
    ).length;

    const timeSpentToday = timeEntries
      .filter(entry => new Date(entry.startTime) >= today)
      .reduce((sum, entry) => sum + (entry.duration || 0), 0);

    const timeSpentThisWeek = timeEntries
      .filter(entry => new Date(entry.startTime) >= weekAgo)
      .reduce((sum, entry) => sum + (entry.duration || 0), 0);

    const timeSpentThisMonth = timeEntries
      .filter(entry => new Date(entry.startTime) >= monthAgo)
      .reduce((sum, entry) => sum + (entry.duration || 0), 0);

    const efficiency = timeSpentThisWeek > 0 ? (tasksCompletedThisWeek / (timeSpentThisWeek / 60)) : 0;
    const focus = timeEntries.length > 0 ? 
      timeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / timeEntries.length : 0;

    return {
      tasksCompletedToday,
      tasksCompletedThisWeek,
      tasksCompletedThisMonth,
      timeSpentToday,
      timeSpentThisWeek,
      timeSpentThisMonth,
      efficiency,
      focus
    };
  }, [tasks, timeEntries]);

  // Calculer toutes les métriques
  const calculateAllMetrics = useCallback((): DashboardData => {
    const taskMetrics = calculateTaskMetrics();
    const timeMetrics = calculateTimeMetrics();
    const teamMetrics = calculateTeamMetrics();
    const commentMetrics = calculateCommentMetrics();
    const tagMetrics = calculateTagMetrics();
    const productivityMetrics = calculateProductivityMetrics();

    return {
      taskMetrics,
      timeMetrics,
      teamMetrics,
      commentMetrics,
      tagMetrics,
      productivityMetrics,
      lastUpdated: new Date().toISOString()
    };
  }, [
    calculateTaskMetrics,
    calculateTimeMetrics,
    calculateTeamMetrics,
    calculateCommentMetrics,
    calculateTagMetrics,
    calculateProductivityMetrics
  ]);

  // Mettre à jour les métriques
  const updateMetrics = useCallback(() => {
    setIsLoading(true);
    try {
      const newData = calculateAllMetrics();
      setDashboardData(newData);
      localStorage.setItem('dashboardMetrics', JSON.stringify(newData));
    } catch (error) {
      console.error('Erreur lors du calcul des métriques:', error);
    } finally {
      setIsLoading(false);
    }
  }, [calculateAllMetrics]);

  // Charger les métriques depuis localStorage
  useEffect(() => {
    const savedMetrics = localStorage.getItem('dashboardMetrics');
    if (savedMetrics) {
      try {
        const parsedMetrics = JSON.parse(savedMetrics);
        setDashboardData(parsedMetrics);
      } catch (error) {
        console.error('Erreur lors du chargement des métriques:', error);
      }
    }
    
    // Calculer les métriques initiales
    updateMetrics();
  }, [updateMetrics]);

  // Recalculer les métriques quand les données changent
  useEffect(() => {
    const interval = setInterval(updateMetrics, 30000); // Toutes les 30 secondes
    return () => clearInterval(interval);
  }, [updateMetrics]);

  // Formater le temps
  const formatTime = useCallback((minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toString().padStart(2, '0')}m`;
  }, []);

  // Formater les pourcentages
  const formatPercentage = useCallback((value: number) => {
    return `${value.toFixed(1)}%`;
  }, []);

  return {
    dashboardData,
    loading,
    updateMetrics,
    formatTime,
    formatPercentage
  };
}
