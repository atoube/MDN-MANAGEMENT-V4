const mysql = require('mysql2/promise');

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
    console.log('🔌 Test de connexion Railway depuis Netlify...');
    console.log('Variables d\'environnement:');
    console.log('RAILWAY_DB_HOST:', process.env.RAILWAY_DB_HOST);
    console.log('RAILWAY_DB_PORT:', process.env.RAILWAY_DB_PORT);
    console.log('RAILWAY_DB_USER:', process.env.RAILWAY_DB_USER);
    console.log('RAILWAY_DB_NAME:', process.env.RAILWAY_DB_NAME);
    console.log('RAILWAY_DB_SSL:', process.env.RAILWAY_DB_SSL);

    // Configuration de la base de données Railway
    const connection = await mysql.createConnection({
      host: process.env.RAILWAY_DB_HOST || 'centerbeam.proxy.rlwy.net',
      port: parseInt(process.env.RAILWAY_DB_PORT || '26824'),
      user: process.env.RAILWAY_DB_USER || 'root',
      password: process.env.RAILWAY_DB_PASSWORD || 'eNMmLvQjDIBHXwPmEqaVutQQDKTwEKsD',
      database: process.env.RAILWAY_DB_NAME || 'railway',
      ssl: process.env.RAILWAY_DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    });

    console.log('✅ Connexion établie');

    // Test simple
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log('✅ Nombre d\'utilisateurs:', rows[0].count);

    // Récupérer quelques utilisateurs
    const [users] = await connection.execute('SELECT id, email, first_name, last_name, role FROM users LIMIT 5');
    console.log('✅ Utilisateurs trouvés:', users.length);

    await connection.end();

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Connexion Railway réussie',
        userCount: rows[0].count,
        users: users,
        env: {
          host: process.env.RAILWAY_DB_HOST,
          port: process.env.RAILWAY_DB_PORT,
          user: process.env.RAILWAY_DB_USER,
          database: process.env.RAILWAY_DB_NAME,
          ssl: process.env.RAILWAY_DB_SSL
        }
      }),
    };

  } catch (error) {
    console.error('❌ Erreur Railway:', error.message);
    console.error('❌ Code:', error.code);
    console.error('❌ Errno:', error.errno);

    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        message: 'Erreur de connexion Railway',
        error: error.message,
        code: error.code,
        errno: error.errno,
        env: {
          host: process.env.RAILWAY_DB_HOST,
          port: process.env.RAILWAY_DB_PORT,
          user: process.env.RAILWAY_DB_USER,
          database: process.env.RAILWAY_DB_NAME,
          ssl: process.env.RAILWAY_DB_SSL
        }
      }),
    };
  }
};



