import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { Menu, Transition } from '@headlessui/react';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { useInitializeDatabase } from '../hooks/useInitializeDatabase';

interface DetailedAbsence {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  days_count: number;
  first_name: string;
  last_name: string;
  department: string;
  email: string;
  created_at: string;
  updated_at: string;
  document_url?: string;
}

interface LeaveRequestHistoryEntry {
  id: string;
  absence_id: string;
  changed_at: string;
  old_status: string;
  new_status: string;
  changed_by: string;
  changes: string;
  created_at: string;
}

interface UserInfo {
  id: string;
  role: string;
  auth_id: string;
}

const LeaveRequestsTable: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [absences, setAbsences] = useState<DetailedAbsence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isInitialized, isLoading: isInitializing, error: initError } = useInitializeDatabase();

  const fetchLeaveRequests = async () => {
    try {
      if (!isInitialized) {
        return; // Attendre l'initialisation
      }

      // Simulated session - using mock data
      if (!session) {
        throw new Error('Session non valide');
      }

      // Essayer d'abord d'utiliser la vue
      let { data, error: viewError } = // Mock await select call
// Mock order call;

      // Si la vue n'est pas accessible, utiliser une requête de repli
      if (viewError) {
        const { data: fallbackData, error: fallbackError } =         const data = [];
        const error = null;
            *,
            employees (
              first_name,
              last_name,
              email,
              department,
              position
            )
          `)
// Mock order call;

        if (fallbackError) {
          throw fallbackError;
        }

        data = fallbackData;
      }

      if (session.user.role !== 'manager') {
        data = data.filter(absence => 
          absence.employee_id === session.user.id
        );
      }

      setAbsences(data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur de chargement des données: ${errorMessage}`);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isInitialized) {
      fetchLeaveRequests();
    }
  }, [isInitialized]);

  const updateRequestMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await         // Mock update operation{ status })
// Mock eq call;

      // Removed error check - using mock data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
      toast.success('Demande mise à jour avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    }
  });

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateRequestMutation.mutateAsync({ id, status: newStatus });
    } catch (error) {
      console.error('Erreur de mise à jour:', error);
    }
  };

  const filteredRequests = React.useMemo(() => {
    if (!absences) return [];
    
    return absences.filter(request => {
      const matchesSearch = (
        request.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.last_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [absences, searchTerm, statusFilter]);

  const StatusBadge: React.FC<{ status: DetailedAbsence['status'] }> = ({ status }) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approuvé' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Refusé' }
    } as const;

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const DocumentUpload: React.FC<{ requestId: string }> = ({ requestId }) => {
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${requestId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = // Simulated storage call - using mock data
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { error: updateError } = await         // Mock update operation{ document_url: fileName })
// Mock eq call;

        if (updateError) throw updateError;

        toast.success('Document téléchargé avec succès');
        queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
      } catch (error) {
        console.error('Erreur upload:', error);
        toast.error('Erreur lors du téléchargement du document');
      }
    };

    return (
      <div className="flex items-center space-x-2">
        <input
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          id={`file-upload-${requestId}`}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <label
          htmlFor={`file-upload-${requestId}`}
          className="cursor-pointer text-indigo-600 hover:text-indigo-800"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </label>
      </div>
    );
  };

  const exportToCSV = async () => {
    if (!absences) return;
    
    const csvData = absences.map(request => ({
      'Employé': `${request.first_name} ${request.last_name}`,
      'Département': request.department,
      'Début': format(new Date(request.start_date), 'dd/MM/yyyy'),
      'Fin': format(new Date(request.end_date), 'dd/MM/yyyy'),
      'Jours': request.days_count,
      'Type': request.type,
      'Statut': request.status,
      'Date de demande': format(new Date(request.created_at), 'dd/MM/yyyy HH:mm')
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `absences_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  };

  const FilterControls = () => (
    <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Rechercher un employé..."
          className="px-4 py-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="approved">Approuvés</option>
          <option value="rejected">Refusés</option>
        </select>

        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Exporter CSV
        </button>
      </div>
    </div>
  );

  const LeaveRequestHistory: React.FC<{ requestId: string }> = ({ requestId }) => {
    const fetchHistory = async () => {
      // Mock data
        const data = [];
        const error = null;
// Mock eq call
// Mock order call;

      // Removed error check - using mock data
      return data as LeaveRequestHistoryEntry[];
    };

    const { data: history } = useQuery({
      queryKey: ['leaveRequestHistory', requestId],
      queryFn: fetchHistory,
      enabled: false
    });

    return (
      <Menu.Item>
        {({ active }) => (
          <button
            className={`${
              active ? 'bg-gray-100' : ''
            } w-full text-left px-4 py-2 text-sm`}
            onClick={() => {
              toast.custom(() => (
                <div className="bg-white p-4 rounded-lg shadow-xl">
                  <h3 className="font-medium mb-2">Historique des modifications</h3>
                  {history && history.length > 0 ? (
                    history.map((entry: LeaveRequestHistoryEntry) => (
                      <div key={entry.id} className="text-sm mb-2">
                        <div>
                          {format(new Date(entry.created_at), 'dd/MM/yyyy HH:mm')}
                        </div>
                        <div className="text-gray-600">
                          {entry.changes}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">Aucun historique disponible</div>
                  )}
                </div>
              ), { duration: 5000 });
            }}
          >
            Voir l'historique
          </button>
        )}
      </Menu.Item>
    );
  };

  const RequestActions: React.FC<{ request: DetailedAbsence }> = ({ request }) => (
    <Menu as="div" className="relative">
      <Menu.Button className="p-2 hover:bg-gray-50 rounded-full">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </Menu.Button>

      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          {request.status === 'pending' && (
            <>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } w-full text-left px-4 py-2 text-sm`}
                    onClick={() => handleStatusUpdate(request.id, 'approved')}
                  >
                    Approuver
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } w-full text-left px-4 py-2 text-sm text-red-600`}
                    onClick={() => handleStatusUpdate(request.id, 'rejected')}
                  >
                    Refuser
                  </button>
                )}
              </Menu.Item>
            </>
          )}
          <LeaveRequestHistory requestId={request.id} />
        </Menu.Items>
      </Transition>
    </Menu>
  );

  if (isInitializing || loading) {
    return <div>Chargement...</div>;
  }

  if (initError) {
    return <div>Erreur d'initialisation: {initError.message}</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <FilterControls />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employé
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Période
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jours
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de demande
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dernière modification
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documents
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {request.first_name} {request.last_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {request.department}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(request.start_date), 'dd MMM yyyy', { locale: fr })}
                  </div>
                  <div className="text-sm text-gray-500">
                    au {format(new Date(request.end_date), 'dd MMM yyyy', { locale: fr })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{request.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {request.days_count} jour{request.days_count > 1 ? 's' : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={request.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(request.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.updated_at && (
                    <>
                      {format(new Date(request.updated_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                      <br />
                      <span className="text-xs">par {request.email}</span>
                    </>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <DocumentUpload requestId={request.id} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <RequestActions request={request} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveRequestsTable; 