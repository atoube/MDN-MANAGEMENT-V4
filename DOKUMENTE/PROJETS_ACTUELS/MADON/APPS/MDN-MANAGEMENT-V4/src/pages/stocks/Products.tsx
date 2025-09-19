import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Plus, Search, Package, User, TrendingUp, AlertTriangle, Edit, Calendar, Tag, BarChart3, Save } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive' | 'low_stock';
  seller_id: string;
  seller_name: string;
  supplier: string;
  created_at: string;
  updated_at: string;
  min_stock: number;
  max_stock: number;
  unit: string;
  barcode?: string;
  sku: string;
}

interface Seller {
  id: string;
  name: string;
  email: string;
  region: string;
  performance: number;
}

const SELLERS: Seller[] = [
  {
    id: '1',
    name: 'Ahmadou Bello',
    email: 'ahmadou.bello@madon.cm',
    region: 'Littoral (Douala)',
    performance: 95
  },
  {
    id: '2',
    name: 'Fatou Ndiaye',
    email: 'fatou.ndiaye@madon.cm',
    region: 'Centre (Yaoundé)',
    performance: 88
  },
  {
    id: '3',
    name: 'Kouassi Mensah',
    email: 'kouassi.mensah@madon.cm',
    region: 'Littoral (Douala)',
    performance: 92
  },
  {
    id: '4',
    name: 'Aissatou Diallo',
    email: 'aissatou.diallo@madon.cm',
    region: 'Centre (Yaoundé)',
    performance: 87
  },
  {
    id: '5',
    name: 'Moussa Traoré',
    email: 'moussa.traore@madon.cm',
    region: 'Littoral (Douala)',
    performance: 78
  }
];

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Système de Gestion Bancaire MDN',
    description: 'Solution complète de gestion bancaire avec modules de comptabilité, facturation et reporting',
    price: 25000000,
    stock: 5,
    category: 'Logiciels Bancaires',
    status: 'active',
    seller_id: '1',
    seller_name: 'Ahmadou Bello',
    supplier: 'MDN Technologies',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-03-15T14:30:00Z',
    min_stock: 2,
    max_stock: 10,
    unit: 'Licence',
    sku: 'MDN-BANK-001'
  },
  {
    id: '2',
    name: 'Système de Gestion Logistique Pro',
    description: 'Plateforme de gestion logistique avec suivi GPS et optimisation des routes',
    price: 18000000,
    stock: 3,
    category: 'Logistique',
    status: 'active',
    seller_id: '2',
    seller_name: 'Fatou Ndiaye',
    supplier: 'MDN Technologies',
    created_at: '2024-01-20T09:00:00Z',
    updated_at: '2024-03-14T16:45:00Z',
    min_stock: 1,
    max_stock: 8,
    unit: 'Licence',
    sku: 'MDN-LOG-002'
  },
  {
    id: '3',
    name: 'Application Mobile MDN Business',
    description: 'Application mobile pour la gestion d\'entreprise avec synchronisation cloud',
    price: 8000000,
    stock: 1,
    category: 'Applications Mobiles',
    status: 'low_stock',
    seller_id: '1',
    seller_name: 'Ahmadou Bello',
    supplier: 'MDN Technologies',
    created_at: '2024-02-10T11:30:00Z',
    updated_at: '2024-03-10T13:20:00Z',
    min_stock: 2,
    max_stock: 15,
    unit: 'Licence',
    sku: 'MDN-MOB-003'
  },
  {
    id: '4',
    name: 'Système de Monitoring Électrique',
    description: 'Solution de monitoring et contrôle des installations électriques',
    price: 15000000,
    stock: 8,
    category: 'Énergie',
    status: 'active',
    seller_id: '3',
    seller_name: 'Kouassi Mensah',
    supplier: 'MDN Technologies',
    created_at: '2024-01-25T14:15:00Z',
    updated_at: '2024-03-12T10:30:00Z',
    min_stock: 3,
    max_stock: 12,
    unit: 'Licence',
    sku: 'MDN-ELEC-004'
  },
  {
    id: '5',
    name: 'Plateforme E-commerce MDN',
    description: 'Solution complète de commerce électronique avec paiement mobile money',
    price: 12000000,
    stock: 4,
    category: 'E-commerce',
    status: 'active',
    seller_id: '4',
    seller_name: 'Aissatou Diallo',
    supplier: 'MDN Technologies',
    created_at: '2024-02-05T08:45:00Z',
    updated_at: '2024-03-13T15:10:00Z',
    min_stock: 2,
    max_stock: 10,
    unit: 'Licence',
    sku: 'MDN-ECO-005'
  },
  {
    id: '6',
    name: 'Système de Facturation Mobile',
    description: 'Solution de facturation intégrée avec les opérateurs mobiles camerounais',
    price: 28000000,
    stock: 2,
    category: 'Télécommunications',
    status: 'active',
    seller_id: '5',
    seller_name: 'Moussa Traoré',
    supplier: 'MDN Technologies',
    created_at: '2024-01-30T12:00:00Z',
    updated_at: '2024-03-11T09:15:00Z',
    min_stock: 1,
    max_stock: 6,
    unit: 'Licence',
    sku: 'MDN-TEL-006'
  },
  {
    id: '7',
    name: 'Système de Gestion Agricole',
    description: 'Plateforme de gestion agricole avec suivi des cultures et météo',
    price: 32000000,
    stock: 0,
    category: 'Agriculture',
    status: 'inactive',
    seller_id: '3',
    seller_name: 'Kouassi Mensah',
    supplier: 'MDN Technologies',
    created_at: '2024-02-15T16:20:00Z',
    updated_at: '2024-03-13T11:45:00Z',
    min_stock: 1,
    max_stock: 5,
    unit: 'Licence',
    sku: 'MDN-AGR-007'
  },
  {
    id: '8',
    name: 'Solution de Sécurité Numérique',
    description: 'Système de cybersécurité avec protection contre les menaces',
    price: 22000000,
    stock: 6,
    category: 'Sécurité',
    status: 'active',
    seller_id: '2',
    seller_name: 'Fatou Ndiaye',
    supplier: 'MDN Technologies',
    created_at: '2024-02-20T10:30:00Z',
    updated_at: '2024-03-14T14:20:00Z',
    min_stock: 2,
    max_stock: 8,
    unit: 'Licence',
    sku: 'MDN-SEC-008'
  },
  {
    id: '9',
    name: 'Plateforme de Formation en Ligne',
    description: 'Système de formation à distance avec classes virtuelles',
    price: 9500000,
    stock: 3,
    category: 'Éducation',
    status: 'active',
    seller_id: '1',
    seller_name: 'Ahmadou Bello',
    supplier: 'MDN Technologies',
    created_at: '2024-02-25T13:45:00Z',
    updated_at: '2024-03-15T12:30:00Z',
    min_stock: 2,
    max_stock: 12,
    unit: 'Licence',
    sku: 'MDN-EDU-009'
  },
  {
    id: '10',
    name: 'Système de Gestion Hospitalière',
    description: 'Solution complète de gestion hospitalière avec dossiers patients',
    price: 35000000,
    stock: 1,
    category: 'Santé',
    status: 'low_stock',
    seller_id: '4',
    seller_name: 'Aissatou Diallo',
    supplier: 'MDN Technologies',
    created_at: '2024-03-01T09:15:00Z',
    updated_at: '2024-03-15T16:00:00Z',
    min_stock: 1,
    max_stock: 4,
    unit: 'Licence',
    sku: 'MDN-HEALTH-010'
  }
];

export default function Products() {
  const [products] = useState<Product[]>(PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sellerFilter, setSellerFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return cats.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = 
        searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.seller_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      const matchesSeller = sellerFilter === 'all' || product.seller_id === sellerFilter;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesSeller;
    });
  }, [products, searchTerm, categoryFilter, statusFilter, sellerFilter]);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStockProducts = products.filter(p => p.status === 'low_stock').length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    const activeProducts = products.filter(p => p.status === 'active').length;

    return {
      totalProducts,
      totalValue,
      lowStockProducts,
      outOfStockProducts,
      activeProducts
    };
  }, [products]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'destructive';
      case 'low_stock': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'low_stock': return 'Stock Faible';
      default: return status;
    }
  };

  const formatPrice = (price: number) => {
    // Formatage compact pour éviter les débordements
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M F.CFA`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K F.CFA`;
    } else {
      return `${price.toLocaleString('fr-FR')} F.CFA`;
    }
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedProduct(null);
    setIsEditMode(false);
  };

  const handleEditProduct = () => {
    setIsEditMode(true);
  };

  const handleSaveProduct = () => {
    // Ici on pourrait sauvegarder les modifications
    setIsEditMode(false);
    toast.success('Produit modifié avec succès');
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">Total Produits</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-full flex-shrink-0">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">Valeur Stock</h3>
              <p className="text-lg font-bold text-gray-900 truncate" title={formatPrice(stats.totalValue)}>
                {formatPrice(stats.totalValue)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-full flex-shrink-0">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">Produits Actifs</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.activeProducts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-full flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">Stock Faible</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.lowStockProducts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-full flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">Rupture Stock</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.outOfStockProducts}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Produits</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit..."
                className="pl-8 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
                <SelectItem value="low_stock">Stock Faible</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sellerFilter}
              onValueChange={setSellerFilter}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tous les vendeurs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les vendeurs</SelectItem>
                {SELLERS.map(seller => (
                  <SelectItem key={seller.id} value={seller.id}>{seller.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un produit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>SKU</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Catégorie</th>
                <th>Vendeur</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr 
                  key={product.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleViewDetails(product)}
                >
                  <td>
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.description}</div>
                    </div>
                  </td>
                  <td className="text-sm text-gray-500 font-mono">{product.sku}</td>
                  <td className="font-medium text-gray-900">
                    {formatPrice(product.price)}
                  </td>
                  <td>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{product.stock}</span>
                      <span className="text-sm text-gray-500 ml-1">{product.unit}</span>
                    </div>
                    {product.stock <= product.min_stock && (
                      <div className="text-xs text-red-600 mt-1">
                        Stock minimum: {product.min_stock}
                      </div>
                    )}
                  </td>
                  <td className="text-sm text-gray-500">{product.category}</td>
                  <td>
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.seller_name}</div>
                        <div className="text-xs text-gray-500">
                          {SELLERS.find(s => s.id === product.seller_id)?.region}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge variant={getStatusColor(product.status) as "success" | "destructive" | "warning" | "secondary"}>
                      {getStatusLabel(product.status)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>Aucun produit trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de détails du produit */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Détails du Produit
            </DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-6">
              {/* En-tête du produit */}
              <div className="border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedProduct.name}
                </h2>
                <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                <div className="flex items-center gap-4">
                  <Badge variant={getStatusColor(selectedProduct.status) as "success" | "destructive" | "warning" | "secondary"}>
                    {getStatusLabel(selectedProduct.status)}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    SKU: {selectedProduct.sku}
                  </span>
                </div>
              </div>

              {/* Informations principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Informations Générales
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix:</span>
                      <span className="font-semibold">{formatPrice(selectedProduct.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock actuel:</span>
                      <span className="font-semibold">
                        {selectedProduct.stock} {selectedProduct.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock minimum:</span>
                      <span className="font-semibold">{selectedProduct.min_stock} {selectedProduct.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock maximum:</span>
                      <span className="font-semibold">{selectedProduct.max_stock} {selectedProduct.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Catégorie:</span>
                      <span className="font-semibold">{selectedProduct.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fournisseur:</span>
                      <span className="font-semibold">{selectedProduct.supplier}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Vendeur Assigné
                  </h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{selectedProduct.seller_name}</h4>
                        <p className="text-sm text-gray-600">
                          {SELLERS.find(s => s.id === selectedProduct.seller_id)?.email}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Région:</span>
                        <span>{SELLERS.find(s => s.id === selectedProduct.seller_id)?.region}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Performance:</span>
                        <span className="font-semibold">
                          {SELLERS.find(s => s.id === selectedProduct.seller_id)?.performance}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Informations Temporelles
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Créé le:</span>
                      <span>{formatDate(selectedProduct.created_at)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Dernière mise à jour:</span>
                      <span>{formatDate(selectedProduct.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistiques du produit */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <BarChart3 className="h-4 w-4" />
                  Statistiques
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-900">Valeur Stock</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">
                      {formatPrice(selectedProduct.price * selectedProduct.stock)}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-900">Niveau Stock</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">
                      {Math.round((selectedProduct.stock / selectedProduct.max_stock) * 100)}%
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-semibold text-yellow-900">Statut Stock</span>
                    </div>
                    <p className="text-lg font-semibold text-yellow-900">
                      {selectedProduct.stock <= selectedProduct.min_stock ? 'Faible' : 'Normal'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t pt-4 flex justify-end gap-3">
                {isEditMode ? (
                  <>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Annuler
                    </Button>
                    <Button onClick={handleSaveProduct}>
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={handleCloseModal}>
                      Fermer
                    </Button>
                    <Button onClick={handleEditProduct}>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier le Produit
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 