const mysql = require('mysql2/promise');

// Configuration de la base de données
const dbConfig = {
  host: 'db5017958553.hosting-data.io',
  port: 3306,
  user: 'dbu1050870',
  password: 'mdn_suite_001',
  database: 'MDN_SUITE',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

async function testConnection() {
  let connection;
  
  try {
    console.log('🔌 Test de connexion à la base de données MariaDB...');
    
    // Créer une connexion
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connexion établie avec succès !');
    
    // Tester une requête simple
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Requête de test réussie:', rows);
    
    // Vérifier si la base de données existe
    const [databases] = await connection.execute('SHOW DATABASES');
    console.log('📋 Bases de données disponibles:');
    databases.forEach(db => {
      console.log(`  - ${db.Database}`);
    });
    
    // Vérifier si la base MDN_SUITE existe
    const mdnSuiteExists = databases.some(db => db.Database === 'MDN_SUITE');
    
    if (mdnSuiteExists) {
      console.log('✅ Base de données MDN_SUITE trouvée !');
      
      // Utiliser la base de données
      await connection.execute('USE MDN_SUITE');
      
      // Vérifier les tables existantes
      const [tables] = await connection.execute('SHOW TABLES');
      console.log('📋 Tables existantes:');
      tables.forEach(table => {
        console.log(`  - ${Object.values(table)[0]}`);
      });
      
      // Tester une requête sur la table users si elle existe
      const usersTableExists = tables.some(table => 
        Object.values(table)[0] === 'users'
      );
      
      if (usersTableExists) {
        const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
        console.log(`👥 Nombre d'utilisateurs: ${users[0].count}`);
        
        // Afficher les utilisateurs
        const [userList] = await connection.execute('SELECT id, email, name, role FROM users LIMIT 5');
        console.log('👤 Utilisateurs:');
        userList.forEach(user => {
          console.log(`  - ${user.email} (${user.name}) - ${user.role}`);
        });
      } else {
        console.log('⚠️  Table users non trouvée');
      }
      
    } else {
      console.log('⚠️  Base de données MDN_SUITE non trouvée');
      console.log('💡 Vous devez exécuter le script database-init.sql pour créer la base de données');
    }
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('🔐 Erreur d\'authentification - Vérifiez le nom d\'utilisateur et le mot de passe');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🌐 Erreur de connexion - Vérifiez l\'hôte et le port');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('🗄️  Base de données non trouvée - Vérifiez le nom de la base de données');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connexion fermée');
    }
  }
}

// Exécuter le test
testConnection();
