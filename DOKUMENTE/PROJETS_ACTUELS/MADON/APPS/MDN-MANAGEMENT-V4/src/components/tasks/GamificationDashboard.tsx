import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Trophy, 
  Star, 
  Target,
  Users,
  TrendingUp,
  Award,
  Crown,
  Zap,
  Flame,
  Clock,
  MessageCircle,
  Tag,
  Settings,
  BarChart3
} from 'lucide-react';
import { useGamification } from '../../hooks/useGamification';
import { useAuth } from '../../contexts/AuthContext';

export function GamificationDashboard() {
  const { user } = useAuth();
  const {
    badges,
    getUserScore,
    getBadgeProgress,
    getLeaderboard,
    getUserBadges,
    getAvailableBadges,
    getGlobalStats,
    calculateLevel
  } = useGamification();

  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'leaderboard' | 'achievements'>('overview');

  if (!user) return null;

  const userScore = getUserScore(user.id.toString());
  const userBadges = getUserBadges(user.id.toString());
  const availableBadges = getAvailableBadges(user.id.toString());
  const leaderboard = getLeaderboard();
  const globalStats = getGlobalStats();
  const userRank = leaderboard.find(entry => entry.userId === user.id.toString())?.rank || 0;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return '⭐';
      case 'rare': return '🌟';
      case 'epic': return '💫';
      case 'legendary': return '👑';
      default: return '⭐';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'productivity': return <Zap className="h-4 w-4" />;
      case 'collaboration': return <Users className="h-4 w-4" />;
      case 'quality': return <Target className="h-4 w-4" />;
      case 'leadership': return <Crown className="h-4 w-4" />;
      case 'special': return <Flame className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'productivity': return 'bg-green-100 text-green-800';
      case 'collaboration': return 'bg-blue-100 text-blue-800';
      case 'quality': return 'bg-purple-100 text-purple-800';
      case 'leadership': return 'bg-yellow-100 text-yellow-800';
      case 'special': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gamification</h2>
          <p className="text-gray-600">Points, badges et classements pour motiver l'équipe</p>
        </div>
        <div className="flex gap-2">
          {(['overview', 'badges', 'leaderboard', 'achievements'] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'overview' && 'Vue d\'ensemble'}
              {tab === 'badges' && 'Badges'}
              {tab === 'leaderboard' && 'Classement'}
              {tab === 'achievements' && 'Succès'}
            </Button>
          ))}
        </div>
      </div>

      {/* Vue d'ensemble */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Statistiques personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Points totaux</p>
                    <p className="text-lg font-semibold">{userScore.totalPoints}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Star className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Niveau</p>
                    <p className="text-lg font-semibold">{userScore.level}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Badges</p>
                    <p className="text-lg font-semibold">{userBadges.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rang</p>
                    <p className="text-lg font-semibold">#{userRank || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progression du niveau */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Progression du niveau
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Niveau {userScore.level}</span>
                  <span className="text-sm text-gray-500">
                    {userScore.totalPoints} / {(userScore.level + 1) * 100} points
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${((userScore.totalPoints % 100) / 100) * 100}%` 
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {(userScore.level + 1) * 100 - userScore.totalPoints} points pour le niveau {userScore.level + 1}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques personnelles détaillées */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Mes statistiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Tâches terminées</span>
                    </div>
                    <span className="font-medium">{userScore.stats.tasksCompleted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Temps travaillé</span>
                    </div>
                    <span className="font-medium">{Math.round(userScore.stats.timeLogged / 60)}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Commentaires</span>
                    </div>
                    <span className="font-medium">{userScore.stats.commentsMade}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Tags créés</span>
                    </div>
                    <span className="font-medium">{userScore.stats.tagsCreated}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Workflows créés</span>
                    </div>
                    <span className="font-medium">{userScore.stats.workflowsCreated}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Statistiques globales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Utilisateurs actifs</span>
                    <span className="font-medium">{globalStats.totalUsers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Points totaux</span>
                    <span className="font-medium">{globalStats.totalPoints}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Badges débloqués</span>
                    <span className="font-medium">{globalStats.totalBadges}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Niveau moyen</span>
                    <span className="font-medium">{globalStats.averageLevel}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Badges */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          {/* Badges débloqués */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Mes badges ({userBadges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userBadges.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>Aucun badge débloqué</p>
                  <p className="text-sm">Commencez à travailler pour débloquer vos premiers badges !</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userBadges.map((badge) => (
                    <div key={badge.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{badge.icon}</span>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{badge.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getRarityColor(badge.rarity)}>
                                {getRarityIcon(badge.rarity)} {badge.rarity}
                              </Badge>
                              <Badge className={getCategoryColor(badge.category)}>
                                {getCategoryIcon(badge.category)}
                                {badge.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{badge.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-yellow-600 font-medium">+{badge.points} points</span>
                          <span className="text-gray-500">
                            Débloqué le {badge.unlockedAt ? new Date(badge.unlockedAt).toLocaleDateString('fr-FR') : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Badges disponibles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Badges disponibles ({availableBadges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableBadges.map((badge) => {
                  const progress = getBadgeProgress(badge, userScore.stats);
                  return (
                    <div key={badge.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow opacity-75">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl grayscale">{badge.icon}</span>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{badge.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getRarityColor(badge.rarity)}>
                                {getRarityIcon(badge.rarity)} {badge.rarity}
                              </Badge>
                              <Badge className={getCategoryColor(badge.category)}>
                                {getCategoryIcon(badge.category)}
                                {badge.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{badge.description}</p>
                        
                        {/* Progression */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progression</span>
                            <span className="font-medium">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="text-sm text-gray-500">
                          <span className="text-yellow-600 font-medium">+{badge.points} points</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Classement */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Classement général
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.slice(0, 10).map((entry, index) => {
                  const isCurrentUser = entry.userId === user.id.toString();
                  return (
                    <div 
                      key={entry.userId} 
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isCurrentUser ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {index < 3 ? (
                            index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'
                          ) : (
                            entry.rank
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {entry.userName}
                            {isCurrentUser && <span className="ml-2 text-blue-600">(Vous)</span>}
                          </div>
                          <div className="text-xs text-gray-500">
                            Niveau {entry.level} • {entry.badgesCount} badges
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">{entry.totalPoints} pts</div>
                        <div className="text-xs text-gray-500">#{entry.rank}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Succès */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Mes succès
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p>Fonctionnalité en développement</p>
                <p className="text-sm">Les succès seront bientôt disponibles !</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
