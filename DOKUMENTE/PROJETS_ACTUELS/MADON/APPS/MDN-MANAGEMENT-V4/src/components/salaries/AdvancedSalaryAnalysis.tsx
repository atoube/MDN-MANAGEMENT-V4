import { useEnhancedSalaryStats } from '../../hooks/useSalaryStats';
import { formatCurrency, formatPercentage } from '../../utils/format';
import { PieChart, LineChart } from '../common/Charts';

export function AdvancedSalaryAnalysis() {
  const { data: stats, isLoading } = useEnhancedSalaryStats();

  if (isLoading) return <div>Chargement de l'analyse...</div>;

  return (
    <div className="space-y-8">
      {/* Métriques de la masse salariale */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total année en cours"
          value={formatCurrency(stats?.payrollMetrics.yearToDateTotal)}
          trend={stats?.payrollMetrics.salaryGrowth}
        />
        <MetricCard
          title="Moyenne mensuelle"
          value={formatCurrency(stats?.payrollMetrics.monthlyAverage)}
        />
        <MetricCard
          title="% Bonus"
          value={formatPercentage(stats?.payrollMetrics.bonusPercentage)}
        />
      </div>

      {/* Distribution des salaires */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Distribution des salaires</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <PieChart
              data={stats?.employeeMetrics.salaryRanges}
              nameKey="range"
              valueKey="count"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm text-gray-500">Employés total</h4>
              <p className="text-2xl font-semibold">
                {stats?.employeeMetrics.totalEmployees}
              </p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500">Ancienneté moyenne</h4>
              <p className="text-2xl font-semibold">
                {formatYears(stats?.employeeMetrics.averageTenure)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analyse par département */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Répartition par département</h3>
        <div className="h-64">
          <BarChart
            data={Object.entries(stats?.departmentStats || {}).map(([dept, data]) => ({
              department: dept,
              total: data.total,
              average: data.average
            }))}
            xAxis="department"
            series={[
              { key: 'total', label: 'Total' },
              { key: 'average', label: 'Moyenne' }
            ]}
          />
        </div>
      </div>
    </div>
  );
} 