import { useState } from 'react';
import { EmployeeWithSalary, Salary } from '../../types';

interface SalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeWithSalary;
  onSave: (salaryId: string, updates: Partial<Salary>) => Promise<void>;
}

export function SalaryModal({ isOpen, onClose, employee, onSave }: SalaryModalProps) {
  const [formData, setFormData] = useState({
    base_amount: employee.salary?.base_amount || 0,
    bonuses: employee.salary?.bonuses || 0,
    deductions: employee.salary?.deductions || 0,
    reason: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(employee.salary.id, {
        ...formData,
        net_amount: formData.base_amount + formData.bonuses - formData.deductions
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">
            Modifier le salaire - {employee.first_name} {employee.last_name}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Salaire de base
            </label>
            <input
              type="number"
              value={formData.base_amount}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                base_amount: parseFloat(e.target.value)
              }))}
              className="mt-1 block w-full border rounded-md px-3 py-2"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bonus
            </label>
            <input
              type="number"
              value={formData.bonuses}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                bonuses: parseFloat(e.target.value)
              }))}
              className="mt-1 block w-full border rounded-md px-3 py-2"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Déductions
            </label>
            <input
              type="number"
              value={formData.deductions}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                deductions: parseFloat(e.target.value)
              }))}
              className="mt-1 block w-full border rounded-md px-3 py-2"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Raison de la modification
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                reason: e.target.value
              }))}
              className="mt-1 block w-full border rounded-md px-3 py-2"
              rows={3}
              required
            />
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
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 