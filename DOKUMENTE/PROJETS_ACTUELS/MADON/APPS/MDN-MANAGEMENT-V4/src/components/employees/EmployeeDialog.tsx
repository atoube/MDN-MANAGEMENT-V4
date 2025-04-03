import React from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Building2, 
  Banknote,
  Calendar 
} from 'lucide-react';
import type { Employee } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface EmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Employee, 'id' | 'created_at' | 'status'>) => void;
  employee?: Employee;
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  salary: string;
  hire_date: string;
  department: string;
  role: string;
}

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const phoneRegex = /^\+?[0-9\s-]{8,}$/;

export function EmployeeDialog({
  isOpen,
  onClose,
  onSubmit,
  employee
}: EmployeeDialogProps) {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    defaultValues: employee ? {
      ...employee,
      salary: employee.salary.toString(),
      hire_date: new Date(employee.hire_date).toISOString().split('T')[0]
    } : {
      hire_date: new Date().toISOString().split('T')[0]
    }
  });

  React.useEffect(() => {
    if (isOpen && employee) {
      reset({
        ...employee,
        salary: employee.salary.toString(),
        hire_date: new Date(employee.hire_date).toISOString().split('T')[0]
      });
    } else if (isOpen) {
      reset({
        hire_date: new Date().toISOString().split('T')[0]
      });
    }
  }, [isOpen, employee, reset]);

  const onSubmitForm = async (data: FormData) => {
    try {
      if (!user?.id) {
        throw new Error('Utilisateur non authentifié');
      }

      // Préparer les données de base avec uniquement les champs requis
      const employeeData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone || '',
        position: data.position,
        department: data.department,
        salary: parseFloat(data.salary),
        hire_date: data.hire_date,
        user_id: user.id,
        role: data.role || 'employee'
      };

      console.log('Submitting employee data:', employeeData);
      await onSubmit(employeeData);
      reset();
      onClose();
    } catch (error) {
      console.error('Error in form submission:', error);
      throw error;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6">
        <Dialog.Panel className="mx-auto w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl ring-1 ring-gray-900/10 sm:p-8 transform transition-all">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              {employee ? 'Modifier l\'employé' : 'Nouvel employé'}
            </Dialog.Title>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Input
                  label="Prénom"
                  icon={<User className="h-5 w-5 text-gray-400" />}
                  error={errors.first_name?.message}
                  {...register('first_name', { required: 'Le prénom est requis' })}
                />
                <Input
                  label="Nom"
                  icon={<User className="h-5 w-5 text-gray-400" />}
                  error={errors.last_name?.message}
                  {...register('last_name', { required: 'Le nom est requis' })}
                />
                <Input
                  type="email"
                  label="Email"
                  icon={<Mail className="h-5 w-5 text-gray-400" />}
                  error={errors.email?.message}
                  {...register('email', { 
                    required: 'L\'email est requis',
                    pattern: {
                      value: emailRegex,
                      message: 'Format d\'email invalide'
                    }
                  })}
                />
                <Input
                  label="Téléphone"
                  icon={<Phone className="h-5 w-5 text-gray-400" />}
                  error={errors.phone?.message}
                  {...register('phone', {
                    pattern: {
                      value: phoneRegex,
                      message: 'Format de téléphone invalide'
                    }
                  })}
                />
              </div>

              <div className="space-y-6">
                <Select
                  label="Poste"
                  icon={<Briefcase className="h-5 w-5 text-gray-400" />}
                  options={[
                    { value: '', label: 'Sélectionnez un poste' },
                    { value: 'director', label: 'Directeur' },
                    { value: 'hr_officer', label: 'RH' },
                    { value: 'accountant', label: 'Comptable' },
                    { value: 'sales_rep', label: 'Commercial' },
                    { value: 'stock_clerk', label: 'Magasinier' },
                    { value: 'delivery_driver', label: 'Livreur' },
                    { value: 'technician', label: 'Technicien' },
                    { value: 'support_staff', label: 'Support' }
                  ]}
                  error={errors.position?.message}
                  {...register('position', { required: 'Le poste est requis' })}
                />

                <Select
                  label="Rôle"
                  icon={<Briefcase className="h-5 w-5 text-gray-400" />}
                  options={[
                    { value: 'employee', label: 'Employé' },
                    { value: 'admin', label: 'Administrateur' },
                    { value: 'hr', label: 'RH' },
                    { value: 'delivery', label: 'Livreur' },
                    { value: 'stock_manager', label: 'Gestionnaire de stock' },
                    { value: 'seller', label: 'Vendeur' }
                  ]}
                  error={errors.role?.message}
                  {...register('role', { required: 'Le rôle est requis' })}
                />

                <Select
                  label="Département"
                  icon={<Building2 className="h-5 w-5 text-gray-400" />}
                  options={[
                    { value: '', label: 'Sélectionnez un département' },
                    { value: 'direction', label: 'Direction' },
                    { value: 'hr', label: 'Ressources Humaines' },
                    { value: 'finance', label: 'Finance' },
                    { value: 'sales', label: 'Commercial' },
                    { value: 'logistics', label: 'Logistique' },
                    { value: 'technical', label: 'Technique' },
                    { value: 'support', label: 'Support' }
                  ]}
                  error={errors.department?.message}
                  {...register('department', { required: 'Le département est requis' })}
                />

                <Input
                  type="number"
                  label="Salaire (F.CFA)"
                  icon={<Banknote className="h-5 w-5 text-gray-400" />}
                  error={errors.salary?.message}
                  {...register('salary', {
                    required: 'Le salaire est requis',
                    min: { value: 0, message: 'Le salaire doit être positif' },
                    valueAsNumber: true
                  })}
                />

                <Input
                  type="date"
                  label="Date d'embauche"
                  icon={<Calendar className="h-5 w-5 text-gray-400" />}
                  error={errors.hire_date?.message}
                  {...register('hire_date', { required: 'La date d\'embauche est requise' })}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="px-4 py-2"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="px-4 py-2"
              >
                {employee ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}