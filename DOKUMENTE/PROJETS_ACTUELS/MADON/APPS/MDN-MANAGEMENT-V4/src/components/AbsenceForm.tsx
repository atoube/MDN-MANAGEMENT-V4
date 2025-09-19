import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { apiService } from '../lib/api';
import { useQueryClient } from 'react-query';
import { useUser } from '../hooks/useUser';

// Ajouter l'interface pour les données d'absence
interface AbsenceData {
  employee_id: string;
  start_date: string;
  end_date: string;
  type: string;
  status: 'pending';
  days_count: number;
  reason: string | null;
  created_at: string;
}

// Ajouter l'interface LeaveRequest
interface LeaveRequest {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  days_count: number;
  reason?: string;
  created_at: string;
  employee: {
    id: string;
    first_name: string;
    last_name: string;
    department: string;
  };
}

const AbsenceForm: React.FC = () => {
  const { user } = useUser();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [type, setType] = useState<string>('congé payé');
  const [reason, setReason] = useState<string>('');
  const [totalDays, setTotalDays] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setTotalDays(diffDays);
    }
  }, [startDate, endDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading('Envoi de la demande...');
      
      // Validation
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }

      if (!startDate || !endDate) {
        throw new Error('Veuillez sélectionner les dates');
      }

      if (endDate < startDate) {
        throw new Error('La date de fin doit être après la date de début');
      }

      // Calcul du nombre de jours
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (diffDays <= 0) {
        throw new Error('La durée doit être d\'au moins 1 jour');
      }

      // Préparation des données
      const absenceData = {
        employee_id: user.id,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        type: type.trim(),
        status: 'pending' as const,
        days_count: diffDays,
        reason: reason.trim() || null,
        created_at: new Date().toISOString()
      };

      // Insertion avec retour des données
      const { data: insertedData, error: insertError } = await         // Mock insert operation[absenceData])
        .select(`
          *,
          employee:employees (
            id,
            first_name,
            last_name,
            department
          )
        `)
        .single();

      if (insertError) {
        console.error('Erreur d\'insertion:', insertError);
        throw new Error(`Erreur lors de l'enregistrement: ${insertError.message}`);
      }

      // Mise à jour du cache et rafraîchissement
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['leaveRequests'] }),
        queryClient.invalidateQueries({ queryKey: ['absences'] }),
        queryClient.refetchQueries({ queryKey: ['leaveRequests'] })
      ]);

      toast.dismiss(loadingToast);
      toast.success('Demande envoyée avec succès');
      resetForm();

    } catch (err) {
      console.error('Erreur complète:', err);
      toast.error(err instanceof Error ? err.message : 'Erreur lors de l\'envoi de la demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStartDate(null);
    setEndDate(null);
    setType('congé payé');
    setReason('');
    setTotalDays(0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date de début
          </label>
          <input
            type="date"
            value={startDate ? startDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date de fin
          </label>
          <input
            type="date"
            value={endDate ? endDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type de congé
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="congé payé">Congé payé</option>
            <option value="congé sans solde">Congé sans solde</option>
            <option value="congé maladie">Congé maladie</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Motif (optionnel)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
          />
        </div>

        <div className="text-sm text-gray-500">
          Nombre de jours : {totalDays}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Envoi en cours...
          </span>
        ) : (
          'Envoyer la demande'
        )}
      </button>
    </form>
  );
};

export default AbsenceForm; 