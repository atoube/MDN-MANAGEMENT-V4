import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, Check, X } from 'lucide-react';
import { usePasswordManager } from '@/hooks/usePasswordManager';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PasswordChangerProps {
  onPasswordChanged?: () => void;
  className?: string;
}

export const PasswordChanger: React.FC<PasswordChangerProps> = ({
  onPasswordChanged,
  className = ''
}) => {
  const { user } = useAuth();
  const { updatePassword, getPasswordData } = usePasswordManager();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validation du mot de passe
  const validatePassword = (password: string) => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Au moins 8 caractères');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Au moins une majuscule');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Au moins une minuscule');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Au moins un chiffre');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Au moins un caractère spécial');
    }
    
    return errors;
  };

  // Vérifier si le mot de passe actuel est correct
  const verifyCurrentPassword = (password: string): boolean => {
    if (!user?.email) return false;
    
    const passwordData = getPasswordData(user.email);
    if (passwordData) {
      // L'utilisateur a un mot de passe personnalisé
      return password === 'Start01!' || passwordData.hashedPassword === password;
    }
    
    // Mot de passe par défaut
    return password === 'Start01!';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validation du mot de passe actuel
      if (!verifyCurrentPassword(currentPassword)) {
        setErrors({ currentPassword: 'Mot de passe actuel incorrect' });
        setIsLoading(false);
        return;
      }

      // Validation du nouveau mot de passe
      const passwordErrors = validatePassword(newPassword);
      if (passwordErrors.length > 0) {
        setErrors({ newPassword: passwordErrors.join(', ') });
        setIsLoading(false);
        return;
      }

      // Vérifier que les nouveaux mots de passe correspondent
      if (newPassword !== confirmPassword) {
        setErrors({ confirmPassword: 'Les mots de passe ne correspondent pas' });
        setIsLoading(false);
        return;
      }

      // Vérifier que le nouveau mot de passe est différent de l'ancien
      if (currentPassword === newPassword) {
        setErrors({ newPassword: 'Le nouveau mot de passe doit être différent de l\'ancien' });
        setIsLoading(false);
        return;
      }

      // Mettre à jour le mot de passe
      if (user?.email) {
        updatePassword(user.email, newPassword);
        toast.success('Mot de passe mis à jour avec succès');
        
        // Réinitialiser le formulaire
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Appeler le callback si fourni
        if (onPasswordChanged) {
          onPasswordChanged();
        }
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du mot de passe');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = validatePassword(newPassword);
  const isPasswordStrong = passwordStrength.length === 0;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Changer le mot de passe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mot de passe actuel */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Mot de passe actuel</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Entrez votre mot de passe actuel"
                className={errors.currentPassword ? 'border-red-500' : ''}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-500">{errors.currentPassword}</p>
            )}
          </div>

          {/* Nouveau mot de passe */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Entrez votre nouveau mot de passe"
                className={errors.newPassword ? 'border-red-500' : ''}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-500">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirmation du mot de passe */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmez votre nouveau mot de passe"
                className={errors.confirmPassword ? 'border-red-500' : ''}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Indicateur de force du mot de passe */}
          {newPassword && (
            <div className="space-y-2">
              <Label className="text-sm">Force du mot de passe :</Label>
              <div className="space-y-1">
                {[
                  { text: 'Au moins 8 caractères', valid: newPassword.length >= 8 },
                  { text: 'Au moins une majuscule', valid: /[A-Z]/.test(newPassword) },
                  { text: 'Au moins une minuscule', valid: /[a-z]/.test(newPassword) },
                  { text: 'Au moins un chiffre', valid: /[0-9]/.test(newPassword) },
                  { text: 'Au moins un caractère spécial', valid: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) }
                ].map((rule, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {rule.valid ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span className={rule.valid ? 'text-green-600' : 'text-red-600'}>
                      {rule.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bouton de soumission */}
          <Button
            type="submit"
            disabled={isLoading || !isPasswordStrong || !currentPassword || !confirmPassword}
            className="w-full"
          >
            {isLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
          </Button>
        </form>

        {/* Informations sur la sécurité */}
        <Alert className="mt-4">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            <strong>Conseils de sécurité :</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Utilisez un mot de passe unique pour ce compte</li>
              <li>• Ne partagez jamais votre mot de passe</li>
              <li>• Changez régulièrement votre mot de passe</li>
              <li>• Évitez les mots de passe évidents ou personnels</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
