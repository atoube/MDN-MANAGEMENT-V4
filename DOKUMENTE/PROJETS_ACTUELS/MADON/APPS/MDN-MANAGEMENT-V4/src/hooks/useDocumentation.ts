import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useEmployees } from './useEmployees';
import { useAuth } from '../contexts/AuthContext';
import {
  Document,
  Space,
  Folder,
  Comment,
  DocumentVersion,
  DocumentTemplate,
  SearchResult,
  DocumentAnalytics,
  Notification,
  WorkflowInstance
} from '../types/documentation';

export function useDocumentation() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  
  const { employees } = useEmployees();
  const { user } = useAuth();

  // Charger les données au montage
  useEffect(() => {
    loadData();
  }, []);

  // Fonction pour forcer la réinitialisation des données
  const resetToInitialData = () => {
    // Supprimer les données existantes du localStorage
    localStorage.removeItem('documents');
    localStorage.removeItem('documentation_spaces');
    localStorage.removeItem('documentation_folders');
    localStorage.removeItem('documentation_templates');
    
    // Recharger les données initiales
    loadData();
    
    toast.success('Données réinitialisées avec succès');
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Charger depuis localStorage ou utiliser les données mockées
      const savedDocuments = localStorage.getItem('documents');
      const savedSpaces = localStorage.getItem('documentation_spaces');
      const savedFolders = localStorage.getItem('documentation_folders');
      const savedTemplates = localStorage.getItem('documentation_templates');

      if (savedDocuments) {
        const parsedDocuments = JSON.parse(savedDocuments);
        // Nettoyer et valider les documents
        const cleanedDocuments = cleanAndValidateDocuments(parsedDocuments);
        setDocuments(cleanedDocuments);
        // Sauvegarder les documents nettoyés
        localStorage.setItem('documents', JSON.stringify(cleanedDocuments));
      } else {
        // Données initiales
        const initialDocuments = getInitialDocuments();
        setDocuments(initialDocuments);
        localStorage.setItem('documents', JSON.stringify(initialDocuments));
      }

      if (savedSpaces) {
        setSpaces(JSON.parse(savedSpaces));
      } else {
        const initialSpaces = getInitialSpaces();
        setSpaces(initialSpaces);
        localStorage.setItem('documentation_spaces', JSON.stringify(initialSpaces));
      }

      if (savedFolders) {
        setFolders(JSON.parse(savedFolders));
      } else {
        const initialFolders = getInitialFolders();
        setFolders(initialFolders);
        localStorage.setItem('documentation_folders', JSON.stringify(initialFolders));
      }

      if (savedTemplates) {
        setTemplates(JSON.parse(savedTemplates));
      } else {
        const initialTemplates = getInitialTemplates();
        setTemplates(initialTemplates);
        localStorage.setItem('documentation_templates', JSON.stringify(initialTemplates));
      }

    } catch (error) {
      console.error('Erreur lors du chargement de la documentation:', error);
      toast.error('Erreur lors du chargement de la documentation');
    } finally {
      setLoading(false);
    }
  };

  // Données initiales mockées
  const getInitialDocuments = (): Document[] => [
    {
      id: '1',
      title: 'Guide d\'utilisation de l\'application MDN',
      content: '<h1>Guide d\'utilisation</h1><p>Ce document décrit comment utiliser l\'application MDN Management...</p>',
      content_plain: 'Guide d\'utilisation Ce document décrit comment utiliser l\'application MDN Management',
      space_id: '1',
      folder_id: '1',
      author_id: 1,
      author_name: 'Ahmadou Bello',
      status: 'published',
      priority: 'medium',
      version: 1,
      tags: ['guide', 'utilisation', 'mdn'],
      category: 'Documentation',
      is_template: false,
      permissions: [
        { role: 'viewer', employee_id: 1, employee_name: 'Ahmadou Bello', granted_at: new Date().toISOString(), granted_by: 1 },
        { role: 'editor', employee_id: 2, employee_name: 'Fatou Ndiaye', granted_at: new Date().toISOString(), granted_by: 1 }
      ],
      collaborators: [1, 2],
      views_count: 15,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Procédure de gestion des employés',
      content: '<h1>Procédure de gestion des employés</h1><p>Ce document décrit les procédures...</p>',
      content_plain: 'Procédure de gestion des employés Ce document décrit les procédures',
      space_id: '2',
      author_id: 2,
      author_name: 'Fatou Ndiaye',
      status: 'published',
      priority: 'high',
      version: 1,
      tags: ['procédure', 'rh', 'employés'],
      category: 'Ressources Humaines',
      is_template: false,
      permissions: [
        { role: 'viewer', employee_id: 1, employee_name: 'Ahmadou Bello', granted_at: new Date().toISOString(), granted_by: 2 },
        { role: 'admin', employee_id: 2, employee_name: 'Fatou Ndiaye', granted_at: new Date().toISOString(), granted_by: 2 }
      ],
      collaborators: [1, 2],
      views_count: 8,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Template de Facturation',
      content: '<h1>Template de Facturation</h1><h2>Informations Client</h2><p><strong>Nom :</strong> [Nom du client]</p><p><strong>Adresse :</strong> [Adresse complète]</p><p><strong>Téléphone :</strong> [Téléphone]</p><p><strong>Email :</strong> [Email]</p><h2>Détails de la Facture</h2><p><strong>Numéro :</strong> [N° Facture]</p><p><strong>Date :</strong> [Date]</p><p><strong>Échéance :</strong> [Date d\'échéance]</p><h2>Articles</h2><table border="1"><tr><th>Description</th><th>Quantité</th><th>Prix unitaire</th><th>Total</th></tr><tr><td>[Description]</td><td>[Qty]</td><td>[Prix]</td><td>[Total]</td></tr></table><h2>Total</h2><p><strong>Sous-total :</strong> [Montant]</p><p><strong>TVA :</strong> [TVA]</p><p><strong>Total TTC :</strong> [Total TTC]</p>',
      content_plain: 'Template de Facturation Informations Client Nom Adresse Téléphone Email Détails de la Facture Numéro Date Échéance Articles Description Quantité Prix unitaire Total Total Sous-total TVA Total TTC',
      space_id: '3',
      author_id: 1,
      author_name: 'Ahmadou Bello',
      status: 'published',
      priority: 'medium',
      version: 1,
      tags: ['template', 'facturation', 'comptabilité'],
      category: 'Comptabilité',
      is_template: true,
      template_type: 'facturation',
      permissions: [
        { role: 'viewer', employee_id: 1, employee_name: 'Ahmadou Bello', granted_at: new Date().toISOString(), granted_by: 1 },
        { role: 'editor', employee_id: 2, employee_name: 'Fatou Ndiaye', granted_at: new Date().toISOString(), granted_by: 1 }
      ],
      collaborators: [1, 2],
      views_count: 12,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Protocole de Fin de Réunion',
      content: '<h1>Protocole de Fin de Réunion</h1><h2>Résumé des Décisions</h2><p><strong>Date de la réunion :</strong> [Date]</p><p><strong>Participants :</strong> [Liste des participants]</p><p><strong>Ordre du jour :</strong> [Points abordés]</p><h2>Décisions Prises</h2><ul><li>[Décision 1] - Responsable : [Nom] - Échéance : [Date]</li><li>[Décision 2] - Responsable : [Nom] - Échéance : [Date]</li></ul><h2>Actions à Suivre</h2><ul><li>[Action 1] - Assigné à : [Nom] - Deadline : [Date]</li><li>[Action 2] - Assigné à : [Nom] - Deadline : [Date]</li></ul><h2>Prochaine Réunion</h2><p><strong>Date :</strong> [Date]</p><p><strong>Ordre du jour prévisionnel :</strong> [Points à aborder]</p>',
      content_plain: 'Protocole de Fin de Réunion Résumé des Décisions Date de la réunion Participants Ordre du jour Décisions Prises Décision 1 Responsable Échéance Décision 2 Responsable Échéance Actions à Suivre Action 1 Assigné à Deadline Action 2 Assigné à Deadline Prochaine Réunion Date Ordre du jour prévisionnel',
      space_id: '1',
      author_id: 1,
      author_name: 'Ahmadou Bello',
      status: 'published',
      priority: 'high',
      version: 1,
      tags: ['template', 'réunion', 'protocole', 'gestion'],
      category: 'Gestion de Projet',
      is_template: true,
      template_type: 'réunion',
      permissions: [
        { role: 'viewer', employee_id: 1, employee_name: 'Ahmadou Bello', granted_at: new Date().toISOString(), granted_by: 1 },
        { role: 'editor', employee_id: 2, employee_name: 'Fatou Ndiaye', granted_at: new Date().toISOString(), granted_by: 1 }
      ],
      collaborators: [1, 2],
      views_count: 18,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString()
    },
    {
      id: '5',
      title: 'Template de Rapport Mensuel',
      content: '<h1>Rapport Mensuel - [Mois/Année]</h1><h2>Résumé Exécutif</h2><p>[Résumé en 2-3 phrases des réalisations principales du mois]</p><h2>Objectifs Atteints</h2><ul><li><strong>[Objectif 1]</strong> - Statut : [Atteint/Partiellement atteint/Non atteint]</li><li><strong>[Objectif 2]</strong> - Statut : [Atteint/Partiellement atteint/Non atteint]</li></ul><h2>Réalisations Principales</h2><h3>Projets</h3><ul><li>[Projet 1] - Avancement : [%] - Statut : [En cours/Terminé/En retard]</li><li>[Projet 2] - Avancement : [%] - Statut : [En cours/Terminé/En retard]</li></ul><h3>Opérations</h3><ul><li>[Opération 1] - Résultat : [Succès/Échec/Partiel]</li><li>[Opération 2] - Résultat : [Succès/Échec/Partiel]</li></ul><h2>Indicateurs de Performance</h2><table border="1"><tr><th>Indicateur</th><th>Objectif</th><th>Réalisé</th><th>Écart</th></tr><tr><td>[KPI 1]</td><td>[Valeur cible]</td><td>[Valeur réelle]</td><td>[Différence]</td></tr><tr><td>[KPI 2]</td><td>[Valeur cible]</td><td>[Valeur réelle]</td><td>[Différence]</td></tr></table><h2>Problèmes Rencontrés</h2><ul><li><strong>[Problème 1]</strong> - Impact : [Faible/Moyen/Élevé] - Solution : [Description]</li><li><strong>[Problème 2]</strong> - Impact : [Faible/Moyen/Élevé] - Solution : [Description]</li></ul><h2>Objectifs du Mois Prochain</h2><ul><li>[Objectif 1] - Priorité : [Haute/Moyenne/Basse]</li><li>[Objectif 2] - Priorité : [Haute/Moyenne/Basse]</li></ul><h2>Recommandations</h2><p>[Recommandations pour améliorer les performances]</p>',
      content_plain: 'Template de Rapport Mensuel Résumé Exécutif Objectifs Atteints Réalisations Principales Projets Opérations Indicateurs de Performance Problèmes Rencontrés Objectifs du Mois Prochain Recommandations',
      space_id: '1',
      author_id: 1,
      author_name: 'Ahmadou Bello',
      status: 'published',
      priority: 'high',
      version: 1,
      tags: ['template', 'rapport', 'mensuel', 'kpi', 'gestion'],
      category: 'Gestion de Projet',
      is_template: true,
      template_type: 'rapport',
      permissions: [
        { role: 'viewer', employee_id: 1, employee_name: 'Ahmadou Bello', granted_at: new Date().toISOString(), granted_by: 1 },
        { role: 'editor', employee_id: 2, employee_name: 'Fatou Ndiaye', granted_at: new Date().toISOString(), granted_by: 1 }
      ],
      collaborators: [1, 2],
      views_count: 25,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString()
    },
    {
      id: '6',
      title: 'Template de Demande de Congés',
      content: '<h1>Demande de Congés</h1><h2>Informations du Demandeur</h2><p><strong>Nom et Prénom :</strong> [Nom complet]</p><p><strong>Fonction :</strong> [Poste occupé]</p><p><strong>Département :</strong> [Département]</p><p><strong>Date de la demande :</strong> [Date]</p><h2>Détails de la Demande</h2><p><strong>Type de congés :</strong> [Congés payés/Congés sans solde/Congés maladie/Repos compensateur]</p><p><strong>Date de début :</strong> [Date]</p><p><strong>Date de fin :</strong> [Date]</p><p><strong>Nombre de jours :</strong> [Nombre]</p><p><strong>Motif :</strong> [Description du motif]</p><h2>Solde de Congés</h2><p><strong>Solde disponible :</strong> [Nombre de jours]</p><p><strong>Solde après congés :</strong> [Nombre de jours]</p><h2>Délégation</h2><p><strong>Personne qui remplace :</strong> [Nom]</p><p><strong>Contact d\'urgence :</strong> [Téléphone]</p><h2>Validation</h2><p><strong>Validé par :</strong> [Nom du responsable]</p><p><strong>Date de validation :</strong> [Date]</p><p><strong>Statut :</strong> [En attente/Validé/Refusé]</p><p><strong>Commentaires :</strong> [Remarques du responsable]</p>',
      content_plain: 'Demande de Congés Informations du Demandeur Nom et Prénom Fonction Département Date de la demande Détails de la Demande Type de congés Date de début Date de fin Nombre de jours Motif Solde de Congés Solde disponible Solde après congés Délégation Personne qui remplace Contact d urgence Validation Validé par Date de validation Statut Commentaires',
      space_id: '2',
      author_id: 1,
      author_name: 'Ahmadou Bello',
      status: 'published',
      priority: 'medium',
      version: 1,
      tags: ['template', 'congés', 'rh', 'demande'],
      category: 'Ressources Humaines',
      is_template: true,
      template_type: 'congés',
      permissions: [
        { role: 'viewer', employee_id: 1, employee_name: 'Ahmadou Bello', granted_at: new Date().toISOString(), granted_by: 1 },
        { role: 'editor', employee_id: 2, employee_name: 'Fatou Ndiaye', granted_at: new Date().toISOString(), granted_by: 1 }
      ],
      collaborators: [1, 2],
      views_count: 32,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString()
    },
    {
      id: '7',
      title: 'Template de Procédure Opérationnelle',
      content: '<h1>Procédure Opérationnelle : [Nom de la procédure]</h1><h2>Informations Générales</h2><p><strong>Code de la procédure :</strong> [PO-XXX]</p><p><strong>Version :</strong> [X.X]</p><p><strong>Date de création :</strong> [Date]</p><p><strong>Dernière révision :</strong> [Date]</p><p><strong>Responsable :</strong> [Nom]</p><p><strong>Approbateur :</strong> [Nom]</p><h2>Objectif</h2><p>[Description claire de l\'objectif de cette procédure]</p><h2>Champ d\'Application</h2><p>[Définir clairement le périmètre d\'application]</p><h2>Définitions et Abréviations</h2><ul><li><strong>[Terme 1]</strong> : [Définition]</li><li><strong>[Terme 2]</strong> : [Définition]</li></ul><h2>Équipements et Matériels Nécessaires</h2><ul><li>[Équipement 1]</li><li>[Équipement 2]</li></ul><h2>Étapes de la Procédure</h2><h3>Étape 1 : [Description]</h3><ol><li>[Action 1]</li><li>[Action 2]</li><li>[Action 3]</li></ol><h3>Étape 2 : [Description]</h3><ol><li>[Action 1]</li><li>[Action 2]</li></ol><h2>Points de Contrôle</h2><ul><li><strong>[Point 1]</strong> : [Critère de validation]</li><li><strong>[Point 2]</strong> : [Critère de validation]</li></ul><h2>Risques et Mesures de Sécurité</h2><ul><li><strong>[Risque 1]</strong> : [Mesure de prévention]</li><li><strong>[Risque 2]</strong> : [Mesure de prévention]</li></ul><h2>En Cas de Problème</h2><p>[Procédure à suivre en cas de difficulté]</p><h2>Documents de Référence</h2><ul><li>[Document 1]</li><li>[Document 2]</li></ul>',
      content_plain: 'Procédure Opérationnelle Informations Générales Code de la procédure Version Date de création Dernière révision Responsable Approbateur Objectif Champ d Application Définitions et Abréviations Équipements et Matériels Nécessaires Étapes de la Procédure Points de Contrôle Risques et Mesures de Sécurité En Cas de Problème Documents de Référence',
      space_id: '1',
      author_id: 1,
      author_name: 'Ahmadou Bello',
      status: 'published',
      priority: 'high',
      version: 1,
      tags: ['template', 'procédure', 'opérationnelle', 'qualité'],
      category: 'Qualité',
      is_template: true,
      template_type: 'procédure',
      permissions: [
        { role: 'viewer', employee_id: 1, employee_name: 'Ahmadou Bello', granted_at: new Date().toISOString(), granted_by: 1 },
        { role: 'editor', employee_id: 2, employee_name: 'Fatou Ndiaye', granted_at: new Date().toISOString(), granted_by: 1 }
      ],
      collaborators: [1, 2],
      views_count: 28,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString()
    },
    {
      id: '8',
      title: 'Template de Compte Rendu de Formation',
      content: '<h1>Compte Rendu de Formation</h1><h2>Informations de la Formation</h2><p><strong>Intitulé de la formation :</strong> [Nom de la formation]</p><p><strong>Formateur :</strong> [Nom du formateur]</p><p><strong>Date :</strong> [Date]</p><p><strong>Durée :</strong> [Nombre d\'heures]</p><p><strong>Lieu :</strong> [Localisation]</p><p><strong>Organisme :</strong> [Nom de l\'organisme]</p><h2>Participants</h2><table border="1"><tr><th>Nom</th><th>Fonction</th><th>Département</th><th>Présence</th></tr><tr><td>[Nom 1]</td><td>[Fonction]</td><td>[Département]</td><td>[Présent/Absent]</td></tr><tr><td>[Nom 2]</td><td>[Fonction]</td><td>[Département]</td><td>[Présent/Absent]</td></tr></table><h2>Objectifs de la Formation</h2><ul><li>[Objectif 1]</li><li>[Objectif 2]</li><li>[Objectif 3]</li></ul><h2>Contenu de la Formation</h2><h3>Module 1 : [Titre]</h3><p>[Description du contenu]</p><h3>Module 2 : [Titre]</h3><p>[Description du contenu]</p><h2>Évaluation de la Formation</h2><p><strong>Note globale :</strong> [X/10]</p><p><strong>Points positifs :</strong></p><ul><li>[Point 1]</li><li>[Point 2]</li></ul><p><strong>Points d\'amélioration :</strong></p><ul><li>[Point 1]</li><li>[Point 2]</li></ul><h2>Retour d\'Expérience</h2><p><strong>Ce qui a été apprécié :</strong> [Description]</p><p><strong>Ce qui peut être amélioré :</strong> [Description]</p><h2>Actions de Suivi</h2><ul><li><strong>[Action 1]</strong> - Responsable : [Nom] - Échéance : [Date]</li><li><strong>[Action 2]</strong> - Responsable : [Nom] - Échéance : [Date]</li></ul><h2>Recommandations</h2><p>[Recommandations pour les prochaines formations]</p>',
      content_plain: 'Compte Rendu de Formation Informations de la Formation Intitulé de la formation Formateur Date Durée Lieu Organisme Participants Objectifs de la Formation Contenu de la Formation Module 1 Module 2 Évaluation de la Formation Note globale Points positifs Points d amélioration Retour d Expérience Ce qui a été apprécié Ce qui peut être amélioré Actions de Suivi Recommandations',
      space_id: '2',
      author_id: 1,
      author_name: 'Ahmadou Bello',
      status: 'published',
      priority: 'medium',
      version: 1,
      tags: ['template', 'formation', 'compte rendu', 'rh'],
      category: 'Ressources Humaines',
      is_template: true,
      template_type: 'formation',
      permissions: [
        { role: 'viewer', employee_id: 1, employee_name: 'Ahmadou Bello', granted_at: new Date().toISOString(), granted_by: 1 },
        { role: 'editor', employee_id: 2, employee_name: 'Fatou Ndiaye', granted_at: new Date().toISOString(), granted_by: 1 },
        { role: 'viewer', employee_id: 3, employee_name: 'Arantes Mbinda', granted_at: new Date().toISOString(), granted_by: 1 }
      ],
      collaborators: [1, 2, 3],
      views_count: 15,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString()
    }
  ];

  // Fonction pour nettoyer et valider les documents
  const cleanAndValidateDocuments = (documents: any[]): Document[] => {
    return documents.map(doc => ({
      id: doc.id || `doc_${Date.now()}_${Math.random()}`,
      title: doc.title || 'Document sans titre',
      content: doc.content || '<p>Aucun contenu disponible</p>',
      content_plain: doc.content_plain || (doc.content ? doc.content.replace(/<[^>]*>/g, '') : 'Aucun contenu disponible'),
      space_id: doc.space_id || '1',
      folder_id: doc.folder_id,
      author_id: doc.author_id || 1,
      author_name: doc.author_name || 'Auteur inconnu',
      status: doc.status || 'draft',
      priority: doc.priority || 'medium',
      version: doc.version || 1,
      tags: Array.isArray(doc.tags) ? doc.tags : [],
      category: doc.category || 'Général',
      is_template: doc.is_template || false,
      template_type: doc.template_type,
      permissions: Array.isArray(doc.permissions) ? doc.permissions : [],
      collaborators: Array.isArray(doc.collaborators) ? doc.collaborators : [],
      views_count: typeof doc.views_count === 'number' ? doc.views_count : 0,
      last_viewed: doc.last_viewed,
      created_at: doc.created_at || new Date().toISOString(),
      updated_at: doc.updated_at || new Date().toISOString(),
      published_at: doc.published_at,
      archived_at: doc.archived_at,
      deleted_at: doc.deleted_at,
      deleted_by: doc.deleted_by,
      last_edited_at: doc.last_edited_at,
      last_edited_by: doc.last_edited_by,
      parent_version_id: doc.parent_version_id,
      workflow_status: doc.workflow_status,
      workflow_approver_id: doc.workflow_approver_id,
      workflow_notes: doc.workflow_notes
    }));
  };

  const getInitialSpaces = (): Space[] => [
    {
      id: '1',
      name: 'Documentation Générale',
      description: 'Espace pour la documentation générale de l\'entreprise',
      key: 'general',
      color: '#3B82F6',
      owner_id: 1,
      owner_name: 'Ahmadou Bello',
      members: [
        { employee_id: 1, employee_name: 'Ahmadou Bello', role: 'admin', joined_at: new Date().toISOString(), invited_by: 1 },
        { employee_id: 2, employee_name: 'Fatou Ndiaye', role: 'editor', joined_at: new Date().toISOString(), invited_by: 1 }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_public: true,
      default_permission: 'viewer'
    },
    {
      id: '2',
      name: 'Ressources Humaines',
      description: 'Espace pour la documentation RH et les procédures',
      key: 'rh',
      color: '#10B981',
      owner_id: 2,
      owner_name: 'Fatou Ndiaye',
      members: [
        { employee_id: 2, employee_name: 'Fatou Ndiaye', role: 'admin', joined_at: new Date().toISOString(), invited_by: 2 },
        { employee_id: 1, employee_name: 'Ahmadou Bello', role: 'viewer', joined_at: new Date().toISOString(), invited_by: 2 }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_public: false,
      default_permission: 'viewer'
    },
    {
      id: '3',
      name: 'Comptabilité & Finance',
      description: 'Espace pour la documentation comptable et financière',
      key: 'comptabilite',
      color: '#8B5CF6',
      owner_id: 1,
      owner_name: 'Ahmadou Bello',
      members: [
        { employee_id: 1, employee_name: 'Ahmadou Bello', role: 'admin', joined_at: new Date().toISOString(), invited_by: 1 },
        { employee_id: 2, employee_name: 'Fatou Ndiaye', role: 'editor', joined_at: new Date().toISOString(), invited_by: 1 }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_public: false,
      default_permission: 'viewer'
    },
    {
      id: '4',
      name: 'Qualité et Processus',
      description: 'Espace pour la documentation qualité et les procédures opérationnelles',
      key: 'qualite',
      color: '#8B5CF6',
      owner_id: 1,
      owner_name: 'Ahmadou Bello',
      members: [
        { employee_id: 1, employee_name: 'Ahmadou Bello', role: 'admin', joined_at: new Date().toISOString(), invited_by: 1 },
        { employee_id: 2, employee_name: 'Fatou Ndiaye', role: 'editor', joined_at: new Date().toISOString(), invited_by: 1 },
        { employee_id: 3, employee_name: 'Arantes Mbinda', role: 'viewer', joined_at: new Date().toISOString(), invited_by: 1 }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_public: false,
      default_permission: 'viewer'
    },
    {
      id: '5',
      name: 'Gestion de Projet',
      description: 'Espace pour la documentation des projets et rapports',
      key: 'projets',
      color: '#EF4444',
      owner_id: 1,
      owner_name: 'Ahmadou Bello',
      members: [
        { employee_id: 1, employee_name: 'Ahmadou Bello', role: 'admin', joined_at: new Date().toISOString(), invited_by: 1 },
        { employee_id: 2, employee_name: 'Fatou Ndiaye', role: 'editor', joined_at: new Date().toISOString(), invited_by: 1 },
        { employee_id: 3, employee_name: 'Arantes Mbinda', role: 'editor', joined_at: new Date().toISOString(), invited_by: 1 }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_public: false,
      default_permission: 'viewer'
    }
  ];

  const getInitialFolders = (): Folder[] => [
    {
      id: '1',
      name: 'Guides utilisateur',
      description: 'Guides et tutoriels pour les utilisateurs',
      space_id: '1',
      created_by: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order: 1
    },
    {
      id: '2',
      name: 'Procédures',
      description: 'Procédures et processus de l\'entreprise',
      space_id: '2',
      created_by: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order: 1
    },
    {
      id: '3',
      name: 'Templates',
      description: 'Modèles de documents réutilisables',
      space_id: '1',
      created_by: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order: 2
    },
    {
      id: '4',
      name: 'Factures',
      description: 'Templates et modèles de facturation',
      space_id: '3',
      created_by: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order: 1
    },
    {
      id: '5',
      name: 'Réunions',
      description: 'Comptes-rendus et protocoles de réunion',
      space_id: '1',
      created_by: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order: 3
    },
    {
      id: '6',
      name: 'Templates RH',
      description: 'Modèles pour les ressources humaines',
      space_id: '2',
      created_by: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order: 2
    },
    {
      id: '7',
      name: 'Procédures Qualité',
      description: 'Procédures qualité et opérationnelles',
      space_id: '4',
      created_by: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order: 1
    },
    {
      id: '8',
      name: 'Rapports Projets',
      description: 'Rapports de projets et analyses',
      space_id: '5',
      created_by: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order: 1
    },
    {
      id: '9',
      name: 'Formations',
      description: 'Comptes rendus et supports de formation',
      space_id: '2',
      created_by: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order: 3
    }
  ];

  const getInitialTemplates = (): DocumentTemplate[] => [
    {
      id: '1',
      name: 'Procédure standard',
      description: 'Template pour créer une procédure standard',
      content: '<h1>Procédure: [Nom de la procédure]</h1><h2>Objectif</h2><p>...</p><h2>Étapes</h2><ol><li>...</li></ol>',
      category: 'Procédure',
      tags: ['template', 'procédure'],
      created_by: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      usage_count: 3,
      is_public: true
    }
  ];

  // Créer un document
  const createDocument = async (documentData: Omit<Document, 'id' | 'created_at' | 'updated_at' | 'version' | 'views_count'>) => {
    try {
      const newDocument: Document = {
        ...documentData,
        id: Date.now().toString(),
        version: 1,
        views_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const updatedDocuments = [...documents, newDocument];
      setDocuments(updatedDocuments);
      localStorage.setItem('documents', JSON.stringify(updatedDocuments));

      toast.success('Document créé avec succès');
      return newDocument;
    } catch (error) {
      console.error('Erreur lors de la création du document:', error);
      toast.error('Erreur lors de la création du document');
      throw error;
    }
  };

  // Mettre à jour un document
  const updateDocument = async (documentId: string, updates: Partial<Document>) => {
    try {
      const updatedDocuments = documents.map(doc => {
        if (doc.id === documentId) {
          return {
            ...doc,
            ...updates,
            version: doc.version + 1,
            updated_at: new Date().toISOString()
          };
        }
        return doc;
      });

      setDocuments(updatedDocuments);
      localStorage.setItem('documents', JSON.stringify(updatedDocuments));

      toast.success('Document mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du document:', error);
      toast.error('Erreur lors de la mise à jour du document');
      throw error;
    }
  };

  // Supprimer un document (déplacer vers la corbeille)
  const deleteDocument = async (documentId: string) => {
    try {
      const updatedDocuments = documents.map(doc => {
        if (doc.id === documentId) {
          return {
            ...doc,
            status: 'deleted',
            deleted_at: new Date().toISOString(),
            deleted_by: 'current_user' // À remplacer par l'ID de l'utilisateur connecté
          };
        }
        return doc;
      });
      setDocuments(updatedDocuments);
      localStorage.setItem('documents', JSON.stringify(updatedDocuments));

      toast.success('Document déplacé vers la corbeille');
    } catch (error) {
      console.error('Erreur lors de la suppression du document:', error);
      toast.error('Erreur lors de la suppression du document');
      throw error;
    }
  };

  // Restaurer un document depuis la corbeille
  const restoreDocument = async (documentId: string) => {
    try {
      const updatedDocuments = documents.map(doc => {
        if (doc.id === documentId) {
          return {
            ...doc,
            status: 'draft',
            deleted_at: undefined,
            deleted_by: undefined
          };
        }
        return doc;
      });
      setDocuments(updatedDocuments);
      localStorage.setItem('documents', JSON.stringify(updatedDocuments));

      toast.success('Document restauré avec succès');
    } catch (error) {
      console.error('Erreur lors de la restauration du document:', error);
      toast.error('Erreur lors de la restauration du document');
      throw error;
    }
  };

  // Supprimer définitivement un document
  const permanentlyDeleteDocument = async (documentId: string) => {
    try {
      const updatedDocuments = documents.filter(doc => doc.id !== documentId);
      setDocuments(updatedDocuments);
      localStorage.setItem('documents', JSON.stringify(updatedDocuments));

      toast.success('Document supprimé définitivement');
    } catch (error) {
      console.error('Erreur lors de la suppression définitive du document:', error);
      toast.error('Erreur lors de la suppression définitive du document');
      throw error;
    }
  };

  // Rechercher des documents
  const searchDocuments = useCallback((query: string): SearchResult[] => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    const results: SearchResult[] = [];

    documents.forEach(doc => {
      let score = 0;
      const matchedFields: string[] = [];

      // Recherche dans le titre
      if (doc.title.toLowerCase().includes(searchTerm)) {
        score += 10;
        matchedFields.push('title');
      }

      // Recherche dans le contenu
      if (doc.content_plain.toLowerCase().includes(searchTerm)) {
        score += 5;
        matchedFields.push('content');
      }

      // Recherche dans les tags
      if (doc.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
        score += 3;
        matchedFields.push('tags');
      }

      if (score > 0) {
        const snippet = doc.content_plain.substring(0, 150) + '...';
        results.push({
          document: doc,
          relevance_score: score,
          matched_fields: matchedFields,
          snippet
        });
      }
    });

    // Trier par score de pertinence
    return results.sort((a, b) => b.relevance_score - a.relevance_score);
  }, [documents]);

  // Obtenir les documents d'un espace
  const getDocumentsBySpace = useCallback((spaceId: string): Document[] => {
    return documents.filter(doc => doc.space_id === spaceId);
  }, [documents]);

  // Obtenir les documents d'un dossier
  const getDocumentsByFolder = useCallback((folderId: string): Document[] => {
    return documents.filter(doc => doc.folder_id === folderId);
  }, [documents]);

  // Obtenir les documents d'un employé
  const getDocumentsByEmployee = useCallback((employeeId: number): Document[] => {
    return documents.filter(doc => 
      doc.author_id === employeeId || 
      doc.collaborators.includes(employeeId) ||
      doc.permissions.some(perm => perm.employee_id === employeeId)
    );
  }, [documents]);

  // Créer un espace
  const createSpace = async (spaceData: Omit<Space, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newSpace: Space = {
        ...spaceData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const updatedSpaces = [...spaces, newSpace];
      setSpaces(updatedSpaces);
      localStorage.setItem('documentation_spaces', JSON.stringify(updatedSpaces));

      toast.success('Espace créé avec succès');
      return newSpace;
    } catch (error) {
      console.error('Erreur lors de la création de l\'espace:', error);
      toast.error('Erreur lors de la création de l\'espace');
      throw error;
    }
  };

  // Créer un dossier
  const createFolder = async (folderData: Omit<Folder, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newFolder: Folder = {
        ...folderData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const updatedFolders = [...folders, newFolder];
      setFolders(updatedFolders);
      localStorage.setItem('documentation_folders', JSON.stringify(updatedFolders));

      toast.success('Dossier créé avec succès');
      return newFolder;
    } catch (error) {
      console.error('Erreur lors de la création du dossier:', error);
      toast.error('Erreur lors de la création du dossier');
      throw error;
    }
  };

  // Vérifier les permissions d'un utilisateur sur un document
  const checkDocumentPermission = useCallback((documentId: string, employeeId: number, requiredRole: 'viewer' | 'editor' | 'admin'): boolean => {
    const document = documents.find(doc => doc.id === documentId);
    if (!document) return false;

    // L'administrateur général a tous les droits
    if (user?.role === 'admin') return true;

    // Vérifier les permissions spécifiques
    const permission = document.permissions.find(perm => perm.employee_id === employeeId);
    if (!permission) return false;

    const roleHierarchy = { viewer: 1, editor: 2, admin: 3 };
    return roleHierarchy[permission.role] >= roleHierarchy[requiredRole];
  }, [documents, user]);

  // Marquer un document comme vu
  const markDocumentAsViewed = async (documentId: string) => {
    try {
      const updatedDocuments = documents.map(doc => {
        if (doc.id === documentId) {
          return {
            ...doc,
            views_count: doc.views_count + 1,
            last_viewed: new Date().toISOString()
          };
        }
        return doc;
      });

      setDocuments(updatedDocuments);
      localStorage.setItem('documents', JSON.stringify(updatedDocuments));
    } catch (error) {
      console.error('Erreur lors du marquage du document comme vu:', error);
    }
  };

  return {
    // État
    documents,
    spaces,
    folders,
    comments,
    templates,
    notifications,
    loading,
    searchResults,

    // Actions
    loadData,
    resetToInitialData,
    createDocument,
    updateDocument,
    deleteDocument,
    searchDocuments,
    createSpace,
    createFolder,
    checkDocumentPermission,
    markDocumentAsViewed,

    // Getters
    getDocumentsBySpace,
    getDocumentsByFolder,
    getDocumentsByEmployee
  };
}
