# Configuration de l'application MADON Management

## Configuration de la base de données

### Option 1 : Base de données MariaDB hébergée

L'application est configurée pour utiliser une base de données MariaDB hébergée :

- **Hôte :** db5017958553.hosting-data.io
- **Port :** 3306
- **Utilisateur :** dbu1050870
- **Mot de passe :** mdn_suite_001
- **Base de données :** MDN_SUITE

### Option 2 : Base de données locale pour le développement

Si la base de données hébergée n'est pas accessible, vous pouvez utiliser une base de données locale :

1. **Installer MySQL/MariaDB localement**
   ```bash
   # Sur macOS avec Homebrew
   brew install mysql
   
   # Sur Ubuntu/Debian
   sudo apt-get install mysql-server
   ```

2. **Créer la base de données**
   ```bash
   mysql -u root -p
   CREATE DATABASE MDN_SUITE;
   USE MDN_SUITE;
   ```

3. **Exécuter le script d'initialisation**
   ```bash
   mysql -u root -p MDN_SUITE < database-init.sql
   ```

### Option 3 : Mode développement avec données simulées

Si aucune base de données n'est disponible, l'application peut fonctionner en mode développement avec des données simulées.

## Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# Configuration de la base de données
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=MDN_SUITE

# Mode de développement
NODE_ENV=development
VITE_DEV_MODE=true

# Pour la base de données hébergée
# DB_HOST=db5017958553.hosting-data.io
# DB_USER=dbu1050870
# DB_PASSWORD=mdn_suite_001
```

## Installation et démarrage

### 1. Installer les dépendances
```bash
npm install
```

### 2. Tester la connexion à la base de données
```bash
node test-db-connection.cjs
```

### 3. Démarrer l'application
```bash
# Mode développement
npm run dev

# Mode production
npm run build
npm run preview
```

## Comptes de test

### Compte administrateur
- **Email :** admin@madon.com
- **Mot de passe :** 123456

### Compte RH
- **Email :** hr@madon.com
- **Mot de passe :** 123456

## Structure de la base de données

L'application utilise les tables suivantes :

- **users** - Utilisateurs du système
- **employees** - Employés de l'entreprise
- **absences** - Demandes de congés
- **modules** - Modules de l'application
- **tasks** - Tâches et projets
- **projects** - Projets
- **documents** - Gestion documentaire
- **transactions** - Transactions financières
- **invoices** - Factures
- **sellers** - Vendeurs
- **recipients** - Destinataires marketing
- **email_campaigns** - Campagnes email
- **social_media_stats** - Statistiques des réseaux sociaux

## Résolution des problèmes

### Erreur de connexion à la base de données

1. **Vérifier la connectivité réseau**
   ```bash
   ping db5017958553.hosting-data.io
   ```

2. **Vérifier les paramètres de connexion**
   - Hôte, port, nom d'utilisateur, mot de passe
   - Permissions de l'utilisateur

3. **Utiliser une base de données locale**
   - Installer MySQL/MariaDB localement
   - Créer la base de données MDN_SUITE
   - Exécuter le script d'initialisation

### Erreurs TypeScript

1. **Vérifier les types**
   ```bash
   npm run build
   ```

2. **Corriger les importations**
   ```bash
   node fix-imports.cjs
   ```

### Mode développement

Si la base de données n'est pas accessible, l'application peut fonctionner avec des données simulées pour le développement et les tests.

## Support

Pour toute question ou problème :
1. Consultez la documentation
2. Vérifiez les logs de la console
3. Testez la connexion à la base de données
4. Contactez l'équipe de développement
