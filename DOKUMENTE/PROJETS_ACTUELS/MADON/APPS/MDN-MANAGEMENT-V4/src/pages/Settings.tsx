import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

import { 
  Settings as SettingsIcon, 
  Globe, 
  DollarSign, 
  Package, 
  Save, 
  RefreshCw,
  AlertCircle,
  Calculator,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { useSettings } from '@/contexts/SettingsContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SettingsPage() {
  const { settings, updateSettings, updateCurrency, updateLanguage, toggleModule } = useSettings();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Taux de change (exemple - dans une vraie app, cela viendrait d'une API)
  const exchangeRates = {
    XAF: { EUR: 0.00152, USD: 0.00165, GBP: 0.00130 },
    EUR: { XAF: 655.957, USD: 1.08, GBP: 0.85 },
    USD: { XAF: 606.5, EUR: 0.92, GBP: 0.79 },
    GBP: { XAF: 769.23, EUR: 1.18, USD: 1.27 }
  };

  const currencies = [
    { code: 'XAF', symbol: 'F.CFA', name: 'Franc CFA' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'USD', symbol: '$', name: 'Dollar US' },
    { code: 'GBP', symbol: '£', name: 'Livre Sterling' }
  ];

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  const handleCurrencyChange = (currencyCode: string) => {
    const selectedCurrency = currencies.find(c => c.code === currencyCode);
    if (selectedCurrency) {
      updateCurrency(selectedCurrency);
      setHasChanges(true);
      toast.success(`Devise changée vers ${selectedCurrency.name}`);
    }
  };

  const handleLanguageChange = (languageCode: string) => {
    const selectedLanguage = languages.find(l => l.code === languageCode);
    if (selectedLanguage) {
      updateLanguage(selectedLanguage);
      setHasChanges(true);
      toast.success(`Langue changée vers ${selectedLanguage.name}`);
    }
  };

  const handleModuleToggle = (moduleId: number) => {
    toggleModule(moduleId);
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    if (!hasChanges) {
      toast.info(t('settings.noChanges'));
      return;
    }

    if (!confirm(t('settings.confirm'))) {
      return;
    }

    setIsLoading(true);
    try {
      // Simuler une sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHasChanges(false);
      toast.success(t('settings.saved'));
      
      // Recharger la page pour appliquer les changements
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch {
      toast.error(t('settings.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      currency: { code: 'XAF', symbol: 'F.CFA', name: 'Franc CFA' },
      language: { code: 'fr', name: 'Français' },
      modules: settings.modules.map(module => ({ ...module, enabled: true }))
    };
    
    updateSettings(defaultSettings);
    setHasChanges(true);
    toast.info(t('settings.resetConfirm'));
  };

  const handleActivateAllModules = () => {
    const updatedSettings = {
      ...settings,
      modules: settings.modules.map(module => ({ ...module, enabled: true }))
    };
    updateSettings(updatedSettings);
    setHasChanges(true);
    toast.info(t('settings.activateAll'));
  };

  const handleDeactivateAllModules = () => {
    const updatedSettings = {
      ...settings,
      modules: settings.modules.map(module => ({ ...module, enabled: false }))
    };
    updateSettings(updatedSettings);
    setHasChanges(true);
    toast.info(t('settings.deactivateAll'));
  };

  // Fonction pour convertir les montants
  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string) => {
    if (fromCurrency === toCurrency) return amount;
    
    const rates = exchangeRates[fromCurrency as keyof typeof exchangeRates];
    if (rates && rates[toCurrency as keyof typeof rates]) {
      return amount * rates[toCurrency as keyof typeof rates];
    }
    return amount;
  };

  // Fonction pour formater les montants selon la devise
  const formatAmount = (amount: number, currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    if (!currency) return `${amount}`;
    
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h1>
          <p className="text-gray-600">{t('settings.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {t('settings.unsaved')}
            </Badge>
          )}
          <Button
            variant="outline"
            onClick={handleResetSettings}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          <Button
            onClick={handleSaveSettings}
            disabled={isLoading || !hasChanges}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                {t('message.loading')}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {t('settings.save')}
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            {t('settings.general')}
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            {t('settings.modules')}
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {t('settings.summary')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Configuration Monnaie */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Configuration Monétaire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Devise
                  </label>
                  <Select
                    value={settings.currency.code}
                    onValueChange={handleCurrencyChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{currency.symbol}</span>
                            <span className="text-gray-500">- {currency.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Symbole actuel
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                    <span className="text-2xl font-bold">{settings.currency.symbol}</span>
                    <span className="text-gray-600">({settings.currency.name})</span>
                  </div>
                </div>
              </div>

              {/* Taux de change */}
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Taux de Change
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {currencies.map((currency) => (
                    <div key={currency.code} className="p-3 border rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        1 {settings.currency.symbol} = 
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {currency.code === settings.currency.code 
                          ? '1.00' 
                          : convertAmount(1, settings.currency.code, currency.code).toFixed(4)
                        } {currency.symbol}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {t('settings.preview')}
                </h4>
                <div className="space-y-2">
                  <p className="text-blue-800">
                    {t('settings.price')}: <span className="font-bold">{formatAmount(150000, settings.currency.code)}</span>
                  </p>
                  <p className="text-blue-800">
                    {t('settings.total')}: <span className="font-bold">{formatAmount(2500000, settings.currency.code)}</span>
                  </p>
                  <p className="text-blue-800">
                    {t('settings.budget')}: <span className="font-bold">{formatAmount(15000000, settings.currency.code)}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration Langue */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Configuration Linguistique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Langue de l'interface
                </label>
                <Select
                  value={settings.language.code}
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    {languages.map((language) => (
                      <SelectItem key={language.code} value={language.code}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Langue sélectionnée</h4>
                <p className="text-green-800">
                  L'interface sera affichée en <span className="font-bold">{settings.language.name}</span>
                </p>
                <p className="text-green-700 text-sm mt-1">
                  Tous les textes de l'application seront traduits automatiquement.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Gestion des Modules
              </CardTitle>
              <p className="text-sm text-gray-600">
                Activez ou désactivez les modules selon vos besoins
              </p>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline">
                  {settings.modules.filter(m => m.enabled).length} modules actifs
                </Badge>
                <Badge variant="outline">
                  {settings.modules.filter(m => !m.enabled).length} modules inactifs
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleActivateAllModules}
                >
                  Activer tout
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeactivateAllModules}
                >
                  Désactiver tout
                </Button>
              </div>
              <div className="space-y-4">
                {settings.modules.map((module) => (
                  <div
                    key={module.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={module.enabled}
                          onCheckedChange={() => handleModuleToggle(module.id)}
                        />
                        <span className="font-medium">{module.name}</span>
                      </div>
                      <Badge variant={module.enabled ? "default" : "secondary"}>
                        {module.enabled ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {module.path}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Information</h4>
                <p className="text-yellow-800 text-sm">
                  Les modules désactivés ne seront pas visibles dans la navigation. 
                  Cette action n'affecte pas les données existantes.
                </p>
              </div>
              
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Aperçu de la navigation</h4>
                <div className="text-sm text-green-800">
                  <p className="mb-2">Modules qui apparaîtront dans le menu :</p>
                  <div className="grid grid-cols-2 gap-1">
                    {settings.modules
                      .filter(module => module.enabled)
                      .map(module => (
                        <div key={module.id} className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span>{module.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Résumé des Paramètres
              </CardTitle>
              <p className="text-sm text-gray-600">
                Aperçu de la configuration actuelle de l'application
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Configuration Monétaire */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Configuration Monétaire</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Devise :</span>
                      <span className="font-medium">{settings.currency.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Symbole :</span>
                      <span className="font-medium">{settings.currency.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Code :</span>
                      <span className="font-medium">{settings.currency.code}</span>
                    </div>
                  </div>
                </div>

                {/* Configuration Linguistique */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Configuration Linguistique</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Langue :</span>
                      <span className="font-medium">{settings.language.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Code :</span>
                      <span className="font-medium">{settings.language.code}</span>
                    </div>
                  </div>
                </div>

                {/* Modules */}
                <div className="p-4 border rounded-lg md:col-span-2">
                  <h4 className="font-medium text-gray-900 mb-3">Configuration des Modules</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {settings.modules.filter(m => m.enabled).length}
                      </div>
                      <div className="text-sm text-green-700">Modules Actifs</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {settings.modules.filter(m => !m.enabled).length}
                      </div>
                      <div className="text-sm text-red-700">Modules Inactifs</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {settings.modules.length}
                      </div>
                      <div className="text-sm text-blue-700">Total Modules</div>
                    </div>
                  </div>
                </div>

                {/* Actions Rapides */}
                <div className="p-4 border rounded-lg md:col-span-2">
                  <h4 className="font-medium text-gray-900 mb-3">Actions Rapides</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetSettings}
                    >
                      Réinitialiser tout
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleActivateAllModules}
                    >
                      Activer tous les modules
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeactivateAllModules}
                    >
                      Désactiver tous les modules
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
