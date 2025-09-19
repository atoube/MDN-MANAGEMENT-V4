import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Edit2, Trash2 } from 'lucide-react';
import type { Employee } from '../../types';

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export function EmployeeList({ employees, onEdit, onDelete }: EmployeeListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => (
          <TableRow key={employee.id}>
            <TableCell>
              <div className="font-medium">
                {employee.first_name} {employee.last_name}
              </div>
            </TableCell>
            <TableCell>{employee.email}</TableCell>
            <TableCell>{employee.phone}</TableCell>
            <TableCell>
              <Badge
                variant={
                  employee.status === 'active'
                    ? 'success'
                    : employee.status === 'inactive'
                    ? 'destructive'
                    : 'warning'
                }
              >
                {employee.status === 'active'
                  ? 'Actif'
                  : employee.status === 'inactive'
                  ? 'Inactif'
                  : 'En attente'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(employee)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(employee.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 