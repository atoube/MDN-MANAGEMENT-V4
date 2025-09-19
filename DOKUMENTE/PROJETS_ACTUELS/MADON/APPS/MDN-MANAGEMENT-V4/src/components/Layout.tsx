import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Truck,
  Package,
  Store,
  ClipboardList,
  Share2,
  DollarSign,
  LogOut,
  Menu,
  X,
  Settings,
  BookOpen,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useSession } from '../hooks/useSession';
import { useAudit } from '../hooks/useAudit';
import { useProfilePhoto } from '../hooks/useProfilePhoto';
import { UserAvatar } from './profile/AvatarSelector';
import { NotificationBell } from './ui/NotificationBell';
import { NotificationCenter } from './notifications/NotificationCenter';
import { ConnectionError } from './common/ConnectionError';
import { EmployeesInitializer } from './EmployeesInitializer';
import { SessionWarning } from './ui/SessionWarning';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionError, setConnectionError] = useState<string | undefined>(undefined);
  const { profilePhoto, avatarId, user: profileUser } = useProfilePhoto();
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, logout } = useAuth();
  const { getEnabledModules } = useSettings();
  const { t } = useLanguage();
  const { showWarning, timeRemaining, extendSession } = useSession();
  const { logLogout, logAccess } = useAudit();
  const modules = getEnabledModules();

  // Initialiser l'utilisateur si nécessaire

  // Écouter les événements de mise à jour du profil utilisateur
  useEffect(() => {
    const handleUserProfileUpdate = (e: CustomEvent) => {
      if (e.detail.user) {
        console.log('🔄 Mise à jour du profil utilisateur dans Layout');
        // L'utilisateur sera mis à jour automatiquement via useAuth
      }
    };

    window.addEventListener('userProfileUpdated', handleUserProfileUpdate as EventListener);
    
    return () => {
      window.removeEventListener('userProfileUpdated', handleUserProfileUpdate as EventListener);
    };
  }, []);

  // Vérifier la connectivité
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Pour l'instant, on considère que la connexion est OK en mode développement
        setConnectionError(undefined);
      } catch {
        setConnectionError('Erreur de connexion');
      }
    };

    checkConnection();

    // Écouter les changements de connectivité
    const handleOnline = () => {
      setIsOnline(true);
      setConnectionError(undefined);
      checkConnection();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setConnectionError('Connexion internet perdue');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Tracer l'accès à la page actuelle
  useEffect(() => {
    if (user && location.pathname) {
      logAccess('system', location.pathname);
    }
  }, [location.pathname, user, logAccess]);

  const handleSignOut = async () => {
    try {
      logLogout(); // Log de déconnexion
      logout();
      navigate('/auth');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleRetryConnection = () => {
    setConnectionError(undefined);
    window.location.reload();
  };

  // Afficher l'erreur de connexion si nécessaire
  if (connectionError || !isOnline) {
    return (
      <ConnectionError
        error={connectionError}
        isOffline={!isOnline}
        onRetry={handleRetryConnection}
      />
    );
  }

  // const isAdmin = user?.email === 'admin@example.com'; // Simplified admin check


  const navigation = modules
    .filter((module) => {
      // Filtrer les modules admin-only si l'utilisateur n'est pas admin
      if (module.adminOnly && user?.role !== 'admin') {
        return false;
      }
      return true;
    })
    .map((module) => {
      // Créer une clé de traduction basée sur le nom du module
      const moduleKey = module.name.toLowerCase().replace(/\s+/g, '');
      const translatedName = t(`module.${moduleKey}`);
      
      return {
        name: translatedName !== `module.${moduleKey}` ? translatedName : module.name,
        href: module.path,
        icon: getIconComponent(module.icon),
        current: location.pathname === module.path,
      };
    });


  return (
    <>
      <EmployeesInitializer />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar pour mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800">
          <div className="flex h-16 items-center justify-between px-4">
            <Link 
              to="/" 
              className="text-xl font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              MADON
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              aria-label="Fermer le menu"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  item.current
                    ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
                aria-current={item.current ? 'page' : undefined}
              >
                <item.icon
                  className={`mr-3 h-6 w-6 flex-shrink-0 ${
                    item.current ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Section utilisateur dans la sidebar mobile */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-x-3">
              <UserAvatar
                avatar={avatarId || undefined}
                name={user ? `${user.first_name} ${user.last_name}` : undefined}
                size="md"
                className="border border-gray-200 dark:border-gray-600"
                photoUrl={profilePhoto || undefined}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/user-profile')}
                aria-label="Mon profil"
                title="Mon profil"
              >
                <User className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                aria-label="Se déconnecter"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar pour desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex h-16 items-center px-4">
            <Link 
              to="/" 
              className="text-xl font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              MADON
            </Link>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  item.current
                    ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
                aria-current={item.current ? 'page' : undefined}
              >
                <item.icon
                  className={`mr-3 h-6 w-6 flex-shrink-0 ${
                    item.current ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="lg:pl-64">
        {/* Header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <NotificationCenter />
              <Button 
                variant="ghost" 
                size="sm" 
                aria-label="Paramètres"
                onClick={() => navigate('/settings')}
              >
                <Settings className="h-6 w-6" />
              </Button>
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-gray-700" />
              <div className="flex items-center gap-x-4">
                {/* Photo de profil */}
                <div className="flex items-center gap-x-3">
                  <UserAvatar
                    avatar={avatarId || undefined}
                    name={user ? `${user.first_name} ${user.last_name}` : undefined}
                    size="sm"
                    className="border border-gray-200 dark:border-gray-600"
                    photoUrl={profilePhoto || undefined}
                  />
                  <div className="hidden sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.email}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/user-profile')}
                  aria-label="Mon profil"
                  title="Mon profil"
                >
                  <User className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  aria-label="Se déconnecter"
                >
                  <LogOut className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu de la page */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>

      <SessionWarning
        isVisible={showWarning}
        timeRemaining={timeRemaining}
        onExtend={extendSession}
        onLogout={handleSignOut}
      />
      </div>
    </>
  );
}

function getIconComponent(iconName: string) {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    LayoutDashboard,
    Users,
    Truck,
    Package,
    Store,
    ClipboardList,
    Share2,
    DollarSign,
    BookOpen,
  };
  return iconMap[iconName] || LayoutDashboard;
}