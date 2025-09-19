import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Plus, Search } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

const TEST_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Client 1',
    email: 'client1@example.com',
    phone: '0123456789',
    address: 'Adresse 1',
    status: 'active',
    createdAt: '2024-04-26',
    updatedAt: '2024-04-26'
  },
  {
    id: '2',
    name: 'Client 2',
    email: 'client2@example.com',
    phone: '0987654321',
    address: 'Adresse 2',
    status: 'active',
    createdAt: '2024-04-26',
    updatedAt: '2024-04-26'
  }
];

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(TEST_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Clients</CardTitle>
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
            Ajouter un client
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
            {filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.address}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {customer.status === 'active' ? 'Actif' : 'Inactif'}
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
};

export default Customers; 