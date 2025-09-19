#!/usr/bin/env node

/**
 * Test simple des fonctions Netlify
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  binset-inline-end: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testDatabaseConnection() {
  log(`\n${colors.cyan}🔌 Test de connexion à la base de données Railway${colors.reset}`);
  log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);

  try {
    const connection = await mysql.createConnection({
      host: 'centerbeam.proxy.rlwy.net',
      port: 26824,
      user: 'root',
      password: 'eNMmLvQjDIBHXwPmEqaVutQQDKTwEKsD',
      database: 'railway',
      ssl: { rejectUnauthorized: false }
    });

    log('✅ Connexion établie', 'green');

    // Test des utilisateurs
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    log(`📊 Nombre d'utilisateurs: ${users[0].count}`, 'blue');

    // Test des tâches
    const [tasks] = await connection.execute('SELECT COUNT(*) as count FROM tasks');
    log(`📊 Nombre de tâches: ${tasks[0].count}`, 'blue');

    // Test des documents
    const [documents] = await connection.execute('SELECT COUNT(*) as count FROM documents');
    log(`📊 Nombre de documents: ${documents[0].count}`, 'blue');

    await connection.end();
    log('✅ Test de base de données réussi!', 'green');
    return true;

  } catch (error) {
    log(`❌ Erreur de base de données: ${error.message}`, 'red');
    return false;
  }
}

async function testAuthentication() {
  log(`\n${colors.cyan}🔐 Test d'authentification${colors.reset}`);
  log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);

  try {
    const connection = await mysql.createConnection({
      host: 'centerbeam.proxy.rlwy.net',
      port: 26824,
      user: 'root',
      password: 'eNMmLvQjDIBHXwPmEqaVutQQDKTwEKsD',
      database: 'railway',
      ssl: { rejectUnauthorized: false }
    });

    // Test de connexion admin
    const [rows] = await connection.execute(
      'SELECT id, email, first_name, last_name, role, password FROM users WHERE email = ?',
      ['admin@madon.com']
    );

    if (rows.length === 0) {
      log('❌ Utilisateur admin non trouvé', 'red');
      await connection.end();
      return false;
    }

    const user = rows[0];
    log(`✅ Utilisateur trouvé: ${user.first_name} ${user.last_name} (${user.role})`, 'green');

    // Test de vérification du mot de passe
    const testPassword = 'admin123';
    let isPasswordValid = false;
    
    if (user.password.startsWith('$2b$')) {
      isPasswordValid = await bcrypt.compare(testPassword, user.password);
      log('🔐 Vérification avec bcrypt', 'blue');
    } else {
      isPasswordValid = testPassword === user.password;
      log('🔐 Vérification directe', 'blue');
    }

    if (isPasswordValid) {
      log('✅ Mot de passe valide', 'green');
    } else {
      log('❌ Mot de passe invalide', 'red');
    }

    await connection.end();
    return isPasswordValid;

  } catch (error) {
    log(`❌ Erreur d'authentification: ${error.message}`, 'red');
    return false;
  }
}

async function testUserManagement() {
  log(`\n${colors.cyan}👥 Test de gestion des utilisateurs${colors.reset}`);
  log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);

  try {
    const connection = await mysql.createConnection({
      host: 'centerbeam.proxy.rlwy.net',
      port: 26824,
      user: 'root',
      password: 'eNMmLvQjDIBHXwPmEqaVutQQDKTwEKsD',
      database: 'railway',
      ssl: { rejectUnauthorized: false }
    });

    // Récupérer tous les utilisateurs
    const [users] = await connection.execute(`
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
      LIMIT 10
    `);

    log(`📋 ${users.length} utilisateurs récupérés:`, 'blue');
    users.forEach(user => {
      log(`  - ${user.first_name} ${user.last_name} (${user.email}) - ${user.role}`, 'blue');
    });

    await connection.end();
    log('✅ Test de gestion des utilisateurs réussi!', 'green');
    return true;

  } catch (error) {
    log(`❌ Erreur de gestion des utilisateurs: ${error.message}`, 'red');
    return false;
  }
}

async function testTasksSystem() {
  log(`\n${colors.cyan}📋 Test du système de tâches${colors.reset}`);
  log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);

  try {
    const connection = await mysql.createConnection({
      host: 'centerbeam.proxy.rlwy.net',
      port: 26824,
      user: 'root',
      password: 'eNMmLvQjDIBHXwPmEqaVutQQDKTwEKsD',
      database: 'railway',
      ssl: { rejectUnauthorized: false }
    });

    // Récupérer les tâches avec les utilisateurs
    const [tasks] = await connection.execute(`
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
      LIMIT 5
    `);

    log(`📋 ${tasks.length} tâches récupérées:`, 'blue');
    tasks.forEach(task => {
      log(`  - ${task.title} (${task.status}) - Assigné à: ${task.assigned_to_name || 'N/A'}`, 'blue');
    });

    await connection.end();
    log('✅ Test du système de tâches réussi!', 'green');
    return true;

  } catch (error) {
    log(`❌ Erreur du système de tâches: ${error.message}`, 'red');
    return false;
  }
}

async function testDocumentsSystem() {
  log(`\n${colors.cyan}📄 Test du système de documents${colors.reset}`);
  log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);

  try {
    const connection = await mysql.createConnection({
      host: 'centerbeam.proxy.rlwy.net',
      port: 26824,
      user: 'root',
      password: 'eNMmLvQjDIBHXwPmEqaVutQQDKTwEKsD',
      database: 'railway',
      ssl: { rejectUnauthorized: false }
    });

    // Récupérer les documents avec les utilisateurs
    const [documents] = await connection.execute(`
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
      LIMIT 5
    `);

    log(`📄 ${documents.length} documents récupérés:`, 'blue');
    documents.forEach(doc => {
      log(`  - ${doc.title} (${doc.category}) - ${doc.status} - Par: ${doc.uploaded_by_name || 'N/A'}`, 'blue');
    });

    await connection.end();
    log('✅ Test du système de documents réussi!', 'green');
    return true;

  } catch (error) {
    log(`❌ Erreur du système de documents: ${error.message}`, 'red');
    return false;
  }
}

async function runAllTests() {
  log(`${colors.bright}${colors.magenta}🚀 TESTS COMPLETS DU SYSTÈME PRODUCTION${colors.reset}`);
  log(`${colors.blue}Test de toutes les fonctionnalités avec la base de données Railway${colors.reset}`);

  const results = {
    database: await testDatabaseConnection(),
    authentication: await testAuthentication(),
    userManagement: await testUserManagement(),
    tasksSystem: await testTasksSystem(),
    documentsSystem: await testDocumentsSystem()
  };

  log(`\n${colors.bright}${colors.blue}📊 RÉSULTATS DES TESTS${colors.reset}`);
  log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);
  
  Object.entries(results).forEach(([test, result]) => {
    const status = result ? '✅' : '❌';
    const color = result ? 'green' : 'red';
    log(`${status} ${test}: ${result ? 'SUCCÈS' : 'ÉCHEC'}`, color);
  });

  const successCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;
  
  log(`\n${colors.bright}${successCount === totalCount ? colors.green : colors.yellow}🎯 ${successCount}/${totalCount} tests réussis${colors.reset}`);
  
  if (successCount === totalCount) {
    log(`${colors.green}🎉 Tous les tests sont passés avec succès!${colors.reset}`);
  } else {
    log(`${colors.yellow}⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.${colors.reset}`);
  }
}

// Gestion des erreurs
process.on('unhandledRejection', (error) => {
  log(`💥 Erreur non gérée: ${error.message}`, 'red');
  process.exit(1);
});

// Exécution des tests
if (require.main === module) {
  runAllTests().catch(error => {
    log(`💥 Erreur lors de l'exécution des tests: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { runAllTests };
