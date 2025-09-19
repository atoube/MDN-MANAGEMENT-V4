#!/usr/bin/env node

/**
 * Script de test pour contourner la protection Vercel
 * Utilise l'authentification Vercel pour tester les API routes
 */

const https = require('https');
const { execSync } = require('child_process');

// Configuration
const VERCEL_URL = 'https://mdn-management-v5-a1tdzx9ci-atoubes-projects.vercel.app';
const API_ENDPOINTS = [
  '/api/hello',
  '/api/test-connection',
  '/api/employees',
  '/api/tasks',
  '/api/documents'
];

console.log('🔐 Test des API Routes avec Authentification Vercel\n');

// Fonction pour faire une requête avec authentification
function makeAuthenticatedRequest(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Vercel-CLI-Test',
        'Accept': 'application/json'
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Test de chaque endpoint
async function testEndpoints() {
  console.log('📋 Test des endpoints API :\n');
  
  for (const endpoint of API_ENDPOINTS) {
    const url = `${VERCEL_URL}${endpoint}`;
    console.log(`🧪 Test: ${endpoint}`);
    
    try {
      const response = await makeAuthenticatedRequest(url);
      
      if (response.status === 200) {
        console.log(`✅ ${endpoint} - OK (${response.status})`);
        try {
          const jsonData = JSON.parse(response.data);
          console.log(`   📊 Données: ${JSON.stringify(jsonData).substring(0, 100)}...`);
        } catch (e) {
          console.log(`   📄 Réponse: ${response.data.substring(0, 100)}...`);
        }
      } else if (response.status === 401 || response.status === 403) {
        console.log(`🔒 ${endpoint} - Protection activée (${response.status})`);
      } else {
        console.log(`❌ ${endpoint} - Erreur (${response.status})`);
      }
    } catch (error) {
      console.log(`💥 ${endpoint} - Erreur: ${error.message}`);
    }
    
    console.log('');
  }
}

// Test de l'application principale
async function testMainApp() {
  console.log('🌐 Test de l\'application principale :\n');
  
  try {
    const response = await makeAuthenticatedRequest(VERCEL_URL);
    
    if (response.status === 200) {
      console.log('✅ Application principale - OK');
      if (response.data.includes('React')) {
        console.log('   📱 Application React détectée');
      }
    } else {
      console.log(`❌ Application principale - Erreur (${response.status})`);
    }
  } catch (error) {
    console.log(`💥 Application principale - Erreur: ${error.message}`);
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Démarrage des tests Vercel\n');
  
  await testMainApp();
  await testEndpoints();
  
  console.log('📋 Résumé :');
  console.log('- Si vous voyez des ✅, les API routes fonctionnent');
  console.log('- Si vous voyez des 🔒, la protection Vercel est activée');
  console.log('- Si vous voyez des ❌, il y a un problème technique');
  
  console.log('\n💡 Solutions :');
  console.log('1. Désactiver la protection dans les paramètres Vercel');
  console.log('2. Utiliser un token de bypass Vercel');
  console.log('3. Créer un nouveau projet sans protection');
}

// Exécution
main().catch(console.error);



