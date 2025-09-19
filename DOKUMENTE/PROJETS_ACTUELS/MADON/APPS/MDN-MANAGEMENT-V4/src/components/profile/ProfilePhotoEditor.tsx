import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Camera, X, Save, RotateCcw } from 'lucide-react';
import { AvatarSelector, UserAvatar } from './AvatarSelector';
import { useProfilePhotoUpload } from '@/hooks/useProfilePhotoUpload';
import { toast } from 'sonner';

interface ProfilePhotoEditorProps {
  userId: string;
  currentPhoto?: string;
  currentAvatar?: string;
  userName?: string;
  onPhotoChange: (photoUrl: string | null, avatarId: string | null) => void;
  className?: string;
}

export const ProfilePhotoEditor: React.FC<ProfilePhotoEditorProps> = ({
  userId,
  currentPhoto,
  currentAvatar,
  userName,
  onPhotoChange,
  className = ''
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(currentPhoto || null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(currentAvatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadPhoto, removePhoto, uploading } = useProfilePhotoUpload();

  // Gérer l'upload de fichier
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await uploadPhoto(file);
    if (result) {
      setSelectedPhoto(result.photo_url);
      setSelectedAvatar(null); // Désélectionner l'avatar si une photo est uploadée
      onPhotoChange(result.photo_url, null);
    }
  };

  // Gérer la sélection d'avatar
  const handleAvatarSelect = (avatarId: string) => {
    setSelectedAvatar(avatarId);
    setSelectedPhoto(null); // Désélectionner la photo si un avatar est choisi
  };

  // Supprimer la photo actuelle
  const handleRemovePhoto = async () => {
    const success = await removePhoto();
    if (success) {
      setSelectedPhoto(null);
      setSelectedAvatar(null);
      onPhotoChange(null, null);
    }
  };

  // Sauvegarder les changements
  const handleSave = () => {
    onPhotoChange(selectedPhoto, selectedAvatar);
    toast.success('Photo de profil mise à jour');
  };

  // Réinitialiser
  const handleReset = () => {
    setSelectedPhoto(currentPhoto || null);
    setSelectedAvatar(currentAvatar || null);
  };

  const hasChanges = selectedPhoto !== (currentPhoto || null) || selectedAvatar !== (currentAvatar || null);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Photo de profil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Aperçu actuel */}
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">Aperçu actuel :</p>
          <div className="flex justify-center">
            {selectedPhoto ? (
              <Avatar className="h-24 w-24">
                <AvatarImage src={selectedPhoto} alt="Photo de profil" />
                <AvatarFallback className="bg-gray-200">
                  <Camera className="h-8 w-8 text-gray-400" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <UserAvatar
                avatar={selectedAvatar || undefined}
                name={userName}
                size="xl"
              />
            )}
          </div>
        </div>

        {/* Onglets pour les options */}
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload photo</TabsTrigger>
            <TabsTrigger value="avatar">Avatar par défaut</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {uploading ? 'Upload en cours...' : 'Choisir une photo'}
                </Button>
                
                {selectedPhoto && (
                  <Button
                    variant="outline"
                    onClick={handleRemovePhoto}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Supprimer
                  </Button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="text-xs text-muted-foreground">
                Formats acceptés : JPG, PNG, GIF (max 5MB)
              </div>
            </div>
          </TabsContent>

          <TabsContent value="avatar" className="space-y-4">
            <AvatarSelector
              currentAvatar={selectedAvatar || undefined}
              onAvatarSelect={handleAvatarSelect}
              trigger={
                <Button variant="outline" className="w-full">
                  Choisir un avatar
                </Button>
              }
            />
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex-1"
          >
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
          
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {hasChanges && (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
            ⚠️ Vous avez des modifications non sauvegardées
          </div>
        )}
      </CardContent>
    </Card>
  );
};
