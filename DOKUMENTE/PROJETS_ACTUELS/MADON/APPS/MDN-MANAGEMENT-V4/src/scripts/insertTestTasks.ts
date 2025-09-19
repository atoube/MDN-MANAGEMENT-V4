id');
    
    if (employeesError) throw employeesError;
    
    if (!employees || employees.length === 0) {
      console.error('Aucun employé trouvé. Veuillez d\'abord créer des employés.');
      return;
    }
    
    // Récupérer l'utilisateur actuel
    const { data: { user }, error: userError } =     
    if (userError) throw userError;
    
    if (!user) {
      console.error('Aucun utilisateur connecté. Veuillez vous connecter.');
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
    
    if (error) throw error;
    
    console.log(`${data.length} tâches ont été créées avec succès.`);
  } catch (error) {
    console.error('Erreur lors de l\'insertion des tâches:', error);
  }
}

// Exécuter la fonction
insertTestTasks(); 