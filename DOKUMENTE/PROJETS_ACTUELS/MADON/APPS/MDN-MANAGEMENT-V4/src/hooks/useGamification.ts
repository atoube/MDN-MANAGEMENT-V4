import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'productivity' | 'collaboration' | 'quality' | 'leadership' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  requirements: BadgeRequirement[];
  unlockedAt?: string;
  progress?: number; // 0-100
}

export interface BadgeRequirement {
  type: 'tasks_completed' | 'time_logged' | 'comments_made' | 'tags_created' | 'workflows_created' | 'streak_days' | 'team_help' | 'quality_score';
  target: number;
  current?: number;
}

export interface UserScore {
  userId: string;
  totalPoints: number;
  level: number;
  badges: string[]; // Badge IDs
  achievements: Achievement[];
  stats: UserStats;
  lastUpdated: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  unlockedAt: string;
  category: string;
}

export interface UserStats {
  tasksCompleted: number;
  timeLogged: number; // en minutes
  commentsMade: number;
  tagsCreated: number;
  workflowsCreated: number;
  streakDays: number;
  teamHelps: number;
  qualityScore: number; // 0-100
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  totalPoints: number;
  level: number;
  badgesCount: number;
  rank: number;
}

export function useGamification() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userScores, setUserScores] = useState<Map<string, UserScore>>(new Map());
  const [loading, setIsLoading] = useState(false);

  // Badges prédéfinis
  const predefinedBadges: Badge[] = [
    // Productivité
    {
      id: 'badge-1',
      name: 'Premier Pas',
      description: 'Complétez votre première tâche',
      icon: '🎯',
      color: 'bg-green-100 text-green-800',
      category: 'productivity',
      rarity: 'common',
      points: 10,
      requirements: [{ type: 'tasks_completed', target: 1 }]
    },
    {
      id: 'badge-2',
      name: 'Productif',
      description: 'Complétez 10 tâches',
      icon: '⚡',
      color: 'bg-blue-100 text-blue-800',
      category: 'productivity',
      rarity: 'common',
      points: 50,
      requirements: [{ type: 'tasks_completed', target: 10 }]
    },
    {
      id: 'badge-3',
      name: 'Super Productif',
      description: 'Complétez 50 tâches',
      icon: '🚀',
      color: 'bg-purple-100 text-purple-800',
      category: 'productivity',
      rarity: 'rare',
      points: 200,
      requirements: [{ type: 'tasks_completed', target: 50 }]
    },
    {
      id: 'badge-4',
      name: 'Maître Productif',
      description: 'Complétez 100 tâches',
      icon: '👑',
      color: 'bg-yellow-100 text-yellow-800',
      category: 'productivity',
      rarity: 'epic',
      points: 500,
      requirements: [{ type: 'tasks_completed', target: 100 }]
    },
    {
      id: 'badge-5',
      name: 'Légende',
      description: 'Complétez 500 tâches',
      icon: '🏆',
      color: 'bg-red-100 text-red-800',
      category: 'productivity',
      rarity: 'legendary',
      points: 1000,
      requirements: [{ type: 'tasks_completed', target: 500 }]
    },

    // Collaboration
    {
      id: 'badge-6',
      name: 'Bavard',
      description: 'Faites votre premier commentaire',
      icon: '💬',
      color: 'bg-green-100 text-green-800',
      category: 'collaboration',
      rarity: 'common',
      points: 15,
      requirements: [{ type: 'comments_made', target: 1 }]
    },
    {
      id: 'badge-7',
      name: 'Collaborateur',
      description: 'Faites 25 commentaires',
      icon: '🤝',
      color: 'bg-blue-100 text-blue-800',
      category: 'collaboration',
      rarity: 'common',
      points: 75,
      requirements: [{ type: 'comments_made', target: 25 }]
    },
    {
      id: 'badge-8',
      name: 'Mentor',
      description: 'Aidez 10 collègues',
      icon: '🎓',
      color: 'bg-purple-100 text-purple-800',
      category: 'collaboration',
      rarity: 'rare',
      points: 150,
      requirements: [{ type: 'team_help', target: 10 }]
    },

    // Qualité
    {
      id: 'badge-9',
      name: 'Perfectionniste',
      description: 'Maintenez un score de qualité de 95%',
      icon: '✨',
      color: 'bg-yellow-100 text-yellow-800',
      category: 'quality',
      rarity: 'epic',
      points: 300,
      requirements: [{ type: 'quality_score', target: 95 }]
    },
    {
      id: 'badge-10',
      name: 'Organisateur',
      description: 'Créez 20 tags',
      icon: '🏷️',
      color: 'bg-green-100 text-green-800',
      category: 'quality',
      rarity: 'common',
      points: 40,
      requirements: [{ type: 'tags_created', target: 20 }]
    },

    // Leadership
    {
      id: 'badge-11',
      name: 'Innovateur',
      description: 'Créez 5 workflows',
      icon: '⚙️',
      color: 'bg-blue-100 text-blue-800',
      category: 'leadership',
      rarity: 'rare',
      points: 100,
      requirements: [{ type: 'workflows_created', target: 5 }]
    },
    {
      id: 'badge-12',
      name: 'Leader',
      description: 'Créez 15 workflows',
      icon: '👨‍💼',
      color: 'bg-purple-100 text-purple-800',
      category: 'leadership',
      rarity: 'epic',
      points: 250,
      requirements: [{ type: 'workflows_created', target: 15 }]
    },

    // Spéciaux
    {
      id: 'badge-13',
      name: 'Marathonien',
      description: 'Travaillez 100 heures',
      icon: '⏰',
      color: 'bg-orange-100 text-orange-800',
      category: 'special',
      rarity: 'rare',
      points: 120,
      requirements: [{ type: 'time_logged', target: 6000 }] // 100 heures en minutes
    },
    {
      id: 'badge-14',
      name: 'Sérieux',
      description: 'Travaillez 7 jours consécutifs',
      icon: '🔥',
      color: 'bg-red-100 text-red-800',
      category: 'special',
      rarity: 'epic',
      points: 200,
      requirements: [{ type: 'streak_days', target: 7 }]
    },
    {
      id: 'badge-15',
      name: 'Déterminé',
      description: 'Travaillez 30 jours consécutifs',
      icon: '💪',
      color: 'bg-yellow-100 text-yellow-800',
      category: 'special',
      rarity: 'legendary',
      points: 500,
      requirements: [{ type: 'streak_days', target: 30 }]
    }
  ];

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedBadges = localStorage.getItem('gamificationBadges');
    const savedUserScores = localStorage.getItem('gamificationUserScores');
    
    if (savedBadges) {
      try {
        const parsedBadges = JSON.parse(savedBadges);
        setBadges(parsedBadges);
      } catch (error) {
        console.error('Erreur lors du chargement des badges:', error);
        setBadges(predefinedBadges);
        localStorage.setItem('gamificationBadges', JSON.stringify(predefinedBadges));
      }
    } else {
      setBadges(predefinedBadges);
      localStorage.setItem('gamificationBadges', JSON.stringify(predefinedBadges));
    }

    if (savedUserScores) {
      try {
        const parsedScores = JSON.parse(savedUserScores);
        setUserScores(new Map(parsedScores));
      } catch (error) {
        console.error('Erreur lors du chargement des scores:', error);
      }
    }
  }, []);

  // Sauvegarder les badges
  const saveBadges = useCallback((newBadges: Badge[]) => {
    localStorage.setItem('gamificationBadges', JSON.stringify(newBadges));
    setBadges(newBadges);
  }, []);

  // Sauvegarder les scores utilisateur
  const saveUserScores = useCallback((newScores: Map<string, UserScore>) => {
    localStorage.setItem('gamificationUserScores', JSON.stringify(Array.from(newScores.entries())));
    setUserScores(newScores);
  }, []);

  // Obtenir ou créer le score d'un utilisateur
  const getUserScore = useCallback((userId: string): UserScore => {
    if (userScores.has(userId)) {
      return userScores.get(userId)!;
    }

    const newScore: UserScore = {
      userId,
      totalPoints: 0,
      level: 1,
      badges: [],
      achievements: [],
      stats: {
        tasksCompleted: 0,
        timeLogged: 0,
        commentsMade: 0,
        tagsCreated: 0,
        workflowsCreated: 0,
        streakDays: 0,
        teamHelps: 0,
        qualityScore: 0
      },
      lastUpdated: new Date().toISOString()
    };

    const updatedScores = new Map(userScores);
    updatedScores.set(userId, newScore);
    saveUserScores(updatedScores);

    return newScore;
  }, [userScores, saveUserScores]);

  // Mettre à jour les statistiques d'un utilisateur
  const updateUserStats = useCallback((userId: string, statsUpdate: Partial<UserStats>) => {
    const userScore = getUserScore(userId);
    const updatedStats = { ...userScore.stats, ...statsUpdate };
    
    const updatedScore: UserScore = {
      ...userScore,
      stats: updatedStats,
      lastUpdated: new Date().toISOString()
    };

    // Vérifier les nouveaux badges
    const newBadges = checkBadgeProgress(updatedScore);
    if (newBadges.length > 0) {
      updatedScore.badges = [...updatedScore.badges, ...newBadges.map(b => b.id)];
      updatedScore.totalPoints += newBadges.reduce((sum, badge) => sum + badge.points, 0);
      updatedScore.level = calculateLevel(updatedScore.totalPoints);
    }

    const updatedScores = new Map(userScores);
    updatedScores.set(userId, updatedScore);
    saveUserScores(updatedScores);

    return updatedScore;
  }, [userScores, getUserScore, saveUserScores]);

  // Vérifier la progression des badges
  const checkBadgeProgress = useCallback((userScore: UserScore): Badge[] => {
    const newBadges: Badge[] = [];
    
    badges.forEach(badge => {
      if (userScore.badges.includes(badge.id)) return; // Badge déjà débloqué
      
      const isUnlocked = badge.requirements.every(requirement => {
        const currentValue = getRequirementValue(userScore.stats, requirement.type);
        return currentValue >= requirement.target;
      });

      if (isUnlocked) {
        const unlockedBadge = {
          ...badge,
          unlockedAt: new Date().toISOString(),
          progress: 100
        };
        newBadges.push(unlockedBadge);
      }
    });

    return newBadges;
  }, [badges]);

  // Obtenir la valeur d'une exigence
  const getRequirementValue = useCallback((stats: UserStats, type: string): number => {
    switch (type) {
      case 'tasks_completed': return stats.tasksCompleted;
      case 'time_logged': return stats.timeLogged;
      case 'comments_made': return stats.commentsMade;
      case 'tags_created': return stats.tagsCreated;
      case 'workflows_created': return stats.workflowsCreated;
      case 'streak_days': return stats.streakDays;
      case 'team_help': return stats.teamHelps;
      case 'quality_score': return stats.qualityScore;
      default: return 0;
    }
  }, []);

  // Calculer le niveau basé sur les points
  const calculateLevel = useCallback((points: number): number => {
    return Math.floor(points / 100) + 1;
  }, []);

  // Obtenir la progression d'un badge
  const getBadgeProgress = useCallback((badge: Badge, userStats: UserStats): number => {
    if (userStats === null) return 0;
    
    let totalProgress = 0;
    let requirementsCount = badge.requirements.length;

    badge.requirements.forEach(requirement => {
      const currentValue = getRequirementValue(userStats, requirement.type);
      const progress = Math.min((currentValue / requirement.target) * 100, 100);
      totalProgress += progress;
    });

    return Math.floor(totalProgress / requirementsCount);
  }, [getRequirementValue]);

  // Obtenir le classement
  const getLeaderboard = useCallback((): LeaderboardEntry[] => {
    const entries: LeaderboardEntry[] = [];
    
    userScores.forEach((score, userId) => {
      entries.push({
        userId,
        userName: `Utilisateur ${userId}`, // Dans un vrai système, on récupérerait le nom
        totalPoints: score.totalPoints,
        level: score.level,
        badgesCount: score.badges.length,
        rank: 0 // Sera calculé après le tri
      });
    });

    // Trier par points décroissants
    entries.sort((a, b) => b.totalPoints - a.totalPoints);
    
    // Assigner les rangs
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return entries;
  }, [userScores]);

  // Obtenir les badges d'un utilisateur
  const getUserBadges = useCallback((userId: string): Badge[] => {
    const userScore = getUserScore(userId);
    return badges.filter(badge => userScore.badges.includes(badge.id));
  }, [badges, getUserScore]);

  // Obtenir les badges disponibles (non débloqués)
  const getAvailableBadges = useCallback((userId: string): Badge[] => {
    const userScore = getUserScore(userId);
    return badges.filter(badge => !userScore.badges.includes(badge.id));
  }, [badges, getUserScore]);

  // Obtenir les statistiques globales
  const getGlobalStats = useCallback(() => {
    const totalUsers = userScores.size;
    const totalPoints = Array.from(userScores.values()).reduce((sum, score) => sum + score.totalPoints, 0);
    const totalBadges = Array.from(userScores.values()).reduce((sum, score) => sum + score.badges.length, 0);
    const averageLevel = totalUsers > 0 ? 
      Array.from(userScores.values()).reduce((sum, score) => sum + score.level, 0) / totalUsers : 0;

    return {
      totalUsers,
      totalPoints,
      totalBadges,
      averageLevel: Math.round(averageLevel * 10) / 10
    };
  }, [userScores]);

  return {
    badges,
    userScores,
    loading,
    getUserScore,
    updateUserStats,
    getBadgeProgress,
    getLeaderboard,
    getUserBadges,
    getAvailableBadges,
    getGlobalStats,
    calculateLevel
  };
}
