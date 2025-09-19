const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Configuration de la base de données Railway
const dbConfig = {
  host: 'centerbeam.proxy.rlwy.net',
  port: 26824,
  user: 'root',
  password: 'eNMmLvQjDIBHXwPmEqaVutQQDKTwEKsD',
  database: 'railway',
  ssl: { rejectUnauthorized: false }
};

// Liste des utilisateurs à ajouter
const usersToAdd = [
  {
    email: 'admin@madon.com',
    first_name: 'Admin',
    last_name: 'MADON',
    role: 'admin',
    password: 'admin123'
  },
  {
    email: 'manager@madon.com',
    first_name: 'Manager',
    last_name: 'MADON',
    role: 'manager',
    password: 'manager123'
  },
  {
    email: 'user@madon.com',
    first_name: 'User',
    last_name: 'MADON',
    role: 'user',
    password: 'user123'
  },
  {
    email: 'hr@madon.com',
    first_name: 'HR',
    last_name: 'MADON',
    role: 'hr',
    password: 'hr123'
  }
];

async function addUsers() {
  let connection;
  
  try {
    console.log('🔌 Connexion à la base de données Railway...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connexion établie');

    // Vérifier si la table users existe
    const [tables] = await connection.execute("SHOW TABLES LIKE 'users'");
    
    if (tables.length === 0) {
      console.log('📋 Création de la table users...');
      await connection.execute(`
        CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          role ENUM('admin', 'manager', 'user', 'hr') NOT NULL DEFAULT 'user',
          password_hash VARCHAR(255) NOT NULL,
          must_change_password BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Table users créée');
    }

    console.log('👥 Ajout des utilisateurs...');
    
    for (const user of usersToAdd) {
      try {
        // Vérifier si l'utilisateur existe déjà
        const [existing] = await connection.execute(
          'SELECT id FROM users WHERE email = ?',
          [user.email]
        );

        if (existing.length > 0) {
          console.log(`⚠️  Utilisateur ${user.email} existe déjà, mise à jour...`);
          
          // Hasher le mot de passe
          const passwordHash = await bcrypt.hash(user.password, 10);
          
          // Mettre à jour l'utilisateur existant
          await connection.execute(`
            UPDATE users 
            SET first_name = ?, last_name = ?, role = ?, password_hash = ?, updated_at = CURRENT_TIMESTAMP
            WHERE email = ?
          `, [user.first_name, user.last_name, user.role, passwordHash, user.email]);
          
          console.log(`✅ Utilisateur ${user.email} mis à jour`);
        } else {
          // Hasher le mot de passe
          const passwordHash = await bcrypt.hash(user.password, 10);
          
          // Insérer le nouvel utilisateur
          await connection.execute(`
            INSERT INTO users (email, first_name, last_name, role, password_hash)
            VALUES (?, ?, ?, ?, ?)
          `, [user.email, user.first_name, user.last_name, user.role, passwordHash]);
          
          console.log(`✅ Utilisateur ${user.email} ajouté`);
        }
      } catch (error) {
        console.error(`❌ Erreur lors de l'ajout de ${user.email}:`, error.message);
      }
    }

    // Afficher tous les utilisateurs
    console.log('\n📋 Liste des utilisateurs dans la base de données:');
    const [allUsers] = await connection.execute(`
      SELECT id, email, first_name, last_name, role, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);
    
    allUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.first_name} ${user.last_name}) - ${user.role}`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connexion fermée');
    }
  }
}

// Exécuter le script
addUsers().then(() => {
  console.log('\n🎉 Script terminé !');
  process.exit(0);
}).catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});