import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SalaryFormData } from './types';
import { Button } from "@/components/ui/Button";;
import { Input } from "@/components/ui/Input";;
import { Select } from "@/components/ui/Select";;

interface SalaryFormProps {
  onSubmit: (data: SalaryFormData) => Promise<void>;
  onCancel: () => void;
}

export const SalaryForm = ({ onSubmit, onCancel }: SalaryFormProps) => {
  const [formData, setFormData] = useState<SalaryFormData>({
    employee_id: '',
    base_salary: 0,
    bonus: 0,
    deductions: 0,
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'bank_transfer',
    notes: ''
  });

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
// Mock from call
// Mock select call
        .order('last_name');

      // Removed error check - using mock data
      return data;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Employé
        </label>
        <Select
          value={formData.employee_id}
          onChange={(e) => setFormData(prev => ({ ...prev, employee_id: e.target.value }))}
          required
        >
          <option value="">Sélectionnez un employé</option>
          {employees?.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.first_name} {employee.last_name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Salaire de base
        </label>
        <Input
          type="number"
          value={formData.base_salary}
          onChange={(e) => setFormData(prev => ({ ...prev, base_salary: parseFloat(e.target.value) }))}
          required
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Bonus
        </label>
        <Input
          type="number"
          value={formData.bonus}
          onChange={(e) => setFormData(prev => ({ ...prev, bonus: parseFloat(e.target.value) }))}
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Déductions
        </label>
        <Input
          type="number"
          value={formData.deductions}
          onChange={(e) => setFormData(prev => ({ ...prev, deductions: parseFloat(e.target.value) }))}
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date de paiement
        </label>
        <Input
          type="date"
          value={formData.payment_date}
          onChange={(e) => setFormData(prev => ({ ...prev, payment_date: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Mode de paiement
        </label>
        <Select
          value={formData.payment_method}
          onChange={(e) => setFormData(prev => ({ ...prev, payment_method: e.target.value as 'bank_transfer' | 'check' | 'cash' }))}
          required
        >
          <option value="bank_transfer">Virement bancaire</option>
          <option value="check">Chèque</option>
          <option value="cash">Espèces</option>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <Input
          type="text"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Enregistrer
        </Button>
      </div>
    </form>
  );
}; 