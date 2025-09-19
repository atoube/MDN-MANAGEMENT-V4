import type { Employee } from '../../types';

interface SortConfig {
  field: keyof Employee | '';
  direction: 'asc' | 'desc' | null;
}

interface SortableHeaderProps {
  label: string;
  field: keyof Employee;
  currentSort: SortConfig;
  onSort: (field: keyof Employee) => void;
}

export const SortableHeader: React.FC<SortableHeaderProps> = ({
  label,
  field,
  currentSort,
  onSort
}) => {
  return (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center">
        {label}
        {currentSort.field === field && (
          <span className="ml-2">
            {currentSort.direction === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );
}; 