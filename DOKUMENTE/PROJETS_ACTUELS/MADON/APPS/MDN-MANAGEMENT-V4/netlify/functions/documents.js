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
        // Récupérer tous les documents avec les informations des utilisateurs
        const [rows] = await connection.execute(`
          SELECT 
            d.id,
            d.title,
            d.description,
            d.category,
            d.file_type,
            d.file_path,
            d.file_size,
            d.status,
            d.uploaded_by,
            d.created_at,
            d.updated_at,
            u.first_name as uploaded_by_name,
            u.last_name as uploaded_by_lastname
          FROM documents d
          LEFT JOIN users u ON d.uploaded_by = u.id
          ORDER BY d.created_at DESC
        `);

        result = {
          statusCode: 200,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(rows),
        };
        break;

      case 'POST':
        // Créer un nouveau document
        const body = JSON.parse(event.body || '{}');
        const { title, description, category, file_type, file_path, file_size, status, uploaded_by } = body;

        if (!title || !description || !category || !uploaded_by) {
          result = {
            statusCode: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: false,
              message: 'Titre, description, catégorie et uploader sont requis'
            }),
          };
          break;
        }

        const [insertResult] = await connection.execute(
          'INSERT INTO documents (title, description, category, file_type, file_path, file_size, status, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [title, description, category, file_type || 'pdf', file_path, file_size || 0, status || 'draft', uploaded_by]
        );

        result = {
          statusCode: 201,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: true,
            message: 'Document créé avec succès',
            document: {
              id: insertResult.insertId,
              title,
              description,
              category,
              file_type: file_type || 'pdf',
              file_path,
              file_size: file_size || 0,
              status: status || 'draft',
              uploaded_by
            }
          }),
        };
        break;

      case 'PUT':
        // Mettre à jour un document
        const docId = event.path.split('/').pop();
        const updateBody = JSON.parse(event.body || '{}');
        const { title: newTitle, description: newDescription, category: newCategory, status: newStatus } = updateBody;

        if (!docId || isNaN(docId)) {
          result = {
            statusCode: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: false,
              message: 'ID document invalide'
            }),
          };
          break;
        }

        const [updateResult] = await connection.execute(
          'UPDATE documents SET title = ?, description = ?, category = ?, status = ?, updated_at = NOW() WHERE id = ?',
          [newTitle, newDescription, newCategory, newStatus, docId]
        );

        if (updateResult.affectedRows === 0) {
          result = {
            statusCode: 404,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: false,
              message: 'Document non trouvé'
            }),
          };
        } else {
          result = {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: true,
              message: 'Document mis à jour avec succès'
            }),
          };
        }
        break;

      case 'DELETE':
        // Supprimer un document
        const deleteDocId = event.path.split('/').pop();

        if (!deleteDocId || isNaN(deleteDocId)) {
          result = {
            statusCode: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: false,
              message: 'ID document invalide'
            }),
          };
          break;
        }

        const [deleteResult] = await connection.execute(
          'DELETE FROM documents WHERE id = ?',
          [deleteDocId]
        );

        if (deleteResult.affectedRows === 0) {
          result = {
            statusCode: 404,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: false,
              message: 'Document non trouvé'
            }),
          };
        } else {
          result = {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: true,
              message: 'Document supprimé avec succès'
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
    console.error('Erreur lors de la gestion des documents:', error);
    
    // Fallback vers des données mockées en cas d'erreur pour GET
    if (event.httpMethod === 'GET') {
      const mockDocuments = [
        {
          id: 1,
          title: 'Guide d\'utilisation',
          description: 'Guide complet pour les utilisateurs',
          category: 'Documentation Technique',
          file_type: 'pdf',
          status: 'published',
          uploaded_by: 1,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        },
        {
          id: 2,
          title: 'Politique de sécurité',
          description: 'Politique de sécurité de l\'entreprise',
          category: 'Procédures RH',
          file_type: 'docx',
          status: 'draft',
          uploaded_by: 2,
          created_at: '2024-01-05T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        }
      ];

      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(mockDocuments),
      };
    }

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

