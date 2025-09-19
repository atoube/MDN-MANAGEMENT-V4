import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from '../contexts/AuthContext';
import PasswordChangeModal from './PasswordChangeModal';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      
      if (result.success) {
        if (result.mustChangePassword) {
          setShowPasswordChangeModal(true);
        } else {
          navigate('/');
        }
      } else {
        setError(result.error || 'Email ou mot de passe incorrect');
      }
    } catch (error) {
      setError('Une erreur est survenue lors de la connexion');
      console.error('Erreur de connexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChanged = () => {
    setShowPasswordChangeModal(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Connexion
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Connectez-vous à votre compte MADON Management
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Accès au système</CardTitle>
            <CardDescription>
              Entrez vos identifiants pour accéder à l'application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="email">Adresse email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@madon.cm"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Votre mot de passe"
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                Comptes de test disponibles :
              </h4>
              <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <div><strong>Administrateur :</strong> a.dipita@themadon.com / Start01!</div>
                <div><strong>Chef RH :</strong> fatou.ndiaye@madon.cm / Start01!</div>
                <div><strong>Manager :</strong> kouassi.mensah@madon.cm / Start01!</div>
                <div><strong>Développeur :</strong> ahmadou.bello@madon.cm / Start01!</div>
                <div><strong>Logistique :</strong> aissatou.diallo@madon.cm / Start01!</div>
                <div><strong>Support :</strong> moussa.traore@madon.cm / Start01!</div>
                <div className="text-blue-600 dark:text-blue-400 mt-2">
                  * Tous les utilisateurs devront changer leur mot de passe à la première connexion
                </div>
                <div className="text-orange-600 dark:text-orange-400 mt-1">
                  ⚠️ jean.baptiste@madon.cm (Comptable) est inactif et ne peut pas se connecter
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <PasswordChangeModal
        isOpen={showPasswordChangeModal}
        onClose={() => setShowPasswordChangeModal(false)}
        userId={user?.id || ''}
        onPasswordChanged={handlePasswordChanged}
      />
    </div>
  );
}
