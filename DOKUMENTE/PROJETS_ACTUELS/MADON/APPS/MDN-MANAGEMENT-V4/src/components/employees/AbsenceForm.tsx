import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { addDays, isWeekend, format } from 'date-fns';
import { 
  Employee, 
  AbsenceFormData, 
  LeaveType,
  Department
} from './types';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';

// Liste des jours fériés en France pour 2024 (à mettre à jour chaque année)
const HOLIDAYS_2024 = [
  '2024-01-01', // Jour de l'an
  '2024-04-01', // Lundi de Pâques
  '2024-05-01', // Fête du travail
  '2024-05-08', // Victoire 1945
  '2024-05-09', // Jeudi de l'Ascension
  '2024-05-20', // Lundi de Pentecôte
  '2024-07-14', // Fête nationale
  '2024-08-15', // Assomption
  '2024-11-01', // Toussaint
  '2024-11-11', // Armistice
  '2024-12-25', // Noël
];

const isHoliday = (date: Date): boolean => {
  const dateString = format(date, 'yyyy-MM-dd');
  return HOLIDAYS_2024.includes(dateString);
};

const calculateBusinessDays = (startDate: Date, endDate: Date): number => {
  let currentDate = startDate;
  let businessDays = 0;

  while (currentDate <= endDate) {
    if (!isWeekend(currentDate) && !isHoliday(currentDate)) {
      businessDays++;
    }
    currentDate = addDays(currentDate, 1);
  }

  return businessDays;
};

interface AbsenceFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

interface DatabaseAbsence {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  type: LeaveType;
  status: string;
  days_count: number;
  reason: string | null;
  created_at: string;
  updated_at: string;
}

interface FormErrors {
  employee_id?: string;
  start_date?: string;
  end_date?: string;
  type?: string;
  reason?: string;
}

export const AbsenceForm = ({ onClose, onSuccess }: AbsenceFormProps) => {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AbsenceFormData>({
    employee_id: '',
    start_date: '',
    end_date: '',
    type: 'congé payé',
    reason: '',
    status: 'pending'
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const queryClient = useQueryClient();

  useEffect(() => {
    const getUser = async () => {
            setUser(user);
    };
    getUser();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (!user) {
        toast.error('Vous devez être connecté pour soumettre une demande');
        return;
      }

      if (!formData.start_date || !formData.end_date) {
        toast.error('Veuillez sélectionner les dates de début et de fin');
        return;
      }

      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);

      if (endDate < startDate) {
        toast.error('La date de fin doit être postérieure à la date de début');
        return;
      }

      const daysCount = calculateBusinessDays(startDate, endDate);

      // Simulated RPC call - using mock data

      if (error) {
        console.error('Erreur détaillée:', error);
        throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
      toast.success('Demande d\'absence enregistrée avec succès');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast.error('Erreur lors de l\'enregistrement de la demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  };

  const fetchEmployees = async () => {
    try {
// Mock from call
// Mock select call;

      if (deptError) throw deptError;
// Mock from call
// Mock select call;

      if (empError) throw empError;

      const departmentsMap = new Map(
        departments.map((dept: Department) => [dept.id, dept.name])
      );

      const employeesWithDept = employees.map((emp: Employee) => ({
        ...emp,
        department: departmentsMap.get(emp.department_id) || 'Non assigné'
      }));

      setEmployees(employeesWithDept);
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error);
      toast.error('Erreur lors de la récupération des employés');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <Card className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <CardContent className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Nouvelle demande d'absence</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employé
              </label>
              <Select
                name="employee_id"
                value={formData.employee_id}
                onChange={handleInputChange}
                className={errors.employee_id ? 'border-red-500' : ''}
                required
                options={[
                  { value: '', label: 'Sélectionnez un employé' },
                  ...employees.map(emp => ({
                    value: emp.id,
                    label: `${emp.first_name} ${emp.last_name}`
                  }))
                ]}
              />
              {errors.employee_id && (
                <p className="mt-1 text-sm text-red-600">{errors.employee_id}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de début
                </label>
                <Input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className={errors.start_date ? 'border-red-500' : ''}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                {errors.start_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin
                </label>
                <Input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className={errors.end_date ? 'border-red-500' : ''}
                  min={formData.start_date || new Date().toISOString().split('T')[0]}
                  required
                />
                {errors.end_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de congé
              </label>
              <Select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={errors.type ? 'border-red-500' : ''}
                required
                options={[
                  { value: 'congé payé', label: 'Congé payé' },
                  { value: 'maladie', label: 'Maladie' },
                  { value: 'maternité', label: 'Maternité' },
                  { value: 'paternité', label: 'Paternité' },
                  { value: 'autre', label: 'Autre' }
                ]}
              />
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raison
              </label>
              <Textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                className={errors.reason ? 'border-red-500' : ''}
                rows={3}
                placeholder="Veuillez justifier votre demande..."
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="primary"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}; 