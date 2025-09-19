import { EmployeeSalaryList } from '../../components/salaries/EmployeeSalaryList';
import { useEffect } from 'react';

export function Payroll() {
  useEffect(() => {
    console.log('Payroll component mounted');
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gestion des Salaires</h1>
        <p className="text-gray-600">Gérez les salaires des employés</p>
      </div>

      {/* Intégration de la liste des salaires */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <EmployeeSalaryList />
      </div>
    </div>
  );
}