import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Plus, Search } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
}

const TEST_SUPPLIERS: Supplier[] = [
  {
    id: '1',
    name: 'Fournisseur 1',
    email: 'fournisseur1@example.com',
    phone: '0123456789',
    address: 'Adresse 1',
    status: 'active'
  },
  {
    id: '2',
    name: 'Fournisseur 2',
    email: 'fournisseur2@example.com',
    phone: '0987654321',
    address: 'Adresse 2',
    status: 'active'
  }
];

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(TEST_SUPPLIERS);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Fournisseurs</CardTitle>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un fournisseur
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Adresse</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td>{supplier.name}</td>
                <td>{supplier.email}</td>
                <td>{supplier.phone}</td>
                <td>{supplier.address}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    supplier.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {supplier.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td>
                  <Button variant="ghost" size="sm">
                    Modifier
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardContent>
    </Card>
  );
} 