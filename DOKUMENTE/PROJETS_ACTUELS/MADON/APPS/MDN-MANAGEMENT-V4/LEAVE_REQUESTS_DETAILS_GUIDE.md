# 📋 Guide d'Utilisation - Détails des Demandes de Congés

## 🎯 Fonctionnalité Implémentée

L'administrateur et le responsable RH peuvent maintenant **voir les détails complets des demandes de congés** avec les **documents uploadés par l'employé**.

## ✨ Nouvelles Fonctionnalités

### **1. Bouton "Voir détails"**
- **Localisation** : Dans le tableau des demandes de congés
- **Action** : Cliquer sur "Voir détails" pour ouvrir le modal complet
- **Disponible pour** : Toutes les demandes (en attente, approuvées, rejetées)

### **2. Modal de Détails Complets**
Le modal affiche :

#### **📊 Informations de l'Employé**
- Nom complet
- Email
- Département
- Poste

#### **📅 Détails de la Demande**
- Type de congé (avec libellé traduit)
- Nombre de jours
- Date de début et fin
- Date de demande
- Dernière mise à jour
- Motif détaillé
- Raison du rejet (si applicable)

#### **📎 Documents Joints**
- **Liste des documents** uploadés par l'employé
- **Icônes par type** de fichier (PDF, images, Word, etc.)
- **Boutons d'action** :
  - 👁️ **Voir** : Aperçu du document
  - ⬇️ **Télécharger** : Téléchargement du fichier

#### **⚡ Actions d'Approbation (Admin/RH uniquement)**
- **Approuver** : Validation directe de la demande
- **Rejeter** : Rejet avec motif obligatoire
- **Interface intuitive** avec formulaires intégrés

## 🔐 Permissions et Sécurité

### **Accès aux Détails**
- ✅ **Tous les utilisateurs** : Peuvent voir les détails de base
- ✅ **Admin/RH** : Accès complet + actions d'approbation

### **Actions d'Approbation**
- 🔒 **Restreint aux rôles** : `admin` et `hr`
- 🔒 **Validation côté client** : Vérification des permissions
- 🔒 **Interface conditionnelle** : Boutons masqués si non autorisé

## 📱 Interface Utilisateur

### **Design Responsive**
- **Desktop** : Modal large avec colonnes
- **Mobile** : Adaptation automatique
- **Accessibilité** : Support clavier et lecteurs d'écran

### **Expérience Utilisateur**
- **Navigation fluide** : Ouverture/fermeture rapide
- **Feedback visuel** : Animations et transitions
- **Messages clairs** : Confirmations et erreurs
- **Design cohérent** : Respect du thème de l'application

## 🧪 Données de Test

### **Demandes Exemple**
1. **Fatou Ndiaye** - Congés payés (En attente)
   - Documents : `billet_avion.pdf`, `reservation_hotel.pdf`
   - Motif : "Vacances familiales - Voyage au Sénégal"

2. **Arantes Mbinda** - Congés maladie (Approuvée)
   - Documents : `certificat_medical.pdf`, `ordonnance_medecin.pdf`
   - Motif : "Consultation médicale et examens de routine"

3. **Marie Kouam** - Congés maladie (En attente)
   - Documents : `arret_travail.pdf`, `certificat_medical.pdf`, `ordonnance_medicaments.pdf`
   - Motif : "Grippe et fièvre - Repos médical prescrit"

4. **Jean Baptiste** - Congés exceptionnels (Rejetée)
   - Documents : `invitation_mariage.pdf`, `programme_ceremonie.pdf`
   - Motif : "Mariage de ma sœur - Cérémonie familiale importante"
   - Raison du rejet : "Période de forte activité - Demande reportée au mois prochain"

## 🚀 Comment Utiliser

### **1. Accéder aux Demandes**
```
URL : http://localhost:5174/employees
Navigation : Employés → Demandes de congés
```

### **2. Voir les Détails**
1. **Cliquer** sur "Voir détails" dans le tableau
2. **Consulter** les informations complètes
3. **Examiner** les documents joints
4. **Fermer** le modal

### **3. Approuver/Rejeter (Admin/RH)**
1. **Ouvrir** les détails d'une demande en attente
2. **Choisir** l'action :
   - **Approuver** : Clic direct
   - **Rejeter** : Saisir le motif obligatoire
3. **Confirmer** l'action
4. **Vérifier** la mise à jour du statut

## 🔧 Configuration Technique

### **Composants Créés**
- `LeaveRequestDetailsModal.tsx` : Modal principal
- `DocumentViewer` : Gestionnaire de documents
- Intégration dans `LeaveRequests.tsx`

### **Fonctionnalités Techniques**
- **TypeScript** : Typage strict des données
- **React Query** : Gestion du cache et des mises à jour
- **Sonner** : Notifications toast
- **Tailwind CSS** : Styling responsive
- **Date-fns** : Formatage des dates en français

### **Sécurité**
- **Validation des rôles** : Vérification côté client
- **Sanitisation** : Protection contre les injections
- **Permissions** : Contrôle d'accès granulaire

## ✅ Résultat Final

### **Fonctionnalités Opérationnelles**
- ✅ **Affichage des détails** complets des demandes
- ✅ **Gestion des documents** uploadés
- ✅ **Actions d'approbation** pour admin/RH
- ✅ **Interface responsive** et accessible
- ✅ **Permissions sécurisées** par rôle
- ✅ **Données de test** réalistes

### **Avantages pour les Utilisateurs**
- 🎯 **Visibilité complète** sur les demandes
- 📎 **Accès aux justificatifs** des employés
- ⚡ **Actions rapides** d'approbation/rejet
- 🔍 **Informations détaillées** pour la prise de décision
- 📱 **Interface moderne** et intuitive

**Le système de gestion des demandes de congés est maintenant complet et professionnel !** 🎉
