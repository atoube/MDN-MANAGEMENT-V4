import React, { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Absence } from '../../types';
import { useEmployees } from '../../hooks/useEmployees';
import { Button } from '../ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { AbsenceRejectionDialog } from './AbsenceRejectionDialog';
import { toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

// Définition du type BadgeVariant
type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 
                    'success' | 'warning' | 'info' | 'danger';

// Définition de initialFilters avant son utilisation
type FilterType = {
  status: 'all' | 'pending' | 'approved' | 'rejected';
  type: 'all' | 'vacation' | 'sick' | 'personal' | 'other';
  dateRange: 'all' | 'today' | 'week' | 'month';
};

const initialFilters: FilterType = {
  status: 'all',
  type: 'all',
  dateRange: 'all'
};

interface AbsenceListProps {
  absences: Absence[];
}

const calculateDays = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};

interface TableData {
  id: string;
  employees: {
    first_name: string;
    last_name: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  type: string;
  start_date: string;
  end_date: string;
}

interface TableColumn {
  header: string;
  accessor: string | ((row: TableData) => React.ReactNode);
}

interface TableProps {
  data: TableData[];
  columns: TableColumn[];
  isLoading: boolean;
}

const getStatusVariant = (status: string): BadgeVariant => {
  const variants: Record<string, BadgeVariant> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    default: 'secondary'
  };
  return variants[status] || variants.default;
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <Badge variant="default">
    {status}
  </Badge>
);

// Utilisation de format et fr pour le formatage des dates
const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
};

// Correction de getStatusColor avec Record
const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    default: 'bg-gray-100 text-gray-800'
  };
  return colors[status] || colors.default;
};

// Correction de getTypeLabel avec Record
const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    vacation: 'Congés payés',
    sick: 'Maladie',
    personal: 'Personnel',
    other: 'Autre'
  };
  return labels[type] || type;
};

// Utilisation de format et fr dans une fonction de formatage
const formatDateWithLocale = (date: string | Date): string => {
  return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
};

// Composant pour afficher les filtres
const AbsenceFilters: React.FC<{
  filters: typeof initialFilters,
  setFilters: (filters: typeof initialFilters) => void
}> = ({ filters, setFilters }) => {
  return (
    <div className="flex gap-4 mb-4">
      <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value as FilterType['status'] })}
        className="rounded-md border border-gray-300 px-3 py-2"
      >
        <option value="all">Tous les statuts</option>
        <option value="pending">En attente</option>
        <option value="approved">Approuvé</option>
        <option value="rejected">Refusé</option>
      </select>
      <select
        value={filters.type}
        onChange={(e) => setFilters({ ...filters, type: e.target.value as FilterType['type'] })}
        className="rounded-md border border-gray-300 px-3 py-2"
      >
        <option value="all">Tous les types</option>
        <option value="vacation">Congés payés</option>
        <option value="sick">Maladie</option>
        <option value="personal">Personnel</option>
        <option value="other">Autre</option>
      </select>
      <select
        value={filters.dateRange}
        onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as FilterType['dateRange'] })}
        className="rounded-md border border-gray-300 px-3 py-2"
      >
        <option value="all">Toutes les dates</option>
        <option value="today">Aujourd'hui</option>
        <option value="week">Cette semaine</option>
        <option value="month">Ce mois</option>
      </select>
    </div>
  );
};

// Composant pour la barre de progression
const ProgressBar: React.FC<{ value: number; max: number }> = ({ value, max }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-blue-600 transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// Composant pour le résumé des absences
const AbsenceSummary: React.FC<{
  total: number;
  taken: number;
  pending: number;
  remaining: number;
}> = ({ total, taken, pending, remaining }) => {
  return (
    <div className="grid grid-cols-4 gap-4 p-4 bg-white rounded-lg shadow">
      <div className="text-center">
        <div className="text-2xl font-bold">{total}</div>
        <div className="text-sm text-gray-500">Total</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">{taken}</div>
        <div className="text-sm text-gray-500">Pris</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">{pending}</div>
        <div className="text-sm text-gray-500">En attente</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">{remaining}</div>
        <div className="text-sm text-gray-500">Restants</div>
      </div>
    </div>
  );
};

// Composant pour le statut avec couleur
const StatusWithColor: React.FC<{ status: string }> = ({ status }) => (
  <div className={getStatusColor(status)}>
    {status}
  </div>
);

// Utilisation de tous les composants dans AbsenceList
export const AbsenceList: React.FC<AbsenceListProps> = ({ absences }) => {
  const { updateAbsence } = useEmployees();
  const [selectedAbsence, setSelectedAbsence] = useState<{
    id: string;
    employeeName: string;
  } | null>(null);
  const [filters, setFilters] = useState<FilterType>(initialFilters);
  
  // Ajout de logs pour débugger
  useEffect(() => {
    console.log('Absences mises à jour:', absences);
  }, [absences]);

  const pendingAbsences = useMemo(() => {
    return absences
      .filter(absence => absence.status === 'pending')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [absences]);

  const handleReject = (absenceId: string, employeeName: string) => {
    setSelectedAbsence({ id: absenceId, employeeName });
  };

  const handleApprove = async (absenceId: string) => {
    try {
      await updateAbsence.mutateAsync({
        id: absenceId,
        status: 'approved'
      });
      toast.success('Congé approuvé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      toast.error('Erreur lors de l\'approbation du congé');
    }
  };

  const columns: TableColumn[] = [
    {
      header: 'Employé',
      accessor: (row: TableData) => `${row.employees.first_name} ${row.employees.last_name}`
    },
    {
      header: 'Type',
      accessor: 'type'
    },
    {
      header: 'Date de début',
      accessor: 'start_date'
    },
    {
      header: 'Date de fin',
      accessor: 'end_date'
    },
    {
      header: 'Statut',
      accessor: (row: TableData) => (
        <StatusWithColor status={row.status} />
      )
    },
    {
      header: 'Actions',
      accessor: (row: TableData) => (
        <div className="flex space-x-2">
          {row.status === 'pending' && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleApprove(row.id)}
              >
                Approuver
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() =>
                  handleReject(row.id, `${row.employees.first_name} ${row.employees.last_name}`)
                }
              >
                Refuser
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  const absenceSummary = useMemo(() => {
    const approved = absences.filter(a => a.status === 'approved');
    return {
      total: 30,
      taken: approved.reduce((acc, curr) => acc + calculateDays(curr.start_date, curr.end_date), 0),
      pending: absences.filter(a => a.status === 'pending').length,
      remaining: 30 - approved.reduce((acc, curr) => 
        acc + calculateDays(curr.start_date, curr.end_date), 0)
    };
  }, [absences]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Demandes de congés en attente</h3>
      <AbsenceFilters 
        filters={filters} 
        setFilters={setFilters} 
      />
      
      {pendingAbsences.length === 0 ? (
        <p>Aucune demande en attente</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employé</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date de début</TableHead>
              <TableHead>Date de fin</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingAbsences.map((absence) => (
              <TableRow key={absence.id}>
                <TableCell>
                  {absence.employee.first_name} {absence.employee.last_name}
                </TableCell>
                <TableCell>
                  {getTypeLabel(absence.type)}
                </TableCell>
                <TableCell>
                  {formatDateWithLocale(absence.start_date)}
                </TableCell>
                <TableCell>
                  {formatDateWithLocale(absence.end_date)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={absence.status} />
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {absence.status === 'pending' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApprove(absence.id)}
                        >
                          Approuver
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleReject(absence.id, `${absence.employee.first_name} ${absence.employee.last_name}`)}
                        >
                          Refuser
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      <ProgressBar 
        value={absenceSummary.taken} 
        max={30} 
      />
      
      <AbsenceSummary {...absenceSummary} />
      
      <AbsenceRejectionDialog
        isOpen={!!selectedAbsence}
        onClose={() => setSelectedAbsence(null)}
        absenceId={selectedAbsence?.id || ''}
        employeeName={selectedAbsence?.employeeName || ''}
      />
    </div>
  );
} 