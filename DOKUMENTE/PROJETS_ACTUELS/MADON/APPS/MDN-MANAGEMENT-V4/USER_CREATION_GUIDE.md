# 🔧 Guide de Résolution - Création d'Utilisateurs

## ❌ Problème Identifié

**Erreur** : `net::ERR_CONNECTION_REFUSED` sur `:3001/api/users`

**Cause** : Le serveur API n'était pas démarré sur le port 3001.

## ✅ Solution

### **1. Démarrer le Serveur API**

```bash
# Option 1: Script automatique (recommandé)
./start-dev.sh

# Option 2: Manuel
cd server
npm start
# Dans un autre terminal
npm run dev
```

### **2. Vérifier que l'API Fonctionne**

```bash
# Test de l'API
curl http://localhost:3001/api/users
```

**Résultat attendu** : Liste des utilisateurs en JSON

### **3. Tester la Création d'Utilisateur**

```bash
# Test de création via API
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@madon.cm","name":"Utilisateur Test","role":"employee","password":"TempPass123!"}'
```

**Résultat attendu** : `{"id":8,"message":"Utilisateur créé avec succès","must_change_password":true}`

## 🎯 Test Complet

### **1. Accès à la Gestion des Utilisateurs**
- **URL** : http://localhost:5174/user-management
- **Prérequis** : Être connecté en tant qu'admin (`admin@madon.cm` / `Start01!`)

### **2. Création d'Utilisateur**
- **Action** : Cliquer sur "Nouvel Utilisateur"
- **Données** :
  - Email : `nouveau@madon.cm`
  - Nom : `Nouvel Utilisateur`
  - Rôle : `employee`
  - Mot de passe : `TempPass123!`
- **Résultat** : Utilisateur créé avec succès

### **3. Test de Connexion**
- **Email** : `nouveau@madon.cm`
- **Mot de passe** : `TempPass123!`
- **Résultat** : Modal de changement de mot de passe obligatoire

## 🔍 Diagnostic

### **Vérifications à Effectuer**

1. **Serveur API** :
   ```bash
   curl http://localhost:3001/api/users
   ```

2. **Base de données** :
   ```bash
   mysql -u root MDN_SUITE -e "SELECT * FROM users;"
   ```

3. **Logs du serveur** :
   - Vérifier la console du serveur API pour les erreurs

### **Messages d'Erreur Courants**

- `net::ERR_CONNECTION_REFUSED` → Serveur API non démarré
- `Erreur API, utilisation des données mockées` → Fallback activé
- `Un utilisateur avec cet email existe déjà` → Email déjà utilisé

## 🚀 Environnement de Développement

### **Script de Démarrage Automatique**

```bash
# Démarre API + Frontend automatiquement
./start-dev.sh
```

### **Ports Utilisés**

- **Frontend** : http://localhost:5174
- **API** : http://localhost:3001
- **Base de données** : localhost:3306

### **Comptes de Test Disponibles**

- **Admin** : `admin@madon.cm` / `Start01!`
- **HR** : `hr@madon.com` / `Start01!`
- **Employé** : `test@madon.cm` / `TempPass123!`

## ✅ Résultat

Une fois le serveur API démarré, la création d'utilisateurs fonctionne parfaitement avec :

- ✅ **Interface utilisateur** fonctionnelle
- ✅ **API backend** opérationnelle
- ✅ **Base de données** connectée
- ✅ **Changement de mot de passe** obligatoire
- ✅ **Validation** des données

**Le système de gestion des utilisateurs est maintenant 100% fonctionnel !** 🎉
