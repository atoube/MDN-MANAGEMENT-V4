import { useEmployees } from '../../hooks/useEmployees';
import { toast } from 'react-hot-toast';
import { FC } from 'react';

interface AbsenceManagementProps {
  onClose: () => void;
}

export const AbsenceManagement: FC<AbsenceManagementProps> = ({ onClose }) => {
  const { absences, updateAbsence } = useEmployees();

  const handleUpdateAbsenceStatus = async (absenceId: string, status: 'approved' | 'rejected', rejectionReason?: string) => {
    try {
      await updateAbsence.mutateAsync({
        id: absenceId,
        status,
        ...(rejectionReason && { rejection_reason: rejectionReason }),
      });
      toast.success(status === 'approved' ? 'Congé approuvé' : 'Congé rejeté');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  // ... reste du code existant pour la gestion des absences

  return (
    <div className="space-y-4">
      {/* Contenu du composant */}
    </div>
  );
}; 