import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Clock, 
  TrendingUp, 
  Users, 
  Calendar,
  Timer,
  Play,
  Pause,
  BarChart3
} from 'lucide-react';
import { useTimeTracking } from '../../hooks/useTimeTracking';
import { useAuth } from '../../contexts/AuthContext';
import { useEmployees } from '../../hooks/useEmployees';

export function TimeDashboard() {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const {
    activeTimers,
    timeEntries,
    getUserTimeStats,
    formatTime,
    stopAllTimers
  } = useTimeTracking();

  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  // Statistiques de l'utilisateur connecté
  const userStats = useMemo(() => {
    return getUserTimeStats();
  }, [getUserTimeStats]);

  // Statistiques de l'équipe (pour les admins/managers)
  const teamStats = useMemo(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
      return null;
    }

    const teamEntries = timeEntries.filter(entry => {
      const entryDate = new Date(entry.startTime);
      const now = new Date();
      
      switch (selectedPeriod) {
        case 'today':
          return entryDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return entryDate >= weekAgo;
        case 'month':
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return entryDate >= monthAgo;
        default:
          return true;
      }
    });

    const totalTime = teamEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    const activeUsers = new Set(teamEntries.map(entry => entry.userId)).size;
    const totalEntries = teamEntries.length;

    // Top utilisateurs
    const userTimeMap = new Map<string, number>();
    teamEntries.forEach(entry => {
      const current = userTimeMap.get(entry.userId) || 0;
      userTimeMap.set(entry.userId, current + (entry.duration || 0));
    });

    const topUsers = Array.from(userTimeMap.entries())
      .map(([userId, time]) => {
        const employee = employees.find(emp => emp.id.toString() === userId);
        return {
          userId,
          name: employee ? `${employee.first_name} ${employee.last_name}` : 'Utilisateur inconnu',
          time
        };
      })
      .sort((a, b) => b.time - a.time)
      .slice(0, 5);

    return {
      totalTime,
      activeUsers,
      totalEntries,
      topUsers
    };
  }, [timeEntries, selectedPeriod, user, employees]);

  // Tâches avec le plus de temps
  const topTasks = useMemo(() => {
    const taskTimeMap = new Map<string, { time: number; entries: number }>();
    
    timeEntries.forEach(entry => {
      const current = taskTimeMap.get(entry.taskId) || { time: 0, entries: 0 };
      taskTimeMap.set(entry.taskId, {
        time: current.time + (entry.duration || 0),
        entries: current.entries + 1
      });
    });

    return Array.from(taskTimeMap.entries())
      .map(([taskId, data]) => ({
        taskId,
        time: data.time,
        entries: data.entries
      }))
      .sort((a, b) => b.time - a.time)
      .slice(0, 5);
  }, [timeEntries]);

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'today': return 'Aujourd\'hui';
      case 'week': return 'Cette semaine';
      case 'month': return 'Ce mois';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec contrôles */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Dashboard Temps</h2>
          <p className="text-gray-600">Suivi du temps et productivité</p>
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
          {activeTimers.size > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={stopAllTimers}
              className="text-red-600 hover:text-red-700"
            >
              <Pause className="h-4 w-4 mr-2" />
              Arrêter tout
            </Button>
          )}
        </div>
      </div>

      {/* Statistiques personnelles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Temps total</p>
                <p className="text-lg font-semibold">{formatTime(userStats?.totalTime || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Aujourd'hui</p>
                <p className="text-lg font-semibold">{formatTime(userStats?.todayTime || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cette semaine</p>
                <p className="text-lg font-semibold">{formatTime(userStats?.weekTime || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Timer className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Timers actifs</p>
                <p className="text-lg font-semibold">{activeTimers.size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques d'équipe (pour admins/managers) */}
      {teamStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Statistiques d'équipe - {getPeriodLabel()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">{formatTime(teamStats.totalTime)}</div>
                    <div className="text-sm text-gray-600">Temps total</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="text-2xl font-bold text-green-600">{teamStats.activeUsers}</div>
                    <div className="text-sm text-gray-600">Utilisateurs actifs</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Top utilisateurs</h4>
                  <div className="space-y-2">
                    {teamStats.topUsers.map((user, index) => (
                      <div key={user.userId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{index + 1}</Badge>
                          <span className="text-sm">{user.name}</span>
                        </div>
                        <span className="text-sm font-medium">{formatTime(user.time)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Tâches les plus chronométrées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topTasks.map((task, index) => (
                  <div key={task.taskId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{index + 1}</Badge>
                      <span className="text-sm">Tâche #{task.taskId}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{formatTime(task.time)}</div>
                      <div className="text-xs text-gray-500">{task.entries} entrées</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Timers actifs */}
      {activeTimers.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-green-600" />
              Timers actifs ({activeTimers.size})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from(activeTimers.values()).map((timer) => {
                const employee = employees.find(emp => emp.id.toString() === timer.userId);
                return (
                  <div key={timer.id} className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div>
                        <div className="font-medium text-sm">Tâche #{timer.taskId}</div>
                        <div className="text-xs text-gray-600">
                          {employee ? `${employee.first_name} ${employee.last_name}` : 'Utilisateur inconnu'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-medium text-green-600">
                        {formatTime(Math.floor((new Date().getTime() - new Date(timer.startTime).getTime()) / (1000 * 60)))}
                      </div>
                      <div className="text-xs text-gray-500">
                        Depuis {new Date(timer.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
