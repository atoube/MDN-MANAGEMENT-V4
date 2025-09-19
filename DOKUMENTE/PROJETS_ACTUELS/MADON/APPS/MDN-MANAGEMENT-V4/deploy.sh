#!/bin/bash

# Script de déploiement pour MADON Management Suite
echo "🚀 Déploiement de MADON Management Suite en production..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le répertoire du projet."
    exit 1
fi

# Installer les dépendances du frontend
echo "📦 Installation des dépendances du frontend..."
npm install

# Construire l'application frontend
echo "🔨 Construction de l'application frontend..."
npm run build

# Vérifier que le build a réussi
if [ ! -d "dist" ]; then
    echo "❌ Erreur: Le build a échoué. Le dossier 'dist' n'existe pas."
    exit 1
fi

# Installer les dépendances du serveur API
echo "📦 Installation des dépendances du serveur API..."
cd server
npm install
cd ..

echo "✅ Build réussi !"
echo "📁 Dossier de déploiement frontend: ./dist"
echo "📁 Serveur API: ./server"
echo ""
echo "📋 Instructions de déploiement:"
echo ""
echo "🔧 Option 1: Déploiement avec serveur API intégré"
echo "1. Copiez le dossier 'server' vers votre serveur"
echo "2. Copiez le contenu du dossier 'dist' dans server/public"
echo "3. Configurez les variables d'environnement:"
echo "   - DB_HOST=db5017958553.hosting-data.io"
echo "   - DB_USER=dbu1050870"
echo "   - DB_PASSWORD=mdn_suite_001"
echo "   - DB_NAME=MDN_SUITE"
echo "   - NODE_ENV=production"
echo "4. Démarrez le serveur: cd server && npm start"
echo ""
echo "🌐 Option 2: Déploiement séparé"
echo "1. Copiez le contenu du dossier 'dist' vers votre serveur web"
echo "2. Déployez le serveur API séparément sur un autre port"
echo "3. Configurez votre serveur web pour servir les fichiers statiques"
echo "4. Assurez-vous que la base de données de production est accessible"
echo ""
echo "🗄️ Base de données: db5017958553.hosting-data.io"
echo "📊 Base: MDN_SUITE"
echo "🔌 API: http://localhost:3001 (ou votre domaine)"
