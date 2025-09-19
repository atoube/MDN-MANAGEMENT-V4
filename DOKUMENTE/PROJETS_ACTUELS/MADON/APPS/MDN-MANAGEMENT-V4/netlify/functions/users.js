const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
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

    // Récupérer tous les utilisateurs
    const [rows] = await connection.execute(`
      SELECT 
        id,
        email,
        first_name,
        last_name,
        role,
        created_at,
        updated_at
      FROM users 
      ORDER BY created_at DESC
    `);

    await connection.end();

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(rows),
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    
    // Fallback vers des données mockées en cas d'erreur
    const mockUsers = [
      {
        id: 1,
        email: 'admin@madon.com',
        first_name: 'Admin',
        last_name: 'MADON',
        role: 'admin',
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
};

