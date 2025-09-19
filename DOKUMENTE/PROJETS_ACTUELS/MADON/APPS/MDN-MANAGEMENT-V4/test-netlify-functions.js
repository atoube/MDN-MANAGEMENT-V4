#!/usr/bin/env node

/**
 * Script de test pour les fonctions Netlify
 * Teste toutes les fonctions API déployées sur Netlify
 */

const https = require('https');
const http = require('http');

// Configuration
const NETLIFY_SITE_URL = process.env.NETLIFY_SITE_URL || 'https://your-site.netlify.app';
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
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = client.request(url, requestOptions, (res) => {
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

  const baseUrl = process.env.TEST_LOCAL ? LOCAL_URL : NETLIFY_SITE_URL;
  const functionUrl = `${baseUrl}/.netlify/functions/${functionName}`;

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
  log(`${colors.bright}${colors.magenta}🚀 DÉBUT DES TESTS NETLIFY FUNCTIONS${colors.reset}`);
  log(`${colors.blue}URL de base: ${process.env.TEST_LOCAL ? LOCAL_URL : NETLIFY_SITE_URL}${colors.reset}`);

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
      expectedData: { success: true }
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
    },
    {
      name: 'Test données manquantes',
      options: {
        method: 'POST',
        body: {}
      },
      expectedStatus: 400
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
      expectedStatus: 200
    },
    {
      name: 'Test création d\'utilisateur',
      options: {
        method: 'POST',
        body: {
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          role: 'employee',
          password: 'TestPass123!'
        }
      },
      expectedStatus: 201,
      expectedData: { success: true }
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
      expectedStatus: 200
    },
    {
      name: 'Test création de tâche',
      options: {
        method: 'POST',
        body: {
          title: 'Test Task',
          description: 'Description de test',
          assigned_to: 1,
          created_by: 1,
          priority: 'medium'
        }
      },
      expectedStatus: 201,
      expectedData: { success: true }
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
      expectedStatus: 200
    },
    {
      name: 'Test création de document',
      options: {
        method: 'POST',
        body: {
          title: 'Test Document',
          description: 'Description de test',
          category: 'Test',
          uploaded_by: 1
        }
      },
      expectedStatus: 201,
      expectedData: { success: true }
    }
  ]);

  // Test de la fonction changement de mot de passe
  await testFunction('change-password', [
    {
      name: 'Test OPTIONS (CORS)',
      options: { method: 'OPTIONS' },
      expectedStatus: 200
    },
    {
      name: 'Test changement de mot de passe (données manquantes)',
      options: {
        method: 'PUT',
        body: {}
      },
      expectedStatus: 400
    }
  ]);

  log(`\n${colors.bright}${colors.green}✅ TOUS LES TESTS TERMINÉS${colors.reset}`);
  log(`${colors.blue}Pour tester en local, utilisez: TEST_LOCAL=true node test-netlify-functions.js${colors.reset}`);
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
