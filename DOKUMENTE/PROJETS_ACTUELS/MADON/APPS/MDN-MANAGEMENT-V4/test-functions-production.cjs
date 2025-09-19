#!/usr/bin/env node

/**
 * Test des fonctions Netlify en production
 */

const https = require('https');

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

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testProductionFunctions() {
  log(`${colors.bright}${colors.magenta}🧪 TEST DES FONCTIONS NETLIFY EN PRODUCTION${colors.reset}`);
  log(`${colors.blue}${'='.repeat(60)}${colors.reset}`);

  const baseUrl = 'https://management.themadon.com/.netlify/functions';
  const results = {};

  // Test 1: Authentification
  log(`\n${colors.cyan}1. Test d'authentification${colors.reset}`);
  try {
    const authResult = await makeRequest(`${baseUrl}/auth-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@madon.com',
        password: 'admin123'
      })
    });

    if (authResult.status === 200 && authResult.data.success) {
      log(`✅ Authentification réussie pour ${authResult.data.user.first_name} ${authResult.data.user.last_name}`, 'green');
      results.auth = true;
    } else {
      log(`❌ Échec de l'authentification: ${JSON.stringify(authResult.data)}`, 'red');
      results.auth = false;
    }
  } catch (error) {
    log(`❌ Erreur d'authentification: ${error.message}`, 'red');
    results.auth = false;
  }

  // Test 2: Utilisateurs
  log(`\n${colors.cyan}2. Test de récupération des utilisateurs${colors.reset}`);
  try {
    const usersResult = await makeRequest(`${baseUrl}/users`);
    
    if (usersResult.status === 200 && Array.isArray(usersResult.data)) {
      log(`✅ ${usersResult.data.length} utilisateurs récupérés`, 'green');
      results.users = true;
    } else {
      log(`❌ Échec de récupération des utilisateurs: ${JSON.stringify(usersResult.data)}`, 'red');
      results.users = false;
    }
  } catch (error) {
    log(`❌ Erreur utilisateurs: ${error.message}`, 'red');
    results.users = false;
  }

  // Test 3: Tâches
  log(`\n${colors.cyan}3. Test de récupération des tâches${colors.reset}`);
  try {
    const tasksResult = await makeRequest(`${baseUrl}/tasks`);
    
    if (tasksResult.status === 200 && Array.isArray(tasksResult.data)) {
      log(`✅ ${tasksResult.data.length} tâches récupérées`, 'green');
      results.tasks = true;
    } else {
      log(`❌ Échec de récupération des tâches: ${JSON.stringify(tasksResult.data)}`, 'red');
      results.tasks = false;
    }
  } catch (error) {
    log(`❌ Erreur tâches: ${error.message}`, 'red');
    results.tasks = false;
  }

  // Test 4: Documents
  log(`\n${colors.cyan}4. Test de récupération des documents${colors.reset}`);
  try {
    const docsResult = await makeRequest(`${baseUrl}/documents`);
    
    if (docsResult.status === 200 && Array.isArray(docsResult.data)) {
      log(`✅ ${docsResult.data.length} documents récupérés`, 'green');
      results.documents = true;
    } else {
      log(`❌ Échec de récupération des documents: ${JSON.stringify(docsResult.data)}`, 'red');
      results.documents = false;
    }
  } catch (error) {
    log(`❌ Erreur documents: ${error.message}`, 'red');
    results.documents = false;
  }

  // Test 5: Test de connexion DB
  log(`\n${colors.cyan}5. Test de connexion à la base de données${colors.reset}`);
  try {
    const dbResult = await makeRequest(`${baseUrl}/test-railway`);
    
    if (dbResult.status === 200 && dbResult.data.success) {
      log(`✅ Connexion à la base de données réussie`, 'green');
      results.database = true;
    } else {
      log(`❌ Échec de connexion à la base de données: ${JSON.stringify(dbResult.data)}`, 'red');
      results.database = false;
    }
  } catch (error) {
    log(`❌ Erreur base de données: ${error.message}`, 'red');
    results.database = false;
  }

  // Résumé final
  log(`\n${colors.bright}${colors.blue}📊 RÉSUMÉ DES TESTS${colors.reset}`);
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
    log(`${colors.green}🎉 TOUTES LES FONCTIONS SONT OPÉRATIONNELLES!${colors.reset}`);
    log(`${colors.blue}✅ Votre application est prête pour la production${colors.reset}`);
  } else {
    log(`${colors.yellow}⚠️  Certaines fonctions nécessitent une attention${colors.reset}`);
    log(`${colors.blue}📋 Consultez le guide de finalisation pour résoudre les problèmes${colors.reset}`);
  }

  // Instructions
  log(`\n${colors.cyan}📋 INSTRUCTIONS${colors.reset}`);
  log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);
  log(`🌐 Site web: https://management.themadon.com`, 'blue');
  log(`🔐 Connexion: admin@madon.com / admin123`, 'blue');
  log(`📖 Guide: GUIDE_FINALISATION_DEPLOIEMENT.md`, 'blue');
}

// Gestion des erreurs
process.on('unhandledRejection', (error) => {
  log(`💥 Erreur non gérée: ${error.message}`, 'red');
  process.exit(1);
});

// Exécution
if (require.main === module) {
  testProductionFunctions().catch(error => {
    log(`💥 Erreur lors de l'exécution: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { testProductionFunctions };
