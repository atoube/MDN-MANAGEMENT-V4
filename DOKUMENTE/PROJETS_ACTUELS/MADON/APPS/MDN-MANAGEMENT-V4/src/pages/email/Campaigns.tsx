import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import {
  Mail,
  Search,
  Filter,
  Calendar,
  Plus,
  Users,
  TrendingUp,
  Loader2,
  Eye,
  BarChart2
} from 'lucide-react';
import { useMarketing } from '../../hooks/useMarketing';

export function Campaigns() {
  const navigate = useNavigate();
  const { emailCampaigns, isLoading } = useMarketing();
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: { variant: 'warning', label: 'Brouillon' },
      scheduled: { variant: 'info', label: 'Programmée' },
      sent: { variant: 'success', label: 'Envoyée' },
      cancelled: { variant: 'danger', label: 'Annulée' }
    } as const;

    const statusInfo = variants[status as keyof typeof variants];
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const filteredCampaigns = emailCampaigns?.filter(campaign => {
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesDate = !dateRange.start || !dateRange.end || (
      new Date(campaign.created_at) >= new Date(dateRange.start) &&
      new Date(campaign.created_at) <= new Date(dateRange.end)
    );
    return matchesStatus && matchesDate;
  });

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
          <h1 className="text-2xl font-semibold text-gray-900">Campagnes Email</h1>
          <p className="mt-1 text-sm text-gray-500">
            Historique et performance de vos campagnes email
          </p>
        </div>
        <Button onClick={() => navigate('/marketing/new-campaign')}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle campagne
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total envoyés</h3>
              <p className="text-3xl font-semibold text-gray-900">
                {emailCampaigns?.reduce((acc, campaign) => acc + campaign.recipients, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Taux d'ouverture</h3>
              <p className="text-3xl font-semibold text-gray-900">
                {emailCampaigns && emailCampaigns.length > 0
                  ? (emailCampaigns.reduce((acc, campaign) => acc + campaign.open_rate, 0) / emailCampaigns.length).toFixed(1)
                  : '0'}%
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Taux de clic</h3>
              <p className="text-3xl font-semibold text-gray-900">
                {emailCampaigns && emailCampaigns.length > 0
                  ? (emailCampaigns.reduce((acc, campaign) => acc + campaign.click_rate, 0) / emailCampaigns.length).toFixed(1)
                  : '0'}%
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <BarChart2 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Campagnes</h3>
              <p className="text-3xl font-semibold text-gray-900">
                {emailCampaigns?.length || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                className="pl-10"
                placeholder="Rechercher une campagne..."
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'Tous les statuts' },
                { value: 'draft', label: 'Brouillon' },
                { value: 'scheduled', label: 'Programmée' },
                { value: 'sent', label: 'Envoyée' },
                { value: 'cancelled', label: 'Annulée' }
              ]}
              className="w-40"
            />
            <div className="flex gap-2">
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-40"
              />
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-40"
              />
            </div>
            <Button variant="secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>

        <Table
          headers={[
            'Campagne',
            'Destinataires',
            'Performance',
            'Date d\'envoi',
            'Statut',
            'Actions'
          ]}
        >
          {filteredCampaigns?.map((campaign) => (
            <tr key={campaign.id}>
              <td className="px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {campaign.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {campaign.subject}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">
                    {campaign.recipients.toLocaleString()}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <Eye className="h-4 w-4 text-gray-400 mr-1" />
                    <span>{campaign.open_rate}% ouverture</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-gray-400 mr-1" />
                    <span>{campaign.click_rate}% clics</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {campaign.sent_date
                  ? new Date(campaign.sent_date).toLocaleDateString()
                  : campaign.scheduled_date
                    ? new Date(campaign.scheduled_date).toLocaleDateString()
                    : '-'
                }
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(campaign.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <Button variant="secondary" size="sm">
                    Détails
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    disabled={campaign.status === 'sent'}
                  >
                    {campaign.status === 'draft' ? 'Éditer' : 'Dupliquer'}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}