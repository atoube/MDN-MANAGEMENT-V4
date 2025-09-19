# 🔧 GUIDE DE DÉPANNAGE - FONCTIONS NETLIFY

## ❌ **PROBLÈME IDENTIFIÉ**

Les fonctions Netlify ne sont **pas déployées** et retournent des erreurs 404. C'est pourquoi l'application affiche :
- `Erreur fetchTasks: Error: Erreur lors de la récupération des tâches`
- `Uncaught SyntaxError: Unexpected identifier 'test'`

---

## 🎯 **SOLUTION IMMÉDIATE**

### 1️⃣ **Déployer les fonctions uniquement**
```bash
./deploy-functions-only.sh
```

### 2️⃣ **Alternative manuelle**
```bash
netlify deploy --prod --dir=dist --functions=netlify/functions --skip-functions-cache
```

---

## 🔍 **DIAGNOSTIC DÉTAILLÉ**

### ❌ **Symptômes observés**
- ✅ Site web accessible : https://management.themadon.com
- ❌ Fonctions retournent 404 : `/.netlify/functions/*`
- ❌ Application ne peut pas récupérer les données
- ❌ Erreurs JavaScript dans la console

### 🔍 **Cause du problème**
- Les fonctions Netlify n'ont pas été déployées lors du déploiement initial
- Le plugin Next.js a causé des conflits
- Les fonctions sont présentes localement mais pas sur Netlify

---

## 🚀 **ÉTAPES DE RÉSOLUTION**

### **ÉTAPE 1 : Déployer les fonctions**
```bash
# Exécuter le script de déploiement des fonctions
./deploy-functions-only.sh
```

### **ÉTAPE 2 : Vérifier le déploiement**
1. Allez sur : https://app.netlify.com
2. Sélectionnez votre projet : `madonmanagement`
3. Cliquez sur **"Functions"** dans le menu de gauche
4. Vous devriez voir vos 6 fonctions :
   - `auth-login.js`
   - `users.js`
   - `tasks.js`
   - `documents.js`
   - `change-password.js`
   - `test-railway.js`

### **ÉTAPE 3 : Configurer les variables d'environnement**
1. Dans Netlify Dashboard, allez dans **"Site settings"**
2. Cliquez sur **"Environment variables"**
3. Ajoutez les variables :

| Variable | Valeur |
|----------|--------|
| `RAILWAY_DB_HOST` | `centerbeam.proxy.rlwy.net` |
| `RAILWAY_DB_PORT` | `26824` |
| `RAILWAY_DB_USER` | `root` |
| `RAILWAY_DB_PASSWORD` | `eNMmLvQjDIBHXwPmEqaVutQQDKTwEKsD` |
| `RAILWAY_DB_NAME` | `railway` |
| `RAILWAY_DB_SSL` | `false` |

### **ÉTAPE 4 : Tester les fonctions**
```bash
# Tester les fonctions déployées
node test-functions-production.cjs
```

---

## 🧪 **TESTS DE VALIDATION**

### 1️⃣ **Test d'authentification**
```bash
curl -X POST "https://management.themadon.com/.netlify/functions/auth-login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@madon.com","password":"admin123"}'
```

**Résultat attendu :**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "admin@madon.com",
    "first_name": "Administrateur",
    "last_name": "Principal",
    "role": "admin"
  },
  "token": "jwt-token-1"
}
```

### 2️⃣ **Test des tâches**
```bash
curl -X GET "https://management.themadon.com/.netlify/functions/tasks"
```

### 3️⃣ **Test de l'interface web**
1. Allez sur : https://management.themadon.com
2. Connectez-vous avec : `admin@madon.com` / `admin123`
3. Vérifiez que les tâches se chargent correctement

---

## 🆘 **RÉSOLUTION DE PROBLÈMES**

### ❌ **Fonctions toujours en 404**
**Solution :**
1. Vérifiez que le dossier `netlify/functions` contient bien les fichiers
2. Redéployez avec : `netlify deploy --prod --dir=dist --functions=netlify/functions`
3. Attendez 2-3 minutes après le déploiement

### ❌ **Erreurs de base de données**
**Solution :**
1. Vérifiez que les variables d'environnement sont configurées
2. Testez la connexion avec : `node test-railway-connection.cjs`
3. Vérifiez que la base de données Railway est accessible

### ❌ **Erreurs JavaScript persistantes**
**Solution :**
1. Videz le cache du navigateur (Ctrl+F5)
2. Vérifiez que les fonctions sont déployées
3. Consultez la console du navigateur pour d'autres erreurs

---

## 📊 **VÉRIFICATION FINALE**

### ✅ **Checklist de validation**
- [ ] Fonctions Netlify déployées et visibles dans le dashboard
- [ ] Variables d'environnement configurées
- [ ] Test d'authentification réussi
- [ ] Test des tâches réussi
- [ ] Interface web fonctionnelle
- [ ] Pas d'erreurs dans la console du navigateur

### 🎯 **URLs de test**
- **Site principal** : https://management.themadon.com
- **Authentification** : https://management.themadon.com/.netlify/functions/auth-login
- **Tâches** : https://management.themadon.com/.netlify/functions/tasks
- **Utilisateurs** : https://management.themadon.com/.netlify/functions/users

---

## 🎉 **RÉSULTAT ATTENDU**

Une fois les fonctions déployées et configurées :

1. ✅ **L'application se charge sans erreurs**
2. ✅ **L'authentification fonctionne**
3. ✅ **Les tâches se chargent correctement**
4. ✅ **Toutes les fonctionnalités sont opérationnelles**

---

**🚀 Exécutez `./deploy-functions-only.sh` pour résoudre le problème immédiatement !**
