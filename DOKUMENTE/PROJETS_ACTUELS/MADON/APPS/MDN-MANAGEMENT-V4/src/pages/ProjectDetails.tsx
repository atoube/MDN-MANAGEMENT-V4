import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Project } from '../components/projects/types';
import { Loader2 } from 'lucide-react';

// Couleurs pour les statuts et priorités (non utilisées pour le moment)

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { isLoading, error: queryError } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('ID du projet non fourni');
      }

      // Vérifier d'abord si l'utilisateur est authentifié (mock)
      console.log('Vérification d\'authentification...');
      console.log('Utilisateur authentifié: user1');

      // D'abord, vérifier si le projet existe (mock)
      const projectExists = {
        id: projectId,
        manager_id: 'user1'
      };

      console.log('Projet trouvé:', projectExists);

      console.log('Projet trouvé:', projectExists);

      // Vérifier si l'utilisateur est le manager du projet (mock)
      const isManager = projectExists.manager_id === 'user1';
      console.log('Est manager:', isManager);

      // Mock data pour les détails du projet
      const data = {
        id: projectId,
        name: 'Développement App Mobile',
        description: 'Application mobile pour la gestion des commandes',
        status: 'in_progress',
        priority: 'high',
        start_date: '2024-01-15',
        end_date: '2024-06-30',
        manager_id: 'user1',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-03-01T14:30:00Z',
        manager: {
          id: 'user1',
          email: 'manager@example.com',
          full_name: 'Jean Dupont'
        },
        members: [
          {
            id: '1',
            user_id: 'user1',
            role: 'Manager',
            user: {
              id: 'user1',
              email: 'manager@example.com',
              full_name: 'Jean Dupont'
            }
          },
          {
            id: '2',
            user_id: 'user2',
            role: 'Développeur',
            user: {
              id: 'user2',
              email: 'dev@example.com',
              full_name: 'Marie Martin'
            }
          }
        ],
        tasks: [
          {
            id: '1',
            name: 'Interface utilisateur',
            description: 'Développement de l\'interface mobile',
            status: 'in_progress',
            priority: 'high',
            start_date: '2024-03-01',
            end_date: '2024-03-15',
            assigned_to: 'user2',
            assigned_user: {
              id: 'user2',
              email: 'dev@example.com',
              full_name: 'Marie Martin'
            }
          }
        ],
        risks: [
          {
            id: '1',
            description: 'Retard dans le développement',
            impact: 'Modéré',
            probability: 'Moyenne',
            impact_level: 'medium',
            mitigation_plan: 'Ajouter des ressources',
            status: 'active'
          }
        ],
        documents: [
          {
            id: '1',
            name: 'Spécifications techniques',
            type: 'pdf',
            url: '/documents/specs.pdf',
            created_by: 'user1',
            created_at: '2024-03-01T10:00:00Z'
          }
        ],
        budgets: [
          {
            id: '1',
            category: 'Développement',
            planned_amount: 50000,
            actual_amount: 35000
          }
        ]
      };

      console.log('Détails du projet récupérés:', data);
      return data as unknown as Project;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // State pour les données du projet (non utilisé pour le moment)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500">Une erreur est survenue : {queryError.message}</p>
        <Button onClick={() => navigate('/projects')}>Retour aux projets</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="tasks">Tâches</TabsTrigger>
          <TabsTrigger value="risks">Risques</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="budgets">Budget</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Contenu de la vue d'ensemble */}
        </TabsContent>

        <TabsContent value="tasks">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Tâches du projet</h3>
            <p>Module de tâches en cours de développement...</p>
          </div>
        </TabsContent>

        <TabsContent value="risks">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Risques du projet</h3>
            <p>Module de risques en cours de développement...</p>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Documents du projet</h3>
            <p>Module de documents en cours de développement...</p>
          </div>
        </TabsContent>

        <TabsContent value="budgets">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Budget du projet</h3>
            <p>Module de budget en cours de développement...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 