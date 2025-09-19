const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
  // Configuration CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Configuration de la base de données Railway
    const connection = await mysql.createConnection({
      host: process.env.RAILWAY_DB_HOST || 'centerbeam.proxy.rlwy.net',
      port: parseInt(process.env.RAILWAY_DB_PORT || '26824'),
      user: process.env.RAILWAY_DB_USER || 'root',
      password: process.env.RAILWAY_DB_PASSWORD || 'eNMmLvQjDIBHXwPmEqaVutQQDKTwEKsD',
      database: process.env.RAILWAY_DB_NAME || 'railway',
      ssl: process.env.RAILWAY_DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    });

    let result;

    switch (event.httpMethod) {
      case 'GET':
        // Récupérer toutes les tâches avec les informations des utilisateurs
        const [rows] = await connection.execute(`
          SELECT 
            t.id,
            t.title,
            t.description,
            t.status,
            t.priority,
            t.assigned_to,
            t.created_by,
            t.due_date,
            t.completed_at,
            t.created_at,
            t.updated_at,
            u1.first_name as assigned_to_name,
            u1.last_name as assigned_to_lastname,
            u2.first_name as created_by_name,
            u2.last_name as created_by_lastname
          FROM tasks t
          LEFT JOIN users u1 ON t.assigned_to = u1.id
          LEFT JOIN users u2 ON t.created_by = u2.id
          ORDER BY t.created_at DESC
        `);

        result = {
          statusCode: 200,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(rows),
        };
        break;

      case 'POST':
        // Créer une nouvelle tâche
        const body = JSON.parse(event.body || '{}');
        const { title, description, status, priority, assigned_to, created_by, due_date } = body;

        if (!title || !description || !assigned_to || !created_by) {
          result = {
            statusCode: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: false,
              message: 'Titre, description, assigné et créateur sont requis'
            }),
          };
          break;
        }

        const [insertResult] = await connection.execute(
          'INSERT INTO tasks (title, description, status, priority, assigned_to, created_by, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [title, description, status || 'todo', priority || 'medium', assigned_to, created_by, due_date]
        );

        result = {
          statusCode: 201,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: true,
            message: 'Tâche créée avec succès',
            task: {
              id: insertResult.insertId,
              title,
              description,
              status: status || 'todo',
              priority: priority || 'medium',
              assigned_to,
              created_by,
              due_date
            }
          }),
        };
        break;

      case 'PUT':
        // Mettre à jour une tâche
        const taskId = event.path.split('/').pop();
        const updateBody = JSON.parse(event.body || '{}');
        const { title: newTitle, description: newDescription, status: newStatus, priority: newPriority, assigned_to: newAssignedTo, due_date: newDueDate } = updateBody;

        if (!taskId || isNaN(taskId)) {
          result = {
            statusCode: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: false,
              message: 'ID tâche invalide'
            }),
          };
          break;
        }

        // Si le statut est "completed", ajouter la date de completion
        let completedAt = null;
        if (newStatus === 'completed') {
          completedAt = new Date().toISOString();
        }

        const [updateResult] = await connection.execute(
          'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, assigned_to = ?, due_date = ?, completed_at = ?, updated_at = NOW() WHERE id = ?',
          [newTitle, newDescription, newStatus, newPriority, newAssignedTo, newDueDate, completedAt, taskId]
        );

        if (updateResult.affectedRows === 0) {
          result = {
            statusCode: 404,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: false,
              message: 'Tâche non trouvée'
            }),
          };
        } else {
          result = {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: true,
              message: 'Tâche mise à jour avec succès'
            }),
          };
        }
        break;

      case 'DELETE':
        // Supprimer une tâche
        const deleteTaskId = event.path.split('/').pop();

        if (!deleteTaskId || isNaN(deleteTaskId)) {
          result = {
            statusCode: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: false,
              message: 'ID tâche invalide'
            }),
          };
          break;
        }

        const [deleteResult] = await connection.execute(
          'DELETE FROM tasks WHERE id = ?',
          [deleteTaskId]
        );

        if (deleteResult.affectedRows === 0) {
          result = {
            statusCode: 404,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: false,
              message: 'Tâche non trouvée'
            }),
          };
        } else {
          result = {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: true,
              message: 'Tâche supprimée avec succès'
            }),
          };
        }
        break;

      default:
        result = {
          statusCode: 405,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: false,
            message: 'Méthode non autorisée'
          }),
        };
    }

    await connection.end();
    return result;

  } catch (error) {
    console.error('Erreur lors de la gestion des tâches:', error);
    
    // En cas d'erreur, retourner une erreur plutôt que des données mockées
    // pour garantir la persistance des vraies données

    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      }),
    };
  }
};

