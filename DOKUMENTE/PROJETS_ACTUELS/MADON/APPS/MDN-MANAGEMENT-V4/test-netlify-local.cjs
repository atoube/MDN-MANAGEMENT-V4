#!/usr/bin/env node

/**
 * Script de test local pour les fonctions Netlify
 * Teste les fonctions en local avec Netlify Dev
 */

const http = require('http');

// Configuration
const LOCAL_URL = 'http://localhost:8888';

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
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = http.request(url, requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function testFunction(functionName, tests) {
  log(`\n${colors.cyan}🧪 Test de la fonction: ${functionName}${colors.reset}`);
  log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);

  const functionUrl = `${LOCAL_URL}/.netlify/functions/${functionName}`;

  for (const test of tests) {
    try {
      log(`\n📋 ${test.name}...`);
      
      const response = await makeRequest(functionUrl, test.options);
      
      if (response.statusCode === test.expectedStatus) {
        log(`✅ ${test.name} - SUCCÈS (${response.statusCode})`, 'green');
        if (test.expectedData) {
          // Vérifier les données attendues
          const hasExpectedData = Object.keys(test.expectedData).every(
            key => response.data[key] === test.expectedData[key]
          );
          if (hasExpectedData) {
            log(`   📊 Données correctes`, 'green');
          } else {
            log(`   ⚠️  Données partiellement correctes`, 'yellow');
          }
        }
        if (test.showResponse) {
          log(`   📄 Réponse: ${JSON.stringify(response.data, null, 2)}`, 'blue');
        }
      } else {
        log(`❌ ${test.name} - ÉCHEC (${response.statusCode} au lieu de ${test.expectedStatus})`, 'red');
        log(`   📄 Réponse: ${JSON.stringify(response.data, null, 2)}`, 'yellow');
      }
    } catch (error) {
      log(`💥 ${test.name} - ERREUR: ${error.message}`, 'red');
    }
  }
}

async function runAllTests() {
  log(`${colors.bright}${colors.magenta}🚀 TESTS LOCAUX NETLIFY FUNCTIONS${colors.reset}`);
  log(`${colors.blue}URL de base: ${LOCAL_URL}${colors.reset}`);
  log(`${colors.yellow}Assurez-vous que Netlify Dev est démarré (netlify dev)${colors.reset}`);

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
  log(`${colors.blue}Pour démarrer Netlify Dev: netlify dev${colors.reset}`);
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

module.exports = { testFunction, makeRequest };
