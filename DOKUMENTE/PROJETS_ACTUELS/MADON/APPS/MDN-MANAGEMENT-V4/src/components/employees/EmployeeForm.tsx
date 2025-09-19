import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";;
import { Input } from "@/components/ui/Input";;
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";;
import { useDepartments } from '@/hooks/useDepartments';
import { Department } from '@/types/department';

interface EmployeeFormProps {
  onSubmit: (data: EmployeeFormData) => void;
}

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  position: string;
  hireDate: string;
  salary: number;
}

export function EmployeeForm({ onSubmit }: EmployeeFormProps) {
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departmentId: '',
    position: '',
    hireDate: '',
    salary: 0,
  });

  const { data: departments } = useDepartments();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="departmentId">Département</Label>
        <Select
          value={formData.departmentId}
          onValueChange={(value: string) => handleSelectChange('departmentId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un département" />
          </SelectTrigger>
          <SelectContent>
            {departments?.map((dept: Department) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Poste</Label>
        <Input
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hireDate">Date d'embauche</Label>
        <Input
          id="hireDate"
          name="hireDate"
          type="date"
          value={formData.hireDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="salary">Salaire</Label>
        <Input
          id="salary"
          name="salary"
          type="number"
          value={formData.salary}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Ajouter l'employé
      </Button>
    </form>
  );
} 