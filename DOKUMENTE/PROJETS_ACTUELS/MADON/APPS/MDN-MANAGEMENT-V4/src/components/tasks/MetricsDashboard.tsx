import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Clock, 
  Users, 
  MessageCircle,
  Tag,
  Target,
  CheckCircle,
  AlertCircle,
  Calendar,
  Zap,
  Award,
  Activity
} from 'lucide-react';
import { useMetrics } from '../../hooks/useMetrics';

export function MetricsDashboard() {
  const { dashboardData, loading, updateMetrics, formatTime, formatPercentage } = useMetrics();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('week');

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des métriques...</p>
        </div>
      </div>
    );
  }

  const { taskMetrics, timeMetrics, teamMetrics, commentMetrics, tagMetrics, productivityMetrics } = dashboardData;

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec contrôles */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Dashboard Métriques</h2>
          <p className="text-gray-600">Analyse de la productivité et des performances</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['today', 'week', 'month'] as const).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="text-xs"
              >
                {period === 'today' ? 'Aujourd\'hui' : 
                 period === 'week' ? 'Semaine' : 'Mois'}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={updateMetrics}
          >
            <Activity className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tâches totales</p>
                <p className="text-lg font-semibold">{taskMetrics.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Taux de completion</p>
                <p className="text-lg font-semibold">{formatPercentage(taskMetrics.completionRate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Temps total</p>
                <p className="text-lg font-semibold">{formatTime(timeMetrics.totalTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Équipe active</p>
                <p className="text-lg font-semibold">{teamMetrics.activeMembers}/{teamMetrics.totalMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métriques de productivité */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Productivité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedPeriod === 'today' ? productivityMetrics.tasksCompletedToday :
                     selectedPeriod === 'week' ? productivityMetrics.tasksCompletedThisWeek :
                     productivityMetrics.tasksCompletedThisMonth}
                  </div>
                  <div className="text-sm text-gray-600">Tâches terminées</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatTime(selectedPeriod === 'today' ? productivityMetrics.timeSpentToday :
                               selectedPeriod === 'week' ? productivityMetrics.timeSpentThisWeek :
                               productivityMetrics.timeSpentThisMonth)}
                  </div>
                  <div className="text-sm text-gray-600">Temps passé</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-purple-50 rounded">
                  <div className="text-2xl font-bold text-purple-600">
                    {productivityMetrics.efficiency.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Efficacité (tâches/h)</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded">
                  <div className="text-2xl font-bold text-yellow-600">
                    {formatTime(productivityMetrics.focus)}
                  </div>
                  <div className="text-sm text-gray-600">Focus moyen</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Répartition des tâches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-sm">Terminées</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{taskMetrics.completed}</span>
                    <Badge variant="secondary">{formatPercentage((taskMetrics.completed / taskMetrics.total) * 100)}</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-sm">En cours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{taskMetrics.inProgress}</span>
                    <Badge variant="secondary">{formatPercentage((taskMetrics.inProgress / taskMetrics.total) * 100)}</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded"></div>
                    <span className="text-sm">En attente</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{taskMetrics.pending}</span>
                    <Badge variant="secondary">{formatPercentage((taskMetrics.pending / taskMetrics.total) * 100)}</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-sm">En retard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{taskMetrics.overdue}</span>
                    <Badge variant="secondary">{formatPercentage((taskMetrics.overdue / taskMetrics.total) * 100)}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top performers et métriques d'équipe */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teamMetrics.topPerformers.map((performer, index) => (
                <div key={performer.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{index + 1}</Badge>
                    <div>
                      <div className="font-medium text-sm">{performer.name}</div>
                      <div className="text-xs text-gray-500">
                        {formatTime(performer.totalTime)} • {performer.completedTasks} tâches
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{performer.completedTasks}</div>
                    <div className="text-xs text-gray-500">tâches</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Collaboration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded">
                  <div className="text-2xl font-bold text-blue-600">{commentMetrics.totalComments}</div>
                  <div className="text-sm text-gray-600">Commentaires</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="text-2xl font-bold text-green-600">
                    {formatPercentage(commentMetrics.responseRate)}
                  </div>
                  <div className="text-sm text-gray-600">Taux de réponse</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Commentateurs actifs</h4>
                <div className="space-y-2">
                  {commentMetrics.mostActiveCommenters.slice(0, 3).map((commenter, index) => (
                    <div key={commenter.userId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{index + 1}</Badge>
                        <span className="text-sm">{commenter.name}</span>
                      </div>
                      <span className="text-sm font-medium">{commenter.commentCount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métriques de temps et tags */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Analyse du temps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatTime(timeMetrics.averageSessionTime)}
                  </div>
                  <div className="text-sm text-gray-600">Session moyenne</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="text-2xl font-bold text-green-600">
                    {timeMetrics.mostProductiveDay}
                  </div>
                  <div className="text-sm text-gray-600">Jour le plus productif</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Tendance de productivité</span>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(timeMetrics.productivityTrend)}
                  <span className={`text-sm font-medium ${getTrendColor(timeMetrics.productivityTrend)}`}>
                    {timeMetrics.productivityTrend === 'up' ? 'En hausse' :
                     timeMetrics.productivityTrend === 'down' ? 'En baisse' : 'Stable'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Organisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-purple-50 rounded">
                  <div className="text-2xl font-bold text-purple-600">{tagMetrics.totalTags}</div>
                  <div className="text-sm text-gray-600">Tags créés</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded">
                  <div className="text-2xl font-bold text-orange-600">
                    {tagMetrics.averageTagsPerTask.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Tags/tâche</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Tags les plus utilisés</h4>
                <div className="space-y-2">
                  {tagMetrics.mostUsedTags.slice(0, 3).map((tag, index) => (
                    <div key={tag.tagId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <Badge className={tag.color}>{tag.name}</Badge>
                      </div>
                      <span className="text-sm font-medium">{tag.usageCount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dernière mise à jour */}
      <div className="text-center text-sm text-gray-500">
        Dernière mise à jour : {new Date(dashboardData.lastUpdated).toLocaleString('fr-FR')}
      </div>
    </div>
  );
}
