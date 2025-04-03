import { memo } from 'react';
import { Employee } from '../../types/salary';
import { Card } from '../ui/Card';
import { Checkbox } from '../ui/Checkbox';
import { Badge } from '../ui/Badge';

export interface EmployeeCardProps {
  employee: Employee;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isEligible: boolean;
}

export const EmployeeCard = memo(function EmployeeCard({
  employee,
  isSelected,
  onSelect,
  isEligible
}: EmployeeCardProps) {
  return (
    <Card className={`p-4 ${!isEligible ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between">
        <Checkbox
          checked={isSelected}
          onChange={() => onSelect(employee.id)}
          disabled={!isEligible}
        />
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              {employee.prenom} {employee.nom}
            </h3>
            <Badge variant={isEligible ? 'success' : 'warning'}>
              {isEligible ? 'Éligible' : 'Non éligible'}
            </Badge>
          </div>
          <p className="text-sm text-gray-500">{employee.poste}</p>
          <p className="text-sm text-gray-500">
            Salaire base: {employee.salaireBase}€
          </p>
          {!isEligible && (
            <p className="text-xs text-red-500 mt-1">
              Non éligible pour le paiement
            </p>
          )}
        </div>
      </div>
    </Card>
  );
});

EmployeeCard.displayName = 'EmployeeCard'; 