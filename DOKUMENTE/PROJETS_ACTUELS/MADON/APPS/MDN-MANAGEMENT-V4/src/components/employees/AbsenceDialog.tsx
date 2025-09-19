import React, { useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { X } from 'lucide-react';
import type { Absence, Employee } from '../../types';
import { useEmployees } from '../../hooks/useEmployees';
import { toast } from 'react-hot-toast';

interface AbsenceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  absenceSummary: {
    total: number;
    taken: number;
    pending: number;
    remaining: number;
  };
  onSubmit: (data: Omit<Absence, 'id' | 'created_at' | 'updated_at' | 'status'>) => void;
}

interface FormData {
  employee_id: string;
  start_date: string;
  end_date: string;
  type: 'annual' | 'sick' | 'other';
  notes?: string;
}

export function AbsenceDialog({
  isOpen,
  onClose,
  employees,
  absenceSummary
}: Omit<AbsenceDialogProps, 'onSubmit'>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<FormData>({
    defaultValues: {
      employee_id: employees[0]?.id || '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      type: 'annual',
      notes: ''
    }
  });

  const { createAbsence } = useEmployees();

  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const selectedDays = watch(['start_date', 'end_date']);
  const numberOfDays = useMemo(() => {
    if (selectedDays[0] && selectedDays[1]) {
      return calculateDays(selectedDays[0], selectedDays[1]);
    }
    return 0;
  }, [selectedDays]);

  const validateDates = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const today = new Date();
    
    if (startDate < today) {
      return "La date de début ne peut pas être dans le passé";
    }
    if (endDate < startDate) {
      return "La date de fin doit être après la date de début";
    }
    
    const days = calculateDays(start, end);
    if (days > absenceSummary.remaining) {
      return "Vous n'avez pas assez de jours de congés disponibles";
    }
    
    return true;
  };

  const onSubmitForm = async (data: FormData) => {
    try {
      // Validation des données
      if (!data.employee_id || !data.start_date || !data.end_date) {
        throw new Error('Tous les champs sont obligatoires');
      }

      // Vérification des dates
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      
      if (endDate < startDate) {
        throw new Error('La date de fin doit être après la date de début');
      }

      const result = await createAbsence.mutateAsync({
        employee_id: data.employee_id,
        start_date: data.start_date,
        end_date: data.end_date
      });

      if (result) {
        toast.success('Demande de congé créée avec succès');
        onClose();
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création de la demande');
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Nouvelle demande de congé</h3>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            {employees.length > 1 && (
              <Select
                label="Employé"
                error={errors.employee_id?.message}
                {...register('employee_id', { required: 'Veuillez sélectionner un employé' })}
                options={employees.map(emp => ({
                  value: emp.id,
                  label: `${emp.first_name} ${emp.last_name}`
                }))}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                label="Date de début"
                error={errors.start_date?.message}
                {...register('start_date', { required: 'Veuillez sélectionner une date de début' })}
              />
              <Input
                type="date"
                label="Date de fin"
                error={errors.end_date?.message}
                {...register('end_date', { required: 'Veuillez sélectionner une date de fin' })}
              />
            </div>

            <Select
              label="Type d'absence"
              error={errors.type?.message}
              {...register('type', { required: 'Veuillez sélectionner un type d\'absence' })}
              options={[
                { value: 'annual', label: 'Congés annuels' },
                { value: 'sick', label: 'Congés maladie' },
                { value: 'other', label: 'Autre' }
              ]}
            />

            <Input
              label="Notes"
              error={errors.notes?.message}
              {...register('notes')}
            />

            <div className="text-sm text-gray-500 mt-2">
              Durée : {numberOfDays} jour{numberOfDays > 1 ? 's' : ''}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
              >
                Enregistrer
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}