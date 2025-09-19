import React, { useState, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Search, 
  Calendar,
  User,
  Package,
  Edit,
  Save
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { useSettings } from '../contexts/SettingsContext';
import { toast } from 'sonner';

interface Sale {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  seller_name: string;
  sale_date: string;
  status: 'completed' | 'pending' | 'cancelled';
  payment_method: 'cash' | 'mobile_money' | 'bank_transfer' | 'card';
  region: string;
  created_at: string;
}

export default function Sales() {
  const { formatCurrency } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedSale, setSelectedSale] = useState<Sale | undefined>();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Mock data pour les ventes avec contexte camerounais
  const sales: Sale[] = useMemo(() => [
    {
      id: '1',
      customer_name: 'Banque Atlantique Cameroun',
      customer_email: 'achats@banqueatlantique.cm',
      customer_phone: '+237 2 33 42 12 34',
      product_name: 'Système de Gestion Bancaire',
      quantity: 1,
      unit_price: 25000000,
      total_amount: 25000000,
      seller_name: 'Ahmadou Bello',
      sale_date: '2024-03-15',
      status: 'completed',
      payment_method: 'bank_transfer',
      region: 'Littoral (Douala)',
      created_at: '2024-03-15T10:00:00Z'
    },
    {
      id: '2',
      customer_name: 'Cimencam',
      customer_email: 'logistique@cimencam.cm',
      customer_phone: '+237 2 33 45 67 89',
      product_name: 'Système de Gestion Logistique',
      quantity: 1,
      unit_price: 18000000,
      total_amount: 18000000,
      seller_name: 'Fatou Ndiaye',
      sale_date: '2024-03-14',
      status: 'completed',
      payment_method: 'bank_transfer',
      region: 'Littoral (Douala)',
      created_at: '2024-03-14T14:30:00Z'
    },
    {
      id: '3',
      customer_name: 'Groupe Socapalm',
      customer_email: 'admin@socapalm.cm',
      customer_phone: '+237 2 22 23 45 67',
      product_name: 'Système de Gestion Agricole',
      quantity: 1,
      unit_price: 32000000,
      total_amount: 32000000,
      seller_name: 'Kouassi Mensah',
      sale_date: '2024-03-13',
      status: 'pending',
      payment_method: 'mobile_money',
      region: 'Centre (Yaoundé)',
      created_at: '2024-03-13T09:15:00Z'
    },
    {
      id: '4',
      customer_name: 'Eneo Cameroun',
      customer_email: 'technique@eneo.cm',
      customer_phone: '+237 2 22 34 56 78',
      product_name: 'Système de Monitoring Électrique',
      quantity: 2,
      unit_price: 15000000,
      total_amount: 30000000,
      seller_name: 'Aissatou Diallo',
      sale_date: '2024-03-12',
      status: 'completed',
      payment_method: 'card',
      region: 'Centre (Yaoundé)',
      created_at: '2024-03-12T16:45:00Z'
    },
    {
      id: '5',
      customer_name: 'MTN Cameroun',
      customer_email: 'support@mtn.cm',
      customer_phone: '+237 2 33 56 78 90',
      product_name: 'Système de Facturation Mobile',
      quantity: 1,
      unit_price: 28000000,
      total_amount: 28000000,
      seller_name: 'Moussa Traoré',
      sale_date: '2024-03-11',
      status: 'cancelled',
      payment_method: 'bank_transfer',
      region: 'Littoral (Douala)',
      created_at: '2024-03-11T11:20:00Z'
    },
    {
      id: '6',
      customer_name: 'SARL Tech Solutions',
      customer_email: 'contact@techsolutions.cm',
      customer_phone: '+237 6 94 12 34 56',
      product_name: 'Application Mobile MDN',
      quantity: 1,
      unit_price: 8000000,
      total_amount: 8000000,
      seller_name: 'Ahmadou Bello',
      sale_date: '2024-03-10',
      status: 'completed',
      payment_method: 'cash',
      region: 'Littoral (Douala)',
      created_at: '2024-03-10T13:30:00Z'
    }
  ], []);

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const matchesSearch = 
        searchTerm === '' || 
        sale.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.seller_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
      
      const matchesDate = dateFilter === 'all' || 
        (dateFilter === 'today' && sale.sale_date === new Date().toISOString().split('T')[0]) ||
        (dateFilter === 'week' && new Date(sale.sale_date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
        (dateFilter === 'month' && new Date(sale.sale_date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
      
      return matchesSearch && matchesStatus && matchesDate;
    }).sort((a, b) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime());
  }, [sales, searchTerm, statusFilter, dateFilter]);

  const stats = useMemo(() => {
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_amount, 0);
    const completedSales = sales.filter(sale => sale.status === 'completed').length;
    const pendingSales = sales.filter(sale => sale.status === 'pending').length;
    const averageSaleValue = totalSales > 0 ? totalRevenue / totalSales : 0;

    return {
      totalSales,
      totalRevenue,
      completedSales,
      pendingSales,
      averageSaleValue
    };
  }, [sales]);

  const handleViewDetails = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDetailsModalOpen(true);
    setIsEditMode(false);
  };

  const handleSaveSale = () => {
    // Ici on pourrait sauvegarder les modifications
    setIsEditMode(false);
    toast.success('Vente modifiée avec succès');
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedSale(undefined);
    setIsEditMode(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminée';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash': return 'Espèces';
      case 'mobile_money': return 'Mobile Money';
      case 'bank_transfer': return 'Virement bancaire';
      case 'card': return 'Carte bancaire';
      default: return method;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Ventes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos ventes et suivez vos performances commerciales
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Package className="w-4 h-4 mr-2" />
            Nouvelle Vente
          </Button>
          <Button variant="secondary">
            <TrendingUp className="w-4 h-4 mr-2" />
            Rapport
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <div className="flex items-center p-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">Total Ventes</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalSales}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center p-4">
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">Chiffre d'Affaires</h3>
              <p className="text-lg font-semibold text-gray-900 truncate">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center p-4">
            <div className="p-2 bg-green-100 rounded-full">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">Ventes Terminées</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.completedSales}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center p-4">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Calendar className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">En Attente</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingSales}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center p-4">
            <div className="p-2 bg-purple-100 rounded-full">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">Vente Moyenne</h3>
              <p className="text-lg font-semibold text-gray-900 truncate">
                {formatCurrency(stats.averageSaleValue)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8 w-64"
                placeholder="Rechercher une vente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="completed">Terminées</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="cancelled">Annulées</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={dateFilter}
            onValueChange={setDateFilter}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Toutes les dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les dates</SelectItem>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tableau des ventes */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Client</TableHead>
              <TableHead className="w-[180px]">Produit</TableHead>
              <TableHead className="w-[80px]">Qté</TableHead>
              <TableHead className="w-[120px]">Montant</TableHead>
              <TableHead className="w-[120px]">Vendeur</TableHead>
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead className="w-[100px]">Statut</TableHead>
              <TableHead className="w-[120px]">Paiement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow 
                key={sale.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleViewDetails(sale)}
              >
                <TableCell className="py-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900 truncate">{sale.customer_name}</div>
                    <div className="text-xs text-gray-500 truncate">{sale.customer_email}</div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="text-sm text-gray-900 truncate">{sale.product_name}</div>
                </TableCell>
                <TableCell className="py-3 text-sm text-gray-500">
                  {sale.quantity}
                </TableCell>
                <TableCell className="py-3 text-sm text-gray-900 font-medium">
                  {formatCurrency(sale.total_amount)}
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-900 truncate">{sale.seller_name}</span>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-sm text-gray-500">
                  {new Date(sale.sale_date).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell className="py-3">
                  <Badge variant={getStatusColor(sale.status) as "success" | "warning" | "destructive" | "secondary"}>
                    {getStatusLabel(sale.status)}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-sm text-gray-500 truncate">
                  {getPaymentMethodLabel(sale.payment_method)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredSales.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p>Aucune vente trouvée</p>
          </div>
        )}
      </Card>

      {/* Modal Détails de la Vente */}
      {isDetailsModalOpen && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Vente #{selectedSale.id}
                </h3>
                <p className="text-gray-500">Détails de la vente</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Informations du client */}
              <Card>
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Informations Client
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nom</label>
                      <p className="text-sm text-gray-900">{selectedSale.customer_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900">{selectedSale.customer_email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Téléphone</label>
                      <p className="text-sm text-gray-900">{selectedSale.customer_phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Région</label>
                      <p className="text-sm text-gray-900">{selectedSale.region}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Informations de la vente */}
              <Card>
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Détails de la Vente
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Produit</label>
                      <p className="text-sm text-gray-900">{selectedSale.product_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Quantité</label>
                      <p className="text-sm text-gray-900">{selectedSale.quantity}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Prix unitaire</label>
                      <p className="text-sm text-gray-900">{formatCurrency(selectedSale.unit_price)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Montant total</label>
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(selectedSale.total_amount)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Vendeur</label>
                      <p className="text-sm text-gray-900">{selectedSale.seller_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date de vente</label>
                      <p className="text-sm text-gray-900">{new Date(selectedSale.sale_date).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Statut</label>
                      <Badge variant={getStatusColor(selectedSale.status) as "success" | "warning" | "destructive" | "secondary"}>
                        {getStatusLabel(selectedSale.status)}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Méthode de paiement</label>
                      <p className="text-sm text-gray-900">{getPaymentMethodLabel(selectedSale.payment_method)}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Actions */}
            <div className="border-t pt-4 flex justify-end gap-3">
              {isEditMode ? (
                <>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Annuler
                  </Button>
                  <Button onClick={handleSaveSale}>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={handleCloseModal}>
                    Fermer
                  </Button>
                  <Button onClick={() => setIsEditMode(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier la Vente
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
