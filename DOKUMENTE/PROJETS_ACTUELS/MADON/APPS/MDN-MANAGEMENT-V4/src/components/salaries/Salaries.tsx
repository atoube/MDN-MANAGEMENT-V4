import { EmployeeSalaryList } from './EmployeeSalaryList';
import { SalaryStats } from './SalaryStats';

export function Salaries() {
  console.log('Rendering Salaries component'); // Log pour déboguer

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Salaires</h1>
      </div>

      {/* Liste des employés avec leurs salaires */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Liste des Employés</h2>
        <EmployeeSalaryList />
      </div>

      {/* Statistiques en bas */}
      <SalaryStats />
    </div>
  );
} 