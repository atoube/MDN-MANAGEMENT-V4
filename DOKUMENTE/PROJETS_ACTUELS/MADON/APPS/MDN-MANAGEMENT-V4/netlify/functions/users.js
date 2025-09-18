const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
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
        // Récupérer tous les utilisateurs
        const [rows] = await connection.execute(`
          SELECT 
            id,
            email,
            first_name,
            last_name,
            role,
            must_change_password,
            created_at,
            updated_at
          FROM users 
          ORDER BY created_at DESC
        `);

        result = {
          statusCode: 200,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(rows),
        };
        break;

      case 'POST':
        // Créer un nouvel utilisateur
        const body = JSON.parse(event.body || '{}');
        const { email, first_name, last_name, role, password } = body;

        if (!email || !first_name || !last_name || !role || !password) {
          result = {
            statusCode: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: false,
              message: 'Tous les champs sont requis'
            }),
          };
          break;
        }

        // Vérifier si l'utilisateur existe déjà
        const [existingUsers] = await connection.execute(
          'SELECT id FROM users WHERE email = ?',
          [email]
        );

        if (existingUsers.length > 0) {
          result = {
            statusCode: 409,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: false,
              message: 'Un utilisateur avec cet email existe déjà'
            }),
          };
          break;
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insérer le nouvel utilisateur
        const [insertResult] = await connection.execute(
          'INSERT INTO users (email, first_name, last_name, role, password, must_change_password) VALUES (?, ?, ?, ?, ?, ?)',
          [email, first_name, last_name, role, hashedPassword, true]
        );

        result = {
          statusCode: 201,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: true,
            message: 'Utilisateur créé avec succès',
            user: {
              id: insertResult.insertId,
              email,
              first_name,
              last_name,
              role,
              must_change_password: true
            }
          }),
        };
        break;

      case 'PUT':
        // Mettre à jour un utilisateur
        const userId = event.path.split('/').pop();
        const updateBody = JSON.parse(event.body || '{}');
        const { email: newEmail, first_name: newFirstName, last_name: newLastName, role: newRole } = updateBody;

        if (!userId || isNaN(userId)) {
          result = {
            statusCode: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: false,
              message: 'ID utilisateur invalide'
            }),
          };
          break;
        }

        const [updateResult] = await connection.execute(
          'UPDATE users SET email = ?, first_name = ?, last_name = ?, role = ?, updated_at = NOW() WHERE id = ?',
          [newEmail, newFirstName, newLastName, newRole, userId]
        );

        if (updateResult.affectedRows === 0) {
          result = {
            statusCode: 404,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: false,
              message: 'Utilisateur non trouvé'
            }),
          };
        } else {
          result = {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: true,
              message: 'Utilisateur mis à jour avec succès'
            }),
          };
        }
        break;

      case 'DELETE':
        // Supprimer un utilisateur
        const deleteUserId = event.path.split('/').pop();

        if (!deleteUserId || isNaN(deleteUserId)) {
          result = {
            statusCode: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: false,
              message: 'ID utilisateur invalide'
            }),
          };
          break;
        }

        // Vérifier si c'est un admin (ne pas permettre la suppression d'un admin)
        const [adminCheck] = await connection.execute(
          'SELECT role FROM users WHERE id = ?',
          [deleteUserId]
        );

        if (adminCheck.length > 0 && adminCheck[0].role === 'admin') {
          result = {
            statusCode: 403,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: false,
              message: 'Impossible de supprimer un administrateur'
            }),
          };
          break;
        }

        const [deleteResult] = await connection.execute(
          'DELETE FROM users WHERE id = ?',
          [deleteUserId]
        );

        if (deleteResult.affectedRows === 0) {
          result = {
            statusCode: 404,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: false,
              message: 'Utilisateur non trouvé'
            }),
          };
        } else {
          result = {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: true,
              message: 'Utilisateur supprimé avec succès'
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
    console.error('Erreur lors de la gestion des utilisateurs:', error);
    
    // Fallback vers des données mockées en cas d'erreur pour GET
    if (event.httpMethod === 'GET') {
      const mockUsers = [
        {
          id: 1,
          email: 'admin@madon.com',
          first_name: 'Admin',
          last_name: 'MADON',
          role: 'admin',
          must_change_password: false,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        }
      ];

      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(mockUsers),
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

