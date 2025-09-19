import { useSalaryStats } from '../../hooks/useSalaryStats';
import { formatCurrency } from '../../utils/format';
import { LineChart, BarChart } from '../common/Charts';

export function DetailedSalaryStats() {
  const { data: stats, isLoading } = useSalaryStats();

  if (isLoading) return <div>Chargement des statistiques détaillées...</div>;

  return (
    <div className="space-y-6">
      {/* Statistiques par département */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Statistiques par département</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2">Département</th>
                <th className="px-4 py-2">Employés</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Moyenne</th>
                <th className="px-4 py-2">Plus haut</th>
                <th className="px-4 py-2">Plus bas</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats?.departmentStats || {}).map(([dept, data]) => (
                <tr key={dept} className="border-t">
                  <td className="px-4 py-2">{dept}</td>
                  <td className="px-4 py-2">{data.employeeCount}</td>
                  <td className="px-4 py-2">{formatCurrency(data.total)}</td>
                  <td className="px-4 py-2">{formatCurrency(data.average)}</td>
                  <td className="px-4 py-2">{formatCurrency(data.highestSalary)}</td>
                  <td className="px-4 py-2">{formatCurrency(data.lowestSalary)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Graphique des tendances */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Évolution sur 6 mois</h3>
        <div className="h-64">
          <LineChart
            data={stats?.monthlyTrend || []}
            xAxis="month"
            series={[
              { key: 'totalSalaries', label: 'Total salaires' },
              { key: 'totalBonuses', label: 'Total bonus' }
            ]}
          />
        </div>
      </div>
    </div>
  );
} 