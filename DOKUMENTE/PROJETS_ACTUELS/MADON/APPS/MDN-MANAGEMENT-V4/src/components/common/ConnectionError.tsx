import React from 'react';
import { Button } from '../ui/Button';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';

interface ConnectionErrorProps {
  error?: string;
  onRetry?: () => void;
  isOffline?: boolean;
}

export function ConnectionError({ error, onRetry, isOffline = false }: ConnectionErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          {isOffline ? (
            <WifiOff className="mx-auto h-16 w-16 text-red-500" />
          ) : (
            <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500" />
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {isOffline ? 'Hors ligne' : 'Erreur de connexion'}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {isOffline 
            ? 'Vérifiez votre connexion internet et réessayez.'
            : error || 'Impossible de se connecter au serveur. Veuillez réessayer.'
          }
        </p>
        
        {onRetry && (
          <Button
            onClick={onRetry}
            className="w-full"
            variant="outline"
          >
            <Wifi className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
        )}
        
        <div className="mt-4 text-sm text-gray-500">
          Si le problème persiste, contactez l'administrateur.
        </div>
      </div>
    </div>
  );
}
