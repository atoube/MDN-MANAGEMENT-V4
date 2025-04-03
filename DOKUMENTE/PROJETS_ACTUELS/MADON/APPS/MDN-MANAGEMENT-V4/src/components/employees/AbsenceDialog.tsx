import React from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { X } from 'lucide-react';
import type { Absence, Employee } from '../../types';

interface AbsenceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Absence, 'id' | 'created_at' | 'updated_at' | 'status'>) => void;
  employees: Employee[];
}

interface FormData {
  employee_id: string;
  start_date: string;
  end_date: string;
  type: 'annual' | 'sick' | 'other';
  reason: string;
  notes?: string;
}

export function AbsenceDialog({
  isOpen,
  onClose,
  onSubmit,
  employees
}: AbsenceDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
      employee_id: employees[0]?.id || '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      type: 'annual',
      reason: '',
      notes: ''
    }
  });

  const onSubmitForm = (data: FormData) => {
    onSubmit({
      ...data,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Ajouter une absence
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

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
              label="Motif"
              error={errors.reason?.message}
              {...register('reason', { required: 'Veuillez indiquer le motif' })}
            />

            <Input
              label="Notes"
              error={errors.notes?.message}
              {...register('notes')}
            />

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