import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface SessionConfig {
  timeoutMinutes: number;
  warningMinutes: number;
  autoLogout: boolean;
}

interface SessionInfo {
  startTime: number;
  lastActivity: number;
  expiresAt: number;
  isExpired: boolean;
  timeRemaining: number;
  warningActive: boolean;
}

const DEFAULT_SESSION_CONFIG: SessionConfig = {
  timeoutMinutes: 30, // Session expire après 30 minutes
  warningMinutes: 5,  // Avertissement 5 minutes avant expiration
  autoLogout: true    // Déconnexion automatique
};

export const useSession = (config: Partial<SessionConfig> = {}) => {
  const { user, logout } = useAuth();
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  
  const finalConfig = { ...DEFAULT_SESSION_CONFIG, ...config };

  // Initialiser la session
  const initializeSession = useCallback(() => {
    if (!user) return;

    const now = Date.now();
    const expiresAt = now + (finalConfig.timeoutMinutes * 60 * 1000);
    
    const session: SessionInfo = {
      startTime: now,
      lastActivity: now,
      expiresAt,
      isExpired: false,
      timeRemaining: finalConfig.timeoutMinutes * 60 * 1000,
      warningActive: false
    };

    setSessionInfo(session);
    localStorage.setItem('sessionInfo', JSON.stringify(session));
  }, [user, finalConfig.timeoutMinutes]);

  // Mettre à jour l'activité
  const updateActivity = useCallback(() => {
    setSessionInfo(prevSession => {
      if (!prevSession) return null;

      const now = Date.now();
      const updatedSession = {
        ...prevSession,
        lastActivity: now,
        expiresAt: now + (finalConfig.timeoutMinutes * 60 * 1000),
        timeRemaining: finalConfig.timeoutMinutes * 60 * 1000,
        warningActive: false
      };

      localStorage.setItem('sessionInfo', JSON.stringify(updatedSession));
      setShowWarning(false);
      return updatedSession;
    });
  }, [finalConfig.timeoutMinutes]);

  // Monitoring de la session
  const startSessionMonitoring = useCallback(() => {
    const interval = setInterval(() => {
      setSessionInfo(prevSession => {
        if (!prevSession) return null;

        const now = Date.now();
        const timeRemaining = prevSession.expiresAt - now;
        const warningTime = finalConfig.warningMinutes * 60 * 1000;

        if (timeRemaining <= 0) {
          // Session expirée
          if (finalConfig.autoLogout) {
            logout();
            alert('Votre session a expiré. Veuillez vous reconnecter.');
          }
          clearInterval(interval);
          return null;
        }

        if (timeRemaining <= warningTime && !prevSession.warningActive) {
          // Afficher l'avertissement
          setShowWarning(true);
          return { ...prevSession, warningActive: true, timeRemaining };
        }

        // Mettre à jour le temps restant
        return { ...prevSession, timeRemaining };
      });
    }, 1000); // Vérifier chaque seconde

    return () => clearInterval(interval);
  }, [finalConfig, logout]);

  // Écouter les événements d'activité
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      updateActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [updateActivity]);

  // Initialiser la session au montage
  useEffect(() => {
    if (user) {
      initializeSession();
    }
  }, [user, initializeSession]);

  // Restaurer la session depuis localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem('sessionInfo');
    if (savedSession && user) {
      const session = JSON.parse(savedSession);
      const now = Date.now();
      
      if (session.expiresAt > now) {
        setSessionInfo(session);
      } else {
        // Session expirée, se déconnecter
        logout();
      }
    }
  }, [user, logout]);

  // Démarrer le monitoring quand sessionInfo change
  useEffect(() => {
    if (sessionInfo) {
      const cleanup = startSessionMonitoring();
      return cleanup;
    }
  }, [sessionInfo, startSessionMonitoring]);

  // Formater le temps restant
  const formatTimeRemaining = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Prolonger la session
  const extendSession = useCallback(() => {
    updateActivity();
  }, [updateActivity]);

  return {
    sessionInfo,
    showWarning,
    timeRemaining: sessionInfo?.timeRemaining || 0,
    formatTimeRemaining,
    extendSession,
    updateActivity,
    isExpired: sessionInfo?.isExpired || false
  };
};


