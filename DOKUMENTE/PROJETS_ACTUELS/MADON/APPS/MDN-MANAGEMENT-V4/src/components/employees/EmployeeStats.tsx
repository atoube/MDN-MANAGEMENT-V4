import { Card } from '../ui/Card';
import type { Employee, Absence } from '../../types';

interface EmployeeStatsProps {
  employees: Employee[];
  absences: Absence[];
}

export function EmployeeStats({ employees, absences }: EmployeeStatsProps) {
  // Calcul du total des employés
  const totalEmployees = employees.length;

  // Calcul du salaire moyen
  const averageSalary = employees.reduce((acc, emp) => acc + emp.salary, 0) / totalEmployees;

  // Calcul du nombre total d'absences
  const totalAbsences = absences.length;

  // Calcul de l'ancienneté moyenne
  const today = new Date();
  const averageTenure = employees.reduce((acc, emp) => {
    const hireDate = new Date(emp.hire_date);
    const years = today.getFullYear() - hireDate.getFullYear();
    return acc + years;
  }, 0) / totalEmployees;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <h3 className="text-lg font-medium text-gray-900">Total Employés</h3>
        <p className="text-3xl font-bold text-blue-600">{totalEmployees}</p>
      </Card>

      <Card>
        <h3 className="text-lg font-medium text-gray-900">Salaire Moyen</h3>
        <p className="text-3xl font-bold text-green-600">
          {averageSalary.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </p>
      </Card>

      <Card>
        <h3 className="text-lg font-medium text-gray-900">Total Absences</h3>
        <p className="text-3xl font-bold text-red-600">{totalAbsences}</p>
      </Card>

      <Card>
        <h3 className="text-lg font-medium text-gray-900">Ancienneté Moyenne</h3>
        <p className="text-3xl font-bold text-purple-600">{averageTenure.toFixed(1)} ans</p>
      </Card>
    </div>
  );
} 