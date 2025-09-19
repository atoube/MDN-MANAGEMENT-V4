import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface Document {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'xls' | 'ppt' | 'image' | 'other';
  size: string;
  uploadDate: string;
  uploadedBy: string;
  category: 'contract' | 'report' | 'presentation' | 'financial' | 'hr' | 'other';
  description?: string;
  isPublic: boolean;
  tags: string[];
}

export function useDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  // Données de test pour les documents
  const getInitialDocuments = (): Document[] => {
    const baseDocuments: Document[] = [
      {
        id: '1',
        title: 'Contrat de travail - Kevin Ndedi',
        type: 'pdf',
        size: '2.3 MB',
        uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        uploadedBy: 'admin@madon.cm',
        category: 'contract',
        description: 'Contrat de travail signé',
        isPublic: false,
        tags: ['contrat', 'rh', 'signé']
      },
      {
        id: '2',
        title: 'Rapport mensuel - Janvier 2024',
        type: 'pdf',
        size: '1.8 MB',
        uploadDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        uploadedBy: 'k.ndedi@themadon.com',
        category: 'report',
        description: 'Rapport d\'activité mensuel',
        isPublic: true,
        tags: ['rapport', 'mensuel', '2024']
      },
      {
        id: '3',
        title: 'Présentation projet Q1',
        type: 'ppt',
        size: '5.2 MB',
        uploadDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        uploadedBy: 'admin@madon.cm',
        category: 'presentation',
        description: 'Présentation des objectifs Q1',
        isPublic: true,
        tags: ['présentation', 'projet', 'Q1']
      },
      {
        id: '4',
        title: 'Bilan financier 2023',
        type: 'xls',
        size: '3.1 MB',
        uploadDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        uploadedBy: 'admin@madon.cm',
        category: 'financial',
        description: 'Bilan financier annuel',
        isPublic: false,
        tags: ['financier', 'bilan', '2023']
      },
      {
        id: '5',
        title: 'Photo équipe - Événement',
        type: 'image',
        size: '4.5 MB',
        uploadDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        uploadedBy: 'k.ndedi@themadon.com',
        category: 'other',
        description: 'Photo de l\'équipe lors de l\'événement',
        isPublic: true,
        tags: ['photo', 'équipe', 'événement']
      }
    ];

    // Filtrer selon le rôle de l'utilisateur
    if (user?.role === 'admin') {
      return baseDocuments; // Admin voit tout
    } else if (user?.role === 'hr') {
      return baseDocuments.filter(doc => 
        doc.category === 'hr' || 
        doc.category === 'contract' || 
        doc.isPublic
      );
    } else {
      // Employé général - seulement ses documents et les publics
      return baseDocuments.filter(doc => 
        doc.uploadedBy === user?.email || 
        doc.isPublic
      );
    }
  };

  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      try {
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const initialDocs = getInitialDocuments();
        setDocuments(initialDocs);
      } catch (error) {
        console.error('Erreur lors du chargement des documents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [user?.email, user?.role]);

  const getDocumentsByCategory = (category: Document['category']) => {
    return documents.filter(doc => doc.category === category);
  };

  const getRecentDocuments = (limit: number = 5) => {
    return documents
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
      .slice(0, limit);
  };

  const getDocumentsByUser = (userEmail: string) => {
    return documents.filter(doc => doc.uploadedBy === userEmail);
  };

  const getDocumentStats = () => {
    const total = documents.length;
    const byCategory = documents.reduce((acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const recent = documents.filter(doc => 
      new Date(doc.uploadDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    return {
      total,
      byCategory,
      recent,
      public: documents.filter(doc => doc.isPublic).length,
      private: documents.filter(doc => !doc.isPublic).length
    };
  };

  return {
    documents,
    loading,
    getDocumentsByCategory,
    getRecentDocuments,
    getDocumentsByUser,
    getDocumentStats
  };
}
