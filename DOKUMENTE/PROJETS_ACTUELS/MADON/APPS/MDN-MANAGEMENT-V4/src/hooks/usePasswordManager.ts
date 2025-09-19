import { useState, useEffect, useCallback } from 'react';

interface PasswordData {
  userId: string;
  email: string;
  hashedPassword: string;
  updatedAt: string;
  mustChangePassword: boolean;
}

interface UsePasswordManagerReturn {
  updatePassword: (email: string, newPassword: string) => void;
  verifyPassword: (email: string, password: string) => boolean;
  getPasswordData: (email: string) => PasswordData | null;
  setMustChangePassword: (email: string, mustChange: boolean) => void;
  getAllPasswords: () => PasswordData[];
}

const STORAGE_KEY = 'user-passwords';

// Fonction simple de hachage (en production, utilisez bcrypt ou similaire)
const simpleHash = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir en entier 32-bit
  }
  return hash.toString();
};

export const usePasswordManager = (): UsePasswordManagerReturn => {
  const [passwords, setPasswords] = useState<PasswordData[]>([]);

  // Charger les mots de passe depuis localStorage au montage
  useEffect(() => {
    try {
      const savedPasswords = localStorage.getItem(STORAGE_KEY);
      if (savedPasswords) {
        const parsedPasswords = JSON.parse(savedPasswords);
        setPasswords(parsedPasswords);
        console.log('🔐 Mots de passe chargés:', parsedPasswords.length);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des mots de passe:', error);
    }
  }, []);

  // Sauvegarder les mots de passe dans localStorage
  const savePasswords = useCallback((newPasswords: PasswordData[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPasswords));
      setPasswords(newPasswords);
      console.log('💾 Mots de passe sauvegardés:', newPasswords.length);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des mots de passe:', error);
    }
  }, []);

  // Mettre à jour le mot de passe d'un utilisateur
  const updatePassword = useCallback((email: string, newPassword: string) => {
    const hashedPassword = simpleHash(newPassword);
    const existingPasswordIndex = passwords.findIndex(p => p.email === email);
    
    const newPasswordData: PasswordData = {
      userId: existingPasswordIndex >= 0 ? passwords[existingPasswordIndex].userId : email,
      email,
      hashedPassword,
      updatedAt: new Date().toISOString(),
      mustChangePassword: false // Le mot de passe a été changé
    };

    let newPasswords: PasswordData[];
    
    if (existingPasswordIndex >= 0) {
      // Mettre à jour le mot de passe existant
      newPasswords = [...passwords];
      newPasswords[existingPasswordIndex] = newPasswordData;
    } else {
      // Ajouter un nouveau mot de passe
      newPasswords = [...passwords, newPasswordData];
    }

    savePasswords(newPasswords);
    
    // Mettre à jour aussi les données d'employé dans localStorage
    updateEmployeePassword(email, newPassword, false);
    
    console.log('🔐 Mot de passe mis à jour pour:', email);
  }, [passwords, savePasswords]);

  // Vérifier le mot de passe d'un utilisateur
  const verifyPassword = useCallback((email: string, password: string): boolean => {
    const passwordData = passwords.find(p => p.email === email);
    
    if (!passwordData) {
      // Si aucun mot de passe personnalisé n'est trouvé, vérifier le mot de passe par défaut
      return password === 'Start01!';
    }
    
    const hashedInput = simpleHash(password);
    return hashedInput === passwordData.hashedPassword;
  }, [passwords]);

  // Obtenir les données de mot de passe d'un utilisateur
  const getPasswordData = useCallback((email: string): PasswordData | null => {
    return passwords.find(p => p.email === email) || null;
  }, [passwords]);

  // Définir si un utilisateur doit changer son mot de passe
  const setMustChangePassword = useCallback((email: string, mustChange: boolean) => {
    const existingPasswordIndex = passwords.findIndex(p => p.email === email);
    
    if (existingPasswordIndex >= 0) {
      const newPasswords = [...passwords];
      newPasswords[existingPasswordIndex].mustChangePassword = mustChange;
      savePasswords(newPasswords);
    } else {
      // Créer une entrée avec le mot de passe par défaut
      const newPasswordData: PasswordData = {
        userId: email,
        email,
        hashedPassword: simpleHash('Start01!'),
        updatedAt: new Date().toISOString(),
        mustChangePassword: mustChange
      };
      savePasswords([...passwords, newPasswordData]);
    }
    
    // Mettre à jour aussi les données d'employé
    updateEmployeePassword(email, 'Start01!', mustChange);
  }, [passwords, savePasswords]);

  // Obtenir tous les mots de passe
  const getAllPasswords = useCallback(() => {
    return passwords;
  }, [passwords]);

  return {
    updatePassword,
    verifyPassword,
    getPasswordData,
    setMustChangePassword,
    getAllPasswords
  };
};

// Fonction utilitaire pour mettre à jour le mot de passe dans les données d'employé
const updateEmployeePassword = (email: string, password: string, mustChangePassword: boolean) => {
  try {
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      const employees = JSON.parse(savedEmployees);
      const updatedEmployees = employees.map((emp: any) => {
        if (emp.email === email) {
          return {
            ...emp,
            password: password,
            must_change_password: mustChangePassword,
            updated_at: new Date().toISOString()
          };
        }
        return emp;
      });
      
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      console.log('👤 Mot de passe mis à jour dans les données d\'employé pour:', email);
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe d\'employé:', error);
  }
};
