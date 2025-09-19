import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Camera, User, Users, Crown, Shield, Briefcase, Heart, Star, Zap, Target, Globe, Coffee } from 'lucide-react';

interface AvatarSelectorProps {
  currentAvatar?: string;
  onAvatarSelect: (avatar: string) => void;
  trigger?: React.ReactNode;
}

// Icônes d'avatar par défaut avec leurs identifiants
const defaultAvatars = [
  { id: 'user', icon: User, label: 'Utilisateur', color: 'bg-blue-500' },
  { id: 'users', icon: Users, label: 'Équipe', color: 'bg-green-500' },
  { id: 'crown', icon: Crown, label: 'Admin', color: 'bg-yellow-500' },
  { id: 'shield', icon: Shield, label: 'Sécurité', color: 'bg-purple-500' },
  { id: 'briefcase', icon: Briefcase, label: 'Business', color: 'bg-indigo-500' },
  { id: 'heart', icon: Heart, label: 'Passion', color: 'bg-pink-500' },
  { id: 'star', icon: Star, label: 'Étoile', color: 'bg-orange-500' },
  { id: 'zap', icon: Zap, label: 'Énergie', color: 'bg-yellow-400' },
  { id: 'target', icon: Target, label: 'Objectif', color: 'bg-red-500' },
  { id: 'globe', icon: Globe, label: 'Monde', color: 'bg-cyan-500' },
  { id: 'coffee', icon: Coffee, label: 'Café', color: 'bg-amber-600' },
  { id: 'camera', icon: Camera, label: 'Photo', color: 'bg-gray-500' },
];

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  currentAvatar,
  onAvatarSelect,
  trigger
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleAvatarSelect = (avatarId: string) => {
    onAvatarSelect(avatarId);
    setIsOpen(false);
  };

  const getCurrentAvatarIcon = () => {
    if (!currentAvatar) return User;
    const avatar = defaultAvatars.find(a => a.id === currentAvatar);
    return avatar ? avatar.icon : User;
  };

  const getCurrentAvatarColor = () => {
    if (!currentAvatar) return 'bg-blue-500';
    const avatar = defaultAvatars.find(a => a.id === currentAvatar);
    return avatar ? avatar.color : 'bg-blue-500';
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="flex items-center gap-2">
      <Camera className="h-4 w-4" />
      Changer l'avatar
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choisir un avatar</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Avatar actuel */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Avatar actuel :</p>
            <Avatar className="h-16 w-16 mx-auto">
              <AvatarFallback className={`${getCurrentAvatarColor()} text-white`}>
                {React.createElement(getCurrentAvatarIcon(), { className: "h-8 w-8" })}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Grille d'avatars par défaut */}
          <div className="grid grid-cols-4 gap-4">
            {defaultAvatars.map((avatar) => {
              const IconComponent = avatar.icon;
              const isSelected = currentAvatar === avatar.id;
              
              return (
                <Button
                  key={avatar.id}
                  variant={isSelected ? "default" : "outline"}
                  className={`h-20 w-20 p-0 flex flex-col items-center justify-center gap-1 ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleAvatarSelect(avatar.id)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={`${avatar.color} text-white`}>
                      <IconComponent className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs">{avatar.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Option pour supprimer l'avatar */}
          <div className="text-center pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => handleAvatarSelect('')}
              className="text-muted-foreground hover:text-destructive"
            >
              Supprimer l'avatar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Composant pour afficher un avatar avec fallback
export const UserAvatar: React.FC<{
  avatar?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  photoUrl?: string; // Ajouter le support des photos personnalisées
}> = ({ avatar, name, size = 'md', className = '', photoUrl }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  };

  const getAvatarIcon = () => {
    if (!avatar) return User;
    const avatarData = defaultAvatars.find(a => a.id === avatar);
    return avatarData ? avatarData.icon : User;
  };

  const getAvatarColor = () => {
    if (!avatar) return 'bg-blue-500';
    const avatarData = defaultAvatars.find(a => a.id === avatar);
    return avatarData ? avatarData.color : 'bg-blue-500';
  };

  const getInitials = () => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {photoUrl ? (
        <AvatarImage src={photoUrl} alt="Photo de profil" />
      ) : null}
      <AvatarFallback className={`${getAvatarColor()} text-white`}>
        {avatar ? (
          React.createElement(getAvatarIcon(), { className: iconSizes[size] })
        ) : (
          <span className="text-sm font-medium">{getInitials()}</span>
        )}
      </AvatarFallback>
    </Avatar>
  );
};
