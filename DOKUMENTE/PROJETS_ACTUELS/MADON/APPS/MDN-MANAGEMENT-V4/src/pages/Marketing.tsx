import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MarketingSettings } from '../components/marketing/MarketingSettings';
import { useToast } from '../hooks/useToast';
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  TrendingUp,
  TrendingDown,
  Mail,
  Users,
  Send,
  Plus,
  Search,
  Filter,
  Loader2,
  Settings
} from 'lucide-react';
import { useMarketing } from '../hooks/useMarketing';
import { MarketingConfig } from '../types';

const platformIcons = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter
} as const;

const platformColors = {
  facebook: { color: 'bg-blue-100', textColor: 'text-blue-600' },
  instagram: { color: 'bg-pink-100', textColor: 'text-pink-600' },
  linkedin: { color: 'bg-blue-100', textColor: 'text-blue-600' },
  twitter: { color: 'bg-gray-100', textColor: 'text-gray-600' }
} as const;

export default function Marketing() {
  const navigate = useNavigate();
  const { socialStats, socialPosts, emailCampaigns, isLoading } = useMarketing();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const toast = useToast();

  const getStatusBadge = (status: string) => {
    const variants = {
      sent: { variant: 'success', label: 'Envoyé' },
      draft: { variant: 'warning', label: 'Brouillon' },
      scheduled: { variant: 'info', label: 'Programmé' },
      published: { variant: 'success', label: 'Publié' }
    } as const;

    const statusInfo = variants[status as keyof typeof variants];
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const handlePlatformClick = (platform: string) => {
    navigate(`/marketing/${platform.toLowerCase()}`);
  };

  const handleNewCampaign = () => {
    navigate('/marketing/new-campaign');
  };

  const handleViewAllCampaigns = () => {
    navigate('/marketing/campaigns');
  };

  const handleSettingsSave = (config: MarketingConfig) => {
    // TODO: Implémenter la sauvegarde des paramètres
    console.log('Configuration sauvegardée:', config);
    setIsSettingsOpen(false);
    toast({
      title: 'Configuration sauvegardée',
      description: 'Les paramètres ont été mis à jour avec succès.',
      type: 'success'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Marketing Digital</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos réseaux sociaux et vos campagnes email
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </Button>
          <Button variant="secondary">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau post
          </Button>
          <Button onClick={handleNewCampaign}>
            <Mail className="w-4 h-4 mr-2" />
            Nouvelle campagne
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {socialStats?.map((platform) => {
          const Icon = platformIcons[platform.platform as keyof typeof platformIcons];
          const colors = platformColors[platform.platform as keyof typeof platformColors];
          const growthIsPositive = platform.growth >= 0;

          return (
            <Card 
              key={platform.platform}
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => handlePlatformClick(platform.platform)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${colors.color}`}>
                  <Icon className={`h-6 w-6 ${colors.textColor}`} />
                </div>
                <div className={`flex items-center ${
                  growthIsPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {growthIsPositive ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {platform.growth}%
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {platform.platform.charAt(0).toUpperCase() + platform.platform.slice(1)}
              </h3>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Abonnés</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {platform.followers.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Engagement</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {platform.engagement}%
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Publications récentes">
          <div className="mb-4 flex justify-between items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Rechercher une publication..."
              />
            </div>
            <Button variant="secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </Button>
          </div>

          <Table
            headers={[
              'Publication',
              'Plateforme',
              'Engagement',
              'Likes',
              'Partages',
              'Statut'
            ]}
          >
            {socialPosts?.map((post) => (
              <tr key={post.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {post.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.engagement}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.likes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.shares}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(post.status)}
                </td>
              </tr>
            ))}
          </Table>
        </Card>

        <Card 
          title="Campagnes Email"
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={handleViewAllCampaigns}
        >
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Send className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Taux d'ouverture moyen</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {emailCampaigns && emailCampaigns.length > 0
                    ? (emailCampaigns.reduce((acc, campaign) => acc + campaign.open_rate, 0) / emailCampaigns.length).toFixed(1)
                    : '0'}%
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Liste de diffusion</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {emailCampaigns?.reduce((acc, campaign) => acc + campaign.recipients, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <Table
            headers={[
              'Campagne',
              'Statut',
              'Destinataires',
              'Taux d\'ouverture',
              'Taux de clic'
            ]}
          >
            {emailCampaigns?.slice(0, 5).map((campaign) => (
              <tr key={campaign.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {campaign.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(campaign.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {campaign.recipients.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {campaign.open_rate}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {campaign.click_rate}%
                </td>
              </tr>
            ))}
          </Table>
          
          <div className="mt-4 text-center">
            <Button variant="secondary" size="sm">
              Voir toutes les campagnes
            </Button>
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