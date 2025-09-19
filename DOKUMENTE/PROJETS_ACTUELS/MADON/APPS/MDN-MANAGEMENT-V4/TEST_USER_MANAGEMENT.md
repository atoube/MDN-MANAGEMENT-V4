# 🧪 Test du Système de Gestion des Utilisateurs

## ✅ Tests à Effectuer

### 1. **Connexion Administrateur**
- **URL** : http://localhost:5174/auth
- **Email** : `admin@madon.cm`
- **Mot de passe** : `Start01!`
- **Résultat attendu** : Connexion réussie, accès à l'application

### 2. **Accès à la Gestion des Utilisateurs**
- **URL** : http://localhost:5174/user-management
- **Prérequis** : Être connecté en tant qu'admin
- **Résultat attendu** : Page visible avec liste des utilisateurs

### 3. **Création d'un Nouvel Utilisateur**
- **Action** : Cliquer sur "Nouvel Utilisateur"
- **Données de test** :
  - Email : `test@madon.cm`
  - Nom : `Utilisateur Test`
  - Rôle : `employee`
  - Mot de passe : `TempPass123!`
- **Résultat attendu** : Utilisateur créé avec succès

### 4. **Test de Connexion du Nouvel Utilisateur**
- **Action** : Se déconnecter et se reconnecter
- **Email** : `test@madon.cm`
- **Mot de passe** : `TempPass123!`
- **Résultat attendu** : Modal de changement de mot de passe obligatoire

### 5. **Changement de Mot de Passe Obligatoire**
- **Action** : Changer le mot de passe dans la modal
- **Nouveau mot de passe** : `NewPass123!`
- **Résultat attendu** : Mot de passe changé, accès à l'application

### 6. **Test de Connexion avec Nouveau Mot de Passe**
- **Action** : Se déconnecter et se reconnecter
- **Email** : `test@madon.cm`
- **Mot de passe** : `NewPass123!`
- **Résultat attendu** : Connexion directe sans modal

## 🔧 Tests de l'API (Optionnel)

### Test des Endpoints
```bash
# Test de l'API (si le serveur est démarré)
curl -X GET http://localhost:3001/api/users
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@madon.cm","password":"Start01!"}'
```

## 📋 Checklist de Validation

- [ ] ✅ Connexion admin fonctionne
- [ ] ✅ Page de gestion des utilisateurs accessible
- [ ] ✅ Création d'utilisateur fonctionne
- [ ] ✅ Changement de mot de passe obligatoire
- [ ] ✅ Validation des critères de mot de passe
- [ ] ✅ Connexion avec nouveau mot de passe
- [ ] ✅ Interface responsive
- [ ] ✅ Messages d'erreur appropriés
- [ ] ✅ Permissions admin respectées

## 🎯 Résultat Attendu

Le système doit permettre :
1. **Admin** : Créer et gérer les utilisateurs
2. **Nouveaux utilisateurs** : Changer obligatoirement leur mot de passe
3. **Sécurité** : Validation stricte des mots de passe
4. **UX** : Interface intuitive et messages clairs

## 🚀 Prêt pour la Production

Si tous les tests passent, le système est prêt pour le déploiement en production !
