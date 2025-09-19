import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Trophy, 
  Target,
  Calendar,
  Timer,
  Award,
  BarChart3,
  UserCheck,
  UserX
} from 'lucide-react';
import { useRoleBasedMetrics } from '../../hooks/useRoleBasedMetrics';

export function RoleBasedMetrics() {
  const { metrics, userRole, userDepartment } = useRoleBasedMetrics();

  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRoleTitle = () => {
    switch (userRole) {
      case 'admin':
        return 'Administrateur - Vue Globale';
      case 'hr':
        return 'RH - Vue Département';
      default:
        return `Employé - ${userDepartment || 'Vue Personnelle'}`;
    }
  };

  const getRoleColor = () => {
    switch (userRole) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'hr':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec rôle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Métriques Personnalisées</h2>
          <p className="text-gray-600">Tableau de bord adapté à votre rôle</p>
        </div>
        <Badge className={getRoleColor()}>
          {getRoleTitle()}
        </Badge>
      </div>

      {/* Métriques personnelles (tous les utilisateurs) */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Mes Activités</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tâches personnelles */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Mes Tâches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{metrics.personal.tasks.total}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-green-600">Terminées</span>
                  <span>{metrics.personal.tasks.completed}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-orange-600">En cours</span>
                  <span>{metrics.personal.tasks.inProgress}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">En attente</span>
                  <span>{metrics.personal.tasks.pending}</span>
                </div>
                {metrics.personal.tasks.overdue > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-red-600">En retard</span>
                    <span>{metrics.personal.tasks.overdue}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Gamification */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Gamification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{metrics.personal.gamification.points}</div>
                  <div className="text-xs text-gray-500">Points</div>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Niveau</span>
                  <span>{metrics.personal.gamification.level}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Badges</span>
                  <span>{metrics.personal.gamification.badges}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Rang</span>
                  <span>#{metrics.personal.gamification.rank}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Temps de travail */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Temps de Travail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{metrics.personal.timeTracking.totalHours}h</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                <Timer className="h-8 w-8 text-purple-500" />
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Aujourd'hui</span>
                  <span>{metrics.personal.timeTracking.todayHours}h</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Cette semaine</span>
                  <span>{metrics.personal.timeTracking.thisWeekHours}h</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Moyenne/jour</span>
                  <span>{metrics.personal.timeTracking.averageHours}h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demandes de congé */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Mes Congés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{metrics.personal.leaveRequests.total}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-yellow-600">En attente</span>
                  <span>{metrics.personal.leaveRequests.pending}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-green-600">Approuvées</span>
                  <span>{metrics.personal.leaveRequests.approved}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-red-600">Rejetées</span>
                  <span>{metrics.personal.leaveRequests.rejected}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Métriques département (managers) */}
      {metrics.department && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Métriques Département</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Employés du département */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Équipe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{metrics.department.employees.total}</div>
                    <div className="text-xs text-gray-500">Employés</div>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-green-600">Actifs</span>
                    <span>{metrics.department.employees.active}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-orange-600">En congé</span>
                    <span>{metrics.department.employees.onLeave}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tâches du département */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Tâches Équipe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{metrics.department.tasks.total}</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                  <Target className="h-8 w-8 text-orange-500" />
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Taux de completion</span>
                    <span>{metrics.department.productivity.averageCompletionRate.toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={metrics.department.productivity.averageCompletionRate} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Congés du département */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Congés Équipe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{metrics.department.leaveRequests.total}</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-500" />
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-yellow-600">En attente</span>
                    <span>{metrics.department.leaveRequests.pending}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-600">Approuvés</span>
                    <span>{metrics.department.leaveRequests.approved}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Productivité */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Productivité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {metrics.department.productivity.averageCompletionRate.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">Completion</div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
                <div className="mt-3">
                  <Progress 
                    value={metrics.department.productivity.averageCompletionRate} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Métriques globales (admins) */}
      {metrics.global && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Métriques Globales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Employés globaux */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Employés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{metrics.global.employees.total}</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-green-600">Actifs</span>
                    <span>{metrics.global.employees.active}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-orange-600">En congé</span>
                    <span>{metrics.global.employees.onLeave}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Inactifs</span>
                    <span>{metrics.global.employees.inactive}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tâches globales */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Tâches Globales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{metrics.global.tasks.total}</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                  <Target className="h-8 w-8 text-orange-500" />
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Taux de completion</span>
                    <span>{metrics.global.productivity.averageCompletionRate.toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={metrics.global.productivity.averageCompletionRate} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Top performers */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{metrics.global.gamification.averagePoints.toFixed(0)}</div>
                    <div className="text-xs text-gray-500">Points moyens</div>
                  </div>
                  <Award className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="mt-3 space-y-1">
                  {metrics.global.gamification.topPerformers.slice(0, 3).map((performer, index) => (
                    <div key={performer.userId} className="flex justify-between text-xs">
                      <span>#{index + 1} {performer.name}</span>
                      <span>{performer.totalPoints}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Départements */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Départements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {Object.keys(metrics.global.productivity.departments).length}
                    </div>
                    <div className="text-xs text-gray-500">Départements</div>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                </div>
                <div className="mt-3 space-y-1">
                  {Object.entries(metrics.global.productivity.departments).slice(0, 3).map(([dept, count]) => (
                    <div key={dept} className="flex justify-between text-xs">
                      <span>{dept}</span>
                      <span>{count} employés</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
