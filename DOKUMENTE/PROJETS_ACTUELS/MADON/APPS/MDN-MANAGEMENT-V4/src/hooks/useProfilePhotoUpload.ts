import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const API_BASE_URL = 'https://management.themadon.com/.netlify/functions';

export function useProfilePhotoUpload() {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const uploadPhoto = useCallback(async (file: File) => {
    if (!user?.id) {
      toast.error('Utilisateur non connecté');
      return null;
    }

    if (!file) {
      toast.error('Aucun fichier sélectionné');
      return null;
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner un fichier image');
      return null;
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La taille du fichier ne doit pas dépasser 5MB');
      return null;
    }

    setUploading(true);

    try {
      // Convertir le fichier en base64
      const photoData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Envoyer à l'API
      const response = await fetch(`${API_BASE_URL}/upload-photo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          photo_data: photoData,
          photo_type: 'profile'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Photo de profil mise à jour avec succès');
        
        // Déclencher un événement pour notifier les autres composants
        window.dispatchEvent(new CustomEvent('profilePhotoUpdated', { 
          detail: { photoUrl: photoData, userId: user.id } 
        }));
        
        return result;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload de la photo:', error);
      toast.error('Erreur lors de l\'upload de la photo');
      return null;
    } finally {
      setUploading(false);
    }
  }, [user?.id]);

  const removePhoto = useCallback(async () => {
    if (!user?.id) {
      toast.error('Utilisateur non connecté');
      return false;
    }

    setUploading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/upload-photo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          photo_data: null,
          photo_type: 'profile'
        }),
      });

      if (response.ok) {
        toast.success('Photo de profil supprimée avec succès');
        
        // Déclencher un événement pour notifier les autres composants
        window.dispatchEvent(new CustomEvent('profilePhotoUpdated', { 
          detail: { photoUrl: null, userId: user.id } 
        }));
        
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la photo:', error);
      toast.error('Erreur lors de la suppression de la photo');
      return false;
    } finally {
      setUploading(false);
    }
  }, [user?.id]);

  return {
    uploadPhoto,
    removePhoto,
    uploading
  };
}
