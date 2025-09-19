#!/usr/bin/env node

/**
 * Script de test direct des fonctions Netlify
 * Teste les fonctions directement sans serveur
 */

const path = require('path');

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

async function testFunction(functionName, tests) {
  log(`\n${colors.cyan}🧪 Test de la fonction: ${functionName}${colors.reset}`);
  log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);

  try {
    // Charger la fonction
    const functionPath = path.join(__dirname, 'netlify', 'functions', `${functionName}.js`);
    const handler = require(functionPath);

    for (const test of tests) {
      try {
        log(`\n📋 ${test.name}...`);
        
        // Créer l'événement mock
        const event = {
          httpMethod: test.options.method || 'GET',
          body: test.options.body ? JSON.stringify(test.options.body) : null,
          headers: test.options.headers || {},
          path: test.path || '/'
        };

        const context = {};
        
        // Exécuter la fonction
        const response = await handler.handler(event, context);
        
        if (response.statusCode === test.expectedStatus) {
          log(`✅ ${test.name} - SUCCÈS (${response.statusCode})`, 'green');
          if (test.expectedData) {
            // Vérifier les données attendues
            const responseData = JSON.parse(response.body);
            const hasExpectedData = Object.keys(test.expectedData).every(
              key => responseData[key] === test.expectedData[key]
            );
            if (hasExpectedData) {
              log(`   📊 Données correctes`, 'green');
            } else {
              log(`   ⚠️  Données partiellement correctes`, 'yellow');
            }
          }
          if (test.showResponse) {
            log(`   📄 Réponse: ${response.body}`, 'blue');
          }
        } else {
          log(`❌ ${test.name} - ÉCHEC (${response.statusCode} au lieu de ${test.expectedStatus})`, 'red');
          log(`   📄 Réponse: ${response.body}`, 'yellow');
        }
      } catch (error) {
        log(`💥 ${test.name} - ERREUR: ${error.message}`, 'red');
      }
    }
  } catch (error) {
    log(`💥 Erreur lors du chargement de la fonction ${functionName}: ${error.message}`, 'red');
  }
}

async function runAllTests() {
  log(`${colors.bright}${colors.magenta}🚀 TESTS DIRECTS DES FONCTIONS NETLIFY${colors.reset}`);
  log(`${colors.blue}Test des fonctions sans serveur${colors.reset}`);

  // Test de la fonction d'authentification
  await testFunction('auth-login', [
    {
      name: 'Test OPTIONS (CORS)',
      options: { method: 'OPTIONS' },
      expectedStatus: 200
    },
    {
      name: 'Test connexion admin (succès)',
      options: {
        method: 'POST',
        body: {
          email: 'admin@madon.com',
          password: 'admin123'
        }
      },
      expectedStatus: 200,
      expectedData: { success: true },
      showResponse: true
    },
    {
      name: 'Test connexion invalide',
      options: {
        method: 'POST',
        body: {
          email: 'invalid@test.com',
          password: 'wrongpassword'
        }
      },
      expectedStatus: 401
    }
  ]);

  // Test de la fonction utilisateurs
  await testFunction('users', [
    {
      name: 'Test OPTIONS (CORS)',
      options: { method: 'OPTIONS' },
      expectedStatus: 200
    },
    {
      name: 'Test récupération des utilisateurs',
      options: { method: 'GET' },
      expectedStatus: 200,
      showResponse: true
    }
  ]);

  // Test de la fonction tâches
  await testFunction('tasks', [
    {
      name: 'Test OPTIONS (CORS)',
      options: { method: 'OPTIONS' },
      expectedStatus: 200
    },
    {
      name: 'Test récupération des tâches',
      options: { method: 'GET' },
      expectedStatus: 200,
      showResponse: true
    }
  ]);

  // Test de la fonction documents
  await testFunction('documents', [
    {
      name: 'Test OPTIONS (CORS)',
      options: { method: 'OPTIONS' },
      expectedStatus: 200
    },
    {
      name: 'Test récupération des documents',
      options: { method: 'GET' },
      expectedStatus: 200,
      showResponse: true
    }
  ]);

  // Test de la fonction test-railway
  await testFunction('test-railway', [
    {
      name: 'Test connexion Railway',
      options: { method: 'GET' },
      expectedStatus: 200,
      showResponse: true
    }
  ]);

  log(`\n${colors.bright}${colors.green}✅ TOUS LES TESTS TERMINÉS${colors.reset}`);
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

module.exports = { testFunction };
