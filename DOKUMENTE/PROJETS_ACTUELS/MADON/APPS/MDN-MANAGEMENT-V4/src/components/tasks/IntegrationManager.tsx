import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { 
  Plug, 
  Plus, 
  Search,
  Edit3,
  Trash2,
  Play,
  Pause,
  Settings,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Download,
  Upload,
  TestTube,
  RefreshCw,
  ExternalLink,
  Key,
  Webhook
} from 'lucide-react';
import { useIntegrations } from '../../hooks/useIntegrations';
import { useAuth } from '../../contexts/AuthContext';

export function IntegrationManager() {
  const { user } = useAuth();
  const {
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
    createApiCredential,
    getActiveIntegrations,
    getIntegrationsByType,
    getIntegrationStats,
    exportData,
    importData
  } = useIntegrations();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<string | null>(null);
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  // Formulaire de création/édition
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'webhook' as 'webhook' | 'api' | 'oauth' | 'import' | 'export',
    configuration: {} as Record<string, any>,
    status: 'inactive' as 'active' | 'inactive' | 'error' | 'pending'
  });

  const stats = getIntegrationStats();
  const filteredIntegrations = React.useMemo(() => {
    let filtered = searchQuery ? 
      integrations.filter(i => 
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) : integrations;
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(integration => integration.type === selectedType);
    }
    
    if (showActiveOnly) {
      filtered = filtered.filter(integration => integration.status === 'active');
    }
    
    return filtered;
  }, [integrations, searchQuery, selectedType, showActiveOnly]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'webhook': return <Webhook className="h-4 w-4" />;
      case 'api': return <Key className="h-4 w-4" />;
      case 'oauth': return <ExternalLink className="h-4 w-4" />;
      case 'import': return <Upload className="h-4 w-4" />;
      case 'export': return <Download className="h-4 w-4" />;
      default: return <Plug className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'webhook': return 'bg-blue-100 text-blue-800';
      case 'api': return 'bg-green-100 text-green-800';
      case 'oauth': return 'bg-purple-100 text-purple-800';
      case 'import': return 'bg-orange-100 text-orange-800';
      case 'export': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateIntegration = () => {
    if (!formData.name.trim()) return;

    const integrationData = {
      ...formData,
      configuration: formData.configuration
    };

    createIntegration(integrationData);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      type: 'webhook',
      configuration: {},
      status: 'inactive'
    });
    setIsCreating(false);
  };

  const handleEditIntegration = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (integration) {
      setFormData({
        name: integration.name,
        description: integration.description,
        type: integration.type,
        configuration: integration.configuration,
        status: integration.status
      });
      setEditingIntegration(integrationId);
      setIsCreating(true);
    }
  };

  const handleSaveEdit = () => {
    if (!editingIntegration || !formData.name.trim()) return;

    const updates = {
      ...formData,
      configuration: formData.configuration
    };

    updateIntegration(editingIntegration, updates);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      type: 'webhook',
      configuration: {},
      status: 'inactive'
    });
    setEditingIntegration(null);
    setIsCreating(false);
  };

  const handleDeleteIntegration = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (integration && confirm(`Êtes-vous sûr de vouloir supprimer l'intégration "${integration.name}" ?`)) {
      deleteIntegration(integrationId);
    }
  };

  const handleToggleIntegration = (integrationId: string) => {
    toggleIntegration(integrationId);
  };

  const handleTestIntegration = async (integrationId: string) => {
    await testIntegration(integrationId);
  };

  const handleSyncIntegration = async (integrationId: string) => {
    await syncIntegration(integrationId);
  };

  const cancelForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'webhook',
      configuration: {},
      status: 'inactive'
    });
    setEditingIntegration(null);
    setIsCreating(false);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        importData(data);
      } catch (error) {
        console.error('Erreur lors de l\'import du fichier:', error);
        alert('Erreur lors de l\'import du fichier. Vérifiez le format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gestion des Intégrations</h2>
          <p className="text-gray-600">Connectez votre système avec des services externes</p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".json"
            onChange={handleFileImport}
            className="hidden"
            id="import-file"
          />
          <Button variant="outline" onClick={() => document.getElementById('import-file')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button variant="outline" onClick={() => exportData('json')}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Intégration
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Plug className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total intégrations</p>
                <p className="text-lg font-semibold">{stats.totalIntegrations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Actives</p>
                <p className="text-lg font-semibold">{stats.activeIntegrations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <RefreshCw className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Synchronisations</p>
                <p className="text-lg font-semibold">{stats.totalSyncs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Webhook className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Événements webhook</p>
                <p className="text-lg font-semibold">{stats.totalWebhookEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Taux de succès</p>
                <p className="text-lg font-semibold">{Math.round(stats.successRate)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulaire de création/édition */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingIntegration ? 'Modifier l\'intégration' : 'Créer une nouvelle intégration'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'intégration *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Slack Notifications"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="webhook">Webhook</option>
                  <option value="api">API</option>
                  <option value="oauth">OAuth</option>
                  <option value="import">Import</option>
                  <option value="export">Export</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description de l'intégration..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.status === 'active'}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  status: e.target.checked ? 'active' : 'inactive' 
                }))}
                className="rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Intégration active
              </label>
            </div>

            <div className="flex gap-2">
              <Button onClick={editingIntegration ? handleSaveEdit : handleCreateIntegration}>
                {editingIntegration ? 'Sauvegarder' : 'Créer l\'intégration'}
              </Button>
              <Button variant="outline" onClick={cancelForm}>
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une intégration..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="lg:w-48">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les types</option>
                <option value="webhook">Webhook</option>
                <option value="api">API</option>
                <option value="oauth">OAuth</option>
                <option value="import">Import</option>
                <option value="export">Export</option>
              </select>
            </div>
            <Button
              variant={showActiveOnly ? "default" : "outline"}
              onClick={() => setShowActiveOnly(!showActiveOnly)}
              className="flex items-center gap-2"
            >
              {showActiveOnly ? <CheckCircle className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              Actives seulement
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des intégrations */}
      <Card>
        <CardHeader>
          <CardTitle>Intégrations ({filteredIntegrations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredIntegrations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Plug className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>Aucune intégration trouvée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredIntegrations.map((integration) => (
                <div key={integration.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{integration.name}</h3>
                          <Badge className={getTypeColor(integration.type)}>
                            {getTypeIcon(integration.type)}
                            {integration.type}
                          </Badge>
                          <Badge className={getStatusColor(integration.status)}>
                            {integration.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleTestIntegration(integration.id)}
                          disabled={loading}
                        >
                          <TestTube className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSyncIntegration(integration.id)}
                          disabled={loading || integration.status !== 'active'}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleIntegration(integration.id)}
                        >
                          {integration.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditIntegration(integration.id)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteIntegration(integration.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Dernière sync:</span>
                        <span className="ml-1 text-gray-600">
                          {integration.lastSync ? new Date(integration.lastSync).toLocaleString('fr-FR') : 'Jamais'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Synchronisations:</span>
                        <span className="ml-1 text-gray-600">{integration.syncCount}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Créé le:</span>
                        <span className="ml-1 text-gray-600">
                          {new Date(integration.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    {integration.errorMessage && (
                      <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        <strong>Erreur:</strong> {integration.errorMessage}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
