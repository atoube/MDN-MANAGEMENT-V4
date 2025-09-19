import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { DocumentTab } from '@/components/documents/DocumentTab';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProjectStatus, ProjectPriority } from './types';
import { getProjectStatusLabel, getProjectPriorityLabel } from './ProjectManagement';

export function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      // Mock data pour le projet
      const data = {
        id: projectId,
        name: 'Développement App Mobile',
        description: 'Application mobile pour la gestion des commandes',
        status: 'in_progress' as ProjectStatus,
        priority: 'high' as ProjectPriority,
        start_date: '2024-01-15',
        end_date: '2024-06-30',
        manager_id: 'user1',
        created_at: '2024-01-15',
        updated_at: '2024-03-01',
        tasks: [
          {
            id: 'task1',
            title: 'Interface utilisateur',
            description: 'Développement de l\'interface mobile',
            status: 'in_progress',
            priority: 'high',
            due_date: '2024-03-15'
          },
          {
            id: 'task2', 
            title: 'API Backend',
            description: 'Développement des services backend',
            status: 'todo',
            priority: 'medium',
            due_date: '2024-03-20'
          }
        ]
      };

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-500">Projet non trouvé</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
            <p className="text-gray-500 mb-4">{project.description}</p>
            <div className="flex gap-2">
              <Badge variant="outline">
                {getProjectStatusLabel(project.status)}
              </Badge>
              <Badge variant="outline">
                {getProjectPriorityLabel(project.priority)}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="tasks">Tâches</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="members">Membres</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div>
            {/* Contenu de l'onglet Vue d'ensemble */}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div>
            {/* Contenu de l'onglet Tâches */}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {projectId && <DocumentTab projectId={projectId} />}
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div>
            {/* Contenu de l'onglet Membres */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getStatusVariant(status: ProjectStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'planning':
      return 'secondary';
    case 'in_progress':
      return 'default';
    case 'on_hold':
      return 'outline';
    case 'completed':
      return 'default';
    case 'cancelled':
      return 'destructive';
    default:
      return 'secondary';
  }
}

function getStatusLabel(status: ProjectStatus): string {
  switch (status) {
    case 'planning':
      return 'En planification';
    case 'in_progress':
      return 'En cours';
    case 'on_hold':
      return 'En pause';
    case 'completed':
      return 'Terminé';
    case 'cancelled':
      return 'Annulé';
    default:
      return status;
  }
}

function getPriorityVariant(priority: ProjectPriority): "default" | "secondary" | "destructive" | "outline" {
  switch (priority) {
    case 'low':
      return 'secondary';
    case 'medium':
      return 'default';
    case 'high':
      return 'destructive';
    default:
      return 'secondary';
  }
}

function getPriorityLabel(priority: ProjectPriority): string {
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