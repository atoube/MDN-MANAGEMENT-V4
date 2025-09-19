# 🚀 Fonctions Netlify - MDN Management V4

## 📋 Vue d'ensemble

Ce projet utilise des **Netlify Functions** pour fournir une API backend serverless. Toutes les fonctions sont déployées automatiquement avec l'application et sont accessibles via des endpoints REST.

## 🔧 Fonctions Disponibles

### 1. **Authentification** - `auth-login.js`
- **Endpoint**: `/.netlify/functions/auth-login`
- **Méthodes**: `POST`, `OPTIONS`
- **Fonctionnalités**:
  - Connexion utilisateur avec email/mot de passe
  - Support des mots de passe hashés (bcrypt) et en clair
  - Fallback vers authentification mockée en cas d'erreur DB
  - Gestion CORS complète

**Exemple d'utilisation**:
```javascript
const response = await fetch('/.netlify/functions/auth-login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@madon.com',
    password: 'admin123'
  })
});
```

### 2. **Gestion des Utilisateurs** - `users.js`
- **Endpoint**: `/.netlify/functions/users`
- **Méthodes**: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- **Fonctionnalités**:
  - CRUD complet pour les utilisateurs
  - Validation des données
  - Hachage automatique des mots de passe
  - Protection contre la suppression d'administrateurs
  - Fallback vers données mockées

**Exemples d'utilisation**:
```javascript
// Récupérer tous les utilisateurs
GET /.netlify/functions/users

// Créer un utilisateur
POST /.netlify/functions/users
{
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "employee",
  "password": "SecurePass123!"
}

// Mettre à jour un utilisateur
PUT /.netlify/functions/users/123
{
  "email": "newemail@example.com",
  "first_name": "Jane",
  "last_name": "Smith",
  "role": "manager"
}

// Supprimer un utilisateur
DELETE /.netlify/functions/users/123
```

### 3. **Gestion des Tâches** - `tasks.js`
- **Endpoint**: `/.netlify/functions/tasks`
- **Méthodes**: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- **Fonctionnalités**:
  - CRUD complet pour les tâches
  - Jointures avec les utilisateurs (assigné/créateur)
  - Gestion automatique des dates de completion
  - Support des priorités et statuts

**Exemples d'utilisation**:
```javascript
// Récupérer toutes les tâches
GET /.netlify/functions/tasks

// Créer une tâche
POST /.netlify/functions/tasks
{
  "title": "Nouvelle tâche",
  "description": "Description de la tâche",
  "assigned_to": 1,
  "created_by": 2,
  "priority": "high",
  "due_date": "2024-12-31"
}

// Marquer une tâche comme terminée
PUT /.netlify/functions/tasks/123
{
  "status": "completed"
}
```

### 4. **Gestion des Documents** - `documents.js`
- **Endpoint**: `/.netlify/functions/documents`
- **Méthodes**: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- **Fonctionnalités**:
  - CRUD complet pour les documents
  - Gestion des métadonnées (taille, type, catégorie)
  - Statuts de publication (draft, published)
  - Jointures avec les utilisateurs

**Exemples d'utilisation**:
```javascript
// Récupérer tous les documents
GET /.netlify/functions/documents

// Créer un document
POST /.netlify/functions/documents
{
  "title": "Guide utilisateur",
  "description": "Guide complet d'utilisation",
  "category": "Documentation",
  "file_type": "pdf",
  "uploaded_by": 1
}
```

### 5. **Changement de Mot de Passe** - `change-password.js`
- **Endpoint**: `/.netlify/functions/change-password`
- **Méthodes**: `PUT`, `OPTIONS`
- **Fonctionnalités**:
  - Validation stricte des critères de sécurité
  - Vérification du mot de passe actuel
  - Hachage automatique du nouveau mot de passe
  - Mise à jour du flag `must_change_password`

**Exemple d'utilisation**:
```javascript
PUT /.netlify/functions/change-password
{
  "userId": 123,
  "currentPassword": "OldPass123!",
  "newPassword": "NewSecurePass456!"
}
```

## 🗄️ Base de Données

### Configuration
- **Provider**: Railway MySQL
- **Connexion**: Variables d'environnement Netlify
- **Fallback**: Données mockées en cas d'erreur

### Variables d'environnement requises:
```bash
RAILWAY_DB_HOST=centerbeam.proxy.rlwy.net
RAILWAY_DB_PORT=26824
RAILWAY_DB_USER=root
RAILWAY_DB_PASSWORD=eNMmLvQjDIBHXwPmEqaVutQQDKTwEKsD
RAILWAY_DB_NAME=railway
RAILWAY_DB_SSL=false
```

## 🧪 Tests

### Test en Local
```bash
# Démarrer Netlify Dev
netlify dev

# Dans un autre terminal, tester les fonctions
TEST_LOCAL=true node test-netlify-functions.js
```

### Test des Fonctions Déployées
```bash
# Tester toutes les fonctions
node test-netlify-functions.js

# Tester une fonction spécifique
curl -X POST https://your-site.netlify.app/.netlify/functions/auth-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@madon.com","password":"admin123"}'
```

## 🚀 Déploiement

### Déploiement Automatique
```bash
# Déploiement en preview
./deploy-netlify.sh

# Déploiement en production
./deploy-netlify.sh --prod

# Déploiement avec tests
./deploy-netlify.sh --test
```

### Déploiement Manuel
```bash
# Build et déploiement
npm run build
netlify deploy

# Déploiement en production
netlify deploy --prod
```

## 📊 Monitoring

### Logs des Fonctions
```bash
# Voir les logs en temps réel
netlify logs

# Voir les logs d'une fonction spécifique
netlify logs --function auth-login
```

### Métriques
- Accédez au dashboard Netlify pour voir:
  - Nombre d'invocations
  - Temps de réponse
  - Taux d'erreur
  - Utilisation de la bande passante

## 🔒 Sécurité

### Bonnes Pratiques Implémentées
- ✅ Validation des entrées
- ✅ Hachage des mots de passe (bcrypt)
- ✅ Gestion CORS appropriée
- ✅ Gestion d'erreurs robuste
- ✅ Fallback vers données mockées
- ✅ Protection contre les injections SQL (requêtes préparées)

### Recommandations
- 🔐 Utiliser HTTPS en production
- 🔐 Implémenter l'authentification JWT
- 🔐 Ajouter la limitation de taux (rate limiting)
- 🔐 Valider les permissions utilisateur

## 🛠️ Développement

### Structure des Fonctions
```
netlify/functions/
├── auth-login.js          # Authentification
├── users.js               # Gestion utilisateurs
├── tasks.js               # Gestion tâches
├── documents.js           # Gestion documents
├── change-password.js     # Changement mot de passe
├── test-auth-frontend.js  # Test frontend
└── auth-login-debug.js    # Debug authentification
```

### Ajouter une Nouvelle Fonction
1. Créer le fichier dans `netlify/functions/`
2. Exporter une fonction `handler`
3. Gérer les méthodes HTTP appropriées
4. Ajouter la gestion CORS
5. Tester avec `netlify dev`
6. Ajouter des tests dans `test-netlify-functions.js`

## 📚 Ressources

- [Documentation Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Guide de déploiement Netlify](https://docs.netlify.com/site-deploys/overview/)
- [Variables d'environnement Netlify](https://docs.netlify.com/environment-variables/overview/)
