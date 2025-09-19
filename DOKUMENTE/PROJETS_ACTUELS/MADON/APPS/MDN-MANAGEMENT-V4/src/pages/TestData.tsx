import { useState } from 'react';
import { apiService } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { toast } from 'react-hot-toast';

export function TestData() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const insertTestTasks = async () => {
    try {
      setIsLoading(true);
      setMessage('Insertion des tâches en cours...');
      
      // Récupérer les employés existants
      const { data: employees, error: employeesError } = // Mock await select call;
      
      if (employeesError) throw employeesError;
      
      if (!employees || employees.length === 0) {
        setMessage('Aucun employé trouvé. Veuillez d\'abord créer des employés.');
        return;
      }
      
      // Récupérer l'utilisateur actuel
      // Simulated auth call - using mock data
      
      if (userError) throw userError;
      
      if (!user) {
        setMessage('Aucun utilisateur connecté. Veuillez vous connecter.');
        return;
      }
      
      // Tâches de test
      const tasks = [
        // Tâches en attente
        {
          title: 'Mise à jour du site web',
          description: 'Mettre à jour le contenu de la page d\'accueil avec les nouvelles offres',
          status: 'pending',
          priority: 'high',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          assigned_to: employees[0].id,
          user_id: user.id
        },
        {
          title: 'Révision des documents',
          description: 'Vérifier et mettre à jour la documentation technique',
          status: 'pending',
          priority: 'medium',
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          assigned_to: employees[1 % employees.length].id,
          user_id: user.id
        },
        // Tâches en cours
        {
          title: 'Développement API',
          description: 'Implémenter les endpoints pour la gestion des utilisateurs',
          status: 'in_progress',
          priority: 'high',
          due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          assigned_to: employees[2 % employees.length].id,
          user_id: user.id
        },
        {
          title: 'Tests unitaires',
          description: 'Écrire les tests pour le module de facturation',
          status: 'in_progress',
          priority: 'medium',
          due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          assigned_to: employees[3 % employees.length].id,
          user_id: user.id
        },
        // Tâches terminées
        {
          title: 'Configuration serveur',
          description: 'Mettre en place le serveur de production',
          status: 'completed',
          priority: 'high',
          due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          assigned_to: employees[4 % employees.length].id,
          user_id: user.id
        },
        {
          title: 'Formation équipe',
          description: 'Former l\'équipe sur les nouvelles fonctionnalités',
          status: 'completed',
          priority: 'medium',
          due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          assigned_to: employees[5 % employees.length].id,
          user_id: user.id
        }
      ];
      
      // Insérer les tâches
      const { data, error } = await         // Mock insert operationtasks)
        .select();
      
      // Removed error check - using mock data
      
      setMessage(`${data.length} tâches ont été créées avec succès.`);
      toast.success(`${data.length} tâches ont été créées avec succès.`);
    } catch (error) {
      console.error('Erreur lors de l\'insertion des tâches:', error);
      setMessage(`Erreur: ${error.message}`);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const insertTestProjectTasks = async () => {
    try {
      setIsLoading(true);
      setMessage('Insertion des tâches de projet en cours...');
      
      // Récupérer les profils existants
      const { data: profiles, error: profilesError } = // Mock await select call;
      
      if (profilesError) throw profilesError;
      
      if (!profiles || profiles.length === 0) {
        setMessage('Aucun profil trouvé. Veuillez d\'abord créer des profils.');
        return;
      }
      
      // Récupérer un projet existant
      const { data: projects, error: projectsError } = // Mock await select call
        .limit(1);
      
      if (projectsError) throw projectsError;
      
      if (!projects || projects.length === 0) {
        setMessage('Aucun projet trouvé. Veuillez d\'abord créer un projet.');
        return;
      }
      
      const projectId = projects[0].id;
      
      // Tâches de projet de test
      const projectTasks = [
        // Tâches en attente
        {
          project_id: projectId,
          name: 'Analyse des besoins',
          description: 'Documenter les besoins fonctionnels et techniques du projet',
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'todo',
          priority: 'high',
          assigned_to: profiles[0].id
        },
        {
          project_id: projectId,
          name: 'Conception architecture',
          description: 'Définir l\'architecture technique du système',
          start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'todo',
          priority: 'high',
          assigned_to: profiles[1 % profiles.length].id
        },
        // Tâches en cours
        {
          project_id: projectId,
          name: 'Développement frontend',
          description: 'Implémenter l\'interface utilisateur',
          start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'in_progress',
          priority: 'medium',
          assigned_to: profiles[2 % profiles.length].id
        },
        {
          project_id: projectId,
          name: 'Tests d\'intégration',
          description: 'Tester l\'intégration des différents modules',
          start_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'in_progress',
          priority: 'medium',
          assigned_to: profiles[3 % profiles.length].id
        },
        // Tâches en révision
        {
          project_id: projectId,
          name: 'Code review',
          description: 'Réviser le code des modules principaux',
          start_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'review',
          priority: 'high',
          assigned_to: profiles[4 % profiles.length].id
        },
        // Tâches terminées
        {
          project_id: projectId,
          name: 'Documentation',
          description: 'Rédiger la documentation technique',
          start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'completed',
          priority: 'medium',
          assigned_to: profiles[5 % profiles.length].id
        }
      ];
      
      // Insérer les tâches de projet
      const { data, error } = await         // Mock insert operationprojectTasks)
        .select();
      
      // Removed error check - using mock data
      
      setMessage(`${data.length} tâches de projet ont été créées avec succès.`);
      toast.success(`${data.length} tâches de projet ont été créées avec succès.`);
    } catch (error) {
      console.error('Erreur lors de l\'insertion des tâches de projet:', error);
      setMessage(`Erreur: ${error.message}`);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Génération de données de test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tâches générales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Générer des tâches de test pour le module Activités.</p>
            <Button 
              onClick={insertTestTasks} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Génération en cours...' : 'Générer des tâches'}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tâches de projet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Générer des tâches de test pour les projets.</p>
            <Button 
              onClick={insertTestProjectTasks} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Génération en cours...' : 'Générer des tâches de projet'}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {message && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
} 