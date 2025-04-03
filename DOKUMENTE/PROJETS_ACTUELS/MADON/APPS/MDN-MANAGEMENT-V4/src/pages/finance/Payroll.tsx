import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import {
  Users,
  Search,
  Filter,
  Calendar,
  Plus,
  DollarSign,
  FileText,
  TrendingUp
} from 'lucide-react';

export function Payroll() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gestion des salaires</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les fiches de paie et les salaires des employés
          </p>
        </div>
        <Button onClick={() => navigate('/finance/payroll/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle fiche de paie
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Employés</h3>
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
              <h3 className="text-lg font-medium text-gray-900">Total salaires</h3>
              <p className="text-3xl font-semibold text-gray-900">12.5M F.CFA</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Moyenne</h3>
              <p className="text-3xl font-semibold text-gray-900">520K F.CFA</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Fiches de paie</h3>
              <p className="text-3xl font-semibold text-gray-900">24</p>
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
                placeholder="Rechercher un employé..."
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Select
              options={[
                { value: 'all', label: 'Tous les statuts' },
                { value: 'draft', label: 'Brouillon' },
                { value: 'approved', label: 'Approuvée' },
                { value: 'paid', label: 'Payée' }
              ]}
              className="w-40"
            />
            <Button variant="secondary">
              <Calendar className="w-4 h-4 mr-2" />
              Période
            </Button>
            <Button variant="secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>

        <Table
          headers={[
            'Employé',
            'Période',
            'Salaire brut',
            'Charges',
            'Net à payer',
            'Statut',
            'Actions'
          ]}
        >
          <tr>
            <td className="px-6 py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 font-medium">JD</span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    John Doe
                  </div>
                  <div className="text-sm text-gray-500">
                    Développeur
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              Mars 2024
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              450 000 F.CFA
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              67 500 F.CFA
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              382 500 F.CFA
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Badge variant="success">Payée</Badge>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex justify-end space-x-2">
                <Button variant="secondary" size="sm">
                  Détails
                </Button>
                <Button variant="secondary" size="sm">
                  Imprimer
                </Button>
              </div>
            </td>
          </tr>
        </Table>
      </Card>
    </div>
  );
}