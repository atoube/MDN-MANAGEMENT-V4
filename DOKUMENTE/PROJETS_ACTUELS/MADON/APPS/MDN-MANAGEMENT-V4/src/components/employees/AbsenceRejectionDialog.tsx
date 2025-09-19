import { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useEmployees } from '../../hooks/useEmployees';
import { useToast } from '../../hooks/useToast';

interface AbsenceRejectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  absenceId: string;
  employeeName: string;
}

export function AbsenceRejectionDialog({
  isOpen,
  onClose,
  absenceId,
  employeeName
}: AbsenceRejectionDialogProps) {
  const [reason, setReason] = useState('');
  const { updateAbsence } = useEmployees();
  const { showToast } = useToast();

  const handleSubmit = async () => {
    if (!reason.trim()) {
      showToast('Veuillez fournir une raison pour le refus', 'error');
      return;
    }

    try {
      await updateAbsence.mutateAsync({
        id: absenceId,
        status: 'rejected',
        rejection_reason: reason
      });

      showToast('La demande de congé a été refusée', 'success');
      onClose();
    } catch (error) {
      showToast('Une erreur est survenue lors du refus de la demande', 'error');
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Refuser la demande de congé de ${employeeName}`}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Raison du refus
          </label>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Veuillez expliquer la raison du refus..."
            multiline
            rows={4}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={handleSubmit}
            isLoading={updateAbsence.isPending}
          >
            Confirmer le refus
          </Button>
        </div>
      </div>
    </Dialog>
  );
} 