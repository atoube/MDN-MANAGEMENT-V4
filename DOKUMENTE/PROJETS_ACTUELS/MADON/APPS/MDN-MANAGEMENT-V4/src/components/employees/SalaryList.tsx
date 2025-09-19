import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Employee } from "@/types/employee";
import { formatCurrency } from "@/lib/utils";

interface SalaryListProps {
  employees: Employee[];
}

export function SalaryList({ employees }: SalaryListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Rechercher un employé..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline">Exporter</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employé</TableHead>
            <TableHead>Poste</TableHead>
            <TableHead>Salaire de base</TableHead>
            <TableHead>Bonus</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Dernière mise à jour</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEmployees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>{formatCurrency(employee.base_salary)}</TableCell>
              <TableCell>{formatCurrency(employee.bonus || 0)}</TableCell>
              <TableCell className="font-medium">
                {formatCurrency((employee.base_salary || 0) + (employee.bonus || 0))}
              </TableCell>
              <TableCell>
                {new Date(employee.updated_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 