import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Plus, AlertCircle } from 'lucide-react';
import { Project, ProjectStatus, ProjectPriority } from './types';
import { CreateProjectForm } from './CreateProjectForm';
import ProjectFilters from './ProjectFilters';
import ProjectStats from './ProjectStats';

interface Task {
  id: string;
  status: string;
  priority: string;
  due_date?: string;
  title: string;
  description?: string;
}

interface ProjectManagementProps {
  onProjectClick?: (projectId: string) => void;
}

export default function ProjectManagement({ onProjectClick }: ProjectManagementProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<ProjectPriority | 'all'>('all');

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      // Mock data pour les projets avec contexte camerounais
      const data = [
        {
          id: '1',
          name: 'Digitalisation Banque Atlantique Cameroun',
          description: 'Système de gestion bancaire moderne pour la Banque Atlantique Cameroun',
          status: 'in_progress' as ProjectStatus,
          priority: 'high' as ProjectPriority,
          start_date: '2024-01-15',
          end_date: '2024-06-30',
          manager_id: 'user1',
          budget: 45000000, // 45M F.CFA
          created_at: '2024-01-15',
          updated_at: '2024-03-01',
          tasks: [
            {
              id: 'task1',
              status: 'in_progress',
              priority: 'high',
              due_date: '2024-03-15',
              title: 'Interface utilisateur bancaire',
              description: 'Développement de l\'interface utilisateur pour les opérations bancaires'
            },
            {
              id: 'task2',
              status: 'todo',
              priority: 'medium',
              due_date: '2024-03-25',
              title: 'Intégration système de paiement',
              description: 'Intégration avec les systèmes de paiement locaux (MTN Money, Orange Money)'
            }
          ]
        },
        {
          id: '2',
          name: 'Système de Gestion Cimencam',
          description: 'Modernisation du système de gestion pour Cimencam',
          status: 'planning' as ProjectStatus,
          priority: 'medium' as ProjectPriority,
          start_date: '2024-03-01',
          end_date: '2024-08-30',
          manager_id: 'user2',
          budget: 28000000, // 28M F.CFA
          created_at: '2024-02-01',
          updated_at: '2024-02-15',
          tasks: [
            {
              id: 'task3',
              status: 'todo',
              priority: 'medium',
              due_date: '2024-04-15',
              title: 'Analyse des besoins',
              description: 'Analyse des besoins spécifiques de Cimencam'
            }
          ]
        },
        {
          id: '3',
          name: 'Application Mobile MDN Management',
          description: 'Application mobile pour la gestion des employés et projets MDN',
          status: 'completed' as ProjectStatus,
          priority: 'urgent' as ProjectPriority,
          start_date: '2023-10-01',
          end_date: '2024-02-28',
          manager_id: 'user1',
          budget: 15000000, // 15M F.CFA
          created_at: '2023-10-01',
          updated_at: '2024-02-28',
          tasks: [
            {
              id: 'task4',
              status: 'completed',
              priority: 'urgent',
              due_date: '2024-02-28',
              title: 'Développement application mobile',
              description: 'Application mobile complète pour la gestion MDN'
            }
          ]
        },
        {
          id: '4',
          name: 'Infrastructure Cloud Eneo',
          description: 'Migration vers l\'infrastructure cloud pour Eneo Cameroun',
          status: 'in_progress' as ProjectStatus,
          priority: 'high' as ProjectPriority,
          start_date: '2024-02-01',
          end_date: '2024-07-31',
          manager_id: 'user3',
          budget: 65000000, // 65M F.CFA
          created_at: '2024-02-01',
          updated_at: '2024-03-01',
          tasks: [
            {
              id: 'task5',
              status: 'in_progress',
              priority: 'high',
              due_date: '2024-03-20',
              title: 'Migration des serveurs',
              description: 'Migration des serveurs vers l\'infrastructure cloud'
            },
            {
              id: 'task6',
              status: 'todo',
              priority: 'medium',
              due_date: '2024-04-10',
              title: 'Configuration sécurité',
              description: 'Configuration des paramètres de sécurité cloud'
            }
          ]
        },
        {
          id: '5',
          name: 'Système de Facturation MTN',
          description: 'Système de facturation automatisé pour MTN Cameroun',
          status: 'on_hold' as ProjectStatus,
          priority: 'medium' as ProjectPriority,
          start_date: '2024-01-01',
          end_date: '2024-05-31',
          manager_id: 'user2',
          budget: 32000000, // 32M F.CFA
          created_at: '2024-01-01',
          updated_at: '2024-02-20',
          tasks: [
            {
              id: 'task7',
              status: 'on_hold',
              priority: 'medium',
              due_date: '2024-05-31',
              title: 'Développement système facturation',
              description: 'Développement du système de facturation automatisé'
            }
          ]
        }
      ];
      
      return data as Project[];
    }
  });

  const filteredProjects = projects?.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const calculateProgress = (tasks: Task[] = []) => {
    if (!tasks.length) return 0;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const handleProjectClick = (project: Project) => {
    if (onProjectClick) {
      onProjectClick(project.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProjectStats />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projets</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Projet
        </Button>
      </div>

      <ProjectFilters
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects?.map((project) => (
          <Card
            key={project.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleProjectClick(project)}
          >
            <CardHeader className="pb-2">
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant={getStatusVariant(project.status)}>
                    {getProjectStatusLabel(project.status)}
                  </Badge>
                  <Badge variant={getPriorityVariant(project.priority)}>
                    {getProjectPriorityLabel(project.priority)}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span>{calculateProgress(project.tasks)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${calculateProgress(project.tasks)}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  {project.tasks?.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">Aucune tâche</p>
                  ) : (
                    <>
                      {/* Tâches en retard */}
                      {project.tasks?.filter((task: Task) => {
                          if (!task.due_date) return false;
                          return new Date(task.due_date) < new Date() && task.status !== 'completed';
                        })
                        .sort((a: Task, b: Task) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
                        .slice(0, 2)
                        .map((task: Task) => (
                          <div 
                            key={task.id} 
                            className="flex flex-col p-3 bg-red-50 rounded-lg shadow-sm border border-red-100 hover:border-red-200 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <span className="text-sm font-medium">{task.title}</span>
                              </div>
                              <Badge variant={getTaskStatusVariant(task.status)}>
                                {getTaskStatusLabel(task.status)}
                              </Badge>
                            </div>
                            {task.description && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              {task.priority && (
                                <Badge variant={getPriorityVariant(task.priority as 'low' | 'medium' | 'high')} className="text-xs">
                                  {task.priority === 'low' ? 'Basse' : task.priority === 'medium' ? 'Moyenne' : 'Haute'}
                                </Badge>
                              )}
                              {task.due_date && (
                                <span className="text-xs text-red-500 font-medium">
                                  En retard depuis le {new Date(task.due_date).toLocaleDateString('fr-FR')}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      
                      {/* Tâches à venir */}
                      {project.tasks?.filter((task: Task) => {
                          if (!task.due_date) return false;
                          return new Date(task.due_date) >= new Date() && task.status !== 'completed';
                        })
                        .sort((a: Task, b: Task) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
                        .slice(0, 3)
                        .map((task: Task) => (
                          <div 
                            key={task.id} 
                            className="flex flex-col p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-gray-200 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{task.title}</span>
                              <Badge variant={getTaskStatusVariant(task.status)}>
                                {getTaskStatusLabel(task.status)}
                              </Badge>
                            </div>
                            {task.description && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              {task.priority && (
                                <Badge variant={getPriorityVariant(task.priority as 'low' | 'medium' | 'high')} className="text-xs">
                                  {task.priority === 'low' ? 'Basse' : task.priority === 'medium' ? 'Moyenne' : 'Haute'}
                                </Badge>
                              )}
                              {task.due_date && (
                                <span className="text-xs text-gray-500">
                                  Échéance : {new Date(task.due_date).toLocaleDateString('fr-FR')}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouveau projet</DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour créer un nouveau projet.
            </DialogDescription>
          </DialogHeader>
          <CreateProjectForm onSuccess={() => {
            setIsCreateDialogOpen(false);
          }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getStatusVariant(status: ProjectStatus): "outline" | "default" | "destructive" | "secondary" | "danger" | "success" | "warning" | "info" {
  switch (status) {
    case 'planning':
      return 'outline';
    case 'in_progress':
      return 'default';
    case 'on_hold':
      return 'destructive';
    case 'completed':
      return 'success';
    default:
      return 'outline';
  }
}

function getPriorityVariant(priority: ProjectPriority): "outline" | "default" | "destructive" | "secondary" | "danger" | "success" | "warning" | "info" {
  switch (priority) {
    case 'low':
      return 'outline';
    case 'medium':
      return 'default';
    case 'high':
      return 'warning';
    case 'urgent':
      return 'destructive';
    default:
      return 'outline';
  }
}

const getTaskStatusVariant = (status: Task['status']): "outline" | "default" | "destructive" | "secondary" | "danger" | "success" | "warning" | "info" => {
  switch (status) {
    case 'todo':
      return 'outline';
    case 'in_progress':
      return 'default';
    case 'review':
      return 'warning';
    case 'completed':
      return 'success';
    default:
      return 'outline';
  }
};

const getTaskStatusLabel = (status: Task['status']): string => {
  switch (status) {
    case 'todo':
      return 'À faire';
    case 'in_progress':
      return 'En cours';
    case 'review':
      return 'En revue';
    case 'completed':
      return 'Terminé';
    default:
      return status;
  }
};

export function getProjectStatusLabel(status: ProjectStatus): string {
  switch (status) {
    case 'planning':
      return 'En planification';
    case 'in_progress':
      return 'En cours';
    case 'on_hold':
      return 'En pause';
    case 'completed':
      return 'Terminé';
    default:
      return status;
  }
}

export function getProjectPriorityLabel(priority: ProjectPriority): string {
  switch (priority) {
    case 'low':
      return 'Basse';
    case 'medium':
      return 'Moyenne';
    case 'high':
      return 'Haute';
    default:
      return priority;
  }
} 