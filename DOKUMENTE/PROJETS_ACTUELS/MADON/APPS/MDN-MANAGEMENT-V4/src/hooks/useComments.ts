import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  parentId?: string; // Pour les réponses aux commentaires
  mentions?: string[]; // IDs des utilisateurs mentionnés
  attachments?: string[]; // Fichiers attachés
}

export interface CommentThread {
  comment: Comment;
  replies: Comment[];
}

export function useComments() {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setIsLoading] = useState(false);

  // Charger les commentaires depuis localStorage
  useEffect(() => {
    const savedComments = localStorage.getItem('taskComments');
    if (savedComments) {
      try {
        const parsedComments = JSON.parse(savedComments);
        setComments(parsedComments);
      } catch (error) {
        console.error('Erreur lors du chargement des commentaires:', error);
      }
    } else {
      // Créer des commentaires de démonstration
      const demoComments: Comment[] = [
        {
          id: 'comment-1',
          taskId: '1',
          userId: '1',
          userName: 'Ahmadou Dipita',
          content: 'J\'ai commencé à travailler sur cette tâche. Je vais me concentrer sur l\'interface utilisateur d\'abord.',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // Il y a 1 jour
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          isEdited: false
        },
        {
          id: 'comment-2',
          taskId: '1',
          userId: '2',
          userName: 'Admin System',
          content: 'Parfait ! N\'hésite pas à me faire signe si tu as besoin d\'aide.',
          createdAt: new Date(Date.now() - 82800000).toISOString(), // Il y a 23h
          updatedAt: new Date(Date.now() - 82800000).toISOString(),
          isEdited: false,
          parentId: 'comment-1'
        },
        {
          id: 'comment-3',
          taskId: '2',
          userId: '3',
          userName: 'Achille Zogo',
          content: 'Cette tâche est bloquée par un problème de dépendance. @Ahmadou Dipita peux-tu regarder ?',
          createdAt: new Date(Date.now() - 3600000).toISOString(), // Il y a 1h
          updatedAt: new Date(Date.now() - 3600000).toISOString(),
          isEdited: false,
          mentions: ['1']
        },
        {
          id: 'comment-4',
          taskId: '3',
          userId: '4',
          userName: 'Bertrand Ndoum',
          content: 'Tâche terminée ! J\'ai ajouté toutes les fonctionnalités demandées.',
          createdAt: new Date(Date.now() - 1800000).toISOString(), // Il y a 30min
          updatedAt: new Date(Date.now() - 1800000).toISOString(),
          isEdited: false
        }
      ];
      
      setComments(demoComments);
      localStorage.setItem('taskComments', JSON.stringify(demoComments));
    }
  }, []);

  // Sauvegarder les commentaires
  const saveComments = useCallback((newComments: Comment[]) => {
    localStorage.setItem('taskComments', JSON.stringify(newComments));
    setComments(newComments);
  }, []);

  // Ajouter un commentaire
  const addComment = useCallback((taskId: string, content: string, parentId?: string, mentions?: string[]) => {
    if (!user || !content.trim()) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      taskId,
      userId: user.id.toString(),
      userName: user.name || `${user.first_name} ${user.last_name}`,
      userAvatar: user.avatar_id ? `avatar-${user.avatar_id}` : undefined,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEdited: false,
      parentId,
      mentions: mentions || []
    };

    const updatedComments = [...comments, newComment];
    saveComments(updatedComments);

    console.log('✅ Commentaire ajouté:', newComment.id);
    return newComment;
  }, [comments, saveComments, user]);

  // Modifier un commentaire
  const updateComment = useCallback((commentId: string, content: string) => {
    if (!user || !content.trim()) return;

    const updatedComments = comments.map(comment =>
      comment.id === commentId && comment.userId === user.id.toString()
        ? {
            ...comment,
            content: content.trim(),
            updatedAt: new Date().toISOString(),
            isEdited: true
          }
        : comment
    );

    saveComments(updatedComments);
    console.log('✅ Commentaire modifié:', commentId);
  }, [comments, saveComments, user]);

  // Supprimer un commentaire
  const deleteComment = useCallback((commentId: string) => {
    if (!user) return;

    const comment = comments.find(c => c.id === commentId);
    if (!comment || comment.userId !== user.id.toString()) {
      console.log('❌ Impossible de supprimer ce commentaire');
      return;
    }

    // Supprimer le commentaire et toutes ses réponses
    const updatedComments = comments.filter(c => 
      c.id !== commentId && c.parentId !== commentId
    );

    saveComments(updatedComments);
    console.log('✅ Commentaire supprimé:', commentId);
  }, [comments, saveComments, user]);

  // Obtenir les commentaires d'une tâche
  const getTaskComments = useCallback((taskId: string): CommentThread[] => {
    const taskComments = comments.filter(comment => comment.taskId === taskId);
    
    // Séparer les commentaires principaux des réponses
    const mainComments = taskComments.filter(comment => !comment.parentId);
    const replies = taskComments.filter(comment => comment.parentId);

    // Organiser en threads
    return mainComments.map(comment => ({
      comment,
      replies: replies.filter(reply => reply.parentId === comment.id)
    })).sort((a, b) => 
      new Date(a.comment.createdAt).getTime() - new Date(b.comment.createdAt).getTime()
    );
  }, [comments]);

  // Obtenir les commentaires récents
  const getRecentComments = useCallback((limit: number = 10) => {
    return comments
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }, [comments]);

  // Rechercher dans les commentaires
  const searchComments = useCallback((query: string) => {
    if (!query.trim()) return [];

    return comments.filter(comment =>
      comment.content.toLowerCase().includes(query.toLowerCase()) ||
      comment.userName.toLowerCase().includes(query.toLowerCase())
    );
  }, [comments]);

  // Obtenir les mentions d'un utilisateur
  const getUserMentions = useCallback((userId: string) => {
    return comments.filter(comment => 
      comment.mentions && comment.mentions.includes(userId)
    );
  }, [comments]);

  // Formater la date relative
  const formatRelativeTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Il y a quelques secondes';
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} minutes`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} heures`;
    if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} jours`;
    
    return date.toLocaleDateString('fr-FR');
  }, []);

  // Extraire les mentions d'un texte
  const extractMentions = useCallback((text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const matches = text.match(mentionRegex);
    return matches ? matches.map(match => match.substring(1)) : [];
  }, []);

  // Obtenir les statistiques des commentaires
  const getCommentStats = useCallback(() => {
    const totalComments = comments.length;
    const totalReplies = comments.filter(c => c.parentId).length;
    const totalMentions = comments.reduce((sum, c) => sum + (c.mentions?.length || 0), 0);
    const activeUsers = new Set(comments.map(c => c.userId)).size;

    return {
      totalComments,
      totalReplies,
      totalMentions,
      activeUsers
    };
  }, [comments]);

  return {
    comments,
    loading,
    addComment,
    updateComment,
    deleteComment,
    getTaskComments,
    getRecentComments,
    searchComments,
    getUserMentions,
    formatRelativeTime,
    extractMentions,
    getCommentStats
  };
}
