import React from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';
import type { Seller } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface SellerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Seller, 'id' | 'created_at'>) => void;
  seller?: Seller;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const phoneRegex = /^\+?[0-9\s-]{8,}$/;

export function SellerDialog({
  isOpen,
  onClose,
  onSubmit,
  seller
}: SellerDialogProps) {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    defaultValues: seller
  });

  React.useEffect(() => {
    if (isOpen && seller) {
      reset(seller);
    } else if (isOpen) {
      reset();
    }
  }, [isOpen, seller, reset]);

  const onSubmitForm = (data: FormData) => {
    if (!user?.id) return;

    onSubmit({
      ...data,
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
              {seller ? 'Modifier le vendeur' : 'Nouveau vendeur'}
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
              label="Nom de la boutique"
              error={errors.name?.message}
              {...register('name', { required: 'Le nom est requis' })}
            />

            <Input
              type="email"
              label="Email"
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
              error={errors.phone?.message}
              {...register('phone', {
                pattern: {
                  value: phoneRegex,
                  message: 'Format de téléphone invalide'
                }
              })}
            />

            <Input
              label="Adresse"
              error={errors.address?.message}
              {...register('address')}
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
                {seller ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}