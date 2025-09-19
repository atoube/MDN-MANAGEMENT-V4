import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { 
  Plus, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText,
  Download
} from 'lucide-react';
import { useLeaveRequests, LeaveRequest, LeaveBalance } from '../hooks/useLeaveRequests';
import { useAuth } from '../contexts/AuthContext';
import { useEmployees } from '../hooks/useEmployees';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CreateLeaveRequestDialog } from '../components/leave/CreateLeaveRequestDialog';

export default function LeaveRequests() {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const {
    leaveRequests,
    leaveBalances,
    loading,
    createLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    getEmployeeLeaveRequests,
    getPendingRequests,
    getEmployeeLeaveBalance
  } = useLeaveRequests();

  const [selectedTab, setSelectedTab] = useState('overview');
  const [isCreateRequestOpen, setIsCreateRequestOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  // Filtrer les demandes selon le rôle de l'utilisateur
  const userLeaveRequests = useMemo(() => {
    if (user?.role === 'admin') {
      return leaveRequests;
    }
    return getEmployeeLeaveRequests(user?.id || 0);
  }, [leaveRequests, user, getEmployeeLeaveRequests]);

  const pendingRequests = useMemo(() => {
    if (user?.role === 'admin') {
      return getPendingRequests();
    }
    return [];
  }, [user, getPendingRequests]);

  const userLeaveBalance = useMemo(() => {
    if (user?.id) {
      return getEmployeeLeaveBalance(user.id);
    }
    return undefined;
  }, [user, getEmployeeLeaveBalance]);

  // Statistiques
  const stats = useMemo(() => {
    const totalRequests = userLeaveRequests.length;
    const pendingCount = userLeaveRequests.filter(req => req.status === 'pending').length;
    const approvedCount = userLeaveRequests.filter(req => req.status === 'approved').length;
    const rejectedCount = userLeaveRequests.filter(req => req.status === 'rejected').length;

    return {
      total: totalRequests,
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount
    };
  }, [userLeaveRequests]);

  const handleApproveRequest = async (requestId: string) => {
    try {
      await approveLeaveRequest(
        requestId, 
        user?.id || 0, 
        `${user?.first_name} ${user?.last_name}` || 'Admin',
        'Demande approuvée'
      );
      toast.success('Demande approuvée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
    }
  };

  const handleRejectRequest = async (requestId: string, reason: string) => {
    try {
      await rejectLeaveRequest(
        requestId, 
        user?.id || 0, 
        `${user?.first_name} ${user?.last_name}` || 'Admin',
        reason
      );
      toast.success('Demande rejetée');
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getLeaveTypeLabel = (type: string) => {
    switch (type) {
      case 'congés_payés': return 'Congés Payés';
      case 'congés_sans_solde': return 'Congés Sans Solde';
      case 'congés_maladie': return 'Congés Maladie';
      case 'repos_compensateur': return 'Repos Compensateur';
      case 'congés_exceptionnels': return 'Congés Exceptionnels';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des demandes de congés...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Congés</h1>
          <p className="text-gray-600 mt-2">
            Gestion des demandes de congés et des soldes
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreateRequestOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Demande
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Demandes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Approuvées</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-full">
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Rejetées</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Solde de congés de l'utilisateur */}
      {userLeaveBalance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Mon Solde de Congés 2024
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-blue-600">{userLeaveBalance.total_days} jours</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Utilisés</p>
                <p className="text-2xl font-bold text-orange-600">{userLeaveBalance.used_days} jours</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Restants</p>
                <p className="text-2xl font-bold text-green-600">{userLeaveBalance.remaining_days} jours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Onglets */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="my-requests">Mes Demandes</TabsTrigger>
          {user?.role === 'admin' && (
            <TabsTrigger value="pending">Demandes en Attente</TabsTrigger>
          )}
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les Demandes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userLeaveRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1 capitalize">{request.status}</span>
                          </Badge>
                          <Badge variant="outline">{getLeaveTypeLabel(request.leave_type)}</Badge>
                        </div>
                        <h3 className="font-medium">{request.employee_name}</h3>
                        <p className="text-sm text-gray-600">{request.reason}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {format(new Date(request.start_date), 'dd/MM/yyyy', { locale: fr })} - {format(new Date(request.end_date), 'dd/MM/yyyy', { locale: fr })}
                          </span>
                          <span>{request.number_of_days} jour(s)</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Détails
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mes demandes */}
        <TabsContent value="my-requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mes Demandes de Congés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userLeaveRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1 capitalize">{request.status}</span>
                          </Badge>
                          <Badge variant="outline">{getLeaveTypeLabel(request.leave_type)}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{request.reason}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {format(new Date(request.start_date), 'dd/MM/yyyy', { locale: fr })} - {format(new Date(request.end_date), 'dd/MM/yyyy', { locale: fr })}
                          </span>
                          <span>{request.number_of_days} jour(s)</span>
                        </div>
                        {request.approved_by_name && (
                          <p className="text-sm text-gray-500 mt-1">
                            Validé par: {request.approved_by_name} le {request.approval_date && format(new Date(request.approval_date), 'dd/MM/yyyy', { locale: fr })}
                          </p>
                        )}
                        {request.rejection_reason && (
                          <p className="text-sm text-red-600 mt-1">
                            Motif du rejet: {request.rejection_reason}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Demandes en attente (Admin seulement) */}
        {user?.role === 'admin' && (
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Demandes en Attente d'Approbation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Clock className="w-4 h-4 mr-1" />
                              En attente
                            </Badge>
                            <Badge variant="outline">{getLeaveTypeLabel(request.leave_type)}</Badge>
                          </div>
                          <h3 className="font-medium">{request.employee_name}</h3>
                          <p className="text-sm text-gray-600">{request.reason}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {format(new Date(request.start_date), 'dd/MM/yyyy', { locale: fr })} - {format(new Date(request.end_date), 'dd/MM/yyyy', { locale: fr })}
                            </span>
                            <span>{request.number_of_days} jour(s)</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveRequest(request.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approuver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const reason = prompt('Motif du rejet:');
                              if (reason) {
                                handleRejectRequest(request.id, reason);
                              }
                            }}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Rejeter
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {pendingRequests.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      Aucune demande en attente d'approbation
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Modal de création de demande */}
      <CreateLeaveRequestDialog
        isOpen={isCreateRequestOpen}
        onClose={() => setIsCreateRequestOpen(false)}
      />

      {/* Modal de détails (à implémenter) */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Détails de la Demande</h2>
            <div className="space-y-4">
              <div>
                <strong>Employé:</strong> {selectedRequest.employee_name}
              </div>
              <div>
                <strong>Type:</strong> {getLeaveTypeLabel(selectedRequest.leave_type)}
              </div>
              <div>
                <strong>Raison:</strong> {selectedRequest.reason}
              </div>
              <div>
                <strong>Période:</strong> {format(new Date(selectedRequest.start_date), 'dd/MM/yyyy', { locale: fr })} - {format(new Date(selectedRequest.end_date), 'dd/MM/yyyy', { locale: fr })}
              </div>
              <div>
                <strong>Nombre de jours:</strong> {selectedRequest.number_of_days}
              </div>
              <div>
                <strong>Statut:</strong> 
                <Badge className={`ml-2 ${getStatusColor(selectedRequest.status)}`}>
                  {getStatusIcon(selectedRequest.status)}
                  <span className="ml-1 capitalize">{selectedRequest.status}</span>
                </Badge>
              </div>
              {selectedRequest.approved_by_name && (
                <div>
                  <strong>Validé par:</strong> {selectedRequest.approved_by_name}
                </div>
              )}
              {selectedRequest.rejection_reason && (
                <div>
                  <strong>Motif du rejet:</strong> {selectedRequest.rejection_reason}
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 