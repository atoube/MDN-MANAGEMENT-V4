import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Absence } from '../../types';

interface AbsenceListProps {
  absences: Absence[];
}

const getStatusColor = (status: Absence['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getTypeLabel = (type: Absence['type']) => {
  switch (type) {
    case 'annual':
      return 'Congés annuels';
    case 'sick':
      return 'Congés maladie';
    case 'other':
      return 'Autre';
    default:
      return type;
  }
};

export function AbsenceList({ absences }: AbsenceListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Historique des absences</h3>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Période
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Type
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Motif
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Statut
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {absences.map((absence) => (
              <tr key={absence.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {format(new Date(absence.start_date), 'dd MMM yyyy', { locale: fr })} -{' '}
                  {format(new Date(absence.end_date), 'dd MMM yyyy', { locale: fr })}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {getTypeLabel(absence.type)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {absence.reason}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(absence.status)}`}>
                    {absence.status === 'pending' && 'En attente'}
                    {absence.status === 'approved' && 'Approuvé'}
                    {absence.status === 'rejected' && 'Rejeté'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 