import { useSalaryStats } from '../../hooks/useSalaryStats';
import { formatCurrency } from '../../utils/format';

export function SalaryStats() {
  const { data: stats, isLoading } = useSalaryStats();

  if (isLoading) return <div>Chargement des statistiques...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="text-sm text-gray-500">Total masse salariale</h4>
        <p className="text-2xl font-semibold">{formatCurrency(stats?.totalSalaries || 0)}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="text-sm text-gray-500">Moyenne des salaires</h4>
        <p className="text-2xl font-semibold">{formatCurrency(stats?.averageSalary || 0)}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="text-sm text-gray-500">Total des bonus</h4>
        <p className="text-2xl font-semibold">{formatCurrency(stats?.totalBonuses || 0)}</p>
      </div>
    </div>
  );
} 