import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedHours?: number;
  tags: string[];
  checklist: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  attachments?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  isPublic: boolean;
}

export interface TaskTemplateCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export function useTaskTemplates() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [categories, setCategories] = useState<TaskTemplateCategory[]>([]);
  const [loading, setIsLoading] = useState(false);

  // Catégories prédéfinies
  const predefinedCategories: TaskTemplateCategory[] = [
    {
      id: 'development',
      name: 'Développement',
      description: 'Templates pour le développement logiciel',
      color: 'bg-blue-100 text-blue-800',
      icon: '💻'
    },
    {
      id: 'design',
      name: 'Design',
      description: 'Templates pour le design et l\'UI/UX',
      color: 'bg-purple-100 text-purple-800',
      icon: '🎨'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Templates pour les activités marketing',
      color: 'bg-green-100 text-green-800',
      icon: '📢'
    },
    {
      id: 'support',
      name: 'Support',
      description: 'Templates pour le support client',
      color: 'bg-orange-100 text-orange-800',
      icon: '🛠️'
    },
    {
      id: 'meeting',
      name: 'Réunions',
      description: 'Templates pour les réunions et événements',
      color: 'bg-yellow-100 text-yellow-800',
      icon: '📅'
    },
    {
      id: 'documentation',
      name: 'Documentation',
      description: 'Templates pour la documentation',
      color: 'bg-gray-100 text-gray-800',
      icon: '📚'
    }
  ];

  // Charger les templates depuis localStorage
  useEffect(() => {
    const savedTemplates = localStorage.getItem('taskTemplates');
    const savedCategories = localStorage.getItem('templateCategories');
    
    if (savedTemplates) {
      try {
        const parsedTemplates = JSON.parse(savedTemplates);
        setTemplates(parsedTemplates);
      } catch (error) {
        console.error('Erreur lors du chargement des templates:', error);
      }
    } else {
      // Créer des templates de démonstration
      const demoTemplates: TaskTemplate[] = [
        {
          id: 'template-1',
          name: 'Développement de fonctionnalité',
          description: 'Template standard pour le développement d\'une nouvelle fonctionnalité',
          category: 'development',
          priority: 'medium',
          estimatedHours: 8,
          tags: ['feature', 'development'],
          checklist: [
            { id: 'check-1', text: 'Analyser les exigences', completed: false },
            { id: 'check-2', text: 'Créer la conception technique', completed: false },
            { id: 'check-3', text: 'Développer la fonctionnalité', completed: false },
            { id: 'check-4', text: 'Écrire les tests unitaires', completed: false },
            { id: 'check-5', text: 'Effectuer les tests d\'intégration', completed: false },
            { id: 'check-6', text: 'Documenter la fonctionnalité', completed: false },
            { id: 'check-7', text: 'Code review', completed: false },
            { id: 'check-8', text: 'Déploiement en production', completed: false }
          ],
          createdBy: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 0,
          isPublic: true
        },
        {
          id: 'template-2',
          name: 'Correction de bug',
          description: 'Template pour la correction et le suivi des bugs',
          category: 'development',
          priority: 'high',
          estimatedHours: 4,
          tags: ['bug', 'fix'],
          checklist: [
            { id: 'check-1', text: 'Reproduire le bug', completed: false },
            { id: 'check-2', text: 'Identifier la cause racine', completed: false },
            { id: 'check-3', text: 'Développer la correction', completed: false },
            { id: 'check-4', text: 'Tester la correction', completed: false },
            { id: 'check-5', text: 'Vérifier qu\'aucune régression n\'est introduite', completed: false },
            { id: 'check-6', text: 'Déployer la correction', completed: false }
          ],
          createdBy: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 0,
          isPublic: true
        },
        {
          id: 'template-3',
          name: 'Design d\'interface utilisateur',
          description: 'Template pour la création d\'interfaces utilisateur',
          category: 'design',
          priority: 'medium',
          estimatedHours: 6,
          tags: ['design', 'ui', 'ux'],
          checklist: [
            { id: 'check-1', text: 'Analyser les besoins utilisateur', completed: false },
            { id: 'check-2', text: 'Créer les wireframes', completed: false },
            { id: 'check-3', text: 'Développer les maquettes', completed: false },
            { id: 'check-4', text: 'Créer le prototype interactif', completed: false },
            { id: 'check-5', text: 'Tests utilisateur', completed: false },
            { id: 'check-6', text: 'Itérations basées sur les retours', completed: false },
            { id: 'check-7', text: 'Livraison des assets finaux', completed: false }
          ],
          createdBy: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 0,
          isPublic: true
        },
        {
          id: 'template-4',
          name: 'Campagne marketing',
          description: 'Template pour le lancement d\'une campagne marketing',
          category: 'marketing',
          priority: 'medium',
          estimatedHours: 12,
          tags: ['marketing', 'campaign'],
          checklist: [
            { id: 'check-1', text: 'Définir les objectifs de la campagne', completed: false },
            { id: 'check-2', text: 'Identifier la cible', completed: false },
            { id: 'check-3', text: 'Créer le message clé', completed: false },
            { id: 'check-4', text: 'Développer les supports créatifs', completed: false },
            { id: 'check-5', text: 'Planifier les canaux de diffusion', completed: false },
            { id: 'check-6', text: 'Lancer la campagne', completed: false },
            { id: 'check-7', text: 'Suivre les performances', completed: false },
            { id: 'check-8', text: 'Analyser les résultats', completed: false }
          ],
          createdBy: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 0,
          isPublic: true
        },
        {
          id: 'template-5',
          name: 'Support client - Résolution de problème',
          description: 'Template pour la résolution des problèmes clients',
          category: 'support',
          priority: 'high',
          estimatedHours: 2,
          tags: ['support', 'client'],
          checklist: [
            { id: 'check-1', text: 'Accuser réception de la demande', completed: false },
            { id: 'check-2', text: 'Analyser le problème', completed: false },
            { id: 'check-3', text: 'Rechercher une solution', completed: false },
            { id: 'check-4', text: 'Tester la solution', completed: false },
            { id: 'check-5', text: 'Communiquer la solution au client', completed: false },
            { id: 'check-6', text: 'Suivre la satisfaction client', completed: false }
          ],
          createdBy: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 0,
          isPublic: true
        }
      ];
      
      setTemplates(demoTemplates);
      localStorage.setItem('taskTemplates', JSON.stringify(demoTemplates));
    }

    if (savedCategories) {
      try {
        const parsedCategories = JSON.parse(savedCategories);
        setCategories(parsedCategories);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    } else {
      setCategories(predefinedCategories);
      localStorage.setItem('templateCategories', JSON.stringify(predefinedCategories));
    }
  }, []);

  // Sauvegarder les templates
  const saveTemplates = useCallback((newTemplates: TaskTemplate[]) => {
    localStorage.setItem('taskTemplates', JSON.stringify(newTemplates));
    setTemplates(newTemplates);
  }, []);

  // Créer un nouveau template
  const createTemplate = useCallback((templateData: Omit<TaskTemplate, 'id' | 'createdBy' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    if (!user) return;

    const newTemplate: TaskTemplate = {
      ...templateData,
      id: `template-${Date.now()}`,
      createdBy: user.id.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0
    };

    const updatedTemplates = [...templates, newTemplate];
    saveTemplates(updatedTemplates);
    
    console.log('✅ Template créé:', newTemplate.name);
    return newTemplate;
  }, [templates, saveTemplates, user]);

  // Mettre à jour un template
  const updateTemplate = useCallback((templateId: string, updates: Partial<TaskTemplate>) => {
    const updatedTemplates = templates.map(template =>
      template.id === templateId
        ? { ...template, ...updates, updatedAt: new Date().toISOString() }
        : template
    );
    
    saveTemplates(updatedTemplates);
    console.log('✅ Template mis à jour:', templateId);
  }, [templates, saveTemplates]);

  // Supprimer un template
  const deleteTemplate = useCallback((templateId: string) => {
    const updatedTemplates = templates.filter(template => template.id !== templateId);
    saveTemplates(updatedTemplates);
    console.log('✅ Template supprimé:', templateId);
  }, [templates, saveTemplates]);

  // Utiliser un template pour créer une tâche
  const useTemplate = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return null;

    // Incrémenter le compteur d'utilisation
    const updatedTemplates = templates.map(t =>
      t.id === templateId
        ? { ...t, usageCount: t.usageCount + 1, updatedAt: new Date().toISOString() }
        : t
    );
    saveTemplates(updatedTemplates);

    console.log('✅ Template utilisé:', template.name);
    return template;
  }, [templates, saveTemplates]);

  // Obtenir les templates par catégorie
  const getTemplatesByCategory = useCallback((categoryId: string) => {
    return templates.filter(template => template.category === categoryId);
  }, [templates]);

  // Obtenir les templates les plus utilisés
  const getMostUsedTemplates = useCallback((limit: number = 10) => {
    return templates
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }, [templates]);

  // Rechercher des templates
  const searchTemplates = useCallback((query: string) => {
    if (!query.trim()) return templates;
    
    return templates.filter(template =>
      template.name.toLowerCase().includes(query.toLowerCase()) ||
      template.description.toLowerCase().includes(query.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }, [templates]);

  // Dupliquer un template
  const duplicateTemplate = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template || !user) return;

    const duplicatedTemplate: TaskTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copie)`,
      createdBy: user.id.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0
    };

    const updatedTemplates = [...templates, duplicatedTemplate];
    saveTemplates(updatedTemplates);
    
    console.log('✅ Template dupliqué:', duplicatedTemplate.name);
    return duplicatedTemplate;
  }, [templates, saveTemplates, user]);

  // Obtenir les statistiques des templates
  const getTemplateStats = useCallback(() => {
    const totalTemplates = templates.length;
    const publicTemplates = templates.filter(t => t.isPublic).length;
    const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0);
    const categoriesUsed = new Set(templates.map(t => t.category)).size;

    return {
      totalTemplates,
      publicTemplates,
      totalUsage,
      categoriesUsed
    };
  }, [templates]);

  return {
    templates,
    categories,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    useTemplate,
    getTemplatesByCategory,
    getMostUsedTemplates,
    searchTemplates,
    duplicateTemplate,
    getTemplateStats
  };
}
