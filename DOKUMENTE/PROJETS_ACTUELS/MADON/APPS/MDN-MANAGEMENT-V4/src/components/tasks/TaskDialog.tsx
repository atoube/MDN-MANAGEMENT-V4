import React from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { X } from 'lucide-react';
import type { Task } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Task, 'id' | 'created_at'>) => void;
  employees: Array<{ id: string; first_name: string; last_name: string }>;
}

interface FormData {
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  priority: string;
}

export function TaskDialog({
  isOpen,
  onClose,
  onSubmit,
  employees
}: TaskDialogProps) {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>();

  const onSubmitForm = (data: FormData) => {
    if (!user?.id) return;

    onSubmit({
      title: data.title,
      description: data.description,
      assigned_to: data.assignedTo,
      due_date: new Date(data.dueDate).toISOString(),
      priority: data.priority,
      status: 'pending',
      user_id: user.id
    });

    reset();
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
        <Dialog.Panel className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Nouvelle tâche
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <Input
              label="Titre"
              placeholder="Ex: Préparer la commande #12345"
              error={errors.title?.message}
              {...register('title', { required: 'Le titre est requis' })}
            />

            <Input
              label="Description"
              placeholder="Description détaillée de la tâche"
              error={errors.description?.message}
              {...register('description', { required: 'La description est requise' })}
            />

            <Select
              label="Assignée à"
              options={[
                { value: '', label: 'Sélectionnez un employé' },
                ...employees.map(employee => ({
                  value: employee.id,
                  label: `${employee.first_name} ${employee.last_name}`
                }))
              ]}
              error={errors.assignedTo?.message}
              {...register('assignedTo', { required: 'L\'assignation est requise' })}
            />

            <Input
              type="date"
              label="Date limite"
              error={errors.dueDate?.message}
              {...register('dueDate', { required: 'La date limite est requise' })}
            />

            <Select
              label="Priorité"
              options={[
                { value: '', label: 'Sélectionnez une priorité' },
                { value: 'low', label: 'Basse' },
                { value: 'medium', label: 'Moyenne' },
                { value: 'high', label: 'Haute' }
              ]}
              error={errors.priority?.message}
              {...register('priority', { required: 'La priorité est requise' })}
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
                Créer la tâche
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}