import React from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { X } from 'lucide-react';
import type { Account, Category, Transaction } from '../../lib/database.types';
import { useAuth } from '../../contexts/AuthContext';

interface TransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'income' | 'expense';
  onSubmit: (data: Omit<Transaction, 'id' | 'created_at'>) => void;
  accounts: Account[] | undefined;
  categories: Category[] | undefined;
}

interface FormData {
  description: string;
  amount: string;
  category_id: string;
  account_id: string;
  reference: string;
  date: string;
}

export function TransactionDialog({
  isOpen,
  onClose,
  type,
  onSubmit,
  accounts,
  categories
}: TransactionDialogProps) {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      category_id: '',
      account_id: ''
    }
  });

  // Reset form when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      reset({
        date: new Date().toISOString().split('T')[0],
        category_id: '',
        account_id: ''
      });
    }
  }, [isOpen, reset]);

  // Filtrer les catégories en fonction du type de transaction
  const filteredCategories = React.useMemo(() => 
    categories?.filter(category => category.type === type) || [],
    [categories, type]
  );

  const onSubmitForm = (data: FormData) => {
    if (!user?.id) return;

    onSubmit({
      type,
      description: data.description,
      amount: parseFloat(data.amount),
      category_id: data.category_id || null, // Allow null category_id
      account_id: data.account_id,
      reference: data.reference,
      date: data.date,
      status: 'completed',
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
              {type === 'income' ? 'Nouvelle entrée' : 'Nouvelle sortie'}
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
              label="Description"
              placeholder="Description de la transaction"
              error={errors.description?.message}
              {...register('description', { required: 'La description est requise' })}
            />

            <Input
              type="number"
              label="Montant"
              placeholder="0"
              error={errors.amount?.message}
              {...register('amount', {
                required: 'Le montant est requis',
                min: { value: 0, message: 'Le montant doit être positif' }
              })}
            />

            <Select
              label="Compte"
              options={[
                { value: '', label: 'Sélectionnez un compte' },
                ...(accounts?.map(account => ({
                  value: account.id,
                  label: `${account.name} (${account.type})`
                })) || [])
              ]}
              error={errors.account_id?.message}
              {...register('account_id', { required: 'Le compte est requis' })}
            />

            <Select
              label="Catégorie (optionnel)"
              options={[
                { value: '', label: 'Sélectionnez une catégorie' },
                ...filteredCategories.map(category => ({
                  value: category.id,
                  label: category.name
                }))
              ]}
              {...register('category_id')}
            />

            <Input
              label="Référence"
              placeholder="Numéro de référence (optionnel)"
              {...register('reference')}
            />

            <Input
              type="date"
              label="Date"
              error={errors.date?.message}
              {...register('date', { required: 'La date est requise' })}
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
                {type === 'income' ? 'Enregistrer l\'entrée' : 'Enregistrer la sortie'}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}