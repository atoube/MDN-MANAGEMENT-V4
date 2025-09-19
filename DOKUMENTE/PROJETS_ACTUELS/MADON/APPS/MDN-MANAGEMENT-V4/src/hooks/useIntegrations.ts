import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface Integration {
  id: string;
  name: string;
  description: string;
  type: 'webhook' | 'api' | 'oauth' | 'import' | 'export';
  status: 'active' | 'inactive' | 'error' | 'pending';
  configuration: Record<string, any>;
  lastSync?: string;
  syncCount: number;
  errorMessage?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookEvent {
  id: string;
  integrationId: string;
  eventType: string;
  payload: Record<string, any>;
  status: 'pending' | 'success' | 'failed';
  attempts: number;
  lastAttempt?: string;
  errorMessage?: string;
  createdAt: string;
}

export interface APICredential {
  id: string;
  name: string;
  type: 'bearer' | 'api_key' | 'basic' | 'oauth2';
  value: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export function useIntegrations() {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);
  const [apiCredentials, setApiCredentials] = useState<APICredential[]>([]);
  const [loading, setIsLoading] = useState(false);

  // Intégrations prédéfinies
  const predefinedIntegrations: Integration[] = [
    {
      id: 'integration-1',
      name: 'Slack Notifications',
      description: 'Envoie des notifications Slack pour les événements de tâches',
      type: 'webhook',
      status: 'inactive',
      configuration: {
        webhookUrl: '',
        events: ['task_created', 'task_completed', 'task_assigned'],
        channel: '#tasks'
      },
      syncCount: 0,
      createdBy: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'integration-2',
      name: 'GitHub Issues',
      description: 'Synchronise les tâches avec les issues GitHub',
      type: 'oauth',
      status: 'inactive',
      configuration: {
        repository: '',
        autoCreate: true,
        syncLabels: true
      },
      syncCount: 0,
      createdBy: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'integration-3',
      name: 'Google Calendar',
      description: 'Synchronise les échéances avec Google Calendar',
      type: 'oauth',
      status: 'inactive',
      configuration: {
        calendarId: '',
        syncDeadlines: true,
        createEvents: true
      },
      syncCount: 0,
      createdBy: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'integration-4',
      name: 'Export CSV',
      description: 'Exporte les tâches en format CSV',
      type: 'export',
      status: 'active',
      configuration: {
        format: 'csv',
        fields: ['title', 'status', 'priority', 'assigned_to', 'due_date'],
        schedule: 'manual'
      },
      syncCount: 0,
      createdBy: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'integration-5',
      name: 'Import Trello',
      description: 'Importe les cartes depuis Trello',
      type: 'import',
      status: 'inactive',
      configuration: {
        boardId: '',
        listMapping: {},
        preserveLabels: true
      },
      syncCount: 0,
      createdBy: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedIntegrations = localStorage.getItem('integrations');
    const savedWebhookEvents = localStorage.getItem('webhookEvents');
    const savedApiCredentials = localStorage.getItem('apiCredentials');
    
    if (savedIntegrations) {
      try {
        const parsedIntegrations = JSON.parse(savedIntegrations);
        setIntegrations(parsedIntegrations);
      } catch (error) {
        console.error('Erreur lors du chargement des intégrations:', error);
        setIntegrations(predefinedIntegrations);
        localStorage.setItem('integrations', JSON.stringify(predefinedIntegrations));
      }
    } else {
      setIntegrations(predefinedIntegrations);
      localStorage.setItem('integrations', JSON.stringify(predefinedIntegrations));
    }

    if (savedWebhookEvents) {
      try {
        const parsedEvents = JSON.parse(savedWebhookEvents);
        setWebhookEvents(parsedEvents);
      } catch (error) {
        console.error('Erreur lors du chargement des événements webhook:', error);
      }
    }

    if (savedApiCredentials) {
      try {
        const parsedCredentials = JSON.parse(savedApiCredentials);
        setApiCredentials(parsedCredentials);
      } catch (error) {
        console.error('Erreur lors du chargement des credentials API:', error);
      }
    }
  }, []);

  // Sauvegarder les intégrations
  const saveIntegrations = useCallback((newIntegrations: Integration[]) => {
    localStorage.setItem('integrations', JSON.stringify(newIntegrations));
    setIntegrations(newIntegrations);
  }, []);

  // Sauvegarder les événements webhook
  const saveWebhookEvents = useCallback((newEvents: WebhookEvent[]) => {
    localStorage.setItem('webhookEvents', JSON.stringify(newEvents));
    setWebhookEvents(newEvents);
  }, []);

  // Sauvegarder les credentials API
  const saveApiCredentials = useCallback((newCredentials: APICredential[]) => {
    localStorage.setItem('apiCredentials', JSON.stringify(newCredentials));
    setApiCredentials(newCredentials);
  }, []);

  // Créer une nouvelle intégration
  const createIntegration = useCallback((integrationData: Omit<Integration, 'id' | 'createdBy' | 'createdAt' | 'updatedAt' | 'syncCount'>) => {
    if (!user) return;

    const newIntegration: Integration = {
      ...integrationData,
      id: `integration-${Date.now()}`,
      createdBy: user.id.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncCount: 0
    };

    const updatedIntegrations = [...integrations, newIntegration];
    saveIntegrations(updatedIntegrations);
    
    console.log('✅ Intégration créée:', newIntegration.name);
    return newIntegration;
  }, [integrations, saveIntegrations, user]);

  // Mettre à jour une intégration
  const updateIntegration = useCallback((integrationId: string, updates: Partial<Integration>) => {
    const updatedIntegrations = integrations.map(integration =>
      integration.id === integrationId
        ? { ...integration, ...updates, updatedAt: new Date().toISOString() }
        : integration
    );
    
    saveIntegrations(updatedIntegrations);
    console.log('✅ Intégration mise à jour:', integrationId);
  }, [integrations, saveIntegrations]);

  // Supprimer une intégration
  const deleteIntegration = useCallback((integrationId: string) => {
    const updatedIntegrations = integrations.filter(integration => integration.id !== integrationId);
    saveIntegrations(updatedIntegrations);
    console.log('✅ Intégration supprimée:', integrationId);
  }, [integrations, saveIntegrations]);

  // Activer/Désactiver une intégration
  const toggleIntegration = useCallback((integrationId: string) => {
    const updatedIntegrations = integrations.map(integration =>
      integration.id === integrationId
        ? { 
            ...integration, 
            status: integration.status === 'active' ? 'inactive' : 'active',
            updatedAt: new Date().toISOString()
          }
        : integration
    );
    
    saveIntegrations(updatedIntegrations);
    console.log('✅ Intégration togglée:', integrationId);
  }, [integrations, saveIntegrations]);

  // Tester une intégration
  const testIntegration = useCallback(async (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration) return false;

    setIsLoading(true);
    
    try {
      // Simuler un test d'intégration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mettre à jour le statut
      updateIntegration(integrationId, { 
        status: 'active',
        lastSync: new Date().toISOString(),
        errorMessage: undefined
      });
      
      console.log('✅ Test d\'intégration réussi:', integration.name);
      return true;
    } catch (error) {
      updateIntegration(integrationId, { 
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Erreur inconnue'
      });
      
      console.error('❌ Test d\'intégration échoué:', integration.name, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [integrations, updateIntegration]);

  // Synchroniser une intégration
  const syncIntegration = useCallback(async (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration || integration.status !== 'active') return false;

    setIsLoading(true);
    
    try {
      // Simuler une synchronisation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mettre à jour les statistiques
      updateIntegration(integrationId, { 
        lastSync: new Date().toISOString(),
        syncCount: integration.syncCount + 1,
        errorMessage: undefined
      });
      
      console.log('✅ Synchronisation réussie:', integration.name);
      return true;
    } catch (error) {
      updateIntegration(integrationId, { 
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Erreur de synchronisation'
      });
      
      console.error('❌ Synchronisation échouée:', integration.name, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [integrations, updateIntegration]);

  // Créer un événement webhook
  const createWebhookEvent = useCallback((eventData: Omit<WebhookEvent, 'id' | 'createdAt' | 'attempts'>) => {
    const newEvent: WebhookEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
      createdAt: new Date().toISOString(),
      attempts: 0
    };

    const updatedEvents = [...webhookEvents, newEvent];
    saveWebhookEvents(updatedEvents);
    
    console.log('✅ Événement webhook créé:', newEvent.eventType);
    return newEvent;
  }, [webhookEvents, saveWebhookEvents]);

  // Créer des credentials API
  const createApiCredential = useCallback((credentialData: Omit<APICredential, 'id' | 'createdAt'>) => {
    const newCredential: APICredential = {
      ...credentialData,
      id: `credential-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const updatedCredentials = [...apiCredentials, newCredential];
    saveApiCredentials(updatedCredentials);
    
    console.log('✅ Credential API créé:', newCredential.name);
    return newCredential;
  }, [apiCredentials, saveApiCredentials]);

  // Obtenir les intégrations actives
  const getActiveIntegrations = useCallback(() => {
    return integrations.filter(integration => integration.status === 'active');
  }, [integrations]);

  // Obtenir les intégrations par type
  const getIntegrationsByType = useCallback((type: string) => {
    return integrations.filter(integration => integration.type === type);
  }, [integrations]);

  // Obtenir les statistiques des intégrations
  const getIntegrationStats = useCallback(() => {
    const totalIntegrations = integrations.length;
    const activeIntegrations = integrations.filter(i => i.status === 'active').length;
    const totalSyncs = integrations.reduce((sum, i) => sum + i.syncCount, 0);
    const totalWebhookEvents = webhookEvents.length;
    const successfulEvents = webhookEvents.filter(e => e.status === 'success').length;

    return {
      totalIntegrations,
      activeIntegrations,
      totalSyncs,
      totalWebhookEvents,
      successfulEvents,
      successRate: totalWebhookEvents > 0 ? (successfulEvents / totalWebhookEvents) * 100 : 0
    };
  }, [integrations, webhookEvents]);

  // Exporter les données
  const exportData = useCallback((format: 'json' | 'csv' = 'json') => {
    const data = {
      integrations,
      webhookEvents,
      apiCredentials,
      exportedAt: new Date().toISOString()
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `integrations-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      // Convertir en CSV (simplifié)
      const csvContent = [
        'Integration Name,Type,Status,Last Sync,Sync Count',
        ...integrations.map(i => `${i.name},${i.type},${i.status},${i.lastSync || 'Never'},${i.syncCount}`)
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `integrations-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }

    console.log('✅ Données exportées:', format);
  }, [integrations, webhookEvents, apiCredentials]);

  // Importer les données
  const importData = useCallback((data: any) => {
    try {
      if (data.integrations) {
        setIntegrations(data.integrations);
        localStorage.setItem('integrations', JSON.stringify(data.integrations));
      }
      if (data.webhookEvents) {
        setWebhookEvents(data.webhookEvents);
        localStorage.setItem('webhookEvents', JSON.stringify(data.webhookEvents));
      }
      if (data.apiCredentials) {
        setApiCredentials(data.apiCredentials);
        localStorage.setItem('apiCredentials', JSON.stringify(data.apiCredentials));
      }
      
      console.log('✅ Données importées avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de l\'import:', error);
      return false;
    }
  }, []);

  return {
    integrations,
    webhookEvents,
    apiCredentials,
    loading,
    createIntegration,
    updateIntegration,
    deleteIntegration,
    toggleIntegration,
    testIntegration,
    syncIntegration,
    createWebhookEvent,
    createApiCredential,
    getActiveIntegrations,
    getIntegrationsByType,
    getIntegrationStats,
    exportData,
    importData
  };
}
