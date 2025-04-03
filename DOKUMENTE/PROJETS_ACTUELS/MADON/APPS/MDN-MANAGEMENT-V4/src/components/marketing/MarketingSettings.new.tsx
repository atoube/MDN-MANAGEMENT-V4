import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Info, X, Facebook, Instagram, Linkedin, Twitter, Save, Shield, MessageCircle, Video } from 'lucide-react';
import { MarketingConfig } from '../../types';

interface MarketingSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MarketingConfig) => void;
  config?: MarketingConfig;
}

const defaultConfig: MarketingConfig = {
  facebook: { clientId: '', clientSecret: '', redirectUri: '' },
  instagram: { clientId: '', clientSecret: '', redirectUri: '' },
  linkedin: { clientId: '', clientSecret: '', redirectUri: '' },
  twitter: { clientId: '', clientSecret: '', redirectUri: '' },
  dikalo: { clientId: '', clientSecret: '', redirectUri: '' },
  tiktok: { clientId: '', clientSecret: '', redirectUri: '' }
};

const platformIcons = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  dikalo: MessageCircle,
  tiktok: Video
} as const;

const platformColors = {
  facebook: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  instagram: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700' },
  linkedin: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  twitter: { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700' },
  dikalo: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  tiktok: { bg: 'bg-black-50', border: 'border-black-200', text: 'text-black-700' }
} as const;

export function MarketingSettings({ isOpen, onClose, onSubmit, config }: MarketingSettingsProps) {
  const [formData, setFormData] = useState<MarketingConfig>(config || defaultConfig);
  const [infoPopup, setInfoPopup] = useState<{ isOpen: boolean; title: string; content: string }>({
    isOpen: false,
    title: '',
    content: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const showInfo = (platform: string, field: string) => {
    const helpTexts: Record<string, Record<string, string>> = {
      facebook: {
        clientId: 'L\'ID client Facebook se trouve dans la console développeur Facebook sous "Applications" > "Votre App" > "Paramètres" > "De base".',
        clientSecret: 'Le secret client Facebook se trouve dans la console développeur Facebook sous "Applications" > "Votre App" > "Paramètres" > "De base".',
        redirectUri: 'L\'URI de redirection doit être configuré dans la console développeur Facebook sous "Applications" > "Votre App" > "Paramètres" > "De base" > "OAuth".'
      },
      instagram: {
        clientId: 'L\'ID client Instagram se trouve dans la console développeur Instagram sous "Applications" > "Votre App" > "Paramètres" > "De base".',
        clientSecret: 'Le secret client Instagram se trouve dans la console développeur Instagram sous "Applications" > "Votre App" > "Paramètres" > "De base".',
        redirectUri: 'L\'URI de redirection doit être configuré dans la console développeur Instagram sous "Applications" > "Votre App" > "Paramètres" > "De base" > "OAuth".'
      },
      linkedin: {
        clientId: 'L\'ID client LinkedIn se trouve dans la console développeur LinkedIn sous "Applications" > "Votre App" > "Paramètres" > "De base".',
        clientSecret: 'Le secret client LinkedIn se trouve dans la console développeur LinkedIn sous "Applications" > "Votre App" > "Paramètres" > "De base".',
        redirectUri: 'L\'URI de redirection doit être configuré dans la console développeur LinkedIn sous "Applications" > "Votre App" > "Paramètres" > "De base" > "OAuth".'
      },
      twitter: {
        clientId: 'L\'ID client Twitter se trouve dans la console développeur Twitter sous "Applications" > "Votre App" > "Paramètres" > "De base".',
        clientSecret: 'Le secret client Twitter se trouve dans la console développeur Twitter sous "Applications" > "Votre App" > "Paramètres" > "De base".',
        redirectUri: 'L\'URI de redirection doit être configuré dans la console développeur Twitter sous "Applications" > "Votre App" > "Paramètres" > "De base" > "OAuth".'
      },
      dikalo: {
        clientId: 'L\'ID client Dikalo se trouve dans la console développeur Dikalo sous "Applications" > "Votre App" > "Paramètres" > "De base".',
        clientSecret: 'Le secret client Dikalo se trouve dans la console développeur Dikalo sous "Applications" > "Votre App" > "Paramètres" > "De base".',
        redirectUri: 'L\'URI de redirection doit être configuré dans la console développeur Dikalo sous "Applications" > "Votre App" > "Paramètres" > "De base" > "OAuth".'
      },
      tiktok: {
        clientId: 'L\'ID client TikTok se trouve dans la console développeur TikTok sous "Applications" > "Votre App" > "Paramètres" > "De base".',
        clientSecret: 'Le secret client TikTok se trouve dans la console développeur TikTok sous "Applications" > "Votre App" > "Paramètres" > "De base".',
        redirectUri: 'L\'URI de redirection doit être configuré dans la console développeur TikTok sous "Applications" > "Votre App" > "Paramètres" > "De base" > "OAuth".'
      }
    };

    setInfoPopup({
      isOpen: true,
      title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} - ${field}`,
      content: helpTexts[platform][field]
    });
  };
  import React from 'react'; // Ajout de l'importation de React

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-5xl w-full rounded-2xl bg-white shadow-2xl">
          <div className="flex flex-col h-[85vh]">
            {/* Header */}
            <div className="px-6 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Shield className="h-5 w-5 text-indigo-600" />
                  </div>
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    Configuration Marketing
                  </Dialog.Title>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(formData).map(([platform, fields]) => {
                    const Icon = platformIcons[platform as keyof typeof platformIcons];
                    const colors = platformColors[platform as keyof typeof platformColors];

                    return (
                      <div 
                        key={platform} 
                        className={`p-4 rounded-lg border ${colors.border} ${colors.bg}`}
                      >
                        <div className="flex items-center space-x-2 mb-3">
                          <div className={`p-1.5 rounded-lg ${colors.bg}`}>
                            <Icon className={`h-5 w-5 ${colors.text}`} />
                          </div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </h3>
                        </div>

                        <div className="space-y-2">
                          {Object.entries(fields).map(([field, value]) => (
                            <div key={field} className="flex items-start gap-1.5">
                              <div className="flex-1">
                                <Input
                                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                                  value={value as string}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    [platform]: {
                                      ...prev[platform as keyof MarketingConfig],
                                      [field]: e.target.value
                                    }
                                  }))}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => showInfo(platform, field)}
                                className="mt-6 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <Info className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={onClose} size="sm">
                  Annuler
                </Button>
                <Button type="submit" onClick={handleSubmit} size="sm">
                  <Save className="w-4 h-4 mr-1.5" />
                  Enregistrer
                </Button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>

      {/* Info Popup */}
      <Dialog open={infoPopup.isOpen} onClose={() => setInfoPopup(prev => ({ ...prev, isOpen: false }))} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full rounded-xl bg-white shadow-xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Dialog.Title className="text-base font-medium text-gray-900">{infoPopup.title}</Dialog.Title>
                <button 
                  onClick={() => setInfoPopup(prev => ({ ...prev, isOpen: false }))} 
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">{infoPopup.content}</div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Dialog>
  );
} 