id');
    
    if (profilesError) throw profilesError;
    
    if (!profiles || profiles.length === 0) {
      console.error('Aucun profil trouvé. Veuillez d\'abord créer des profils.');
      return;
    }
    
    // Récupérer un projet existant
    const { data: projects, error: projectsError } = // Mock await select call
      .limit(1);
    
    if (projectsError) throw projectsError;
    
    if (!projects || projects.length === 0) {
      console.error('Aucun projet trouvé. Veuillez d\'abord créer un projet.');
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
    
    if (error) throw error;
    
    console.log(`${data.length} tâches de projet ont été créées avec succès.`);
  } catch (error) {
    console.error('Erreur lors de l\'insertion des tâches de projet:', error);
  }
}

// Exécuter la fonction
insertTestProjectTasks(); 