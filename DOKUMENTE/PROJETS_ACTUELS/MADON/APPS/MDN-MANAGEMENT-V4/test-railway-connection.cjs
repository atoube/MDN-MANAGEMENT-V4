#!/usr/bin/env node

/**
 * Test direct de la connexion Railway
 */

const mysql = require('mysql2/promise');

async function testRailwayConnection() {
  console.log('🔌 Test de connexion Railway...');
  
  try {
    // Configuration de la base de données Railway
    const connection = await mysql.createConnection({
      host: 'centerbeam.proxy.rlwy.net',
      port: 26824,
      user: 'root',
      password: 'eNMmLvQjDIBHXwPmEqaVutQQDKTwEKsD',
      database: 'railway',
      ssl: { rejectUnauthorized: false }
    });

    console.log('✅ Connexion établie');

    // Test simple
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log('✅ Nombre d\'utilisateurs:', rows[0].count);

    // Récupérer quelques utilisateurs
    const [users] = await connection.execute('SELECT id, email, first_name, last_name, role FROM users LIMIT 5');
    console.log('✅ Utilisateurs trouvés:', users.length);
    console.log('📋 Utilisateurs:', users);

    await connection.end();
    console.log('✅ Test de connexion Railway réussi!');

  } catch (error) {
    console.error('❌ Erreur Railway:', error.message);
    console.error('❌ Code:', error.code);
    console.error('❌ Errno:', error.errno);
  }
}

testRailwayConnection();
