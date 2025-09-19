import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Loader2, Calendar, AlertTriangle, Eye, Edit2 } from 'lucide-react';
import { format, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';
import DeliveryMap from '@/components/delivery/DeliveryMap';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { geocodeAddress } from '@/services/geocoding';
import { Delivery, DeliveryStatus } from '@/types/delivery';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 5;

export default function Deliveries() {
  const { user, loading: authLoading } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Delivery>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [newDelivery, setNewDelivery] = useState({
    client_name: '',
    address: '',
    scheduled_date: '',
    notes: '',
  });
  const [activeTab, setActiveTab] = useState('list');
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDeliveries();
      // Mettre à jour les positions toutes les 30 secondes
      const interval = setInterval(fetchDeliveries, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      
      // Mock data pour les livraisons avec adresses camerounaises
      const data = [
        {
          id: '1',
          client_name: 'Banque Atlantique Cameroun',
          address: 'Avenue de l\'Indépendance, Akwa, Douala, Cameroun',
          client_address: 'Avenue de l\'Indépendance, Akwa, Douala, Cameroun',
          client_email: 'contact@banqueatlantique.cm',
          client_phone: '+237 2 33 42 12 34',
          scheduled_date: '2024-03-20',
          status: 'pending' as DeliveryStatus,
          driver_id: 'driver1',
          notes: 'Livraison équipements informatiques - Accès par l\'entrée principale',
          created_at: '2024-03-15T10:00:00Z',
          updated_at: '2024-03-15T10:00:00Z',
          latitude: 4.0511,
          longitude: 9.7679,
          tracking_number: 'CM789456123',
          tracking_status: 'pending' as const,
          tracking_updates: [
            {
              date: '2024-03-15',
              status: 'Commande confirmée',
              location: 'Entrepôt Douala',
              description: 'Colis préparé et en attente d\'expédition'
            }
          ]
        },
        {
          id: '2',
          client_name: 'Cimencam',
          address: 'Route de Bonabéri, Zone Industrielle, Douala, Cameroun',
          client_address: 'Route de Bonabéri, Zone Industrielle, Douala, Cameroun',
          client_email: 'logistique@cimencam.cm',
          client_phone: '+237 2 33 45 67 89',
          scheduled_date: '2024-03-21',
          status: 'in_progress' as DeliveryStatus,
          driver_id: 'driver2',
          notes: 'Livraison urgente - Contacter le responsable logistique',
          created_at: '2024-03-16T09:00:00Z',
          updated_at: '2024-03-18T14:30:00Z',
          latitude: 4.0167,
          longitude: 9.6833,
          tracking_number: 'CM456789123',
          tracking_status: 'in_transit' as const,
          tracking_updates: [
            {
              date: '2024-03-16',
              status: 'Commande confirmée',
              location: 'Entrepôt Douala',
              description: 'Colis préparé pour expédition'
            },
            {
              date: '2024-03-18',
              status: 'En transit',
              location: 'Route Douala → Bonabéri',
              description: 'Colis en route vers la destination'
            }
          ]
        },
        {
          id: '3',
          client_name: 'Groupe Socapalm',
          address: 'Boulevard de la République, Centre-ville, Yaoundé, Cameroun',
          client_address: 'Boulevard de la République, Centre-ville, Yaoundé, Cameroun',
          client_email: 'admin@socapalm.cm',
          client_phone: '+237 2 22 23 45 67',
          scheduled_date: '2024-03-22',
          status: 'completed' as DeliveryStatus,
          driver_id: 'driver3',
          notes: 'Livraison terminée - Signature reçue',
          created_at: '2024-03-14T08:00:00Z',
          updated_at: '2024-03-19T16:45:00Z',
          latitude: 3.8480,
          longitude: 11.5021,
          tracking_number: 'CM321654987',
          tracking_status: 'delivered' as const,
          tracking_updates: [
            {
              date: '2024-03-14',
              status: 'Commande confirmée',
              location: 'Entrepôt Douala',
              description: 'Colis préparé pour expédition'
            },
            {
              date: '2024-03-16',
              status: 'En transit',
              location: 'Douala → Yaoundé',
              description: 'Colis en route vers Yaoundé'
            },
            {
              date: '2024-03-18',
              status: 'En cours de livraison',
              location: 'Yaoundé, Cameroun',
              description: 'Colis en cours de livraison'
            },
            {
              date: '2024-03-19',
              status: 'Livré',
              location: 'Yaoundé, Cameroun',
              description: 'Colis livré avec succès - Signature reçue'
            }
          ]
        },
        {
          id: '4',
          client_name: 'Eneo Cameroun',
          address: 'Quartier Bastos, Yaoundé, Cameroun',
          client_address: 'Quartier Bastos, Yaoundé, Cameroun',
          client_email: 'technique@eneo.cm',
          client_phone: '+237 2 22 34 56 78',
          scheduled_date: '2024-03-23',
          status: 'pending' as DeliveryStatus,
          driver_id: 'driver1',
          notes: 'Livraison équipements électriques - Zone sécurisée',
          created_at: '2024-03-17T11:30:00Z',
          updated_at: '2024-03-17T11:30:00Z',
          latitude: 3.8667,
          longitude: 11.5167
        },
        {
          id: '5',
          client_name: 'MTN Cameroun',
          address: 'Rue de la Joie, Akwa, Douala, Cameroun',
          client_address: 'Rue de la Joie, Akwa, Douala, Cameroun',
          client_email: 'support@mtn.cm',
          client_phone: '+237 2 33 56 78 90',
          scheduled_date: '2024-03-24',
          status: 'in_progress' as DeliveryStatus,
          driver_id: 'driver2',
          notes: 'Livraison serveurs - Accès par le parking souterrain',
          created_at: '2024-03-18T14:00:00Z',
          updated_at: '2024-03-20T09:15:00Z',
          latitude: 4.0511,
          longitude: 9.7679
        }
      ];

      setDeliveries(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des livraisons:', error);
      toast.error('Impossible de charger les livraisons');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDelivery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Géocoder l'adresse
      const geocodingResult = await geocodeAddress(newDelivery.address);
      
      if (!geocodingResult) {
        throw new Error('Impossible de géocoder l\'adresse');
      }

      // Mock insert operation
      const mockDelivery = {
        id: Date.now().toString(),
        ...newDelivery,
        status: 'pending' as DeliveryStatus,
        latitude: geocodingResult.latitude,
        longitude: geocodingResult.longitude,
        last_location_update: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Simuler l'ajout à la liste
      setDeliveries(prev => [...prev, mockDelivery]);
      
      setNewDelivery({ client_name: '', address: '', scheduled_date: '', notes: '' });
      toast.success('La livraison a été ajoutée avec succès');
      fetchDeliveries();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la livraison:', error);
      toast.error('Impossible d\'ajouter la livraison');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: DeliveryStatus) => {
    try {
      // Mock update operation
      setDeliveries(prev => 
        prev.map(delivery => 
          delivery.id === id 
            ? { ...delivery, status: newStatus, updated_at: new Date().toISOString() }
            : delivery
        )
      );
      
      toast.success('Le statut a été mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Impossible de mettre à jour le statut');
    }
  };

  const getTrackingStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'out_for_delivery': return 'warning';
      case 'in_transit': return 'secondary';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTrackingStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Livré';
      case 'out_for_delivery': return 'En livraison';
      case 'in_transit': return 'En transit';
      case 'pending': return 'En attente';
      case 'failed': return 'Échec';
      default: return status;
    }
  };

  const handleViewDetails = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsDetailsModalOpen(true);
  };

  const handleEditDelivery = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsEditModalOpen(true);
  };

  const handleUpdateDelivery = (delivery: Delivery) => {
    setDeliveries(prev => 
      prev.map(d => d.id === delivery.id ? delivery : d)
    );
    setIsEditModalOpen(false);
    setSelectedDelivery(null);
    toast.success('Livraison mise à jour avec succès');
  };

  const filteredDeliveries = deliveries.filter(delivery =>
    delivery.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDeliveries.length / ITEMS_PER_PAGE);
  const paginatedDeliveries = filteredDeliveries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const isDeliveryLate = (delivery: Delivery) => {
    if (!delivery.scheduled_date) return false;
    return isBefore(new Date(delivery.scheduled_date), new Date()) && delivery.status !== 'delivered';
  };

  const deliveryLocations = deliveries
    .filter(delivery => delivery.latitude && delivery.longitude)
    .map(delivery => ({
      id: delivery.id,
      latitude: delivery.latitude!,
      longitude: delivery.longitude!,
      name: delivery.client_name,
      status: delivery.status
    }));

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Module Livraisons</h1>
        {user && (
          <p className="text-sm text-gray-500">
            Connecté en tant que : {user.email}
          </p>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">
            Liste des Livraisons
          </TabsTrigger>
          <TabsTrigger value="map">
            Carte des Livraisons
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle Livraison</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddDelivery} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Nom du client"
                    value={newDelivery.client_name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setNewDelivery({ ...newDelivery, client_name: e.target.value })
                    }
                    required
                  />
                  <Input
                    placeholder="Adresse"
                    value={newDelivery.address}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setNewDelivery({ ...newDelivery, address: e.target.value })
                    }
                    required
                  />
                  <Input
                    type="datetime-local"
                    value={newDelivery.scheduled_date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setNewDelivery({ ...newDelivery, scheduled_date: e.target.value })
                    }
                    required
                  />
                  <Input
                    placeholder="Notes (optionnel)"
                    value={newDelivery.notes}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setNewDelivery({ ...newDelivery, notes: e.target.value })
                    }
                  />
                </div>
                <Button type="submit">Ajouter la livraison</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Liste des Livraisons</CardTitle>
                <div className="flex gap-4">
                  <Select
                    value={sortField}
                    onValueChange={(value: keyof Delivery) => {
                      setSortField(value);
                      fetchDeliveries();
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">Date de création</SelectItem>
                      <SelectItem value="scheduled_date">Date prévue</SelectItem>
                      <SelectItem value="client_name">Nom du client</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      fetchDeliveries();
                    }}
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </Button>
                </div>
              </div>
              <Input
                placeholder="Rechercher une livraison..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="mt-4"
              />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedDeliveries.map((delivery) => (
                    <Card key={delivery.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{delivery.client_name}</h3>
                            <p className="text-sm text-gray-500">{delivery.address}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-500">
                                {format(new Date(delivery.scheduled_date), 'PPP', { locale: fr })}
                              </span>
                              {isDeliveryLate(delivery) && (
                                <span className="flex items-center gap-1 text-red-500 text-sm">
                                  <AlertTriangle className="h-4 w-4" />
                                  En retard
                                </span>
                              )}
                            </div>
                            {delivery.notes && (
                              <p className="text-sm text-gray-500 mt-2">{delivery.notes}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                              {delivery.tracking_number && (
                                <Badge variant={getTrackingStatusColor(delivery.tracking_status || 'pending')} className="text-xs">
                                  {getTrackingStatusLabel(delivery.tracking_status || 'pending')}
                                </Badge>
                              )}
                              <Select
                                value={delivery.status}
                                onValueChange={(value: DeliveryStatus) => 
                                  handleUpdateStatus(delivery.id, value)
                                }
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">En attente</SelectItem>
                                  <SelectItem value="in_progress">En cours</SelectItem>
                                  <SelectItem value="delivered">Livré</SelectItem>
                                  <SelectItem value="cancelled">Annulé</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewDetails(delivery)}
                                className="h-8 px-3"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Détails
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditDelivery(delivery)}
                                className="h-8 px-3"
                              >
                                <Edit2 className="h-4 w-4 mr-1" />
                                Modifier
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="flex justify-between items-center mt-4">
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </Button>
                    <span className="text-sm text-gray-500">
                      Page {currentPage} sur {totalPages}
                    </span>
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle>Carte des Livraisons</CardTitle>
            </CardHeader>
            <CardContent>
              <DeliveryMap 
                locations={deliveryLocations} 
                googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Détails de la Livraison */}
      {isDetailsModalOpen && selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Détails de la Livraison</h2>
              <Button variant="ghost" onClick={() => setIsDetailsModalOpen(false)}>×</Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Client</h3>
                  <p className="text-gray-900">{selectedDelivery.client_name}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Adresse</h3>
                  <p className="text-gray-900">{selectedDelivery.address}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Date prévue</h3>
                  <p className="text-gray-900">{format(new Date(selectedDelivery.scheduled_date), 'PPP', { locale: fr })}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Statut</h3>
                  <Badge variant={
                    selectedDelivery.status === 'delivered' ? 'success' :
                    selectedDelivery.status === 'in_progress' ? 'warning' :
                    selectedDelivery.status === 'cancelled' ? 'destructive' :
                    'secondary'
                  }>
                    {selectedDelivery.status === 'pending' ? 'En attente' :
                     selectedDelivery.status === 'in_progress' ? 'En cours' :
                     selectedDelivery.status === 'delivered' ? 'Livré' :
                     'Annulé'}
                  </Badge>
                </div>
              </div>

              {selectedDelivery.notes && (
                <div>
                  <h3 className="font-semibold text-gray-700">Notes</h3>
                  <p className="text-gray-900">{selectedDelivery.notes}</p>
                </div>
              )}

              {/* Section Tracking */}
              {selectedDelivery.tracking_number && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-700 mb-4">Suivi du Colis</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-600">Numéro de Suivi</h4>
                      <p className="text-gray-900 font-mono">{selectedDelivery.tracking_number}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-600">Statut</h4>
                      <Badge variant={getTrackingStatusColor(selectedDelivery.tracking_status || 'pending')}>
                        {getTrackingStatusLabel(selectedDelivery.tracking_status || 'pending')}
                      </Badge>
                    </div>
                  </div>

                  {selectedDelivery.tracking_updates && selectedDelivery.tracking_updates.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-3">Historique du Suivi</h4>
                      <div className="space-y-3">
                        {selectedDelivery.tracking_updates.map((update, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h5 className="text-sm font-medium text-gray-900">{update.status}</h5>
                                <span className="text-xs text-gray-500">{format(new Date(update.date), 'dd/MM/yyyy', { locale: fr })}</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{update.location}</p>
                              <p className="text-xs text-gray-500 mt-1">{update.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
                Fermer
              </Button>
              <Button onClick={() => {
                setIsDetailsModalOpen(false);
                setIsEditModalOpen(true);
              }}>
                Modifier
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Édition de la Livraison */}
      {isEditModalOpen && selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Modifier la Livraison</h2>
              <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>×</Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                  <Input
                    value={selectedDelivery.client_name}
                    onChange={(e) => setSelectedDelivery({...selectedDelivery, client_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <Input
                    value={selectedDelivery.address}
                    onChange={(e) => setSelectedDelivery({...selectedDelivery, address: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date prévue</label>
                  <Input
                    type="datetime-local"
                    value={selectedDelivery.scheduled_date}
                    onChange={(e) => setSelectedDelivery({...selectedDelivery, scheduled_date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <Select 
                    value={selectedDelivery.status} 
                    onValueChange={(value: DeliveryStatus) => setSelectedDelivery({...selectedDelivery, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="in_progress">En cours</SelectItem>
                      <SelectItem value="delivered">Livré</SelectItem>
                      <SelectItem value="cancelled">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={selectedDelivery.notes || ''}
                  onChange={(e) => setSelectedDelivery({...selectedDelivery, notes: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>

              {/* Section Tracking */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Suivi du Colis</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de Suivi</label>
                    <Input
                      value={selectedDelivery.tracking_number || ''}
                      onChange={(e) => setSelectedDelivery({...selectedDelivery, tracking_number: e.target.value})}
                      placeholder="Ex: CM123456789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut de Suivi</label>
                    <Select 
                      value={selectedDelivery.tracking_status || 'pending'} 
                      onValueChange={(value) => setSelectedDelivery({...selectedDelivery, tracking_status: value as 'pending' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed'})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="in_transit">En transit</SelectItem>
                        <SelectItem value="out_for_delivery">En livraison</SelectItem>
                        <SelectItem value="delivered">Livré</SelectItem>
                        <SelectItem value="failed">Échec</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => handleUpdateDelivery(selectedDelivery)}>
                Sauvegarder
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}