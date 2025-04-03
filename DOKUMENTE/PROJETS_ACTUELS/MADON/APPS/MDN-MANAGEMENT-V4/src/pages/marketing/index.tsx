import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Settings } from 'lucide-react';
import { MarketingSettings } from '../../components/marketing/MarketingSettings';
import { useToast } from '../../hooks/useToast';
import type { MarketingConfig } from '../../types';

export default function Marketing() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();

  const handleSettingsSave = async (config: MarketingConfig) => {
    try {
      // Ici, vous pouvez sauvegarder la configuration dans Supabase ou un autre stockage
      console.log('Configuration sauvegardée:', config);
      toast({
        title: 'Configuration sauvegardée',
        description: 'Les paramètres de marketing ont été mis à jour avec succès.',
        type: 'success'
      });
      setIsSettingsOpen(false);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde des paramètres.',
        type: 'error'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Marketing</h1>
        <Button
          variant="secondary"
          onClick={() => setIsSettingsOpen(true)}
        >
          <Settings className="w-4 h-4 mr-2" />
          Paramètres
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Réseaux Sociaux</h3>
            <p className="text-gray-500 text-sm mb-4">
              Gérez vos comptes de réseaux sociaux et planifiez vos publications.
            </p>
            {/* Contenu des réseaux sociaux */}
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Email Marketing</h3>
            <p className="text-gray-500 text-sm mb-4">
              Créez et suivez vos campagnes email.
            </p>
            {/* Contenu email marketing */}
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-500 text-sm mb-4">
              Suivez les performances de vos campagnes marketing.
            </p>
            {/* Contenu analytics */}
          </div>
        </Card>
      </div>

      <MarketingSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSubmit={handleSettingsSave}
      />
    </div>
  );
} 