import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useSalaryData } from '../../hooks/useSalaryData';
import { formatCurrency, formatDate } from '../../utils/format';

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  department: string;
  position: string;
  salary?: {
    base_amount: number;
    bonuses: number;
    deductions: number;
    net_amount: number;
  };
}

export interface EmployeeSalaryListProps {
  data: Employee[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
  isExporting?: boolean;
}

export const EmployeeSalaryList: React.FC<EmployeeSalaryListProps> = ({
  data: employeesWithSalaries,
  isLoading,
  isError,
  error,
  refetch,
  isExporting
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // Fonction de filtrage avec types explicites
  const filterEmployees = (employee: Employee) => {
    const matchesSearch = 
      employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = 
      departmentFilter === 'all' || 
      employee.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  };

  // Gestionnaire d'événements avec type explicite
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Obtenir les départements uniques avec typage
  const departments = useMemo(() => {
    if (!employeesWithSalaries) return [];
    
    const uniqueDepartments = [...new Set(
      employeesWithSalaries.map(emp => emp.department)
    )];
    
    return uniqueDepartments.sort();
  }, [employeesWithSalaries]);

  // Filtrer les employés
  const filteredEmployees = useMemo(() => {
    if (!employeesWithSalaries) return [];
    return employeesWithSalaries.filter(filterEmployees);
  }, [employeesWithSalaries, searchTerm, departmentFilter]);

  console.log('EmployeeSalaryList render:', {
    loading: isLoading,
    error,
    employeesCount: employeesWithSalaries?.length
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8 min-h-[400px] bg-white rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-gray-600">Chargement de la liste des employés...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Erreur: Impossible de charger les données. Veuillez réessayer.
      </div>
    );
  }

  if (!employeesWithSalaries?.length) {
    return (
      <div className="bg-yellow-50 text-yellow-600 p-4 rounded-lg">
        Aucun employé trouvé dans la base de données.
      </div>
    );
  }

  return (
    <div className="space-y-4 min-h-[400px]">
      {/* Barre de recherche et filtres */}
      <div className="flex flex-wrap gap-4 mb-6 sticky top-0 bg-white z-10 p-4">
        <input
          type="text"
          placeholder="Rechercher un employé..."
          className="px-4 py-2 border rounded-lg"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">Tous les départements</option>
          {departments.map((dept: string) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Ajout d'un message pour indiquer le nombre d'employés */}
      <div className="text-sm text-gray-600 mb-4">
        {filteredEmployees.length} employé(s) trouvé(s)
      </div>

      {/* Liste des employés */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Département
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salaire de base
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bonus
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dernière mise à jour
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees?.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {employee.last_name} {employee.first_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {employee.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.position}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatCurrency(employee.salary?.base_amount)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatCurrency(employee.salary?.bonuses)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(employee.salary?.net_amount)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatDate(employee.salary?.updated_at)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {/* Logique pour modifier */}}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => {/* Logique pour voir l'historique */}}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Historique
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeSalaryList; 