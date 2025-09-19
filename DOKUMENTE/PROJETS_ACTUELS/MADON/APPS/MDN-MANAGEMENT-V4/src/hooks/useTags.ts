import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  usageCount: number;
}

export interface TaskTag {
  taskId: string;
  tagId: string;
  addedBy: string;
  addedAt: string;
}

export function useTags() {
  const { user } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [taskTags, setTaskTags] = useState<TaskTag[]>([]);
  const [loading, setIsLoading] = useState(false);

  // Couleurs prédéfinies pour les tags
  const predefinedColors = [
    'bg-red-100 text-red-800',
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
    'bg-gray-100 text-gray-800',
    'bg-orange-100 text-orange-800',
    'bg-teal-100 text-teal-800'
  ];

  // Charger les tags depuis localStorage
  useEffect(() => {
    const savedTags = localStorage.getItem('tags');
    const savedTaskTags = localStorage.getItem('taskTags');
    
    if (savedTags) {
      try {
        const parsedTags = JSON.parse(savedTags);
        setTags(parsedTags);
      } catch (error) {
        console.error('Erreur lors du chargement des tags:', error);
      }
    } else {
      // Créer des tags de démonstration
      const demoTags: Tag[] = [
        {
          id: 'tag-1',
          name: 'Urgent',
          color: 'bg-red-100 text-red-800',
          description: 'Tâches urgentes nécessitant une attention immédiate',
          createdBy: '1',
          createdAt: new Date().toISOString(),
          usageCount: 0
        },
        {
          id: 'tag-2',
          name: 'Bug',
          color: 'bg-orange-100 text-orange-800',
          description: 'Corrections de bugs et problèmes techniques',
          createdBy: '1',
          createdAt: new Date().toISOString(),
          usageCount: 0
        },
        {
          id: 'tag-3',
          name: 'Feature',
          color: 'bg-blue-100 text-blue-800',
          description: 'Nouvelles fonctionnalités à développer',
          createdBy: '1',
          createdAt: new Date().toISOString(),
          usageCount: 0
        },
        {
          id: 'tag-4',
          name: 'Documentation',
          color: 'bg-green-100 text-green-800',
          description: 'Tâches liées à la documentation',
          createdBy: '1',
          createdAt: new Date().toISOString(),
          usageCount: 0
        },
        {
          id: 'tag-5',
          name: 'Review',
          color: 'bg-yellow-100 text-yellow-800',
          description: 'Tâches nécessitant une révision',
          createdBy: '1',
          createdAt: new Date().toISOString(),
          usageCount: 0
        },
        {
          id: 'tag-6',
          name: 'Client',
          color: 'bg-purple-100 text-purple-800',
          description: 'Tâches liées aux demandes clients',
          createdBy: '1',
          createdAt: new Date().toISOString(),
          usageCount: 0
        }
      ];
      
      setTags(demoTags);
      localStorage.setItem('tags', JSON.stringify(demoTags));
    }

    if (savedTaskTags) {
      try {
        const parsedTaskTags = JSON.parse(savedTaskTags);
        setTaskTags(parsedTaskTags);
      } catch (error) {
        console.error('Erreur lors du chargement des tags de tâches:', error);
      }
    }
  }, []);

  // Sauvegarder les tags
  const saveTags = useCallback((newTags: Tag[]) => {
    localStorage.setItem('tags', JSON.stringify(newTags));
    setTags(newTags);
  }, []);

  // Sauvegarder les tags de tâches
  const saveTaskTags = useCallback((newTaskTags: TaskTag[]) => {
    localStorage.setItem('taskTags', JSON.stringify(newTaskTags));
    setTaskTags(newTaskTags);
  }, []);

  // Créer un nouveau tag
  const createTag = useCallback((tagData: Omit<Tag, 'id' | 'createdBy' | 'createdAt' | 'usageCount'>) => {
    if (!user) return;

    const newTag: Tag = {
      ...tagData,
      id: `tag-${Date.now()}`,
      createdBy: user.id.toString(),
      createdAt: new Date().toISOString(),
      usageCount: 0
    };

    const updatedTags = [...tags, newTag];
    saveTags(updatedTags);
    
    console.log('✅ Tag créé:', newTag.name);
    return newTag;
  }, [tags, saveTags, user]);

  // Mettre à jour un tag
  const updateTag = useCallback((tagId: string, updates: Partial<Tag>) => {
    const updatedTags = tags.map(tag =>
      tag.id === tagId
        ? { ...tag, ...updates }
        : tag
    );
    
    saveTags(updatedTags);
    console.log('✅ Tag mis à jour:', tagId);
  }, [tags, saveTags]);

  // Supprimer un tag
  const deleteTag = useCallback((tagId: string) => {
    // Supprimer le tag
    const updatedTags = tags.filter(tag => tag.id !== tagId);
    saveTags(updatedTags);

    // Supprimer toutes les associations avec les tâches
    const updatedTaskTags = taskTags.filter(taskTag => taskTag.tagId !== tagId);
    saveTaskTags(updatedTaskTags);

    console.log('✅ Tag supprimé:', tagId);
  }, [tags, taskTags, saveTags, saveTaskTags]);

  // Ajouter un tag à une tâche
  const addTagToTask = useCallback((taskId: string, tagId: string) => {
    if (!user) return;

    // Vérifier si l'association existe déjà
    const existingAssociation = taskTags.find(
      taskTag => taskTag.taskId === taskId && taskTag.tagId === tagId
    );

    if (existingAssociation) {
      console.log('⚠️ Tag déjà associé à cette tâche');
      return;
    }

    const newTaskTag: TaskTag = {
      taskId,
      tagId,
      addedBy: user.id.toString(),
      addedAt: new Date().toISOString()
    };

    const updatedTaskTags = [...taskTags, newTaskTag];
    saveTaskTags(updatedTaskTags);

    // Mettre à jour le compteur d'utilisation du tag
    const updatedTags = tags.map(tag =>
      tag.id === tagId
        ? { ...tag, usageCount: tag.usageCount + 1 }
        : tag
    );
    saveTags(updatedTags);

    console.log('✅ Tag ajouté à la tâche:', taskId, tagId);
  }, [taskTags, tags, saveTaskTags, saveTags, user]);

  // Retirer un tag d'une tâche
  const removeTagFromTask = useCallback((taskId: string, tagId: string) => {
    const updatedTaskTags = taskTags.filter(
      taskTag => !(taskTag.taskId === taskId && taskTag.tagId === tagId)
    );
    saveTaskTags(updatedTaskTags);

    // Mettre à jour le compteur d'utilisation du tag
    const updatedTags = tags.map(tag =>
      tag.id === tagId
        ? { ...tag, usageCount: Math.max(0, tag.usageCount - 1) }
        : tag
    );
    saveTags(updatedTags);

    console.log('✅ Tag retiré de la tâche:', taskId, tagId);
  }, [taskTags, tags, saveTaskTags, saveTags]);

  // Obtenir les tags d'une tâche
  const getTaskTags = useCallback((taskId: string) => {
    const taskTagIds = taskTags
      .filter(taskTag => taskTag.taskId === taskId)
      .map(taskTag => taskTag.tagId);
    
    return tags.filter(tag => taskTagIds.includes(tag.id));
  }, [taskTags, tags]);

  // Obtenir les tâches avec un tag spécifique
  const getTasksWithTag = useCallback((tagId: string) => {
    return taskTags
      .filter(taskTag => taskTag.tagId === tagId)
      .map(taskTag => taskTag.taskId);
  }, [taskTags]);

  // Rechercher des tags
  const searchTags = useCallback((query: string) => {
    if (!query.trim()) return tags;
    
    return tags.filter(tag =>
      tag.name.toLowerCase().includes(query.toLowerCase()) ||
      (tag.description && tag.description.toLowerCase().includes(query.toLowerCase()))
    );
  }, [tags]);

  // Obtenir les tags les plus utilisés
  const getMostUsedTags = useCallback((limit: number = 10) => {
    return tags
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }, [tags]);

  // Obtenir une couleur aléatoire pour un nouveau tag
  const getRandomColor = useCallback(() => {
    const usedColors = tags.map(tag => tag.color);
    const availableColors = predefinedColors.filter(color => !usedColors.includes(color));
    
    if (availableColors.length === 0) {
      return predefinedColors[Math.floor(Math.random() * predefinedColors.length)];
    }
    
    return availableColors[Math.floor(Math.random() * availableColors.length)];
  }, [tags]);

  return {
    tags,
    taskTags,
    loading,
    createTag,
    updateTag,
    deleteTag,
    addTagToTask,
    removeTagFromTask,
    getTaskTags,
    getTasksWithTag,
    searchTags,
    getMostUsedTags,
    getRandomColor,
    predefinedColors
  };
}
