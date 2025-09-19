import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorState {
  hasError: boolean;
  error?: Error;
  message?: string;
}

export function useErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorState>({ hasError: false });

  const handleError = useCallback((error: unknown, context?: string) => {
    console.error(`Erreur${context ? ` dans ${context}` : ''}:`, error);

    let errorMessage = 'Une erreur inattendue s\'est produite';
    let shouldShowToast = true;

    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Gestion des erreurs spécifiques
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet.';
      } else if (error.message.includes('Unauthorized')) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
        shouldShowToast = false;
      } else if (error.message.includes('Forbidden')) {
        errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    setErrorState({
      hasError: true,
      error: error instanceof Error ? error : new Error(errorMessage),
      message: errorMessage
    });

    if (shouldShowToast) {
      toast.error(errorMessage);
    }

    return errorMessage;
  }, []);

  const clearError = useCallback(() => {
    setErrorState({ hasError: false });
  }, []);

  const resetError = useCallback(() => {
    setErrorState({ hasError: false });
  }, []);

  return {
    error: errorState.error,
    hasError: errorState.hasError,
    errorMessage: errorState.message,
    handleError,
    clearError,
    resetError
  };
}
