import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Calendar, Shield, Camera, Save } from 'lucide-react';
import { ProfilePhotoEditor } from '@/components/profile/ProfilePhotoEditor';
import { UserAvatar } from '@/components/profile/AvatarSelector';
import { PasswordChanger } from '@/components/profile/PasswordChanger';
import { useProfilePhotos, useCurrentUserPhoto } from '@/hooks/useProfilePhotos';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { useProfilePhotoUpload } from '@/hooks/useProfilePhotoUpload';
import { useEmployeesAPI } from '@/hooks/useEmployeesAPI';
import { toast } from 'sonner';

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const { getProfilePhoto, updateProfilePhoto } = useProfilePhotos();
  const { photoUrl, avatarId } = useCurrentUserPhoto();
  const { createProfileUpdateNotification } = useNotifications();
  const { uploadPhoto, removePhoto, uploading } = useProfilePhotoUpload();
  const { updateEmployee } = useEmployeesAPI();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    address: ''
  });

  // Charger les données utilisateur
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
        position: user.position || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      // Mettre à jour via l'API
      await updateEmployee(user.id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        address: formData.address
      });
      
      // Mettre à jour les données d'employé dans localStorage pour la synchronisation
      const savedEmployees = localStorage.getItem('employees');
      if (savedEmployees) {
        const employees = JSON.parse(savedEmployees);
        const employeeIndex = employees.findIndex((emp: any) => 
          emp.id.toString() === user.id || emp.email === user.email
        );
        
        if (employeeIndex >= 0) {
          // Mettre à jour les données de l'employé
          employees[employeeIndex] = {
            ...employees[employeeIndex],
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            department: formData.department,
            position: formData.position,
            address: formData.address,
            updated_at: new Date().toISOString()
          };
          
          // Sauvegarder les employés mis à jour
          localStorage.setItem('employees', JSON.stringify(employees));
          
          // Mettre à jour l'utilisateur connecté
          const updatedUser = {
            ...user,
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            department: formData.department,
            position: formData.position,
            address: formData.address,
            name: `${formData.first_name} ${formData.last_name}`
          };
          
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          
          // Déclencher un événement pour notifier les autres composants
          window.dispatchEvent(new CustomEvent('userProfileUpdated', { 
            detail: { user: updatedUser } 
          }));
          
          // Déclencher un événement pour notifier la mise à jour de l'employé
          window.dispatchEvent(new CustomEvent('employeeUpdated', { 
            detail: { employeeId: user.id, employee: employees[employeeIndex] } 
          }));
          
          console.log('🔄 Profil utilisateur et données d\'employé synchronisés');
          
          // Créer une notification pour la modification du profil
          createProfileUpdateNotification(
            `${formData.first_name} ${formData.last_name}`,
            user.name || 'Utilisateur'
          );
          
          toast.success('Profil mis à jour avec succès');
          setIsEditing(false);
        } else {
          toast.error('Employé non trouvé dans la base de données');
        }
      } else {
        toast.error('Données d\'employés non trouvées');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error);
      toast.error('Erreur lors de la sauvegarde du profil');
    }
  };

  const handlePhotoChange = (newPhotoUrl: string | null, newAvatarId: string | null) => {
    if (user) {
      updateProfilePhoto(user.id.toString(), newPhotoUrl, newAvatarId);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      await uploadPhoto(file);
    }
  };

  const handleRemovePhoto = async () => {
    if (user) {
      await removePhoto();
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'hr': return 'bg-blue-100 text-blue-800';
      case 'manager': return 'bg-purple-100 text-purple-800';
      case 'employee': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Veuillez vous connecter pour voir votre profil</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête du profil */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <UserAvatar
              avatar={avatarId || undefined}
              name={`${user.first_name} ${user.last_name}`}
              size="xl"
              photoUrl={photoUrl || undefined}
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-muted-foreground">{user.position}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getRoleBadgeColor(user.role)}>
                  <Shield className="h-3 w-3 mr-1" />
                  {user.role.toUpperCase()}
                </Badge>
                <Badge variant="outline">
                  {user.department}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Contenu principal */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Informations personnelles</TabsTrigger>
          <TabsTrigger value="photo">Photo de profil</TabsTrigger>
          <TabsTrigger value="password">Mot de passe</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
                <div className="flex gap-2">
                  {isEditing && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        // Recharger les données originales
                        if (user) {
                          setFormData({
                            first_name: user.first_name || '',
                            last_name: user.last_name || '',
                            email: user.email || '',
                            phone: user.phone || '',
                            department: user.department || '',
                            position: user.position || '',
                            address: user.address || ''
                          });
                        }
                      }}
                    >
                      Annuler
                    </Button>
                  )}
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder
                      </>
                    ) : (
                      'Modifier'
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Prénom</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Nom</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Département</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Poste</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              {/* Informations en lecture seule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Date d'embauche : {user.hire_date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Statut : {user.status}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photo" className="space-y-6">
          <ProfilePhotoEditor
            userId={user.id.toString()}
            currentPhoto={photoUrl || undefined}
            currentAvatar={avatarId || undefined}
            userName={`${user.first_name} ${user.last_name}`}
            onPhotoChange={handlePhotoChange}
          />
        </TabsContent>

        <TabsContent value="password" className="space-y-6">
          <PasswordChanger
            onPasswordChanged={() => {
              toast.success('Mot de passe mis à jour avec succès');
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
