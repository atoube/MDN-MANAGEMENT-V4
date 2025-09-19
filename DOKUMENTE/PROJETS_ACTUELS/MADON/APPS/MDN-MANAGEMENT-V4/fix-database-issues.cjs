#!/usr/bin/env node

/**
 * Script pour corriger les problèmes de base de données identifiés
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
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

async function fixDatabaseIssues() {
  log(`${colors.bright}${colors.magenta}🔧 CORRECTION DES PROBLÈMES DE BASE DE DONNÉES${colors.reset}`);
  log(`${colors.blue}${'='.repeat(60)}${colors.reset}`);

  let connection;
  
  try {
    // Connexion à la base de données
    connection = await mysql.createConnection({
      host: 'centerbeam.proxy.rlwy.net',
      port: 26824,
      user: 'root',
      password: 'eNMmLvQjDIBHXwPmEqaVutQQDKTwEKsD',
      database: 'railway',
      ssl: { rejectUnauthorized: false }
    });

    log('✅ Connexion à la base de données établie', 'green');

    // 1. Ajouter la colonne must_change_password si elle n'existe pas
    log(`\n${colors.cyan}1. Vérification de la colonne must_change_password${colors.reset}`);
    
    try {
      await connection.execute(`
        ALTER TABLE users 
        ADD COLUMN must_change_password BOOLEAN DEFAULT FALSE
      `);
      log('✅ Colonne must_change_password ajoutée', 'green');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        log('ℹ️  Colonne must_change_password existe déjà', 'blue');
      } else {
        throw error;
      }
    }

    // 2. Corriger le mot de passe de l'administrateur
    log(`\n${colors.cyan}2. Correction du mot de passe administrateur${colors.reset}`);
    
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const [updateResult] = await connection.execute(
      'UPDATE users SET password = ?, must_change_password = FALSE WHERE email = ?',
      [hashedPassword, 'admin@madon.com']
    );

    if (updateResult.affectedRows > 0) {
      log('✅ Mot de passe administrateur mis à jour avec bcrypt', 'green');
    } else {
      log('⚠️  Aucun utilisateur admin trouvé', 'yellow');
    }

    // 3. Vérifier et corriger les autres utilisateurs admin
    log(`\n${colors.cyan}3. Vérification des autres utilisateurs admin${colors.reset}`);
    
    const [adminUsers] = await connection.execute(
      'SELECT id, email, first_name, last_name, password FROM users WHERE role = "admin"'
    );

    for (const user of adminUsers) {
      if (!user.password.startsWith('$2b$')) {
        const hashedPwd = await bcrypt.hash('admin123', 10);
        await connection.execute(
          'UPDATE users SET password = ? WHERE id = ?',
          [hashedPwd, user.id]
        );
        log(`✅ Mot de passe hashé pour ${user.first_name} ${user.last_name}`, 'green');
      }
    }

    // 4. Créer quelques documents de test
    log(`\n${colors.cyan}4. Création de documents de test${colors.reset}`);
    
    const [adminUser] = await connection.execute(
      'SELECT id FROM users WHERE email = "admin@madon.com" LIMIT 1'
    );

    if (adminUser.length > 0) {
      const adminId = adminUser[0].id;
      
      const testDocuments = [
        {
          title: 'Guide d\'utilisation',
          description: 'Guide complet pour les utilisateurs de l\'application',
          category: 'Documentation',
          file_type: 'pdf',
          file_path: '/documents/guide-utilisation.pdf',
          file_size: 1024000,
          status: 'published',
          uploaded_by: adminId
        },
        {
          title: 'Politique de sécurité',
          description: 'Politique de sécurité de l\'entreprise',
          category: 'RH',
          file_type: 'docx',
          file_path: '/documents/politique-securite.docx',
          file_size: 512000,
          status: 'published',
          uploaded_by: adminId
        },
        {
          title: 'Procédure de congés',
          description: 'Procédure pour demander des congés',
          category: 'RH',
          file_type: 'pdf',
          file_path: '/documents/procedure-conges.pdf',
          file_size: 256000,
          status: 'draft',
          uploaded_by: adminId
        }
      ];

      for (const doc of testDocuments) {
        try {
          await connection.execute(`
            INSERT INTO documents (title, description, category, file_type, file_path, file_size, status, uploaded_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [doc.title, doc.description, doc.category, doc.file_type, doc.file_path, doc.file_size, doc.status, doc.uploaded_by]);
          
          log(`✅ Document créé: ${doc.title}`, 'green');
        } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            log(`ℹ️  Document existe déjà: ${doc.title}`, 'blue');
          } else {
            log(`❌ Erreur création document ${doc.title}: ${error.message}`, 'red');
          }
        }
      }
    }

    // 5. Vérification finale
    log(`\n${colors.cyan}5. Vérification finale${colors.reset}`);
    
    const [finalUsers] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const [finalTasks] = await connection.execute('SELECT COUNT(*) as count FROM tasks');
    const [finalDocs] = await connection.execute('SELECT COUNT(*) as count FROM documents');
    
    log(`📊 Utilisateurs: ${finalUsers[0].count}`, 'blue');
    log(`📊 Tâches: ${finalTasks[0].count}`, 'blue');
    log(`📊 Documents: ${finalDocs[0].count}`, 'blue');

    // Test de connexion admin
    const [testAdmin] = await connection.execute(
      'SELECT id, email, first_name, last_name, password FROM users WHERE email = ?',
      ['admin@madon.com']
    );

    if (testAdmin.length > 0) {
      const user = testAdmin[0];
      const isPasswordValid = await bcrypt.compare('admin123', user.password);
      
      if (isPasswordValid) {
        log('✅ Test de connexion admin réussi', 'green');
      } else {
        log('❌ Test de connexion admin échoué', 'red');
      }
    }

    log(`\n${colors.bright}${colors.green}🎉 CORRECTION TERMINÉE AVEC SUCCÈS!${colors.reset}`);

  } catch (error) {
    log(`❌ Erreur lors de la correction: ${error.message}`, 'red');
    log(`❌ Code: ${error.code}`, 'red');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Gestion des erreurs
process.on('unhandledRejection', (error) => {
  log(`💥 Erreur non gérée: ${error.message}`, 'red');
  process.exit(1);
});

// Exécution
if (require.main === module) {
  fixDatabaseIssues().catch(error => {
    log(`💥 Erreur lors de l'exécution: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { fixDatabaseIssues };
