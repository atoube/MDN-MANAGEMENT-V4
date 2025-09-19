import { useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  name?: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler une vérification d'authentification
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simulation d'authentification
    if (email === 'admin@madon.com' && password === '123456') {
      const mockUser: User = {
        id: 1,
        email: 'admin@madon.com',
        name: 'Administrateur',
        role: 'admin'
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true };
    } else {
      throw new Error('Identifiants invalides');
    }
  };

  const signOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return { user, loading, signIn, signOut };
} 