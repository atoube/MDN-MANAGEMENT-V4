import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { 
  TrendingUp, 
  Package, 
  Search, 
  Upload, 
  User, 
  DollarSign, 
  MapPin, 
  Phone,
  Mail,
  Calendar,
  Plus,
  Edit,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive' | 'low_stock';
  sku: string;
}

interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  performance: number;
  total_sales: number;
  products: Product[];
  created_at: string;
  status: 'active' | 'inactive';
}

const SELLERS: Seller[] = [
  {
    id: '1',
    name: 'Ahmadou Bello',
    email: 'ahmadou.bello@madon.cm',
    phone: '+237 6 94 12 34 56',
    region: 'Littoral (Douala)',
    performance: 95,
    total_sales: 125000000,
    status: 'active',
    created_at: '2022-03-15T10:00:00Z',
    products: [
      {
        id: '1',
        name: 'Système de Gestion Bancaire MDN',
        price: 25000000,
        stock: 5,
        category: 'Logiciels Bancaires',
        status: 'active',
        sku: 'MDN-BANK-001'
      },
      {
        id: '3',
        name: 'Application Mobile MDN Business',
        price: 8000000,
        stock: 1,
        category: 'Applications Mobiles',
        status: 'low_stock',
        sku: 'MDN-MOB-003'
      },
      {
        id: '9',
        name: 'Plateforme de Formation en Ligne',
        price: 9500000,
        stock: 3,
        category: 'Éducation',
        status: 'active',
        sku: 'MDN-EDU-009'
      }
    ]
  },
  {
    id: '2',
    name: 'Fatou Ndiaye',
    email: 'fatou.ndiaye@madon.cm',
    phone: '+237 6 95 23 45 67',
    region: 'Centre (Yaoundé)',
    performance: 88,
    total_sales: 98000000,
    status: 'active',
    created_at: '2021-08-20T09:00:00Z',
    products: [
      {
        id: '2',
        name: 'Système de Gestion Logistique Pro',
        price: 18000000,
        stock: 3,
        category: 'Logistique',
        status: 'active',
        sku: 'MDN-LOG-002'
      },
      {
        id: '8',
        name: 'Solution de Sécurité Numérique',
        price: 22000000,
        stock: 6,
        category: 'Sécurité',
        status: 'active',
        sku: 'MDN-SEC-008'
      }
    ]
  },
  {
    id: '3',
    name: 'Kouassi Mensah',
    email: 'kouassi.mensah@madon.cm',
    phone: '+237 6 96 34 56 78',
    region: 'Littoral (Douala)',
    performance: 92,
    total_sales: 110000000,
    status: 'active',
    created_at: '2023-01-10T08:30:00Z',
    products: [
      {
        id: '4',
        name: 'Système de Monitoring Électrique',
        price: 15000000,
        stock: 8,
        category: 'Énergie',
        status: 'active',
        sku: 'MDN-ELEC-004'
      },
      {
        id: '7',
        name: 'Système de Gestion Agricole',
        price: 32000000,
        stock: 0,
        category: 'Agriculture',
        status: 'inactive',
        sku: 'MDN-AGR-007'
      }
    ]
  },
  {
    id: '4',
    name: 'Aissatou Diallo',
    email: 'aissatou.diallo@madon.cm',
    phone: '+237 6 97 45 67 89',
    region: 'Centre (Yaoundé)',
    performance: 87,
    total_sales: 85000000,
    status: 'active',
    created_at: '2022-11-05T14:00:00Z',
    products: [
      {
        id: '5',
        name: 'Plateforme E-commerce MDN',
        price: 12000000,
        stock: 4,
        category: 'E-commerce',
        status: 'active',
        sku: 'MDN-ECO-005'
      },
      {
        id: '10',
        name: 'Système de Gestion Hospitalière',
        price: 35000000,
        stock: 1,
        category: 'Santé',
        status: 'low_stock',
        sku: 'MDN-HEALTH-010'
      }
    ]
  },
  {
    id: '5',
    name: 'Moussa Traoré',
    email: 'moussa.traore@madon.cm',
    phone: '+237 6 98 56 78 90',
    region: 'Littoral (Douala)',
    performance: 78,
    total_sales: 65000000,
    status: 'active',
    created_at: '2023-05-12T16:30:00Z',
    products: [
      {
        id: '6',
        name: 'Système de Facturation Mobile',
        price: 28000000,
        stock: 2,
        category: 'Télécommunications',
        status: 'active',
        sku: 'MDN-TEL-006'
      }
    ]
  }
];

export default function Sellers() {
  const [sellers, setSellers] = useState<Seller[]>(SELLERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isNewSellerModalOpen, setIsNewSellerModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const filteredSellers = useMemo(() => {
    return sellers.filter(seller => {
      const matchesSearch = 
        searchTerm === '' || 
        seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.phone.includes(searchTerm);
      
      const matchesRegion = regionFilter === 'all' || seller.region === regionFilter;
      const matchesStatus = statusFilter === 'all' || seller.status === statusFilter;
      
      return matchesSearch && matchesRegion && matchesStatus;
    });
  }, [sellers, searchTerm, regionFilter, statusFilter]);

  const stats = useMemo(() => {
    const totalSellers = sellers.length;
    const totalProducts = sellers.reduce((sum, seller) => sum + seller.products.length, 0);
    const totalSales = sellers.reduce((sum, seller) => sum + seller.total_sales, 0);
    const activeSellers = sellers.filter(s => s.status === 'active').length;
    const avgPerformance = sellers.reduce((sum, seller) => sum + seller.performance, 0) / sellers.length;

    return {
      totalSellers,
      totalProducts,
      totalSales,
      activeSellers,
      avgPerformance: Math.round(avgPerformance)
    };
  }, [sellers]);

  const regions = useMemo(() => {
    return [...new Set(sellers.map(s => s.region))].sort();
  }, [sellers]);

  const formatPrice = (price: number) => {
    // Formatage spécial pour les grandes valeurs
    if (price >= 1000000) {
      const millions = price / 1000000;
      return `${millions.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}M F.CFA`;
    }
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'success';
    if (performance >= 80) return 'warning';
    return 'destructive';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'destructive';
  };

  const getProductStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'low_stock': return 'warning';
      case 'inactive': return 'destructive';
      default: return 'secondary';
    }
  };

  const getProductStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'low_stock': return 'Stock Faible';
      case 'inactive': return 'Inactif';
      default: return status;
    }
  };

  const handleViewDetails = (seller: Seller) => {
    setSelectedSeller(seller);
    setIsDetailsModalOpen(true);
    setIsEditMode(false);
  };

  const handleSaveSeller = () => {
    // Ici on pourrait sauvegarder les modifications
    setIsEditMode(false);
    toast.success('Vendeur modifié avec succès');
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedSeller(null);
    setIsEditMode(false);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Vendeurs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos vendeurs et suivez leurs performances
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </Button>
          <Button onClick={() => setIsNewSellerModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Vendeur
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Vendeurs</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSellers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Produits Assignés</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4 min-w-0 flex-1">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Ventes Totales</h3>
              <div className="space-y-1">
                <p className="text-lg font-bold text-gray-900 break-words">
                  {formatPrice(stats.totalSales)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Vendeurs Actifs</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.activeSellers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Performance Moy.</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.avgPerformance}%</p>
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
                placeholder="Rechercher un vendeur..."
                className="pl-8 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Select
            value={regionFilter}
            onValueChange={setRegionFilter}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Toutes les régions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les régions</SelectItem>
              {regions.map(region => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tableau des vendeurs */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Vendeur</TableHead>
                <TableHead className="w-[200px]">Contact</TableHead>
                <TableHead className="w-[200px]">Région</TableHead>
                <TableHead className="w-[120px]">Performance</TableHead>
                <TableHead className="w-[150px]">Ventes Totales</TableHead>
                <TableHead className="w-[150px]">Produits</TableHead>
                <TableHead className="w-[100px]">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSellers.map((seller) => (
                <TableRow 
                  key={seller.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleViewDetails(seller)}
                >
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{seller.name}</div>
                        <div className="text-sm text-gray-500">{seller.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-900">{seller.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-900 truncate">{seller.region}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant={getPerformanceColor(seller.performance) as "success" | "warning" | "destructive"}>
                      {seller.performance}%
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="text-sm text-gray-900 font-medium">
                      {formatPrice(seller.total_sales)}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-900 font-medium">
                          {seller.products.length} produits
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 ml-6">
                        {seller.products.reduce((sum, p) => sum + p.stock, 0)} en stock
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant={getStatusColor(seller.status) as "success" | "destructive"}>
                      {seller.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSellers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>Aucun vendeur trouvé</p>
            </div>
          )}
        </div>
      </Card>

      {/* Modal Détails du Vendeur */}
      {isDetailsModalOpen && selectedSeller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedSeller.name}
                </h3>
                <p className="text-gray-500">Détails du vendeur</p>
              </div>
              {/* Actions */}
              <div className="border-t pt-4 flex justify-end gap-3">
                {isEditMode ? (
                  <>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Annuler
                    </Button>
                    <Button onClick={handleSaveSeller}>
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
                      Modifier le Vendeur
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Informations du vendeur */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Informations Personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedSeller.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Téléphone</label>
                    <p className="text-gray-900 flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedSeller.phone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Région</label>
                    <p className="text-gray-900 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedSeller.region}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date d'inscription</label>
                    <p className="text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {new Date(selectedSeller.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques du vendeur */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Statistiques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Performance</label>
                    <div className="flex items-center">
                      <Badge variant={getPerformanceColor(selectedSeller.performance) as "success" | "warning" | "destructive"}>
                        {selectedSeller.performance}%
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ventes Totales</label>
                    <p className="text-gray-900 font-semibold">
                      {formatPrice(selectedSeller.total_sales)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nombre de Produits</label>
                    <p className="text-gray-900 font-semibold">
                      {selectedSeller.products.length} produits
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Statut</label>
                    <Badge variant={getStatusColor(selectedSeller.status) as "success" | "destructive"}>
                      {selectedSeller.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Liste des produits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Produits Assignés ({selectedSeller.products.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedSeller.products.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant={getProductStatusColor(product.status) as "success" | "warning" | "destructive" | "secondary"}>
                              {getProductStatusLabel(product.status)}
                            </Badge>
                            <span className="text-sm text-gray-500">SKU: {product.sku}</span>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
                          <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Prix: {formatPrice(product.price)}</span>
                            <span>Stock: {product.stock} unités</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {selectedSeller.products.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p>Aucun produit assigné à ce vendeur</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Modal Nouveau Vendeur */}
      {isNewSellerModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Nouveau Vendeur</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input
                  type="text"
                  placeholder="Nom complet"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  placeholder="email@madon.cm"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                <input
                  type="tel"
                  placeholder="+237 6 XX XX XX XX"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Région *</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="">Sélectionner une région</option>
                  <option value="Littoral (Douala)">Littoral (Douala)</option>
                  <option value="Centre (Yaoundé)">Centre (Yaoundé)</option>
                  <option value="Ouest (Bafoussam)">Ouest (Bafoussam)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Performance (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="85"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="secondary" onClick={() => setIsNewSellerModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => {
                setIsNewSellerModalOpen(false);
                toast.success('Vendeur créé avec succès');
              }}>
                Créer le vendeur
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}