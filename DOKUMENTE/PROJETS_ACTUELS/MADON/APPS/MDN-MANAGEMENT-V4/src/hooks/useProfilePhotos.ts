import { useState, useEffect, useCallback, useMemo } from 'react';

interface ProfilePhoto {
  userId: string;
  photoUrl?: string | null;
  avatarId?: string | null;
  updatedAt: string;
}

interface UseProfilePhotosReturn {
  getProfilePhoto: (userId: string) => { photoUrl?: string | null; avatarId?: string | null };
  updateProfilePhoto: (userId: string, photoUrl: string | null, avatarId: string | null) => void;
  removeProfilePhoto: (userId: string) => void;
  getAllProfilePhotos: () => ProfilePhoto[];
}

const STORAGE_KEY = 'profile-photos';

export const useProfilePhotos = (): UseProfilePhotosReturn => {
  const [photos, setPhotos] = useState<ProfilePhoto[]>([]);

  // Charger les photos depuis localStorage au montage
  useEffect(() => {
    try {
      const savedPhotos = localStorage.getItem(STORAGE_KEY);
      if (savedPhotos) {
        const parsedPhotos = JSON.parse(savedPhotos);
        setPhotos(parsedPhotos);
        console.log('📸 Photos de profil chargées:', parsedPhotos.length);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des photos de profil:', error);
    }
  }, []);

  // Sauvegarder les photos dans localStorage
  const savePhotos = useCallback((newPhotos: ProfilePhoto[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPhotos));
      setPhotos(newPhotos);
      console.log('💾 Photos de profil sauvegardées:', newPhotos.length);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des photos de profil:', error);
    }
  }, []);

  // Obtenir la photo de profil d'un utilisateur
  const getProfilePhoto = useCallback((userId: string) => {
    const photo = photos.find(p => p.userId === userId);
    return {
      photoUrl: photo?.photoUrl || null,
      avatarId: photo?.avatarId || null
    };
  }, [photos]);

  // Mettre à jour la photo de profil d'un utilisateur
  const updateProfilePhoto = useCallback((
    userId: string, 
    photoUrl: string | null, 
    avatarId: string | null
  ) => {
    const existingPhotoIndex = photos.findIndex(p => p.userId === userId);
    const newPhoto: ProfilePhoto = {
      userId,
      photoUrl,
      avatarId,
      updatedAt: new Date().toISOString()
    };

    let newPhotos: ProfilePhoto[];
    
    if (existingPhotoIndex >= 0) {
      // Mettre à jour la photo existante
      newPhotos = [...photos];
      newPhotos[existingPhotoIndex] = newPhoto;
    } else {
      // Ajouter une nouvelle photo
      newPhotos = [...photos, newPhoto];
    }

    savePhotos(newPhotos);
    
    // Mettre à jour aussi les données d'employé dans localStorage
    updateEmployeePhoto(userId, photoUrl, avatarId);
    
    // Déclencher un événement personnalisé pour notifier les composants
    window.dispatchEvent(new CustomEvent('profilePhotoUpdated', { 
      detail: { userId, photoUrl, avatarId } 
    }));
  }, [photos, savePhotos]);

  // Supprimer la photo de profil d'un utilisateur
  const removeProfilePhoto = useCallback((userId: string) => {
    const newPhotos = photos.filter(p => p.userId !== userId);
    savePhotos(newPhotos);
    
    // Supprimer aussi des données d'employé
    updateEmployeePhoto(userId, null, null);
  }, [photos, savePhotos]);

  // Obtenir toutes les photos de profil
  const getAllProfilePhotos = useCallback(() => {
    return photos;
  }, [photos]);

  return {
    getProfilePhoto,
    updateProfilePhoto,
    removeProfilePhoto,
    getAllProfilePhotos
  };
};

// Fonction utilitaire pour mettre à jour la photo dans les données d'employé
const updateEmployeePhoto = (userId: string, photoUrl: string | null, avatarId: string | null) => {
  try {
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      const employees = JSON.parse(savedEmployees);
      const updatedEmployees = employees.map((emp: any) => {
        if (emp.id.toString() === userId || emp.email === userId) {
          return {
            ...emp,
            photo_url: photoUrl,
            avatar_id: avatarId,
            updated_at: new Date().toISOString()
          };
        }
        return emp;
      });
      
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      console.log('👤 Photo mise à jour dans les données d\'employé pour:', userId);
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la photo d\'employé:', error);
  }
};

// Hook pour obtenir la photo de profil de l'utilisateur connecté
export const useCurrentUserPhoto = () => {
  const { getProfilePhoto } = useProfilePhotos();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    // Récupérer l'utilisateur connecté depuis localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error('Erreur lors du parsing de l\'utilisateur connecté:', error);
      }
    }
  }, []);

  // Écouter les événements de mise à jour des photos et du profil
  useEffect(() => {
    const handleProfilePhotoUpdate = (e: CustomEvent) => {
      if (currentUser && (e.detail.userId === currentUser.id || e.detail.userId === currentUser.email)) {
        console.log('🔄 Mise à jour forcée de la photo de profil');
        setForceUpdate(prev => prev + 1);
      }
    };

    const handleUserProfileUpdate = (e: CustomEvent) => {
      if (currentUser && e.detail.user) {
        console.log('🔄 Mise à jour forcée du profil utilisateur');
        setCurrentUser(e.detail.user);
        setForceUpdate(prev => prev + 1);
      }
    };

    window.addEventListener('profilePhotoUpdated', handleProfilePhotoUpdate as EventListener);
    window.addEventListener('userProfileUpdated', handleUserProfileUpdate as EventListener);
    
    return () => {
      window.removeEventListener('profilePhotoUpdated', handleProfilePhotoUpdate as EventListener);
      window.removeEventListener('userProfileUpdated', handleUserProfileUpdate as EventListener);
    };
  }, [currentUser]);

  // Essayer de récupérer la photo avec l'ID et l'email
  const userPhoto = useMemo(() => {
    let photo = { photoUrl: null, avatarId: null };
    
    if (currentUser) {
      // Essayer avec l'ID d'abord
      photo = getProfilePhoto(currentUser.id);
      
      // Si pas trouvé avec l'ID, essayer avec l'email
      if (!photo.photoUrl && !photo.avatarId) {
        photo = getProfilePhoto(currentUser.email);
      }
      
      // Si toujours pas trouvé, vérifier dans les données d'employé
      if (!photo.photoUrl && !photo.avatarId) {
        try {
          const savedEmployees = localStorage.getItem('employees');
          if (savedEmployees) {
            const employees = JSON.parse(savedEmployees);
            const employee = employees.find((emp: any) => 
              emp.id.toString() === currentUser.id || emp.email === currentUser.email
            );
            
            if (employee) {
              photo = {
                photoUrl: employee.photo_url || null,
                avatarId: employee.avatar_id || null
              };
            }
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données d\'employé:', error);
        }
      }
    }
    
    return photo;
  }, [currentUser, getProfilePhoto, forceUpdate]);

  return {
    ...userPhoto,
    user: currentUser
  };
};
