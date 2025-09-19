import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useSalaryVisibility() {
  const { user } = useAuth();
  const [isSalaryVisible, setIsSalaryVisible] = useState(false);

  // Charger l'état depuis localStorage au montage ou changement d'utilisateur
  useEffect(() => {
    if (user?.email) {
      const savedState = localStorage.getItem(`salary_visibility_${user.email}`);
      setIsSalaryVisible(savedState === 'true');
    } else {
      setIsSalaryVisible(false);
    }
  }, [user?.email]);

  // Fonction pour basculer la visibilité
  const toggleSalaryVisibility = () => {
    const newState = !isSalaryVisible;
    setIsSalaryVisible(newState);
    
    if (user?.email) {
      localStorage.setItem(`salary_visibility_${user.email}`, newState.toString());
      
      // Déclencher un événement personnalisé pour synchroniser les autres composants
      window.dispatchEvent(new CustomEvent('salaryVisibilityUpdated', {
        detail: { email: user.email, isVisible: newState }
      }));
    }
  };

  // Écouter les changements dans localStorage et les événements personnalisés
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (user?.email && e.key === `salary_visibility_${user.email}`) {
        setIsSalaryVisible(e.newValue === 'true');
      }
    };

    const handleSalaryVisibilityUpdate = (e: CustomEvent) => {
      if (user?.email && e.detail.email === user.email) {
        setIsSalaryVisible(e.detail.isVisible);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('salaryVisibilityUpdated', handleSalaryVisibilityUpdate as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('salaryVisibilityUpdated', handleSalaryVisibilityUpdate as EventListener);
    };
  }, [user?.email]);

  return {
    isSalaryVisible,
    toggleSalaryVisibility
  };
}
