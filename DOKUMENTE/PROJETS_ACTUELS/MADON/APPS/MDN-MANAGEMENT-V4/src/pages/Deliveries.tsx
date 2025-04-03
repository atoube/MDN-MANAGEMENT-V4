import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { 
  Package, 
  Truck, 
  MapPin, 
  Search, 
  Filter, 
  Calendar, 
  Clock,
  Eye,
  Edit,
  AlertCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Delivery {
  id: string;
  tracking_number: string;
  status: 'pending' | 'in_progress' | 'delivered' | 'cancelled';
  address: string;
  delivery_date: string;
  delivery_person: {
    first_name: string;
    last_name: string;
  };
  client: {
    first_name: string;
    last_name: string;
  };
  cost: number;
}

export function Deliveries() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Fetch deliveries
  const { data: deliveries, isLoading } = useQuery({
    queryKey: ['deliveries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deliveries')
        .select(`
          *,
          delivery_person:delivery_person_id(first_name, last_name),
          client:client_id(first_name, last_name),
          delivery_costs(amount)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Delivery[];
    }
  });

  // Update delivery status
  const updateDeliveryStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Delivery['status'] }) => {
      const { data, error } = await supabase
        .from('deliveries')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
    }
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'warning', label: 'En attente' },
      in_progress: { variant: 'info', label: 'En cours' },
      delivered: { variant: 'success', label: 'Livrée' },
      cancelled: { variant: 'danger', label: 'Annulée' }
    } as const;

    const statusInfo = variants[status as keyof typeof variants];
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const handleStatusChange = async (id: string, newStatus: Delivery['status']) => {
    try {
      await updateDeliveryStatus.mutateAsync({ id, status: newStatus });
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  };

  const handleStatusCardClick = (status: string) => {
    setStatusFilter(status);
    // Scroll to the table section
    document.querySelector('.deliveries-table')?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredDeliveries = deliveries?.filter(delivery => {
    const matchesSearch = 
      searchTerm === '' || 
      delivery.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    
    const matchesDate = !dateRange.start || !dateRange.end || (
      new Date(delivery.delivery_date) >= new Date(dateRange.start) &&
      new Date(delivery.delivery_date) <= new Date(dateRange.end)
    );
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const stats = {
    pending: deliveries?.filter(d => d.status === 'pending').length || 0,
    in_progress: deliveries?.filter(d => d.status === 'in_progress').length || 0,
    delivered: deliveries?.filter(d => d.status === 'delivered').length || 0,
    total_distance: '1,234' // This would come from actual calculation
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Livraisons</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez et suivez toutes vos livraisons en temps réel
          </p>
        </div>
        <Button onClick={() => navigate('/deliveries/new')}>
          <Truck className="w-4 h-4 mr-2" />
          Nouvelle livraison
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card 
          className="cursor-pointer transition-all hover:shadow-lg transform hover:-translate-y-1"
          onClick={() => handleStatusCardClick('pending')}
        >
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">En attente</h3>
              <p className="text-3xl font-semibold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:shadow-lg transform hover:-translate-y-1"
          onClick={() => handleStatusCardClick('in_progress')}
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">En cours</h3>
              <p className="text-3xl font-semibold text-gray-900">{stats.in_progress}</p>
            </div>
          </div>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:shadow-lg transform hover:-translate-y-1"
          onClick={() => handleStatusCardClick('delivered')}
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Livrées</h3>
              <p className="text-3xl font-semibold text-gray-900">{stats.delivered}</p>
            </div>
          </div>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:shadow-lg transform hover:-translate-y-1"
          onClick={() => navigate('/deliveries/stats')}
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Distance totale</h3>
              <p className="text-3xl font-semibold text-gray-900">{stats.total_distance} km</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="deliveries-table">
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                className="pl-10"
                placeholder="Rechercher une livraison..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'Tous les statuts' },
                { value: 'pending', label: 'En attente' },
                { value: 'in_progress', label: 'En cours' },
                { value: 'delivered', label: 'Livrées' },
                { value: 'cancelled', label: 'Annulées' }
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
          </div>
        </div>

        <Table
          headers={[
            'N° Suivi',
            'Client',
            'Adresse',
            'Date',
            'Livreur',
            'Coût',
            'Statut',
            'Actions'
          ]}
        >
          {filteredDeliveries?.map((delivery) => (
            <tr key={delivery.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {delivery.tracking_number}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {`${delivery.client.first_name} ${delivery.client.last_name}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {delivery.address}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(delivery.delivery_date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {`${delivery.delivery_person.first_name} ${delivery.delivery_person.last_name}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'XOF',
                  minimumFractionDigits: 0
                }).format(delivery.cost)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(delivery.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => navigate(`/deliveries/${delivery.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Détails
                  </Button>
                  {delivery.status !== 'delivered' && delivery.status !== 'cancelled' && (
                    <Select
                      value={delivery.status}
                      onChange={(e) => handleStatusChange(delivery.id, e.target.value as Delivery['status'])}
                      options={[
                        { value: 'pending', label: 'En attente' },
                        { value: 'in_progress', label: 'En cours' },
                        { value: 'delivered', label: 'Livrée' },
                        { value: 'cancelled', label: 'Annulée' }
                      ]}
                      className="w-32"
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}