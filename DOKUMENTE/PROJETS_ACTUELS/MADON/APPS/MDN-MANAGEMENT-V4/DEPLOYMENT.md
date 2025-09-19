# 🚀 Guide de Déploiement - MADON Management Suite

## 📋 Prérequis

- Node.js 18+ installé
- Base de données MySQL/MariaDB accessible
- Serveur web (Apache, Nginx, etc.)

## 🔧 Configuration de Production

### 1. Base de Données
- **Hôte**: db5017958553.hosting-data.io
- **Port**: 3306
- **Utilisateur**: dbu1050870
- **Mot de passe**: mdn_suite_001
- **Base de données**: MDN_SUITE

### 2. Variables d'Environnement
```bash
NODE_ENV=production
DB_HOST=db5017958553.hosting-data.io
DB_PORT=3306
DB_USER=dbu1050870
DB_PASSWORD=mdn_suite_001
DB_NAME=MDN_SUITE
```

## 🚀 Déploiement

### Option 1: Script Automatique
```bash
./deploy.sh
```

### Option 2: Déploiement Manuel
```bash
# 1. Installer les dépendances du frontend
npm install

# 2. Construire l'application frontend
npm run build

# 3. Installer les dépendances du serveur API
cd server
npm install
cd ..

# 4. Copier les fichiers vers votre serveur
```

### Option 3: Déploiement avec API intégrée
```bash
# 1. Construire l'application
./deploy.sh

# 2. Démarrer le serveur API
./start-api.sh
```

## 📁 Structure de Déploiement

```
dist/
├── index.html          # Point d'entrée
├── assets/             # Fichiers CSS, JS, images
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── ...
```

## 🌐 Configuration du Serveur Web

### Apache (.htaccess)
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Nginx
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## 🔍 Vérification Post-Déploiement

1. ✅ L'application se charge correctement
2. ✅ La connexion à la base de données fonctionne
3. ✅ Les tâches s'affichent (8 tâches existantes)
4. ✅ La navigation fonctionne (MADON → /, Tableau de bord → /dashboard)
5. ✅ L'authentification fonctionne

## 🐛 Dépannage

### Problème de Connexion à la Base de Données
- Vérifiez les paramètres de connexion
- Assurez-vous que le serveur de base de données est accessible
- Vérifiez les permissions utilisateur

### Problème de Navigation
- Vérifiez la configuration du serveur web pour les routes SPA
- Assurez-vous que toutes les routes pointent vers index.html

### Problème d'Affichage des Tâches
- Vérifiez la connexion à la base de données
- Vérifiez que la table 'tasks' contient des données
- Consultez les logs de la console pour les erreurs

## 📞 Support

En cas de problème, vérifiez :
1. Les logs de la console du navigateur
2. Les logs du serveur web
3. La connectivité à la base de données
4. La configuration des variables d'environnement
