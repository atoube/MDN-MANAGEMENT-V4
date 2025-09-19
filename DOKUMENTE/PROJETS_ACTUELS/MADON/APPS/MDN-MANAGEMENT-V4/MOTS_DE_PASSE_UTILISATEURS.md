# 🔐 MOTS DE PASSE DES UTILISATEURS - MDN Management V4

## 👑 ADMINISTRATEURS

### 🔑 **Administrateur Principal**
- **Email**: `admin@madon.com`
- **Mot de passe**: `admin123`
- **Rôle**: `admin`
- **Statut**: ✅ **ACTIF** (mot de passe hashé avec bcrypt)

### 🔑 **Administrateur Achille**
- **Email**: `a.dipita@themadon.com`
- **Mot de passe**: `admin123`
- **Rôle**: `admin`
- **Statut**: ✅ **ACTIF** (mot de passe hashé avec bcrypt)

---

## 👥 UTILISATEURS STANDARD

### 📋 **Utilisateurs avec mots de passe en clair** (17 utilisateurs)

| # | Nom | Email | Mot de passe | Rôle |
|---|-----|-------|--------------|------|
| 1 | Responsable Livraisons | `delivery@madon.com` | `password123` | `user` |
| 2 | Manager RH | `hr@madon.com` | `password123` | `user` |
| 3 | Gestionnaire Stock | `stock@madon.com` | `password123` | `user` |
| 4 | Responsable Marketing | `marketing@madon.com` | `password123` | `user` |
| 5 | Jean Baptiste | `jean.baptiste@madon.cm` | `password123` | `user` |
| 6 | Marie Dupont | `marie.dupont@madon.cm` | `password123` | `user` |
| 7 | Fatou Ndiaye | `fatou.ndiaye@madon.cm` | `password123` | `user` |
| 8 | Kouassi Mensah | `kouassi.mensah@madon.cm` | `password123` | `user` |
| 9 | Moussa Traoré | `moussa.traore@madon.cm` | `password123` | `user` |
| 10 | Aissatou Diallo | `aissatou.diallo@madon.cm` | `password123` | `user` |
| 11 | Ibrahim Sarr | `ibrahim.sarr@madon.cm` | `password123` | `user` |
| 12 | Aminata Keita | `aminata.keita@madon.cm` | `password123` | `user` |
| 13 | Ousmane Diop | `ousmane.diop@madon.cm` | `password123` | `user` |
| 14 | Khadija Ba | `khadija.ba@madon.cm` | `password123` | `user` |
| 15 | Modou Fall | `modou.fall@madon.cm` | `password123` | `user` |
| 16 | Fatima Sow | `fatima.sow@madon.cm` | `password123` | `user` |
| 17 | Cheikh Ndiaye | `cheikh.ndiaye@madon.cm` | `password123` | `user` |

---

## 🛡️ SÉCURITÉ

### ✅ **Mots de passe sécurisés**
- **Administrateurs**: Mots de passe hashés avec bcrypt (salt rounds: 10)
- **Utilisateurs standard**: Mots de passe en clair (à hasher en production)

### 🔄 **Recommandations de sécurité**
1. **Hasher tous les mots de passe** avec bcrypt avant la mise en production
2. **Changer les mots de passe par défaut** après le premier login
3. **Implémenter une politique de mots de passe** plus stricte
4. **Ajouter l'authentification à deux facteurs** pour les administrateurs

---

## 🚀 ACCÈS À L'APPLICATION

### 🌐 **URL de production**
- **Site**: `https://votre-site.netlify.app`
- **API**: `https://votre-site.netlify.app/.netlify/functions/`

### 🔐 **Connexion recommandée**
1. **Utilisez l'administrateur principal** pour les tests initiaux
2. **Email**: `admin@madon.com`
3. **Mot de passe**: `admin123`

---

## 📊 STATISTIQUES

- **Total utilisateurs**: 19
- **Administrateurs**: 2
- **Utilisateurs standard**: 17
- **Mots de passe hashés**: 2
- **Mots de passe en clair**: 17

---

**⚠️ IMPORTANT**: Ces mots de passe sont pour l'environnement de test. Changez-les avant la mise en production !

**Date de génération**: 18 Septembre 2024  
**Version**: MDN Management V4.0.0
