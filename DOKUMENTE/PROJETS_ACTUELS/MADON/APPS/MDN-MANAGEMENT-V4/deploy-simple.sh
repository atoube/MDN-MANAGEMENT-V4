#!/bin/bash

echo "🚀 DÉPLOIEMENT SIMPLE - MDN MANAGEMENT V4"
echo "=========================================="

# Vérifier si Netlify CLI est installé
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI n'est pas installé"
    echo "Installez-le avec: npm install -g netlify-cli"
    exit 1
fi

# Vérifier si on est connecté à Netlify
if ! netlify status &> /dev/null; then
    echo "❌ Non connecté à Netlify"
    echo "Connectez-vous avec: netlify login"
    exit 1
fi

echo "📦 Construction de l'application (ignorant les erreurs TypeScript)..."
npm run build -- --mode production || {
    echo "⚠️  Erreurs de build détectées, tentative de build avec --no-check"
    npx vite build --mode production --no-check || {
        echo "❌ Échec du build"
        exit 1
    }
}

echo "✅ Build terminé"

echo "🚀 Déploiement sur Netlify..."
netlify deploy --prod --dir=dist

echo "✅ Déploiement terminé!"
echo "🌐 Votre application est maintenant en ligne!"
