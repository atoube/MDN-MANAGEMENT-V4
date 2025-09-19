import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Search,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

interface Purchase {
  id: string;
  supplier_name: string;
  supplier_email: string;
  supplier_phone: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  order_date: string;
  delivery_date: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'partial' | 'paid';
  notes: string;
  tracking_number?: string;
  tracking_status?: 'pending' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed';
  tracking_updates?: Array<{
    date: string;
    status: string;
    location: string;
    description: string;
  }>;
}

export default function Purchases() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewPurchaseModalOpen, setIsNewPurchaseModalOpen] = useState(false);

  // Mock data pour les achats
  const purchases: Purchase[] = [
    {
      id: '1',
      supplier_name: 'Fournisseur Cameroun SA',
      supplier_email: 'contact@fournisseur-cm.cm',
      supplier_phone: '+237 6 90 12 34 56',
      product_name: 'Ordinateurs portables HP',
      quantity: 50,
      unit_price: 350000,
      total_amount: 17500000,
      order_date: '2024-01-15',
      delivery_date: '2024-02-15',
      status: 'delivered',
      payment_status: 'paid',
      notes: 'Livraison effectuée dans les délais',
      tracking_number: 'CM123456789',
      tracking_status: 'delivered',
      tracking_updates: [
        {
          date: '2024-02-10',
          status: 'Commande confirmée',
          location: 'Douala, Cameroun',
          description: 'Commande traitée et préparée pour expédition'
        },
        {
          date: '2024-02-12',
          status: 'En transit',
          location: 'Port de Douala',
          description: 'Colis expédié vers Yaoundé'
        },
        {
          date: '2024-02-14',
          status: 'En cours de livraison',
          location: 'Yaoundé, Cameroun',
          description: 'Colis en cours de livraison vers le destinataire'
        },
        {
          date: '2024-02-15',
          status: 'Livré',
          location: 'Yaoundé, Cameroun',
          description: 'Colis livré avec succès'
        }
      ]
    },
    {
      id: '2',
      supplier_name: 'Tech Solutions Douala',
      supplier_email: 'info@techsolutions-dla.cm',
      supplier_phone: '+237 6 91 23 45 67',
      product_name: 'Écrans LED 24"',
      quantity: 30,
      unit_price: 85000,
      total_amount: 2550000,
      order_date: '2024-01-20',
      delivery_date: '2024-02-10',
      status: 'confirmed',
      payment_status: 'partial',
      notes: 'Paiement de 60% effectué',
      tracking_number: 'CM987654321',
      tracking_status: 'in_transit',
      tracking_updates: [
        {
          date: '2024-02-05',
          status: 'Commande confirmée',
          location: 'Douala, Cameroun',
          description: 'Commande traitée et préparée'
        },
        {
          date: '2024-02-08',
          status: 'En transit',
          location: 'Douala → Yaoundé',
          description: 'Colis en route vers Yaoundé'
        }
      ]
    },
    {
      id: '3',
      supplier_name: 'Mobilier Yaoundé',
      supplier_email: 'ventes@mobilier-yao.cm',
      supplier_phone: '+237 6 92 34 56 78',
      product_name: 'Bureaux ergonomiques',
      quantity: 25,
      unit_price: 120000,
      total_amount: 3000000,
      order_date: '2024-01-25',
      delivery_date: '2024-02-20',
      status: 'pending',
      payment_status: 'pending',
      notes: 'En attente de confirmation'
    },
    {
      id: '4',
      supplier_name: 'Équipements Bafoussam',
      supplier_email: 'contact@equipements-baf.cm',
      supplier_phone: '+237 6 93 45 67 89',
      product_name: 'Imprimantes multifonctions',
      quantity: 15,
      unit_price: 180000,
      total_amount: 2700000,
      order_date: '2024-01-30',
      delivery_date: '2024-02-25',
      status: 'cancelled',
      payment_status: 'pending',
      notes: 'Commande annulée - rupture de stock'
    },
    {
      id: '5',
      supplier_name: 'Informatique Garoua',
      supplier_email: 'info@informatique-gar.cm',
      supplier_phone: '+237 6 94 56 78 90',
      product_name: 'Serveurs Dell PowerEdge',
      quantity: 5,
      unit_price: 2500000,
      total_amount: 12500000,
      order_date: '2024-02-01',
      delivery_date: '2024-03-01',
      status: 'confirmed',
      payment_status: 'partial',
      notes: 'Paiement de 40% effectué'
    }
  ];

  const [purchasesList, setPurchasesList] = useState<Purchase[]>(purchases);

  // Calcul des statistiques
  const stats = useMemo(() => {
    const total = purchasesList.length;
    const totalAmount = purchasesList.reduce((sum, p) => sum + p.total_amount, 0);
    const pendingOrders = purchasesList.filter(p => p.status === 'pending').length;
    const deliveredOrders = purchasesList.filter(p => p.status === 'delivered').length;
    const paidOrders = purchasesList.filter(p => p.payment_status === 'paid').length;

    return {
      totalOrders: total,
      totalAmount,
      pendingOrders,
      deliveredOrders,
      paidOrders
    };
  }, [purchasesList]);

  // Filtrage des achats
  const filteredPurchases = useMemo(() => {
    return purchasesList.filter(purchase => {
      const matchesSearch = 
        purchase.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.product_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || purchase.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || purchase.payment_status === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [purchasesList, searchTerm, statusFilter, paymentFilter]);

  // Utilise le formatage de devise du contexte global
  const formatPrice = (price: number) => {
    // Forcer le formatage en F.CFA pour cette page
    return `${price.toLocaleString('fr-FR')} F.CFA`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'confirmed': return 'warning';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Livré';
      case 'confirmed': return 'Confirmé';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'partial': return 'warning';
      case 'pending': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Payé';
      case 'partial': return 'Partiel';
      case 'pending': return 'En attente';
      default: return status;
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

  const handleViewDetails = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsDetailsModalOpen(true);
  };

  const handleEditPurchase = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsEditModalOpen(true);
  };

  const handleDeletePurchase = (purchaseId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet achat ?')) return;
    
    setPurchasesList(prev => prev.filter(p => p.id !== purchaseId));
    toast.success('Achat supprimé avec succès');
  };

  const handleUpdatePurchase = (data: Partial<Purchase>) => {
    if (!selectedPurchase) return;
    
    setPurchasesList(prev => 
      prev.map(p => 
        p.id === selectedPurchase.id ? { ...p, ...data } : p
      )
    );
    setIsEditModalOpen(false);
    setSelectedPurchase(null);
    toast.success('Achat mis à jour avec succès');
  };

  const handleCreatePurchase = (data: Omit<Purchase, 'id'>) => {
    const newPurchase: Purchase = {
      ...data,
      id: Date.now().toString()
    };
    
    setPurchasesList(prev => [...prev, newPurchase]);
    setIsNewPurchaseModalOpen(false);
    toast.success('Achat créé avec succès');
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Achats</h1>
          <p className="text-gray-600">Gérez vos achats, fournisseurs et commandes</p>
        </div>
        <Button onClick={() => setIsNewPurchaseModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Achat
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Commandes</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4 min-w-0 flex-1">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Montant Total</h3>
              <p className="text-lg font-bold text-gray-900 break-words">
                {formatPrice(stats.totalAmount)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">En Attente</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Livrés</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.deliveredOrders}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Payés</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.paidOrders}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres et Recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par fournisseur ou produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut de commande" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmé</SelectItem>
                <SelectItem value="delivered">Livré</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut de paiement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les paiements</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="partial">Partiel</SelectItem>
                <SelectItem value="paid">Payé</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setPaymentFilter('all');
            }}>
              <Filter className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des achats */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Achats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[160px] min-w-[160px]">Fournisseur</TableHead>
                  <TableHead className="w-[140px] min-w-[140px]">Produit</TableHead>
                  <TableHead className="w-[70px] min-w-[70px] text-center">Qté</TableHead>
                  <TableHead className="w-[100px] min-w-[100px]">Prix Unitaire</TableHead>
                  <TableHead className="w-[110px] min-w-[110px]">Total</TableHead>
                  <TableHead className="w-[90px] min-w-[90px]">Date</TableHead>
                  <TableHead className="w-[90px] min-w-[90px]">Statut</TableHead>
                  <TableHead className="w-[90px] min-w-[90px]">Paiement</TableHead>
                  <TableHead className="w-[90px] min-w-[90px]">Suivi</TableHead>
                  <TableHead className="w-[100px] min-w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="py-3">
                      <div className="space-y-1">
                        <div className="font-medium text-sm truncate">{purchase.supplier_name}</div>
                        <div className="text-xs text-gray-500 truncate">{purchase.supplier_email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="text-sm truncate block">{purchase.product_name}</span>
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <span className="font-medium text-sm">{purchase.quantity}</span>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="text-sm font-medium">{formatPrice(purchase.unit_price)}</span>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="text-sm font-bold">{formatPrice(purchase.total_amount)}</span>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="text-xs">{formatDate(purchase.order_date)}</span>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant={getStatusColor(purchase.status)} className="text-xs">
                        {getStatusLabel(purchase.status)}
                      </Badge>
                    </TableCell>
                                      <TableCell className="py-3">
                    <Badge variant={getPaymentStatusColor(purchase.payment_status)} className="text-xs">
                      {getPaymentStatusLabel(purchase.payment_status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    {purchase.tracking_number ? (
                      <Badge variant={getTrackingStatusColor(purchase.tracking_status || 'pending')} className="text-xs">
                        {getTrackingStatusLabel(purchase.tracking_status || 'pending')}
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <div className="flex justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(purchase)}
                        className="h-7 px-2"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditPurchase(purchase)}
                        className="h-7 px-2"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeletePurchase(purchase.id)}
                        className="h-7 px-2"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPurchases.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun achat trouvé</h3>
              <p className="text-gray-500">Aucun achat ne correspond à vos critères de recherche.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Détails de l'Achat */}
      {selectedPurchase && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isDetailsModalOpen ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Détails de l'Achat</h2>
              <Button variant="ghost" onClick={() => setIsDetailsModalOpen(false)}>×</Button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Fournisseur</h3>
                  <p className="text-gray-900">{selectedPurchase.supplier_name}</p>
                  <p className="text-sm text-gray-500">{selectedPurchase.supplier_email}</p>
                  <p className="text-sm text-gray-500">{selectedPurchase.supplier_phone}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Produit</h3>
                  <p className="text-gray-900">{selectedPurchase.product_name}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Quantité</h3>
                  <p className="text-gray-900">{selectedPurchase.quantity}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Prix Unitaire</h3>
                  <p className="text-gray-900">{formatPrice(selectedPurchase.unit_price)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Montant Total</h3>
                  <p className="text-gray-900 font-bold">{formatPrice(selectedPurchase.total_amount)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Date de Commande</h3>
                  <p className="text-gray-900">{formatDate(selectedPurchase.order_date)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Date de Livraison</h3>
                  <p className="text-gray-900">{formatDate(selectedPurchase.delivery_date)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Statut</h3>
                  <Badge variant={getStatusColor(selectedPurchase.status)}>
                    {getStatusLabel(selectedPurchase.status)}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Paiement</h3>
                  <Badge variant={getPaymentStatusColor(selectedPurchase.payment_status)}>
                    {getPaymentStatusLabel(selectedPurchase.payment_status)}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700">Notes</h3>
                <p className="text-gray-900">{selectedPurchase.notes}</p>
              </div>

              {/* Section Tracking */}
              {selectedPurchase.tracking_number && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-700 mb-4">Suivi du Colis</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-600">Numéro de Suivi</h4>
                      <p className="text-gray-900 font-mono">{selectedPurchase.tracking_number}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-600">Statut</h4>
                      <Badge variant={getTrackingStatusColor(selectedPurchase.tracking_status || 'pending')}>
                        {getTrackingStatusLabel(selectedPurchase.tracking_status || 'pending')}
                      </Badge>
                    </div>
                  </div>

                  {selectedPurchase.tracking_updates && selectedPurchase.tracking_updates.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-3">Historique du Suivi</h4>
                      <div className="space-y-3">
                        {selectedPurchase.tracking_updates.map((update, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h5 className="text-sm font-medium text-gray-900">{update.status}</h5>
                                <span className="text-xs text-gray-500">{formatDate(update.date)}</span>
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

      {/* Modal Édition de l'Achat */}
      {selectedPurchase && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isEditModalOpen ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Modifier l'Achat</h2>
              <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>×</Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <Select 
                    value={selectedPurchase.status} 
                    onValueChange={(value) => setSelectedPurchase({...selectedPurchase, status: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="confirmed">Confirmé</SelectItem>
                      <SelectItem value="delivered">Livré</SelectItem>
                      <SelectItem value="cancelled">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut de Paiement</label>
                  <Select 
                    value={selectedPurchase.payment_status} 
                    onValueChange={(value) => setSelectedPurchase({...selectedPurchase, payment_status: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="partial">Partiel</SelectItem>
                      <SelectItem value="paid">Payé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={selectedPurchase.notes}
                  onChange={(e) => setSelectedPurchase({...selectedPurchase, notes: e.target.value})}
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
                      value={selectedPurchase.tracking_number || ''}
                      onChange={(e) => setSelectedPurchase({...selectedPurchase, tracking_number: e.target.value})}
                      placeholder="Ex: CM123456789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut de Suivi</label>
                    <Select 
                      value={selectedPurchase.tracking_status || 'pending'} 
                      onValueChange={(value) => setSelectedPurchase({...selectedPurchase, tracking_status: value as any})}
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
              <Button onClick={() => handleUpdatePurchase(selectedPurchase)}>
                Sauvegarder
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouvel Achat */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isNewPurchaseModalOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Nouvel Achat</h2>
            <Button variant="ghost" onClick={() => setIsNewPurchaseModalOpen(false)}>×</Button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Fournisseur</label>
                <Input placeholder="Nom du fournisseur" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input placeholder="email@fournisseur.cm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <Input placeholder="+237 6 XX XX XX XX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produit</label>
                <Input placeholder="Nom du produit" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                <Input type="number" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix Unitaire (FCFA)</label>
                <Input type="number" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de Livraison</label>
                <Input type="date" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Notes additionnelles..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsNewPurchaseModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => {
              toast.success('Achat créé avec succès');
              setIsNewPurchaseModalOpen(false);
            }}>
              Créer l'Achat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
