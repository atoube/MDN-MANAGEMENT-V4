import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import type { Employee, EmployeeFormData } from '../../types';

interface EditEmployeeModalProps {
  employee: Employee;
  onSave: (employee: Employee) => Promise<void>;
  onClose: () => void;
}

export const EditEmployeeModal = ({ employee, onClose, onSave }: EditEmployeeModalProps) => {
  const [formData, setFormData] = useState<EmployeeFormData>(() => ({
    first_name: employee.first_name,
    last_name: employee.last_name,
    email: employee.email,
    phone: employee.phone,
    department: employee.department,
    position: employee.position,
    role: employee.role,
    status: employee.status,
    salary: String(employee.salary),
    hire_date: employee.hire_date,
    photo_url: employee.photo_url
  }));

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        salary: String(employee.salary)
      });
    }
  }, [employee]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' 
        ? (value as 'active' | 'inactive')
        : name === 'salary'
        ? value.replace(/[^\d]/g, '')
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave({
        ...formData,
        id: employee.id,
        salary: formData.salary
      });
      onClose();
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Modifier l'employé</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                name="first_name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                name="last_name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={handleChange}
                name="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                name="phone"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Poste</label>
              <input
                type="text"
                value={formData.position}
                onChange={handleChange}
                name="position"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Salaire</label>
              <input
                type="number"
                value={formData.salary}
                onChange={handleChange}
                name="salary"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date d'entrée</label>
              <input
                type="date"
                value={formData.hire_date}
                onChange={handleChange}
                name="hire_date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Statut</label>
              <select
                value={formData.status}
                onChange={handleChange}
                name="status"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 