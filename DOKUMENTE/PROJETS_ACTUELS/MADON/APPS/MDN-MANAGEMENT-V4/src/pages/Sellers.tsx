import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Store, TrendingUp, Package, ShoppingBag, Search, Filter, Trash2, Upload } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useSellers } from '../hooks/useSellers';
import { SellerDialog } from '../components/sellers/SellerDialog';
import { ImportSellersDialog } from '../components/sellers/ImportSellersDialog';
import { useAuth } from '../contexts/AuthContext';

export function Sellers() {
  const { user } = useAuth();
  const { sellers, isLoading, createSeller, updateSeller, deleteSeller, importSellers } = useSellers();
  const [isSellerDialogOpen, setIsSellerDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<any>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateSeller = async (data: any) => {
    try {
      await createSeller.mutateAsync(data);
      setIsSellerDialogOpen(false);
    } catch (error) {
      console.error('Error creating seller:', error);
    }
  };

  const handleUpdateSeller = async (data: any) => {
    if (!selectedSeller) return;

    try {
      await updateSeller.mutateAsync({
        id: selectedSeller.id,
        ...data
      });
      setIsSellerDialogOpen(false);
      setSelectedSeller(undefined);
    } catch (error) {
      console.error('Error updating seller:', error);
    }
  };

  const handleDeleteSeller = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce vendeur ?')) return;

    try {
      await deleteSeller.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting seller:', error);
    }
  };

  const handleEditSeller = (seller: any) => {
    setSelectedSeller(seller);
    setIsSellerDialogOpen(true);
  };

  const handleImportSellers = async (sellers: any[]) => {
    try {
      await importSellers.mutateAsync(sellers);
    } catch (error) {
      console.error('Error importing sellers:', error);
      throw error;
    }
  };

  const filteredSellers = sellers?.filter(seller =>
    searchTerm === '' ||
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const totalSellers = sellers?.length || 0;
  const totalProducts = sellers?.reduce((sum, seller) => 
    sum + (seller.products?.length || 0), 0) || 0;
  const inStockProducts = sellers?.reduce((sum, seller) => 
    sum + (seller.products?.filter(p => p.status === 'in_stock').length || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Vendeurs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos vendeurs et suivez leurs performances
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setIsImportDialogOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </Button>
          <Button onClick={() => setIsSellerDialogOpen(true)}>
            <Store className="w-4 h-4 mr-2" />
            Nouveau vendeur
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-full">
              <Store className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total vendeurs</h3>
              <p className="text-3xl font-semibold text-gray-900">{totalSellers}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Ventes du mois</h3>
              <p className="text-3xl font-semibold text-gray-900">58.4M F.CFA</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Produits en stock</h3>
              <p className="text-3xl font-semibold text-gray-900">{inStockProducts}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <ShoppingBag className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Produits en ligne</h3>
              <p className="text-3xl font-semibold text-gray-900">{totalProducts}</p>
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
                placeholder="Rechercher un vendeur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>

        <Table
          headers={[
            'Vendeur',
            'Contact',
            'Produits',
            'Ventes totales',
            'Actions'
          ]}
        >
          {filteredSellers?.map((seller) => (
            <tr key={seller.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Store className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {seller.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {seller.address}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{seller.email}</div>
                <div className="text-sm text-gray-500">{seller.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {seller.products?.length || 0} produits
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                -
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <Button variant="secondary" size="sm">
                    Détails
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleEditSeller(seller)}
                  >
                    Modifier
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDeleteSeller(seller.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <SellerDialog
        isOpen={isSellerDialogOpen}
        onClose={() => {
          setIsSellerDialogOpen(false);
          setSelectedSeller(undefined);
        }}
        onSubmit={selectedSeller ? handleUpdateSeller : handleCreateSeller}
        seller={selectedSeller}
      />

      <ImportSellersDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={handleImportSellers}
      />
    </div>
  );
}