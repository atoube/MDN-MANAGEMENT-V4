import React from 'react';
import { EmployeeStats } from '../../components/employees/EmployeeStats';
import { EmployeeDetailsFrame } from '../../components/employees/EmployeeDetailsFrame';
import { testEmployees } from '../../lib/test-data/employees';
import { testAbsences } from '../../lib/test-data/absences';
import type { Employee, Absence } from '../../types';

export default function EmployeesPage() {
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [employees, setEmployees] = React.useState<Employee[]>(testEmployees);
  const [absences, setAbsences] = React.useState<Absence[]>(testAbsences);

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailsOpen(true);
  };

  const handleEmployeeUpdate = (data: Partial<Employee>) => {
    if (!selectedEmployee) return;

    setEmployees(prevEmployees =>
      prevEmployees.map(emp =>
        emp.id === selectedEmployee.id ? { ...emp, ...data } : emp
      )
    );

    setSelectedEmployee(prev =>
      prev ? { ...prev, ...data } : null
    );
  };

  const handleAddAbsence = (data: Omit<Absence, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    const newAbsence: Absence = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setAbsences(prev => [...prev, newAbsence]);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-900">Gestion des Employés</h1>

      <EmployeeStats employees={employees} absences={absences} />

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Liste des Employés</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Poste
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Département
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr
                    key={employee.id}
                    onClick={() => handleEmployeeClick(employee)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.first_name} {employee.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{employee.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{employee.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        employee.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedEmployee && (
        <EmployeeDetailsFrame
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedEmployee(null);
          }}
          employee={selectedEmployee}
          onUpdate={handleEmployeeUpdate}
          onAddAbsence={handleAddAbsence}
          absences={absences}
        />
      )}
    </div>
  );
} 