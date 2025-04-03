import React from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { X } from 'lucide-react';
import type { Account } from '../../lib/database.types';
import { useAuth } from '../../contexts/AuthContext';

interface AccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Account, 'id' | 'created_at'>) => void;
}

interface FormData {
  name: string;
  type: string;
  currency: string;
}

export function AccountDialog({
  isOpen,
  onClose,
  onSubmit
}: AccountDialogProps) {
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
      name: data.name,
      type: data.type,
      currency: data.currency,
      balance: 0,
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
              Nouveau compte
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
              label="Nom du compte"
              placeholder="Ex: Caisse principale"
              error={errors.name?.message}
              {...register('name', { required: 'Le nom est requis' })}
            />

            <Select
              label="Type de compte"
              options={[
                { value: '', label: 'Sélectionnez un type' },
                { value: 'cash', label: 'Caisse' },
                { value: 'bank', label: 'Banque' },
                { value: 'mobile_money', label: 'Mobile Money' }
              ]}
              error={errors.type?.message}
              {...register('type', { required: 'Le type est requis' })}
            />

            <Input
              label="Devise"
              defaultValue="XOF"
              disabled
              {...register('currency')}
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
                Créer le compte
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}