import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Facebook, Instagram, Linkedin, Twitter, Plus, RefreshCcw, AlertCircle } from 'lucide-react';
import { useMarketing } from '../../hooks/useMarketing';

const platformConfig = {
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: 'text-[#1877F2]',
    bgColor: 'bg-blue-100'
  },
  instagram: {
    name: 'Instagram',
    icon: Instagram,
    color: 'text-[#E4405F]',
    bgColor: 'bg-pink-100'
  },
  linkedin: {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'text-[#0A66C2]',
    bgColor: 'bg-blue-100'
  },
  twitter: {
    name: 'Twitter',
    icon: Twitter,
    color: 'text-[#1DA1F2]',
    bgColor: 'bg-blue-100'
  }
} as const;

export function MarketingSettings() {
  const { socialConnections, connectSocialMedia, refreshToken, isLoading } = useMarketing();

  const handleConnect = async (platform: keyof typeof platformConfig) => {
    try {
      await connectSocialMedia.mutateAsync(platform);
    } catch (error) {
      console.error(`Erreur lors de la connexion à ${platform}:`, error);
    }
  };

  const handleRefreshToken = async (connectionId: string) => {
    try {
      await refreshToken.mutateAsync(connectionId);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Configuration Marketing</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos connexions aux réseaux sociaux
          </p>
        </div>
      </div>

      <Card>
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Réseaux sociaux connectés</h2>
          
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(platformConfig).map(([platform, config]) => {
              const connection = socialConnections?.find(
                conn => conn.platform === platform
              );
              const Icon = config.icon;

              return (
                <div
                  key={platform}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${config.bgColor}`}>
                      <Icon className={`h-6 w-6 ${config.color}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {config.name}
                      </h3>
                      {connection ? (
                        <div className="mt-1 flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {connection.account_name}
                          </span>
                          <Badge
                            variant={connection.status === 'active' ? 'success' : 'warning'}
                          >
                            {connection.status === 'active' ? 'Connecté' : 'Expiré'}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">
                          Non connecté
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {connection ? (
                      <>
                        {connection.status === 'expired' && (
                          <div className="flex items-center text-amber-500 text-sm mr-2">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Token expiré
                          </div>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleRefreshToken(connection.id)}
                          disabled={isLoading}
                        >
                          <RefreshCcw className="h-4 w-4 mr-2" />
                          Actualiser
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => handleConnect(platform as keyof typeof platformConfig)}
                        disabled={isLoading}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Connecter
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Paramètres de publication</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900">
                Approbation des publications
              </h3>
              <p className="text-sm text-gray-500">
                Définissez qui peut approuver les publications avant leur mise en ligne
              </p>
              {/* Ajouter les contrôles de paramètres ici */}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900">
                Planification automatique
              </h3>
              <p className="text-sm text-gray-500">
                Configurez les meilleurs moments pour publier sur chaque plateforme
              </p>
              {/* Ajouter les contrôles de paramètres ici */}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Intégrations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900">
                API Marketing
              </h3>
              <p className="text-sm text-gray-500">
                Gérez vos clés API et webhooks pour les intégrations tierces
              </p>
              {/* Ajouter les contrôles d'API ici */}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900">
                Analytics
              </h3>
              <p className="text-sm text-gray-500">
                Configurez l'intégration avec Google Analytics et autres outils
              </p>
              {/* Ajouter les contrôles d'analytics ici */}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 