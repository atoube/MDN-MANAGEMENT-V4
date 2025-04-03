import React from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import {
  FileText,
  Search,
  Filter,
  Calendar,
  Plus,
  DollarSign,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

export function DGIDeclarations() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Déclarations DGI</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos déclarations fiscales et sociales
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle déclaration
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total déclarations</h3>
              <p className="text-3xl font-semibold text-gray-900">24</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Montant total</h3>
              <p className="text-3xl font-semibold text-gray-900">8.5M F.CFA</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">En attente</h3>
              <p className="text-3xl font-semibold text-gray-900">3</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Validées</h3>
              <p className="text-3xl font-semibold text-gray-900">21</p>
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
                placeholder="Rechercher une déclaration..."
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Select
              options={[
                { value: 'all', label: 'Tous les types' },
                { value: 'tva', label: 'TVA' },
                { value: 'is', label: 'IS' },
                { value: 'irpp', label: 'IRPP' },
                { value: 'cnps', label: 'CNPS' }
              ]}
              className="w-40"
            />
            <Select
              options={[
                { value: 'all', label: 'Tous les statuts' },
                { value: 'draft', label: 'Brouillon' },
                { value: 'submitted', label: 'Soumise' },
                { value: 'validated', label: 'Validée' },
                { value: 'rejected', label: 'Rejetée' }
              ]}
              className="w-40"
            />
            <Button variant="secondary">
              <Calendar className="w-4 h-4 mr-2" />
              Période
            </Button>
          </div>
        </div>

        <Table
          headers={[
            'Référence',
            'Type',
            'Période',
            'Montant',
            'Date soumission',
            'Statut',
            'Actions'
          ]}
        >
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              DGI-2024-001
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              TVA
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              Mars 2024
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"> ```
              450 000 F.CFA
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              15/03/2024
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Badge variant="success">Validée</Badge>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex justify-end space-x-2">
                <Button variant="secondary" size="sm">
                  Détails
                </Button>
                <Button variant="secondary" size="sm">
                  Télécharger
                </Button>
              </div>
            </td>
          </tr>
        </Table>
      </Card>
    </div>
  );
}