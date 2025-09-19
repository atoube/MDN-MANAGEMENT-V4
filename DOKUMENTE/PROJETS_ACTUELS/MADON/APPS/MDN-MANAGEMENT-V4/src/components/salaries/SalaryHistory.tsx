import { useSalaryHistory } from '../../hooks/useSalaryHistory';
import { formatCurrency, formatDate } from '../../utils/format';

interface SalaryHistoryProps {
  employeeId: string;
  onClose: () => void;
}

export function SalaryHistory({ employeeId, onClose }: SalaryHistoryProps) {
  const { data: history, isLoading } = useSalaryHistory(employeeId);

  if (isLoading) return <div>Chargement de l'historique...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Historique des salaires</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="overflow-y-auto max-h-96">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2">Date effective</th>
                <th className="px-4 py-2">Base</th>
                <th className="px-4 py-2">Bonus</th>
                <th className="px-4 py-2">Déductions</th>
                <th className="px-4 py-2">Net</th>
                <th className="px-4 py-2">Raison</th>
              </tr>
            </thead>
            <tbody>
              {history?.map(entry => (
                <tr key={entry.id} className="border-t">
                  <td className="px-4 py-2">{formatDate(entry.effective_date)}</td>
                  <td className="px-4 py-2">{formatCurrency(entry.base_amount)}</td>
                  <td className="px-4 py-2">{formatCurrency(entry.bonuses)}</td>
                  <td className="px-4 py-2">{formatCurrency(entry.deductions)}</td>
                  <td className="px-4 py-2">{formatCurrency(entry.net_amount)}</td>
                  <td className="px-4 py-2">{entry.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 