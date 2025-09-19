import React from 'react';
import { Button } from './Button';
import { useNotificationContext } from '../../contexts/NotificationContext';

export function NotificationTest() {
  const { notifySuccess, notifyError, notifyInfo, notifyWarning } = useNotificationContext();

  const testNotifications = () => {
    // Notification de succès
    notifySuccess('Opération effectuée avec succès !', 'Succès');
    
    // Notification d'erreur après 1 seconde
    setTimeout(() => {
      notifyError('Une erreur est survenue lors du traitement.', 'Erreur');
    }, 1000);
    
    // Notification d'information après 2 secondes
    setTimeout(() => {
      notifyInfo('Nouvelle mise à jour disponible.', 'Information');
    }, 2000);
    
    // Notification d'avertissement après 3 secondes
    setTimeout(() => {
      notifyWarning('Attention : Session expirant dans 5 minutes.', 'Avertissement');
    }, 3000);
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Test des Notifications</h3>
      <p className="text-sm text-gray-600 mb-4">
        Cliquez sur le bouton pour tester le système de notifications.
      </p>
      <Button onClick={testNotifications} className="w-full">
        Tester les Notifications
      </Button>
    </div>
  );
}
