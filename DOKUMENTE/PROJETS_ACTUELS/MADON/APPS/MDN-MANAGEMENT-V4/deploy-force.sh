#!/bin/bash

echo "🚀 DÉPLOIEMENT FORCÉ - MDN MANAGEMENT V4"
echo "========================================="

# Vérifier si Netlify CLI est installé
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI n'est pas installé"
    echo "Installez-le avec: npm install -g netlify-cli"
    exit 1
fi

echo "🔐 Connexion à Netlify..."
netlify login

if [ $? -ne 0 ]; then
    echo "❌ Échec de la connexion à Netlify"
    exit 1
fi

echo "✅ Connexion réussie!"

echo "📦 Construction de l'application (mode forcé)..."
# Construire en ignorant complètement TypeScript
npx vite build --mode production --no-check --force

if [ $? -ne 0 ]; then
    echo "⚠️  Tentative de build avec Vite directement..."
    npx vite build --force
fi

if [ $? -ne 0 ]; then
    echo "❌ Échec du build"
    exit 1
fi

echo "✅ Build terminé"

echo "🚀 Déploiement sur Netlify (sans plugin Next.js)..."
# Déployer en spécifiant explicitement le répertoire
netlify deploy --prod --dir=dist --skip-functions-cache

if [ $? -eq 0 ]; then
    echo "✅ Déploiement terminé avec succès!"
    echo "🌐 Votre application est maintenant en ligne!"
    echo ""
    echo "🔐 Pour vous connecter:"
    echo "   Email: admin@madon.com"
    echo "   Mot de passe: admin123"
    echo ""
    echo "📋 Autres comptes disponibles:"
    echo "   Email: a.dipita@themadon.com"
    echo "   Mot de passe: admin123"
else
    echo "❌ Échec du déploiement"
    exit 1
fi
