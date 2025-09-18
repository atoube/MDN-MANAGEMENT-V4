const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { email, password } = body;

    if (!email || !password) {
      return {
        statusCode: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          message: 'Email et mot de passe requis'
        }),
      };
    }

    try {
      // Configuration de la base de données Railway
      const connection = await mysql.createConnection({
        host: process.env.RAILWAY_DB_HOST || 'centerbeam.proxy.rlwy.net',
        port: process.env.RAILWAY_DB_PORT || 26824,
        user: process.env.RAILWAY_DB_USER || 'root',
        password: process.env.RAILWAY_DB_PASSWORD || 'eNMmLvQjDIBHXwPmEqaVutQQDKTwEKsD',
        database: process.env.RAILWAY_DB_NAME || 'railway',
        ssl: process.env.RAILWAY_DB_SSL === 'true' ? { rejectUnauthorized: false } : false
      });

      // Rechercher l'utilisateur par email
      const [rows] = await connection.execute(
        'SELECT id, email, first_name, last_name, role, password FROM users WHERE email = ?',
        [email]
      );

      await connection.end();

      if (rows.length === 0) {
        return {
          statusCode: 401,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: false,
            message: 'Utilisateur non trouvé'
          }),
        };
      }

      const user = rows[0];

      // Vérifier le mot de passe
      // Si le mot de passe est hashé (commence par $2b$), utiliser bcrypt
      // Sinon, comparer directement
      let isPasswordValid = false;
      if (user.password.startsWith('$2b$')) {
        isPasswordValid = await bcrypt.compare(password, user.password);
      } else {
        isPasswordValid = password === user.password;
      }

      if (!isPasswordValid) {
        return {
          statusCode: 401,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: false,
            message: 'Mot de passe incorrect'
          }),
        };
      }

      // Retourner les informations de l'utilisateur (sans le mot de passe)
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            must_change_password: false
          },
          token: 'jwt-token-' + user.id // Token simple pour l'instant
        }),
      };

    } catch (dbError) {
      console.error('Erreur de base de données:', dbError);
      
      // Fallback vers l'authentification mockée
      if (email === 'admin@madon.com' && password === 'admin123') {
        return {
          statusCode: 200,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: true,
            user: {
              id: 1,
              email: 'admin@madon.com',
              first_name: 'Admin',
              last_name: 'MADON',
              role: 'admin'
            },
            token: 'mock-jwt-token'
          }),
        };
      } else {
        return {
          statusCode: 401,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: false,
            message: 'Identifiants invalides (mode démo)'
          }),
        };
      }
    }

  } catch (error) {
    console.error('Erreur lors de l\'authentification:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        message: 'Erreur lors de l\'authentification',
        error: error.message,
      }),
    };
  }
};
