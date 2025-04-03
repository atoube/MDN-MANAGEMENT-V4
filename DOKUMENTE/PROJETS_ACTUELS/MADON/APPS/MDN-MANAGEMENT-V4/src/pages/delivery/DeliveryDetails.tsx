import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import {
  ArrowLeft,
  Package,
  MapPin,
  Truck,
  Clock,
  User,
  Phone,
  DollarSign,
  FileText
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function DeliveryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: delivery, isLoading } = useQuery({
    queryKey: ['delivery', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deliveries')
        .select(`
          *,
          delivery_person:delivery_person_id(
            id,
            first_name,
            last_name,
            phone,
            email
          ),
          client:client_id(
            id,
            first_name,
            last_name,
            phone,
            email
          ),
          delivery_items(
            id,
            quantity,
            unit_price,
            total_price,
            product:product_id(
              id,
              name,
              description
            )
          ),
          delivery_tracking(
            id,
            status,
            location,
            notes,
            created_at
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Livraison non trouvée</h2>
        <Button className="mt-4" onClick={() => navigate('/deliveries')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux livraisons
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={() => navigate('/deliveries')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Livraison #{delivery.tracking_number}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Détails de la livraison
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(delivery.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Informations de livraison
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Client</p>
                <div className="mt-2 flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-900">
                    {`${delivery.client.first_name} ${delivery.client.last_name}`}
                  </span>
                </div>
                <div className="mt-1 flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-900">{delivery.client.phone}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Livreur</p>
                <div className="mt-2 flex items-center">
                  <Truck className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-900">
                    {`${delivery.delivery_person.first_name} ${delivery.delivery_person.last_name}`}
                  </span>
                </div>
                <div className="mt-1 flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-900">{delivery.delivery_person.phone}</span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-500">Adresse de livraison</p>
              <div className="mt-2 flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-900">{delivery.address}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Articles
            </h2>
            <Table
              headers={[
                'Produit',
                'Quantité',
                'Prix unitaire',
                'Total'
              ]}
            >
              {delivery.delivery_items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {item.product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.product.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'XOF',
                      minimumFractionDigits: 0
                    }).format(item.unit_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'XOF',
                      minimumFractionDigits: 0
                    }).format(item.total_price)}
                  </td>
                </tr>
              ))}
            </Table>
            <div className="mt-4 flex justify-end">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-xl font-semibold text-gray-900">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'XOF',
                    minimumFractionDigits: 0
                  }).format(delivery.cost)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Suivi de la livraison
            </h2>
            <div className="flow-root">
              <ul className="-mb-8">
                {delivery.delivery_tracking.map((track, idx) => (
                  <li key={track.id}>
                    <div className="relative pb-8">
                      {idx !== delivery.delivery_tracking.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                            <Clock className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {track.location && (
                                <span className="font-medium text-gray-900">
                                  {track.location}
                                </span>
                              )}
                            </p>
                            {track.notes && (
                              <p className="mt-1 text-sm text-gray-500">
                                {track.notes}
                              </p>
                            )}
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {new Date(track.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}