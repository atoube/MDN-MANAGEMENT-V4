import { useCurrentUserPhoto } from './useProfilePhotos';

// Hook de compatibilité pour maintenir l'interface existante
export function useProfilePhoto() {
  const { photoUrl, avatarId, user } = useCurrentUserPhoto();
  
  return {
    profilePhoto: photoUrl,
    avatarId: avatarId,
    user: user,
    updateProfilePhoto: () => {
      // Cette fonction est maintenant gérée par useProfilePhotos
      console.log('updateProfilePhoto est maintenant géré par useProfilePhotos');
    }
  };
}
