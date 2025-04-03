import React from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { X } from 'lucide-react';
import type { Employee } from '../../types';

interface CareerTrackingProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Employee>) => void;
  employee: Employee;
}

interface FormData {
  career_history: {
    position: string;
    start_date: string;
    end_date?: string;
    department: string;
    achievements: string;
  }[];
  performance_reviews: {
    date: string;
    rating: number;
    feedback: string;
    goals: string;
  }[];
  professional_goals: {
    short_term: string[];
    long_term: string[];
  };
  training_history: {
    name: string;
    date: string;
    provider: string;
    status: 'completed' | 'in_progress' | 'planned';
  }[];
}

export function CareerTracking({
  isOpen,
  onClose,
  onSubmit,
  employee
}: CareerTrackingProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
      career_history: employee.career_history || [],
      performance_reviews: employee.performance_reviews || [],
      professional_goals: employee.professional_goals || {
        short_term: [],
        long_term: []
      },
      training_history: employee.training_history || []
    }
  });

  const onSubmitForm = (data: FormData) => {
    onSubmit({
      ...data,
      id: employee.id
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
        <Dialog.Panel className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Suivi professionnel de {employee.first_name} {employee.last_name}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900">Historique des postes</h3>
              <div className="space-y-4">
                {watch('career_history')?.map((_, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded">
                    <Input
                      label="Poste"
                      {...register(`career_history.${index}.position`)}
                    />
                    <Input
                      label="Département"
                      {...register(`career_history.${index}.department`)}
                    />
                    <Input
                      type="date"
                      label="Date de début"
                      {...register(`career_history.${index}.start_date`)}
                    />
                    <Input
                      type="date"
                      label="Date de fin"
                      {...register(`career_history.${index}.end_date`)}
                    />
                    <Input
                      label="Réalisations"
                      className="col-span-2"
                      {...register(`career_history.${index}.achievements`)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900">Objectifs professionnels</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Court terme</label>
                  <Input
                    label="Objectifs (séparés par des virgules)"
                    {...register('professional_goals.short_term')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Long terme</label>
                  <Input
                    label="Objectifs (séparés par des virgules)"
                    {...register('professional_goals.long_term')}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900">Formations</h3>
              <div className="space-y-4">
                {watch('training_history')?.map((_, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded">
                    <Input
                      label="Nom de la formation"
                      {...register(`training_history.${index}.name`)}
                    />
                    <Input
                      label="Fournisseur"
                      {...register(`training_history.${index}.provider`)}
                    />
                    <Input
                      type="date"
                      label="Date"
                      {...register(`training_history.${index}.date`)}
                    />
                    <Select
                      label="Statut"
                      options={[
                        { value: 'completed', label: 'Terminée' },
                        { value: 'in_progress', label: 'En cours' },
                        { value: 'planned', label: 'Planifiée' }
                      ]}
                      {...register(`training_history.${index}.status`)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Fermer
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