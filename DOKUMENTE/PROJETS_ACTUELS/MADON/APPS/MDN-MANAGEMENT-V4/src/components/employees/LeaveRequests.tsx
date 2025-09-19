import { useState, useMemo, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '../ui/Button';
import { LeaveRequestDetailsModal } from './LeaveRequestDetailsModal';
import { useLeaveRequests, LeaveRequest as HookLeaveRequest } from '../../hooks/useLeaveRequests';
import { useLeavePermissions } from '../../hooks/useLeavePermissions';
import { 
  LeaveStatus, 
  StatusFilterType,
  SortOrder
} from './types';

const formatDate = (date: string): string => {
  try {
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return date;
  }
};

// Définition locale de LeaveRequest pour éviter le conflit d'importation
interface LocalLeaveRequest {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  type: string;
  status: string;
  total_days: number;
  reason: string | null;
  created_at: string;
  updated_at: string;
  rejection_reason?: string | null;
  proof_documents?: string[];
  employee: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    department: string;
    position: string;
  };
}

// Fonction pour convertir les données du hook vers le format local
const convertHookDataToLocal = (hookRequests: HookLeaveRequest[]): LocalLeaveRequest[] => {
  return hookRequests.map(request => {
    
    // Gérer le cas où employee_name pourrait être null ou undefined
    const employeeName = request.employee_name || 'Employé Inconnu';
    const nameParts = employeeName.split(' ');
    const firstName = nameParts[0] || 'Prénom';
    const lastName = nameParts.slice(1).join(' ') || 'Nom';
    
    return {
      id: request.id,
      employee_id: request.employee_id.toString(),
      start_date: request.start_date,
      end_date: request.end_date,
      type: request.leave_type,
      status: request.status,
      total_days: request.number_of_days,
      reason: request.reason,
      created_at: request.created_at,
      updated_at: request.updated_at,
      rejection_reason: request.rejection_reason,
      proof_documents: request.proof_documents || [],
      employee: {
        id: request.employee_id.toString(),
        first_name: firstName,
        last_name: lastName,
        email: request.employee_email || 'email@exemple.com',
        department: 'Département', // Valeur par défaut
        position: 'Poste' // Valeur par défaut
      }
    };
  });
};


const SearchInput = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <div className="relative">
    <input
      type="text"
      placeholder="Rechercher un employé..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 w-64"
    />
    <svg 
      className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
      />
    </svg>
  </div>
);

const EmptyState = () => (
  <div className="p-12 text-center bg-gray-50 rounded-lg m-6">
    <svg 
      className="mx-auto h-16 w-16 text-gray-400 animate-pulse" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
      />
    </svg>
    <h3 className="mt-4 text-lg font-medium text-gray-900">Tableau vide</h3>
    <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
      Aucune demande de congé n'est actuellement enregistrée dans le système.
    </p>
  </div>
);

const RequestCounter = ({ count }: { count: number }) => (
  <span 
    className="relative px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium transition-all duration-300 ease-in-out group"
    key={count}
  >
    <span className="relative z-10">
      {count} demande{count > 1 ? 's' : ''}
    </span>
    <span className="absolute inset-0 bg-indigo-200 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300 ease-in-out" />
  </span>
);

const LoadingIndicator = () => (
  <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 flex items-center gap-2">
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600" />
    <span className="text-sm text-gray-600">Mise à jour...</span>
  </div>
);


interface LeaveRequestWithReason extends LocalLeaveRequest {
  rejection_reason?: string | null;
}


const renderStatus = (status: string, rejectionReason?: string | null) => {
  const statusConfig = {
    pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
    approved: { label: 'Approuvé', color: 'bg-green-100 text-green-800' },
    rejected: { label: 'Refusé', color: 'bg-red-100 text-red-800' }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <div className="flex flex-col gap-1">
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
      {status === 'rejected' && rejectionReason && (
        <span className="text-xs text-red-600 truncate" title={rejectionReason}>
          {rejectionReason.length > 15 ? `${rejectionReason.substring(0, 15)}...` : rejectionReason}
        </span>
      )}
    </div>
  );
};

export const LeaveRequests = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LocalLeaveRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequestForDetails, setSelectedRequestForDetails] = useState<LocalLeaveRequest | null>(null);

  // Hook de permissions
  const { 
    permissions, 
    canViewRequest, 
    canApproveRequest, 
    canRejectRequest,
    isAdmin,
    isHR,
    isEmployee 
  } = useLeavePermissions();

  console.log('🔍 LeaveRequests component loaded');

  // Utiliser le hook useLeaveRequests
  const { 
    leaveRequests: hookLeaveRequests, 
    loading: hookLoading, 
    loadData,
    approveLeaveRequest,
    rejectLeaveRequest
  } = useLeaveRequests();

  // Convertir les données du hook vers le format local
  const leaveRequestsData = useMemo(() => {
    const allRequests = convertHookDataToLocal(hookLeaveRequests);
    
    // Filtrer selon les permissions
    return allRequests.filter(request => {
      return canViewRequest(request.employee.email);
    });
  }, [hookLeaveRequests, canViewRequest]);

  const isLoading = hookLoading;
  const error = null; // Le hook gère les erreurs en interne

  console.log('📊 LeaveRequests data:', leaveRequestsData);
  console.log('⏳ Loading:', isLoading);
  console.log('❌ Error:', error);

  const handleStatusChange = async (id: string, newStatus: string, rejectionReason?: string) => {
    try {
      // Trouver la demande pour vérifier les permissions
      const request = leaveRequestsData.find(req => req.id === id);
      if (!request) {
        toast.error('Demande non trouvée');
        return;
      }

      // Vérifier les permissions
      if (newStatus === 'approved' && !canApproveRequest(request.employee.email)) {
        toast.error('Vous n\'avez pas l\'autorisation d\'approuver cette demande');
        return;
      }

      if (newStatus === 'rejected' && !canRejectRequest(request.employee.email)) {
        toast.error('Vous n\'avez pas l\'autorisation de rejeter cette demande');
        return;
      }

      console.log(`Mise à jour du statut pour la demande ${id}: ${newStatus}`);
      
      // Utiliser les fonctions du hook selon le statut
      if (newStatus === 'approved') {
        await approveLeaveRequest(id, 1, 'Ahmadou Bello'); // ID et nom de l'approbateur
      } else if (newStatus === 'rejected') {
        const reason = rejectionReason || prompt('Raison du refus:');
        if (reason) {
          await rejectLeaveRequest(id, 1, 'Ahmadou Bello', reason);
        } else {
          toast.error('Raison de rejet requise');
          return;
        }
      }
      
      toast.success('Statut mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const renderStatusActions = (request: LeaveRequestWithReason, onViewDetails: (request: LocalLeaveRequest) => void) => {
    console.log('🎯 renderStatusActions called for request:', request.id);
    
    const canApprove = canApproveRequest(request.employee.email);
    const canReject = canRejectRequest(request.employee.email);
    
    return (
      <div className="flex space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log('👆 Voir détails clicked for request:', request.id);
            onViewDetails(request);
          }}
          className="text-xs px-2 py-1"
        >
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Détails
        </Button>
        {request.status === 'pending' && (
          <>
            {canReject && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const reason = prompt('Raison du refus:');
                  if (reason) {
                    handleStatusChange(request.id, 'rejected', reason);
                  }
                }}
                className="text-xs px-2 py-1"
              >
                Rejeter
              </Button>
            )}
            {canApprove && (
              <Button
                variant="default"
                size="sm"
                onClick={() => handleStatusChange(request.id, 'approved')}
                disabled={request.status !== 'pending'}
                className="text-xs px-3 py-1"
              >
                OK
              </Button>
            )}
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    // Simulation des mises à jour en temps réel
    const checkInterval = setInterval(() => {
      // Vérifier périodiquement les mises à jour
      console.log('Vérification des mises à jour des demandes de congés');
    }, 30000);

    return () => {
      clearInterval(checkInterval);
    };
  }, []);

  const filteredAndSortedRequests = useMemo(() => {
    if (!leaveRequestsData) return [];
    
    return [...leaveRequestsData]
      .filter((request) => 
        (statusFilter === 'all' || request.status === statusFilter) &&
        (searchTerm === '' || 
          `${request.employee.first_name} ${request.employee.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.employee.department
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      )
      .sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [leaveRequestsData, statusFilter, searchTerm, sortOrder]);


  const handleReject = async () => {
    if (!selectedRequest?.id || !rejectionReason.trim()) {
      toast.error('Veuillez saisir un motif de rejet');
      return;
    }

    try {
      console.log(`Rejet de la demande ${selectedRequest.id}: ${rejectionReason}`);
      
      await rejectLeaveRequest(selectedRequest.id, 1, 'Ahmadou Bello', rejectionReason);
      toast.success('Demande rejetée avec succès');
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedRequest(null);
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      toast.error('Erreur lors du rejet de la demande');
    }
  };

  const handleViewDetails = (request: LocalLeaveRequest) => {
    setSelectedRequestForDetails(request);
    setShowDetailsModal(true);
  };

  const handleApproveFromModal = async (requestId: string) => {
    try {
      await approveLeaveRequest(requestId, 1, 'Ahmadou Bello');
      toast.success('Demande approuvée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      toast.error('Erreur lors de l\'approbation de la demande');
    }
  };

  const handleRejectFromModal = async (requestId: string, reason: string) => {
    try {
      await rejectLeaveRequest(requestId, 1, 'Ahmadou Bello', reason);
      toast.success('Demande rejetée avec succès');
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      toast.error('Erreur lors du rejet de la demande');
    }
  };

  const handleClearTable = useCallback(async () => {
    try {
      const loadingToast = toast.loading('Suppression en cours...');
      
      console.log('Suppression de toutes les demandes de congés');
      
      // Vider le localStorage
      localStorage.removeItem('leave_requests');
      
      // Recharger les données
      await loadData();

      toast.dismiss(loadingToast);
      toast.success('Table vidée avec succès', {
        icon: '🗑️',
        duration: 4000,
      });

    } catch (err) {
      console.error('Erreur détaillée:', err);
      toast.error('Erreur lors de la suppression. Veuillez réessayer.', {
        duration: 5000,
      });
      
      await loadData();
    }
  }, [loadData]);

  const refreshButton = (
    <button
      onClick={() => loadData()}
      className="p-2 border rounded-lg hover:bg-gray-50 transition-colors"
      title="Rafraîchir la liste"
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
        />
      </svg>
    </button>
  );

  const clearTableButton = (
    <button
      onClick={async () => {
        try {
          // Simulation de la vérification du nombre d'entrées
          const count = leaveRequestsData?.length || 0;

          if (!count || count === 0) {
            toast('Le tableau est déjà vide', {
              icon: 'ℹ️',
              style: {
                background: '#EFF6FF',
                color: '#1E40AF',
              },
            });
            return;
          }

          const confirmClear = window.confirm(
            'ATTENTION !\n\n' +
            `Vous êtes sur le point de supprimer ${count} demande(s) de congés.\n` +
            'Cette action est irréversible.\n\n' +
            'Voulez-vous vraiment continuer ?'
          );

          if (!confirmClear) {
            return;
          }

          await handleClearTable();
        } catch (err) {
          console.error('Erreur de vérification:', err);
          toast.error('Erreur lors de la vérification de la table');
        }
      }}
      className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 disabled:opacity-50"
      title="Vider le tableau"
    >
      <svg 
        className="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
        />
      </svg>
      Vider le tableau
    </button>
  );

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg">
        <div className="flex items-center">
          <svg className="h-6 w-6 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-red-800">
            Erreur de chargement
          </h3>
        </div>
        <div className="mt-2">
          <p className="text-sm text-red-700">
            Une erreur est survenue lors du chargement des demandes de congés.
          </p>
          <p className="text-xs text-red-600 mt-1">
            Erreur inconnue
          </p>
          <p className="text-xs text-red-500 mt-1">
            Veuillez vérifier la connexion à la base de données et réessayer.
          </p>
        </div>
        <div className="mt-4 flex gap-2">
          <button 
            onClick={() => loadData()}
            className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
          >
            Réessayer le chargement
          </button>
          <button
            onClick={() => loadData()}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
          >
            Actualiser les données
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2">Chargement des demandes...</span>
      </div>
    );
  }

  // Debug: Afficher un message simple si pas de données
  if (!leaveRequestsData || leaveRequestsData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📋 Demandes de Congés
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Aucune demande de congés trouvée</p>
          <p className="text-sm text-gray-400">Données: {JSON.stringify(leaveRequestsData)}</p>
          <p className="text-sm text-gray-400">Loading: {isLoading ? 'true' : 'false'}</p>
          <p className="text-sm text-gray-400">Error: none</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow relative">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">
              Demandes de congés
            </h2>
            {filteredAndSortedRequests && (
              <RequestCounter count={filteredAndSortedRequests.length} />
            )}
          </div>
          {isLoading && (
            <div className="absolute top-2 right-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <SearchInput value={searchTerm} onChange={setSearchTerm} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilterType)}
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 min-w-[150px]"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvées</option>
              <option value="rejected">Refusées</option>
            </select>
            {clearTableButton}
            {refreshButton}
            <button
              onClick={() => setSortOrder(current => current === 'asc' ? 'desc' : 'asc')}
              className="p-2 border rounded-lg hover:bg-gray-50 transition-colors group"
              title={`Trier par date (${sortOrder === 'asc' ? 'Plus ancien' : 'Plus récent'})`}
            >
              <svg 
                className={`w-5 h-5 transform ${sortOrder === 'desc' ? 'rotate-180' : ''} group-hover:text-indigo-600 transition-colors`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M3 4h13M3 8h9M3 12h5M3 16h9M3 20h13" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {!filteredAndSortedRequests?.length ? (
        <EmptyState />
      ) : (
        <div className="overflow-hidden">
          <table className="w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employé
                </th>
                <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Période
                </th>
                <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="w-16 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="w-32 px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedRequests.map((request: LocalLeaveRequest) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="truncate">
                      <div className="text-sm font-medium text-gray-900 truncate">
                          {request.employee.first_name} {request.employee.last_name}
                        </div>
                      <div className="text-xs text-gray-500 truncate">
                          {request.employee.department} • {request.employee.position}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-xs text-gray-900">
                      {formatDate(request.start_date)}
                    </div>
                    <div className="text-xs text-gray-900">
                      {formatDate(request.end_date)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {request.total_days}j
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 truncate" title={request.type.charAt(0).toUpperCase() + request.type.slice(1)}>
                      {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                    </div>
                    {request.reason && (
                      <div className="text-xs text-gray-500 truncate" title={request.reason}>
                        {request.reason.length > 20 ? `${request.reason.substring(0, 20)}...` : request.reason}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="truncate">
                    {renderStatus(request.status as LeaveStatus, request.rejection_reason)}
                    </div>
                  </td>
                  <td className="px-2 py-4 text-xs text-gray-500">
                    {new Date(request.created_at).toLocaleDateString('fr-FR', { 
                      day: '2-digit', 
                      month: '2-digit' 
                    })}
                  </td>
                  <td className="px-2 py-4 text-right">
                    {renderStatusActions(request as LeaveRequestWithReason, handleViewDetails)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl transform transition-all">
            <h3 className="text-lg font-semibold mb-2">Motif du rejet</h3>
            <p className="text-sm text-gray-500 mb-4">
              Veuillez indiquer la raison du rejet de cette demande de congé.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-red-500 resize-none"
              placeholder="Saisissez le motif du rejet..."
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedRequest(null);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détails des demandes */}
      <LeaveRequestDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedRequestForDetails(null);
        }}
        request={selectedRequestForDetails}
        onApprove={handleApproveFromModal}
        onReject={handleRejectFromModal}
      />

      {isLoading && <LoadingIndicator />}
    </div>
  );
}; 