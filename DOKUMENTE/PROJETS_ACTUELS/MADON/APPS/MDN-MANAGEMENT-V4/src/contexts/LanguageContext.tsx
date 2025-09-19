import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traductions pour différentes langues
const translations = {
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de Bord',
    'nav.projects': 'Projets',
    'nav.tasks': 'Tâches',
    'nav.employees': 'Employés',
    'nav.stocks': 'Stocks',
    'nav.sellers': 'Vendeurs',
    'nav.sales': 'Ventes',
    'nav.purchases': 'Achats',
    'nav.deliveries': 'Livraisons',
    'nav.marketing': 'Marketing',
    'nav.finance': 'Finance',
    'nav.settings': 'Paramètres',
    'nav.profile': 'Profil',

    // Actions communes
    'action.save': 'Sauvegarder',
    'action.cancel': 'Annuler',
    'action.edit': 'Modifier',
    'action.delete': 'Supprimer',
    'action.add': 'Ajouter',
    'action.view': 'Voir',
    'action.close': 'Fermer',
    'action.confirm': 'Confirmer',
    'action.reset': 'Réinitialiser',

    // Messages
    'message.saved': 'Sauvegardé avec succès',
    'message.deleted': 'Supprimé avec succès',
    'message.error': 'Une erreur est survenue',
    'message.loading': 'Chargement...',
    'message.noData': 'Aucune donnée disponible',

    // Formulaires
    'form.name': 'Nom',
    'form.email': 'Email',
    'form.phone': 'Téléphone',
    'form.address': 'Adresse',
    'form.submit': 'Soumettre',
    'form.required': 'Ce champ est requis',

    // Statuts
    'status.active': 'Actif',
    'status.inactive': 'Inactif',
    'status.pending': 'En attente',
    'status.completed': 'Terminé',
    'status.cancelled': 'Annulé',

    // Paramètres
    'settings.title': 'Configuration de l\'Application',
    'settings.subtitle': 'Gérez les paramètres généraux de l\'application',
    'settings.general': 'Général',
    'settings.currency': 'Devise',
    'settings.language': 'Langue',
    'settings.modules': 'Modules',
    'settings.save': 'Sauvegarder',
    'settings.reset': 'Réinitialiser',
    'settings.unsaved': 'Modifications non sauvegardées',
    'settings.saved': 'Paramètres sauvegardés avec succès',
    'settings.error': 'Erreur lors de la sauvegarde des paramètres',
    'settings.confirm': 'Êtes-vous sûr de vouloir sauvegarder ces paramètres ? L\'application sera rechargée.',
    'settings.noChanges': 'Aucune modification à sauvegarder',
    'settings.resetConfirm': 'Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?',
    'settings.activateAll': 'Activer tous les modules',
    'settings.deactivateAll': 'Désactiver tous les modules',
    'settings.activeModules': 'modules actifs',
    'settings.inactiveModules': 'modules inactifs',
    'settings.navigationPreview': 'Aperçu de la navigation',
    'settings.visibleModules': 'Modules qui apparaîtront dans le menu :',
    'settings.moduleInfo': 'Les modules désactivés ne seront pas visibles dans la navigation. Cette action n\'affecte pas les données existantes.',
    'settings.summary': 'Résumé des Paramètres',
    'settings.summarySubtitle': 'Aperçu de la configuration actuelle de l\'application',
    'settings.currencyConfig': 'Configuration Monétaire',
    'settings.languageConfig': 'Configuration Linguistique',
    'settings.moduleConfig': 'Configuration des Modules',
    'settings.quickActions': 'Actions Rapides',
    'settings.currencyLabel': 'Devise :',
    'settings.symbolLabel': 'Symbole :',
    'settings.codeLabel': 'Code :',
    'settings.languageLabel': 'Langue :',
    'settings.activeModulesCount': 'Modules Actifs',
    'settings.inactiveModulesCount': 'Modules Inactifs',
    'settings.totalModules': 'Total Modules',
    'settings.preview': 'Exemple d\'affichage',
    'settings.price': 'Prix',
    'settings.total': 'Total',
    'settings.budget': 'Budget',

    // Devises
    'currency.xaf': 'Franc CFA',
    'currency.eur': 'Euro',
    'currency.usd': 'Dollar US',
    'currency.gbp': 'Livre Sterling',

    // Langues
    'language.fr': 'Français',
    'language.en': 'English',
    'language.es': 'Español',

    // Modules
    'module.dashboard': 'Tableau de Bord',
    'module.projects': 'Projets',
    'module.tasks': 'Tâches',
    'module.employees': 'Employés',
    'module.stocks': 'Stocks',
    'module.sellers': 'Vendeurs',
    'module.sales': 'Ventes',
    'module.purchases': 'Achats',
    'module.deliveries': 'Livraisons',
    'module.marketing': 'Marketing',
    'module.finance': 'Finance',
    'module.documents': 'Documents',
    'module.profile': 'Profil',

    // Général
    'general.yes': 'Oui',
    'general.no': 'Non',
    'general.ok': 'OK',
    'general.back': 'Retour',
    'general.next': 'Suivant',
    'general.previous': 'Précédent',
    'general.search': 'Rechercher',
    'general.filter': 'Filtrer',
    'general.sort': 'Trier',
    'general.refresh': 'Actualiser',
    'general.export': 'Exporter',
    'general.import': 'Importer',
    'general.download': 'Télécharger',
    'general.upload': 'Téléverser',

    // Tableau de bord
    'dashboard.welcome': 'Bienvenue',
    'dashboard.user': 'Utilisateur',
    'dashboard.quickStats': 'Statistiques Rapides',
    'dashboard.statsDescription': 'Vue d\'ensemble des performances',
    'dashboard.recentActivity': 'Activité Récente',
    'dashboard.activityDescription': 'Dernières actions effectuées',
    'dashboard.tasks': 'Tâches',
    'dashboard.tasksDescription': 'Tâches en cours et à venir',
    'dashboard.notifications': 'Notifications',
    'dashboard.notificationsDescription': 'Messages et alertes récents',
    'dashboard.languageInfo': 'Information sur la Langue',
    'dashboard.languageInfoText': 'La langue de l\'application peut être modifiée dans les paramètres. Tous les textes s\'adapteront automatiquement à votre choix.',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.projects': 'Projects',
    'nav.tasks': 'Tasks',
    'nav.employees': 'Employees',
    'nav.stocks': 'Stocks',
    'nav.sellers': 'Sellers',
    'nav.sales': 'Sales',
    'nav.purchases': 'Purchases',
    'nav.deliveries': 'Deliveries',
    'nav.marketing': 'Marketing',
    'nav.finance': 'Finance',
    'nav.settings': 'Settings',
    'nav.profile': 'Profile',

    // Actions communes
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.add': 'Add',
    'action.view': 'View',
    'action.close': 'Close',
    'action.confirm': 'Confirm',
    'action.reset': 'Reset',

    // Messages
    'message.saved': 'Saved successfully',
    'message.deleted': 'Deleted successfully',
    'message.error': 'An error occurred',
    'message.loading': 'Loading...',
    'message.noData': 'No data available',

    // Formulaires
    'form.name': 'Name',
    'form.email': 'Email',
    'form.phone': 'Phone',
    'form.address': 'Address',
    'form.submit': 'Submit',
    'form.required': 'This field is required',

    // Statuts
    'status.active': 'Active',
    'status.inactive': 'Inactive',
    'status.pending': 'Pending',
    'status.completed': 'Completed',
    'status.cancelled': 'Cancelled',

    // Paramètres
    'settings.title': 'Application Configuration',
    'settings.subtitle': 'Manage general application settings',
    'settings.general': 'General',
    'settings.currency': 'Currency',
    'settings.language': 'Language',
    'settings.modules': 'Modules',
    'settings.save': 'Save',
    'settings.reset': 'Reset',
    'settings.unsaved': 'Unsaved changes',
    'settings.saved': 'Settings saved successfully',
    'settings.error': 'Error saving settings',
    'settings.confirm': 'Are you sure you want to save these settings? The application will be reloaded.',
    'settings.noChanges': 'No changes to save',
    'settings.resetConfirm': 'Are you sure you want to reset all settings?',
    'settings.activateAll': 'Activate all modules',
    'settings.deactivateAll': 'Deactivate all modules',
    'settings.activeModules': 'active modules',
    'settings.inactiveModules': 'inactive modules',
    'settings.navigationPreview': 'Navigation Preview',
    'settings.visibleModules': 'Modules that will appear in the menu:',
    'settings.moduleInfo': 'Disabled modules will not be visible in navigation. This action does not affect existing data.',
    'settings.summary': 'Settings Summary',
    'settings.summarySubtitle': 'Overview of current application configuration',
    'settings.currencyConfig': 'Currency Configuration',
    'settings.languageConfig': 'Language Configuration',
    'settings.moduleConfig': 'Module Configuration',
    'settings.quickActions': 'Quick Actions',
    'settings.currencyLabel': 'Currency:',
    'settings.symbolLabel': 'Symbol:',
    'settings.codeLabel': 'Code:',
    'settings.languageLabel': 'Language:',
    'settings.activeModulesCount': 'Active Modules',
    'settings.inactiveModulesCount': 'Inactive Modules',
    'settings.totalModules': 'Total Modules',
    'settings.preview': 'Display Example',
    'settings.price': 'Price',
    'settings.total': 'Total',
    'settings.budget': 'Budget',

    // Devises
    'currency.xaf': 'CFA Franc',
    'currency.eur': 'Euro',
    'currency.usd': 'US Dollar',
    'currency.gbp': 'Pound Sterling',

    // Langues
    'language.fr': 'Français',
    'language.en': 'English',
    'language.es': 'Español',

    // Modules
    'module.dashboard': 'Dashboard',
    'module.projects': 'Projects',
    'module.tasks': 'Tasks',
    'module.employees': 'Employees',
    'module.stocks': 'Stocks',
    'module.sellers': 'Sellers',
    'module.sales': 'Sales',
    'module.purchases': 'Purchases',
    'module.deliveries': 'Deliveries',
    'module.marketing': 'Marketing',
    'module.finance': 'Finance',
    'module.documents': 'Documents',
    'module.profile': 'Profile',

    // Général
    'general.yes': 'Yes',
    'general.no': 'No',
    'general.ok': 'OK',
    'general.back': 'Back',
    'general.next': 'Next',
    'general.previous': 'Previous',
    'general.search': 'Search',
    'general.filter': 'Filter',
    'general.sort': 'Sort',
    'general.refresh': 'Refresh',
    'general.export': 'Export',
    'general.import': 'Import',
    'general.download': 'Download',
    'general.upload': 'Upload',

    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.user': 'User',
    'dashboard.quickStats': 'Quick Stats',
    'dashboard.statsDescription': 'Performance overview',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.activityDescription': 'Latest actions performed',
    'dashboard.tasks': 'Tasks',
    'dashboard.tasksDescription': 'Current and upcoming tasks',
    'dashboard.notifications': 'Notifications',
    'dashboard.notificationsDescription': 'Recent messages and alerts',
    'dashboard.languageInfo': 'Language Information',
    'dashboard.languageInfoText': 'The application language can be changed in settings. All texts will automatically adapt to your choice.',
  },
  es: {
    // Navigation
    'nav.dashboard': 'Panel de Control',
    'nav.projects': 'Proyectos',
    'nav.tasks': 'Tareas',
    'nav.employees': 'Empleados',
    'nav.stocks': 'Inventario',
    'nav.sellers': 'Vendedores',
    'nav.sales': 'Ventas',
    'nav.purchases': 'Compras',
    'nav.deliveries': 'Entregas',
    'nav.marketing': 'Marketing',
    'nav.finance': 'Finanzas',
    'nav.settings': 'Configuración',
    'nav.profile': 'Perfil',

    // Actions communes
    'action.save': 'Guardar',
    'action.cancel': 'Cancelar',
    'action.edit': 'Editar',
    'action.delete': 'Eliminar',
    'action.add': 'Agregar',
    'action.view': 'Ver',
    'action.close': 'Cerrar',
    'action.confirm': 'Confirmar',
    'action.reset': 'Restablecer',

    // Messages
    'message.saved': 'Guardado exitosamente',
    'message.deleted': 'Eliminado exitosamente',
    'message.error': 'Ocurrió un error',
    'message.loading': 'Cargando...',
    'message.noData': 'No hay datos disponibles',

    // Formulaires
    'form.name': 'Nombre',
    'form.email': 'Correo electrónico',
    'form.phone': 'Teléfono',
    'form.address': 'Dirección',
    'form.submit': 'Enviar',
    'form.required': 'Este campo es obligatorio',

    // Statuts
    'status.active': 'Activo',
    'status.inactive': 'Inactivo',
    'status.pending': 'Pendiente',
    'status.completed': 'Completado',
    'status.cancelled': 'Cancelado',

    // Paramètres
    'settings.title': 'Configuración de la Aplicación',
    'settings.subtitle': 'Gestionar la configuración general de la aplicación',
    'settings.general': 'General',
    'settings.currency': 'Moneda',
    'settings.language': 'Idioma',
    'settings.modules': 'Módulos',
    'settings.save': 'Guardar',
    'settings.reset': 'Restablecer',
    'settings.unsaved': 'Cambios no guardados',
    'settings.saved': 'Configuración guardada exitosamente',
    'settings.error': 'Error al guardar la configuración',
    'settings.confirm': '¿Está seguro de que desea guardar esta configuración? La aplicación se recargará.',
    'settings.noChanges': 'No hay cambios para guardar',
    'settings.resetConfirm': '¿Está seguro de que desea restablecer toda la configuración?',
    'settings.activateAll': 'Activar todos los módulos',
    'settings.deactivateAll': 'Desactivar todos los módulos',
    'settings.activeModules': 'módulos activos',
    'settings.inactiveModules': 'módulos inactivos',
    'settings.navigationPreview': 'Vista Previa de Navegación',
    'settings.visibleModules': 'Módulos que aparecerán en el menú:',
    'settings.moduleInfo': 'Los módulos desactivados no serán visibles en la navegación. Esta acción no afecta los datos existentes.',
    'settings.summary': 'Resumen de Configuración',
    'settings.summarySubtitle': 'Vista general de la configuración actual de la aplicación',
    'settings.currencyConfig': 'Configuración de Moneda',
    'settings.languageConfig': 'Configuración de Idioma',
    'settings.moduleConfig': 'Configuración de Módulos',
    'settings.quickActions': 'Acciones Rápidas',
    'settings.currencyLabel': 'Moneda:',
    'settings.symbolLabel': 'Símbolo:',
    'settings.codeLabel': 'Código:',
    'settings.languageLabel': 'Idioma:',
    'settings.activeModulesCount': 'Módulos Activos',
    'settings.inactiveModulesCount': 'Módulos Inactivos',
    'settings.totalModules': 'Total de Módulos',
    'settings.preview': 'Ejemplo de Visualización',
    'settings.price': 'Precio',
    'settings.total': 'Total',
    'settings.budget': 'Presupuesto',

    // Devises
    'currency.xaf': 'Franco CFA',
    'currency.eur': 'Euro',
    'currency.usd': 'Dólar Estadounidense',
    'currency.gbp': 'Libra Esterlina',

    // Langues
    'language.fr': 'Français',
    'language.en': 'English',
    'language.es': 'Español',

    // Modules
    'module.dashboard': 'Panel de Control',
    'module.projects': 'Proyectos',
    'module.tasks': 'Tareas',
    'module.employees': 'Empleados',
    'module.stocks': 'Inventario',
    'module.sellers': 'Vendedores',
    'module.sales': 'Ventas',
    'module.purchases': 'Compras',
    'module.deliveries': 'Entregas',
    'module.marketing': 'Marketing',
    'module.finance': 'Finanzas',
    'module.documents': 'Documentos',
    'module.profile': 'Perfil',

    // Général
    'general.yes': 'Sí',
    'general.no': 'No',
    'general.ok': 'OK',
    'general.back': 'Atrás',
    'general.next': 'Siguiente',
    'general.previous': 'Anterior',
    'general.search': 'Buscar',
    'general.filter': 'Filtrar',
    'general.sort': 'Ordenar',
    'general.refresh': 'Actualizar',
    'general.export': 'Exportar',
    'general.import': 'Importar',
    'general.download': 'Descargar',
    'general.upload': 'Subir',

    // Panel de Control
    'dashboard.welcome': 'Bienvenido',
    'dashboard.user': 'Usuario',
    'dashboard.quickStats': 'Estadísticas Rápidas',
    'dashboard.statsDescription': 'Vista general del rendimiento',
    'dashboard.recentActivity': 'Actividad Reciente',
    'dashboard.activityDescription': 'Últimas acciones realizadas',
    'dashboard.tasks': 'Tareas',
    'dashboard.tasksDescription': 'Tareas actuales y próximas',
    'dashboard.notifications': 'Notificaciones',
    'dashboard.notificationsDescription': 'Mensajes y alertas recientes',
    'dashboard.languageInfo': 'Información del Idioma',
    'dashboard.languageInfoText': 'El idioma de la aplicación se puede cambiar en la configuración. Todos los textos se adaptarán automáticamente a su elección.',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState('fr');

  useEffect(() => {
    // Charger la langue depuis localStorage
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage && translations[savedLanguage as keyof typeof translations]) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: string) => {
    if (translations[lang as keyof typeof translations]) {
      setLanguageState(lang);
      localStorage.setItem('appLanguage', lang);
    }
  };

  const t = (key: string): string => {
    const currentTranslations = translations[language as keyof typeof translations];
    return currentTranslations[key as keyof typeof currentTranslations] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
