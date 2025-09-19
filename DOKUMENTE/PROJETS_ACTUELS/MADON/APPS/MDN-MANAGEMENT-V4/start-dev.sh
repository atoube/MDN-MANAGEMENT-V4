#!/bin/bash

# Script pour démarrer l'environnement de développement complet
echo "🚀 Démarrage de l'environnement de développement MADON Management Suite..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le répertoire du projet."
    exit 1
fi

# Démarrer le serveur API en arrière-plan
echo "🔌 Démarrage du serveur API..."
cd server
npm start &
API_PID=$!
cd ..

# Attendre que le serveur API démarre
echo "⏳ Attente du démarrage du serveur API..."
sleep 3

# Vérifier que l'API fonctionne
if curl -s http://localhost:3001/api/users > /dev/null; then
    echo "✅ Serveur API démarré avec succès sur le port 3001"
else
    echo "❌ Erreur: Impossible de se connecter au serveur API"
    kill $API_PID 2>/dev/null
    exit 1
fi

# Démarrer le frontend
echo "🌐 Démarrage du frontend..."
echo ""
echo "📋 Environnement de développement prêt !"
echo "🔌 API: http://localhost:3001"
echo "🌐 Frontend: http://localhost:5174"
echo ""
echo "📝 Comptes de test disponibles :"
echo "   - Admin: admin@madon.cm / Start01!"
echo "   - HR: hr@madon.com / Start01!"
echo "   - Employé: test@madon.cm / TempPass123!"
echo ""
echo "🛑 Pour arrêter: Ctrl+C (arrêtera les deux serveurs)"
echo ""

# Démarrer le frontend (cela bloquera le terminal)
npm run dev

# Nettoyage à la sortie
echo ""
echo "🛑 Arrêt des serveurs..."
kill $API_PID 2>/dev/null
echo "✅ Environnement arrêté"
