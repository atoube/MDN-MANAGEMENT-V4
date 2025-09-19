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

    console.log('🔐 Tentative de connexion pour:', email);
    console.log('🔑 Mot de passe fourni:', password ? '***' : 'vide');

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
        port: parseInt(process.env.RAILWAY_DB_PORT || '26824'),
        user: process.env.RAILWAY_DB_USER || 'root',
        password: process.env.RAILWAY_DB_PASSWORD || 'eNMmLvQjDIBHXwPmEqaVutQQDKTwEKsD',
        database: process.env.RAILWAY_DB_NAME || 'railway',
        ssl: process.env.RAILWAY_DB_SSL === 'true' ? { rejectUnauthorized: false } : false
      });

      console.log('✅ Connexion à la base de données établie');

      // Rechercher l'utilisateur par email
      const [rows] = await connection.execute(
        'SELECT id, email, first_name, last_name, role, password FROM users WHERE email = ?',
        [email]
      );

      console.log('🔍 Utilisateurs trouvés:', rows.length);
      if (rows.length > 0) {
        console.log('👤 Utilisateur trouvé:', {
          id: rows[0].id,
          email: rows[0].email,
          first_name: rows[0].first_name,
          last_name: rows[0].last_name,
          role: rows[0].role,
          password_length: rows[0].password.length,
          password_starts_with: rows[0].password.substring(0, 10)
        });
      }

      await connection.end();

      if (rows.length === 0) {
        console.log('❌ Utilisateur non trouvé');
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
      let isPasswordValid = false;
      if (user.password.startsWith('$2b$')) {
        console.log('🔐 Vérification avec bcrypt');
        isPasswordValid = await bcrypt.compare(password, user.password);
      } else {
        console.log('🔐 Vérification directe');
        isPasswordValid = password === user.password;
        console.log('🔑 Comparaison:', password, '===', user.password, '=', isPasswordValid);
      }

      console.log('✅ Mot de passe valide:', isPasswordValid);

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
      const response = {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          must_change_password: false
        },
        token: 'jwt-token-' + user.id
      };

      console.log('🎉 Connexion réussie pour:', user.email);

      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(response),
      };

    } catch (dbError) {
      console.error('❌ Erreur de base de données:', dbError.message);
      
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
    console.error('❌ Erreur lors de l\'authentification:', error.message);
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



