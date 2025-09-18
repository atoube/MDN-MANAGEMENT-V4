const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'PUT, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'PUT') {
    return {
      statusCode: 405,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        message: 'Méthode non autorisée'
      }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { userId, currentPassword, newPassword } = body;

    if (!userId || !currentPassword || !newPassword) {
      return {
        statusCode: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          message: 'ID utilisateur, mot de passe actuel et nouveau mot de passe requis'
        }),
      };
    }

    // Validation du nouveau mot de passe
    if (newPassword.length < 8) {
      return {
        statusCode: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          message: 'Le nouveau mot de passe doit contenir au moins 8 caractères'
        }),
      };
    }

    // Vérifier les critères de sécurité
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return {
        statusCode: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
        }),
      };
    }

    // Configuration de la base de données Railway
    const connection = await mysql.createConnection({
      host: process.env.RAILWAY_DB_HOST || 'centerbeam.proxy.rlwy.net',
      port: parseInt(process.env.RAILWAY_DB_PORT || '26824'),
      user: process.env.RAILWAY_DB_USER || 'root',
      password: process.env.RAILWAY_DB_PASSWORD || 'eNMmLvQjDIBHXwPmEqaVutQQDKTwEKsD',
      database: process.env.RAILWAY_DB_NAME || 'railway',
      ssl: process.env.RAILWAY_DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    });

    // Récupérer l'utilisateur et son mot de passe actuel
    const [rows] = await connection.execute(
      'SELECT id, password FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      await connection.end();
      return {
        statusCode: 404,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          message: 'Utilisateur non trouvé'
        }),
      };
    }

    const user = rows[0];

    // Vérifier le mot de passe actuel
    let isCurrentPasswordValid = false;
    if (user.password.startsWith('$2b$')) {
      isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    } else {
      isCurrentPasswordValid = currentPassword === user.password;
    }

    if (!isCurrentPasswordValid) {
      await connection.end();
      return {
        statusCode: 401,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          message: 'Mot de passe actuel incorrect'
        }),
      };
    }

    // Hasher le nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe et marquer qu'il n'a plus besoin d'être changé
    const [updateResult] = await connection.execute(
      'UPDATE users SET password = ?, must_change_password = false, updated_at = NOW() WHERE id = ?',
      [hashedNewPassword, userId]
    );

    await connection.end();

    if (updateResult.affectedRows === 0) {
      return {
        statusCode: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          message: 'Erreur lors de la mise à jour du mot de passe'
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Mot de passe changé avec succès'
      }),
    };

  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
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
