import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Table } from '@/components/ui/Table';
import { FileText, Download } from 'lucide-react';

interface StockReport {
  id: string;
  type: 'inventory' | 'sales' | 'purchases';
  period: 'daily' | 'weekly' | 'monthly';
  date: string;
  totalProducts: number;
  totalValue: number;
  status: 'completed' | 'pending' | 'failed';
}

const TEST_REPORTS: StockReport[] = [
  {
    id: '1',
    type: 'inventory',
    period: 'daily',
    date: '2024-04-26',
    totalProducts: 150,
    totalValue: 25000,
    status: 'completed'
  },
  {
    id: '2',
    type: 'sales',
    period: 'weekly',
    date: '2024-04-20',
    totalProducts: 75,
    totalValue: 15000,
    status: 'completed'
  }
];

const Reports: React.FC = () => {
  const [reports, setReports] = useState<StockReport[]>(TEST_REPORTS);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');

  const filteredReports = reports.filter(report => {
    if (selectedType && report.type !== selectedType) return false;
    if (selectedPeriod && report.period !== selectedPeriod) return false;
    return true;
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'inventory': return 'Inventaire';
      case 'sales': return 'Ventes';
      case 'purchases': return 'Achats';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    const labels = {
      completed: 'Terminé',
      pending: 'En cours',
      failed: 'Échoué'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Rapports</CardTitle>
        <div className="flex items-center gap-4">
          <Select
            value={selectedType}
            onValueChange={setSelectedType}
            placeholder="Type de rapport"
          >
            <option value="">Tous les types</option>
            <option value="inventory">Inventaire</option>
            <option value="sales">Ventes</option>
            <option value="purchases">Achats</option>
          </Select>
          <Select
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
            placeholder="Période"
          >
            <option value="">Toutes les périodes</option>
            <option value="daily">Journalier</option>
            <option value="weekly">Hebdomadaire</option>
            <option value="monthly">Mensuel</option>
          </Select>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Générer un rapport
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Période</th>
              <th>Date</th>
              <th>Produits</th>
              <th>Valeur totale</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id}>
                <td>{getTypeLabel(report.type)}</td>
                <td>{report.period === 'daily' ? 'Journalier' : report.period === 'weekly' ? 'Hebdomadaire' : 'Mensuel'}</td>
                <td>{report.date}</td>
                <td>{report.totalProducts}</td>
                <td>{report.totalValue.toLocaleString()} €</td>
                <td>{getStatusBadge(report.status)}</td>
                <td>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
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

export default Reports;
