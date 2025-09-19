import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePasswordManager } from '../hooks/usePasswordManager';

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  first_name?: string;
  last_name?: string;
  department?: string;
  position?: string;
  must_change_password?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; mustChangePassword?: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { verifyPassword, getPasswordData } = usePasswordManager();

  useEffect(() => {
    // Vérifier si un utilisateur est déjà connecté
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    // Ne pas créer d'utilisateur par défaut - laisser l'utilisateur se connecter
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; mustChangePassword?: boolean; error?: string }> => {
    console.log('🔐 AuthContext - Tentative de connexion:', email);
    console.log('🔐 AuthContext - URL API:', '/.netlify/functions/auth-login');
    
    try {
      // Essayer d'abord l'API
      try {
        console.log('🔐 AuthContext - Envoi de la requête à l\'API...');
        const response = await fetch('/.netlify/functions/auth-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        
        console.log('🔐 AuthContext - Réponse reçue:', response.status, response.statusText);

        if (response.ok) {
          const userData = await response.json();
          console.log('🔐 AuthContext - Données utilisateur reçues:', userData);
          setUser(userData.user);
          localStorage.setItem('currentUser', JSON.stringify(userData.user));
          
          console.log('🔐 AuthContext - Connexion réussie pour:', userData.user.email);
          return { 
            success: true, 
            mustChangePassword: userData.user.must_change_password 
          };
        } else {
          const errorData = await response.json();
          console.log('🔐 AuthContext - Erreur API:', errorData);
          return { success: false, error: errorData.message || 'Erreur de connexion' };
        }
      } catch (error) {
        console.error('🔐 AuthContext - Erreur API:', error);
        console.error('🔐 AuthContext - Type d\'erreur:', typeof error);
        console.error('🔐 AuthContext - Message d\'erreur:', error.message);
        console.error('🔐 AuthContext - Stack:', error.stack);
        
        // Vérifier si c'est une erreur de réseau
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          return { success: false, error: 'Erreur de connexion au serveur. Vérifiez votre connexion internet.' };
        }
        
        return { success: false, error: 'Erreur de connexion au serveur' };
      }

      // Si on arrive ici, c'est que l'API a échoué
      return { success: false, error: 'Email ou mot de passe incorrect' };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { success: false, error: 'Une erreur est survenue lors de la connexion' };
    }
  };

  const logout = () => {
    // Nettoyer toutes les données utilisateur
    localStorage.removeItem('currentUser');
    
    // Nettoyer la photo de profil si elle existe
    if (user?.email) {
      localStorage.removeItem(`profile_photo_${user.email}`);
    }
    
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};