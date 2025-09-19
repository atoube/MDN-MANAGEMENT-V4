#!/bin/bash

echo "🚀 FORCE DÉPLOIEMENT DES FONCTIONS NETLIFY"
echo "=========================================="

# Vérifier si Netlify CLI est installé
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI n'est pas installé"
    echo "Installez-le avec: npm install -g netlify-cli"
    exit 1
fi

echo "🔐 Vérification de la connexion Netlify..."
if ! netlify status &> /dev/null; then
    echo "❌ Non connecté à Netlify"
    echo "Connectez-vous avec: netlify login"
    exit 1
fi

echo "✅ Connexion Netlify OK"

echo "📁 Vérification du dossier des fonctions..."
if [ ! -d "netlify/functions" ]; then
    echo "❌ Dossier netlify/functions non trouvé"
    exit 1
fi

echo "📋 Fonctions trouvées:"
ls -la netlify/functions/ | grep "\.js$"

echo ""
echo "🔧 Création d'un fichier temporaire pour forcer le déploiement..."
# Créer un fichier temporaire pour forcer le déploiement
touch netlify/functions/.deploy-trigger

echo "🚀 Déploiement forcé avec cache vidé..."

# Déployer avec cache vidé et forcer le déploiement des fonctions
netlify deploy --prod --dir=dist --functions=netlify/functions --skip-functions-cache --force

if [ $? -eq 0 ]; then
    echo "✅ Déploiement forcé terminé!"
    
    # Supprimer le fichier temporaire
    rm -f netlify/functions/.deploy-trigger
    
    echo ""
    echo "⏳ Attendez 60 secondes pour que les fonctions soient disponibles..."
    sleep 60
    
    echo "🧪 Test des fonctions..."
    echo "Test d'authentification..."
    curl -X POST "https://management.themadon.com/.netlify/functions/auth-login" \
      -H "Content-Type: application/json" \
      -d '{"email":"admin@madon.com","password":"admin123"}' \
      --max-time 10
    
    echo ""
    echo "✅ Fonctions déployées!"
    echo "🌐 Testez votre application: https://management.themadon.com"
else
    echo "❌ Échec du déploiement forcé"
    exit 1
fi
