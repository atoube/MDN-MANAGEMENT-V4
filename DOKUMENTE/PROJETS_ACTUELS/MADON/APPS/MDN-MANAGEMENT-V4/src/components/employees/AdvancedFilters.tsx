import { FC } from 'react';

interface AdvancedFiltersProps {
  onFilterChange: (filters: any) => void;
}

export const AdvancedFilters: FC<AdvancedFiltersProps> = ({ onFilterChange }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Salaire minimum</label>
          <input
            type="number"
            onChange={(e) => onFilterChange({ minSalary: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date d'entrée après</label>
          <input
            type="date"
            onChange={(e) => onFilterChange({ startDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Département</label>
          <select
            onChange={(e) => onFilterChange({ department: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Tous</option>
            <option value="IT">IT</option>
            <option value="RH">RH</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      </div>
    </div>
  );
}; 