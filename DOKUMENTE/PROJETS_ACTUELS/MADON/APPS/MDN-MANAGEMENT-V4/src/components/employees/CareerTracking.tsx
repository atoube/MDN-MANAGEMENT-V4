import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
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
  const validateDates = (start: string, end?: string) => {
    if (!end) return true;
    return new Date(start) <= new Date(end);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting }
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Suivi professionnel de {employee.first_name} {employee.last_name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-900">Historique des postes</h3>
            <div className="space-y-4">
              {watch('career_history')?.map((_, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Poste</label>
                    <Input
                      {...register(`career_history.${index}.position`)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Département</label>
                    <Input
                      {...register(`career_history.${index}.department`)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date de début</label>
                    <Input
                      type="date"
                      {...register(`career_history.${index}.start_date`)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                    <Input
                      type="date"
                      {...register(`career_history.${index}.end_date`)}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Réalisations</label>
                    <Input
                      {...register(`career_history.${index}.achievements`)}
                    />
                  </div>
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
                  {...register('professional_goals.short_term')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Long terme</label>
                <Input
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom de la formation</label>
                    <Input
                      {...register(`training_history.${index}.name`)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fournisseur</label>
                    <Input
                      {...register(`training_history.${index}.provider`)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <Input
                      type="date"
                      {...register(`training_history.${index}.date`)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                    <Select
                      options={[
                        { value: 'completed', label: 'Terminée' },
                        { value: 'in_progress', label: 'En cours' },
                        { value: 'planned', label: 'Planifiée' }
                      ]}
                      {...register(`training_history.${index}.status`)}
                    />
                  </div>
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
              disabled={isSubmitting}
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 