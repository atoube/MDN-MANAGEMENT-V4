#!/bin/bash

# Script de déploiement Netlify pour MDN Management V4
# Ce script construit l'application et déploie les fonctions Netlify

set -e  # Arrêter en cas d'erreur

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 DÉPLOIEMENT NETLIFY - MDN MANAGEMENT V4${NC}"
echo -e "${BLUE}==========================================${NC}"

# Vérifier que Netlify CLI est installé
if ! command -v netlify &> /dev/null; then
    echo -e "${RED}❌ Netlify CLI n'est pas installé${NC}"
    echo -e "${YELLOW}💡 Installez-le avec: npm install -g netlify-cli${NC}"
    exit 1
fi

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Ce script doit être exécuté depuis la racine du projet${NC}"
    exit 1
fi

# Étape 1: Nettoyer et installer les dépendances
echo -e "\n${YELLOW}📦 Installation des dépendances...${NC}"
npm ci

# Étape 2: Construire l'application
echo -e "\n${YELLOW}🔨 Construction de l'application...${NC}"
npm run build

# Vérifier que le build a réussi
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Le build a échoué - le dossier dist n'existe pas${NC}"
    exit 1
fi

# Étape 3: Vérifier les fonctions Netlify
echo -e "\n${YELLOW}🔍 Vérification des fonctions Netlify...${NC}"
if [ ! -d "netlify/functions" ]; then
    echo -e "${RED}❌ Le dossier netlify/functions n'existe pas${NC}"
    exit 1
fi

# Lister les fonctions disponibles
echo -e "${BLUE}📋 Fonctions Netlify disponibles:${NC}"
ls -la netlify/functions/ | grep -E '\.(js)$' | while read line; do
    echo -e "  ${GREEN}✓${NC} $(echo $line | awk '{print $9}')"
done

# Étape 4: Tester les fonctions en local (optionnel)
if [ "$1" = "--test" ]; then
    echo -e "\n${YELLOW}🧪 Test des fonctions en local...${NC}"
    
    # Démarrer Netlify Dev en arrière-plan
    echo -e "${BLUE}🔄 Démarrage de Netlify Dev...${NC}"
    netlify dev &
    NETLIFY_PID=$!
    
    # Attendre que le serveur démarre
    sleep 10
    
    # Exécuter les tests
    echo -e "${BLUE}🧪 Exécution des tests...${NC}"
    TEST_LOCAL=true node test-netlify-functions.js
    
    # Arrêter Netlify Dev
    kill $NETLIFY_PID 2>/dev/null || true
    echo -e "${GREEN}✅ Tests terminés${NC}"
fi

# Étape 5: Déploiement
echo -e "\n${YELLOW}🚀 Déploiement sur Netlify...${NC}"

# Vérifier si nous sommes connectés à Netlify
if ! netlify status &> /dev/null; then
    echo -e "${YELLOW}🔐 Connexion à Netlify requise...${NC}"
    netlify login
fi

# Déployer
if [ "$1" = "--prod" ]; then
    echo -e "${BLUE}🌐 Déploiement en production...${NC}"
    netlify deploy --prod
else
    echo -e "${BLUE}🧪 Déploiement en preview...${NC}"
    netlify deploy
fi

# Étape 6: Afficher les informations de déploiement
echo -e "\n${GREEN}✅ Déploiement terminé avec succès!${NC}"
echo -e "${BLUE}📊 Informations de déploiement:${NC}"
netlify status

# Étape 7: Tester les fonctions déployées (optionnel)
if [ "$1" = "--test-prod" ]; then
    echo -e "\n${YELLOW}🧪 Test des fonctions déployées...${NC}"
    node test-netlify-functions.js
fi

echo -e "\n${GREEN}🎉 Déploiement Netlify terminé!${NC}"
echo -e "${BLUE}💡 Commandes utiles:${NC}"
echo -e "  ${YELLOW}netlify status${NC} - Voir le statut du déploiement"
echo -e "  ${YELLOW}netlify logs${NC} - Voir les logs des fonctions"
echo -e "  ${YELLOW}netlify functions:list${NC} - Lister les fonctions déployées"
echo -e "  ${YELLOW}netlify open${NC} - Ouvrir le site déployé"
