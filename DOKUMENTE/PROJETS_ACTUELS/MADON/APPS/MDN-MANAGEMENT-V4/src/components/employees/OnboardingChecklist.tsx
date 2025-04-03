import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { X } from 'lucide-react';
import type { Employee } from '../../types';

interface OnboardingChecklistProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Employee>) => void;
  employee: Employee;
}

interface FormData {
  onboarding: {
    documents: {
      type: string;
      status: 'pending' | 'received' | 'verified';
      notes?: string;
    }[];
    training: {
      name: string;
      status: 'pending' | 'in_progress' | 'completed';
      completion_date?: string;
      notes?: string;
    }[];
    equipment: {
      item: string;
      status: 'pending' | 'ordered' | 'delivered' | 'setup';
      notes?: string;
    }[];
    access: {
      system: string;
      status: 'pending' | 'requested' | 'granted';
      notes?: string;
    }[];
    meetings: {
      type: string;
      status: 'scheduled' | 'completed';
      date?: string;
      notes?: string;
    }[];
  };
}

export function OnboardingChecklist({
  isOpen,
  onClose,
  onSubmit,
  employee
}: OnboardingChecklistProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
      onboarding: employee.onboarding || {
        documents: [
          { type: 'Contrat de travail', status: 'pending' },
          { type: 'Pièce d\'identité', status: 'pending' },
          { type: 'Attestation de résidence', status: 'pending' },
          { type: 'Photos d\'identité', status: 'pending' }
        ],
        training: [
          { name: 'Sécurité au travail', status: 'pending' },
          { name: 'Politique RH', status: 'pending' },
          { name: 'Outils internes', status: 'pending' }
        ],
        equipment: [
          { item: 'Ordinateur', status: 'pending' },
          { item: 'Badge d\'accès', status: 'pending' },
          { item: 'Téléphone professionnel', status: 'pending' }
        ],
        access: [
          { system: 'Email professionnel', status: 'pending' },
          { system: 'Intranet', status: 'pending' },
          { system: 'Système de gestion', status: 'pending' }
        ],
        meetings: [
          { type: 'Entretien avec le manager', status: 'scheduled' },
          { type: 'Présentation de l\'équipe', status: 'scheduled' },
          { type: 'Formation initiale', status: 'scheduled' }
        ]
      }
    }
  });

  const onSubmitForm = (data: FormData) => {
    onSubmit({
      ...data,
      id: employee.id
    });
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'ordered':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      case 'setup':
        return 'bg-green-100 text-green-800';
      case 'requested':
        return 'bg-blue-100 text-blue-800';
      case 'granted':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <Dialog.Panel className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Processus d'intégration de {employee.first_name} {employee.last_name}
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
              <h3 className="text-md font-medium text-gray-900">Documents requis</h3>
              <div className="space-y-4">
                {watch('onboarding.documents')?.map((doc, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded">
                    <span className="flex-1">{doc.type}</span>
                    <Select
                      options={[
                        { value: 'pending', label: 'En attente' },
                        { value: 'received', label: 'Reçu' },
                        { value: 'verified', label: 'Vérifié' }
                      ]}
                      className="w-32"
                      {...register(`onboarding.documents.${index}.status`)}
                    />
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(watch(`onboarding.documents.${index}.status`))}`}>
                      {watch(`onboarding.documents.${index}.status`) === 'pending' && 'En attente'}
                      {watch(`onboarding.documents.${index}.status`) === 'received' && 'Reçu'}
                      {watch(`onboarding.documents.${index}.status`) === 'verified' && 'Vérifié'}
                    </span>
                    <Input
                      placeholder="Notes"
                      className="w-64"
                      {...register(`onboarding.documents.${index}.notes`)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900">Formations</h3>
              <div className="space-y-4">
                {watch('onboarding.training')?.map((training, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded">
                    <span className="flex-1">{training.name}</span>
                    <Select
                      options={[
                        { value: 'pending', label: 'En attente' },
                        { value: 'in_progress', label: 'En cours' },
                        { value: 'completed', label: 'Terminé' }
                      ]}
                      className="w-32"
                      {...register(`onboarding.training.${index}.status`)}
                    />
                    <Input
                      type="date"
                      placeholder="Date de fin"
                      className="w-32"
                      {...register(`onboarding.training.${index}.completion_date`)}
                    />
                    <Input
                      placeholder="Notes"
                      className="w-64"
                      {...register(`onboarding.training.${index}.notes`)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900">Équipement</h3>
              <div className="space-y-4">
                {watch('onboarding.equipment')?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded">
                    <span className="flex-1">{item.item}</span>
                    <Select
                      options={[
                        { value: 'pending', label: 'En attente' },
                        { value: 'ordered', label: 'Commandé' },
                        { value: 'delivered', label: 'Livré' },
                        { value: 'setup', label: 'Installé' }
                      ]}
                      className="w-32"
                      {...register(`onboarding.equipment.${index}.status`)}
                    />
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(watch(`onboarding.equipment.${index}.status`))}`}>
                      {watch(`onboarding.equipment.${index}.status`) === 'pending' && 'En attente'}
                      {watch(`onboarding.equipment.${index}.status`) === 'ordered' && 'Commandé'}
                      {watch(`onboarding.equipment.${index}.status`) === 'delivered' && 'Livré'}
                      {watch(`onboarding.equipment.${index}.status`) === 'setup' && 'Installé'}
                    </span>
                    <Input
                      placeholder="Notes"
                      className="w-64"
                      {...register(`onboarding.equipment.${index}.notes`)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900">Accès aux systèmes</h3>
              <div className="space-y-4">
                {watch('onboarding.access')?.map((access, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded">
                    <span className="flex-1">{access.system}</span>
                    <Select
                      options={[
                        { value: 'pending', label: 'En attente' },
                        { value: 'requested', label: 'Demandé' },
                        { value: 'granted', label: 'Accordé' }
                      ]}
                      className="w-32"
                      {...register(`onboarding.access.${index}.status`)}
                    />
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(watch(`onboarding.access.${index}.status`))}`}>
                      {watch(`onboarding.access.${index}.status`) === 'pending' && 'En attente'}
                      {watch(`onboarding.access.${index}.status`) === 'requested' && 'Demandé'}
                      {watch(`onboarding.access.${index}.status`) === 'granted' && 'Accordé'}
                    </span>
                    <Input
                      placeholder="Notes"
                      className="w-64"
                      {...register(`onboarding.access.${index}.notes`)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900">Réunions</h3>
              <div className="space-y-4">
                {watch('onboarding.meetings')?.map((meeting, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded">
                    <span className="flex-1">{meeting.type}</span>
                    <Select
                      options={[
                        { value: 'scheduled', label: 'Planifiée' },
                        { value: 'completed', label: 'Terminée' }
                      ]}
                      className="w-32"
                      {...register(`onboarding.meetings.${index}.status`)}
                    />
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(watch(`onboarding.meetings.${index}.status`))}`}>
                      {watch(`onboarding.meetings.${index}.status`) === 'scheduled' && 'Planifiée'}
                      {watch(`onboarding.meetings.${index}.status`) === 'completed' && 'Terminée'}
                    </span>
                    <Input
                      type="date"
                      placeholder="Date"
                      className="w-32"
                      {...register(`onboarding.meetings.${index}.date`)}
                    />
                    <Input
                      placeholder="Notes"
                      className="w-64"
                      {...register(`onboarding.meetings.${index}.notes`)}
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