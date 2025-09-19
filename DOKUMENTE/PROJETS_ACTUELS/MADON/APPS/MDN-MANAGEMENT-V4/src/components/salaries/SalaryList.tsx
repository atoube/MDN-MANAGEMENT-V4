import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useSalaryData } from '../../hooks/useSalaryData';
import { formatCurrency, formatDate } from '../../utils/format';
import { SalaryModal } from './SalaryModal';
import { toast } from 'react-hot-toast';
import { SalaryHistory } from './SalaryHistory';

export interface Salary {
  base_amount: number;
  bonuses: number;
  deductions: number;
  net_amount: number;
  status?: string;
  last_updated?: string;
}

export interface EmployeeWithSalary {
  id: string;
  first_name: string;
  last_name: string;
  department: string;
  position: string;
  salary: Salary;
}

export interface SalaryUpdateData {
  employee_id: string;
  base_amount: number;
  bonuses: number;
  deductions: number;
}

interface SalaryListProps {
  data: EmployeeWithSalary[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  updateSalary: (data: SalaryUpdateData) => Promise<void>;
  isExporting?: boolean;
}

export const SalaryList: React.FC<SalaryListProps> = ({
  data,
  isLoading,
  isError,
  error,
  updateSalary,
  isExporting
}) => {
  const { employeesWithSalaries, updateSalary: useSalaryDataUpdateSalary } = useSalaryData();
  const { data: employees, isLoading: useSalaryDataIsLoading, error: useSalaryDataError } = employeesWithSalaries;
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWithSalary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showHistory, setShowHistory] = useState<string | null>(null);

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur de chargement des données</div>;

  const handleSalaryUpdate = async (salaryId: string, updates: Partial<Salary>) => {
    try {
      await updateSalary({
        employee_id: salaryId,
        ...updates,
        base_amount: updates.base_amount || 0,
        bonuses: updates.bonuses || 0,
        deductions: updates.deductions || 0
      });
      toast.success('Salaire mis à jour avec succès');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du salaire');
      console.error(error);
    }
  };

  // Filtrer les employés
  const filteredEmployees = employees?.filter(employee => {
    const matchesSearch = 
      `${employee.first_name} ${employee.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    
    const matchesDepartment = 
      !selectedDepartment || 
      employee.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  // Obtenir la liste unique des départements
  const departments = [...new Set(employees?.map(e => e.department) || [])];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Liste des Salaires</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un employé..."
            className="px-4 py-2 border rounded"
          />
          <select 
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="">Tous les départements</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Employé</th>
              <th className="px-4 py-2">Département</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Salaire de base</th>
              <th className="px-4 py-2">Bonus</th>
              <th className="px-4 py-2">Déductions</th>
              <th className="px-4 py-2">Salaire net</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees?.map(employee => (
              <tr 
                key={employee.id} 
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2">
                  {employee.last_name} {employee.first_name}
                </td>
                <td className="px-4 py-2">{employee.department}</td>
                <td className="px-4 py-2">{employee.position}</td>
                <td className="px-4 py-2">
                  {formatCurrency(employee.salary?.base_amount || 0)}
                </td>
                <td className="px-4 py-2">
                  {formatCurrency(employee.salary?.bonuses || 0)}
                </td>
                <td className="px-4 py-2">
                  {formatCurrency(employee.salary?.deductions || 0)}
                </td>
                <td className="px-4 py-2">
                  {formatCurrency(employee.salary?.net_amount || 0)}
                </td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded ${
                    employee.salary?.status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {employee.salary?.status || 'Non défini'}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setIsModalOpen(true);
                      }}
                    >
                      Modifier
                    </button>
                    <button 
                      className="text-gray-600 hover:text-gray-800"
                      onClick={() => {
                        setShowHistory(employee.id);
                      }}
                    >
                      Historique
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedEmployee && (
        <SalaryModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEmployee(null);
          }}
          employee={selectedEmployee}
          onSave={handleSalaryUpdate}
        />
      )}

      {showHistory && (
        <SalaryHistory
          employeeId={showHistory}
          onClose={() => setShowHistory(null)}
        />
      )}
    </div>
  );
};

export default SalaryList; 