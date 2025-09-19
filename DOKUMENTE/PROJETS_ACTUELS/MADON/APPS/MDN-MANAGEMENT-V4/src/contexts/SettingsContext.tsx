import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppSettings {
  currency: {
    code: string;
    symbol: string;
    name: string;
  };
  language: {
    code: string;
    name: string;
  };
  modules: Array<{
    id: number;
    name: string;
    path: string;
    icon: string;
    enabled: boolean;
    order_index: number;
  }>;
}

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: AppSettings) => void;
  updateCurrency: (currency: AppSettings['currency']) => void;
  updateLanguage: (language: AppSettings['language']) => void;
  toggleModule: (moduleId: number) => void;
  getEnabledModules: () => AppSettings['modules'];
  formatCurrency: (amount: number) => string;
}

const defaultSettings: AppSettings = {
  currency: {
    code: 'XAF',
    symbol: 'F.CFA',
    name: 'Franc CFA'
  },
  language: {
    code: 'fr',
    name: 'Français'
  },
  modules: [
    { id: 1, name: 'Tableau de Bord', path: '/dashboard', icon: 'LayoutDashboard', enabled: true, order_index: 1 },
    { id: 2, name: 'Projets', path: '/projects', icon: 'ClipboardList', enabled: true, order_index: 2 },
    { id: 3, name: 'Tâches', path: '/tasks', icon: 'Package', enabled: true, order_index: 3 },
    { id: 4, name: 'Employés', path: '/employees', icon: 'Users', enabled: true, order_index: 4 },
    { id: 13, name: 'Gestion Utilisateurs', path: '/user-management', icon: 'UserCog', enabled: true, order_index: 13, adminOnly: true },
    { id: 5, name: 'Stocks', path: '/stocks', icon: 'Package', enabled: true, order_index: 5 },
    { id: 6, name: 'Vendeurs', path: '/sellers', icon: 'Store', enabled: true, order_index: 6 },
    { id: 7, name: 'Ventes', path: '/sales', icon: 'DollarSign', enabled: true, order_index: 7 },
    { id: 8, name: 'Achats', path: '/purchases', icon: 'Package', enabled: true, order_index: 8 },
    { id: 9, name: 'Livraisons', path: '/deliveries', icon: 'Truck', enabled: true, order_index: 9 },
    { id: 10, name: 'Marketing', path: '/marketing', icon: 'Share2', enabled: true, order_index: 10 },
    { id: 11, name: 'Finance', path: '/finance', icon: 'DollarSign', enabled: true, order_index: 11 },
    { id: 12, name: 'Documentation', path: '/documents', icon: 'BookOpen', enabled: true, order_index: 12 }
  ]
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  

  useEffect(() => {
    // Charger les paramètres depuis localStorage au démarrage
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        // Vérifier si le module Documentation est présent
        const hasDocumentationModule = parsedSettings.modules.some((m: { name: string }) => m.name === 'Documentation');
        
        if (!hasDocumentationModule) {
          // Ajouter le module Documentation s'il n'existe pas
          const updatedModules = [
            ...parsedSettings.modules,
            { id: 12, name: 'Documentation', path: '/documents', icon: 'BookOpen', enabled: true, order_index: 12 }
          ];
          const updatedSettings = { ...parsedSettings, modules: updatedModules };
          setSettings(updatedSettings);
          localStorage.setItem('appSettings', JSON.stringify(updatedSettings));
        } else {
          setSettings(parsedSettings);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
      }
    }
  }, []);

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
  };

  const updateCurrency = (currency: AppSettings['currency']) => {
    const newSettings = { ...settings, currency };
    updateSettings(newSettings);
  };

  const updateLanguage = (language: AppSettings['language']) => {
    const newSettings = { ...settings, language };
    updateSettings(newSettings);
    // La synchronisation avec le LanguageProvider sera gérée ailleurs
  };

  const toggleModule = (moduleId: number) => {
    const newSettings = {
      ...settings,
      modules: settings.modules.map(module =>
        module.id === moduleId
          ? { ...module, enabled: !module.enabled }
          : module
      )
    };
    updateSettings(newSettings);
  };

  const getEnabledModules = () => {
    return settings.modules.filter(module => module.enabled);
  };

  const formatCurrency = (amount: number): string => {
    const currencyCode = settings.currency.code;
    const symbol = settings.currency.symbol;
    
    // Formatage spécifique pour XAF (Franc CFA)
    if (currencyCode === 'XAF') {
      // Formatage simple et direct pour F.CFA
      return `${amount.toLocaleString('fr-FR')} F.CFA`;
    }
    
    // Formatage pour les autres devises
    try {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch {
      // Fallback si la devise n'est pas reconnue
      return `${symbol} ${amount.toLocaleString('fr-FR')}`;
    }
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    updateCurrency,
    updateLanguage,
    toggleModule,
    getEnabledModules,
    formatCurrency
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
