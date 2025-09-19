import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CheckCircle2, Clock, AlertTriangle, Ban } from 'lucide-react';

interface ProjectStats {
  total: number;
  completed: number;
  inProgress: number;
  onHold: number;
  planning: number;
  urgentPriority: number;
  highPriority: number;
  overdueTasks: number;
}

export default function ProjectStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['project-stats'],
    queryFn: async () => {
      // Mock data pour les projets
      const projects = [
        {
          id: '1',
          name: 'Développement App Mobile',
          status: 'in_progress',
          priority: 'high',
          tasks: [
            { id: '1', status: 'in_progress', priority: 'high', due_date: '2024-03-15' }
          ]
        },
        {
          id: '2',
          name: 'Refonte Site Web',
          status: 'planning',
          priority: 'medium',
          tasks: []
        },
        {
          id: '3',
          name: 'Système de Facturation',
          status: 'completed',
          priority: 'urgent',
          tasks: [
            { id: '2', status: 'completed', priority: 'urgent', due_date: '2024-02-28' }
          ]
        }
      ];

      // Mock data pour les tâches en retard
      const tasks = [
        { id: '3', due_date: '2024-03-10', status: 'in_progress' },
        { id: '4', due_date: '2024-03-12', status: 'todo' }
      ];

      const projectStats: ProjectStats = {
        total: projects.length,
        completed: projects.filter(p => p.status === 'completed').length,
        inProgress: projects.filter(p => p.status === 'in_progress').length,
        onHold: projects.filter(p => p.status === 'on_hold').length,
        planning: projects.filter(p => p.status === 'planning').length,
        urgentPriority: projects.filter(p => p.priority === 'urgent').length,
        highPriority: projects.filter(p => p.priority === 'high').length,
        overdueTasks: tasks.length,
      };

      return projectStats;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Projets en cours',
      value: stats?.inProgress || 0,
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Projets terminés',
      value: stats?.completed || 0,
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Projets urgents',
      value: stats?.urgentPriority || 0,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Tâches en retard',
      value: stats?.overdueTasks || 0,
      icon: Ban,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.bgColor} mr-4`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 