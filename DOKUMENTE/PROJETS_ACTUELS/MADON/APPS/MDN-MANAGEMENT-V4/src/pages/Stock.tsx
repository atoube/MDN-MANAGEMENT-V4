import React from 'react';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Package, 
  TrendingUp, 
  AlertCircle, 
  Search, 
  Filter,
  ArrowUpCircle,
  ArrowDownCircle,
  BarChart2,
  Plus
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

const products = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    sku: 'IP15P-128-GR',
    category: 'Électronique',
    quantity: 45,
    minStock: 10,
    price: '799 000 F.CFA',
    status: 'in_stock'
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24',
    sku: 'SGS24-256-BK',
    category: 'Électronique',
    quantity: 8,
    minStock: 15,
    price: '699 000 F.CFA',
    status: 'low_stock'
  },
  {
    id: '3',
    name: 'MacBook Air M2',
    sku: 'MBA-M2-512-SG',
    category: 'Informatique',
    quantity: 0,
    minStock: 5,
    price: '899 000 F.CFA',
    status: 'out_of_stock'
  }
];

const recentMovements = [
  {
    id: '1',
    type: 'in',
    quantity: 50,
    product: 'iPhone 15 Pro',
    date: '2024-03-15',
    operator: 'John Doe'
  },
  {
    id: '2',
    type: 'out',
    quantity: 5,
    product: 'Samsung Galaxy S24',
    date: '2024-03-15',
    operator: 'Jane Smith'
  }
];

export function Stock() {
  const getStatusBadge = (status: string) => {
    const variants = {
      in_stock: { variant: 'success', label: 'En stock' },
      low_stock: { variant: 'warning', label: 'Stock faible' },
      out_of_stock: { variant: 'danger', label: 'Rupture' }
    } as const;

    const statusInfo = variants[status as keyof typeof variants];
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gestion des stocks</h1>
          <p className="mt-1 text-sm text-gray-500">
            Suivez et gérez votre inventaire en temps réel
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <ArrowDownCircle className="w-4 h-4 mr-2" />
            Entrée stock
          </Button>
          <Button variant="secondary">
            <ArrowUpCircle className="w-4 h-4 mr-2" />
            Sortie stock
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau produit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total produits</h3>
              <p className="text-3xl font-semibold text-gray-900">1,234</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Valeur stock</h3>
              <p className="text-3xl font-semibold text-gray-900">284.5M F.CFA</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Stock faible</h3>
              <p className="text-3xl font-semibold text-gray-900">12</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <BarChart2 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Mouvements/jour</h3>
              <p className="text-3xl font-semibold text-gray-900">45</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    className="pl-10"
                    placeholder="Rechercher un produit..."
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select
                  options={[
                    { value: 'all', label: 'Toutes catégories' },
                    { value: 'electronics', label: 'Électronique' },
                    { value: 'computers', label: 'Informatique' }
                  ]}
                  className="w-40"
                />
                <Button variant="secondary">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </Button>
              </div>
            </div>

            <Table
              headers={[
                'Produit',
                'SKU',
                'Catégorie',
                'Quantité',
                'Prix',
                'Statut',
                'Actions'
              ]}
            >
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${
                      product.quantity <= product.minStock 
                        ? 'text-red-600' 
                        : 'text-gray-900'
                    }`}>
                      {product.quantity}
                    </span>
                    <span className="text-gray-500 ml-1">
                      {`(Min: ${product.minStock})`}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button variant="secondary" size="sm">
                        Détails
                      </Button>
                      <Button variant="secondary" size="sm">
                        Modifier
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>

        <div>
          <Card title="Mouvements récents">
            <div className="flow-root">
              <ul className="-mb-8">
                {recentMovements.map((movement, index) => (
                  <li key={movement.id}>
                    <div className="relative pb-8">
                      {index !== recentMovements.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            movement.type === 'in' 
                              ? 'bg-green-500' 
                              : 'bg-red-500'
                          }`}>
                            {movement.type === 'in' ? (
                              <ArrowDownCircle className="h-5 w-5 text-white" />
                            ) : (
                              <ArrowUpCircle className="h-5 w-5 text-white" />
                            )}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {movement.type === 'in' ? 'Entrée' : 'Sortie'} de{' '}
                              <span className="font-medium text-gray-900">
                                {movement.quantity}
                              </span>{' '}
                              unités de{' '}
                              <span className="font-medium text-gray-900">
                                {movement.product}
                              </span>
                            </p>
                            <p className="text-sm text-gray-500">
                              Par {movement.operator}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {new Date(movement.date).toLocaleDateString()}
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