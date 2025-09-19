#!/bin/bash

# Script pour démarrer le serveur API
echo "🚀 Démarrage du serveur API MADON Management Suite..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -d "server" ]; then
    echo "❌ Erreur: Dossier 'server' non trouvé. Assurez-vous d'être dans le répertoire du projet."
    exit 1
fi

# Aller dans le dossier server
cd server

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances du serveur API..."
    npm install
fi

# Démarrer le serveur
echo "🔌 Démarrage du serveur API sur le port 3001..."
echo "📊 Connexion à la base de données: localhost:3306/MDN_SUITE"
echo ""
echo "✅ Serveur API démarré !"
echo "🌐 API disponible sur: http://localhost:3001"
echo "📋 Endpoints disponibles:"
echo "   - GET /api/tasks - Récupérer les tâches"
echo "   - POST /api/tasks - Créer une tâche"
echo "   - PUT /api/tasks/:id/status - Mettre à jour le statut"
echo "   - GET /api/employees - Récupérer les employés"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"

# Démarrer le serveur
npm start
