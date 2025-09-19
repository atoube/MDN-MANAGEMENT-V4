import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  Calendar, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye
} from "lucide-react";
import { toast } from "sonner";

interface LeaveRequest {
  id: number;
  employee_id: number;
  employee_name: string;
  start_date: string;
  end_date: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  total_days: number;
  reason?: string;
  created_at: string;
}

export function LeaveRequestsList() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      
      // Utiliser des données simulées pour l'instant
      const mockData: LeaveRequest[] = [
        {
          id: 1,
          employee_id: 1,
          employee_name: "Jean Dupont",
          start_date: "2024-03-15",
          end_date: "2024-03-20",
          type: "vacation",
          status: "pending",
          total_days: 5,
          reason: "Congés annuels",
          created_at: "2024-03-01T10:00:00Z"
        },
        {
          id: 2,
          employee_id: 2,
          employee_name: "Marie Martin",
          start_date: "2024-03-25",
          end_date: "2024-03-26",
          type: "sick_leave",
          status: "approved",
          total_days: 2,
          reason: "Maladie",
          created_at: "2024-03-10T14:30:00Z"
        },
        {
          id: 3,
          employee_id: 3,
          employee_name: "Pierre Durand",
          start_date: "2024-04-01",
          end_date: "2024-04-05",
          type: "personal_leave",
          status: "rejected",
          total_days: 4,
          reason: "Affaires personnelles",
          created_at: "2024-03-15T09:15:00Z"
        }
      ];
      
      setLeaveRequests(mockData);
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
      toast.error('Erreur lors du chargement des demandes de congés');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: number, newStatus: 'approved' | 'rejected') => {
    try {
      // Simuler la mise à jour
      setLeaveRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status: newStatus }
            : request
        )
      );
      
      toast.success(`Demande ${newStatus === 'approved' ? 'approuvée' : 'rejetée'} avec succès`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeté</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'vacation': 'Congés annuels',
      'sick_leave': 'Congés maladie',
      'personal_leave': 'Congés personnels',
      'maternity_leave': 'Congés maternité',
      'paternity_leave': 'Congés paternité',
      'other': 'Autre'
    };
    return types[type] || type;
  };

  const filteredRequests = leaveRequests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec filtres */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Demandes de congés</h2>
          <p className="text-gray-600">Gérez les demandes de congés des employés</p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Toutes ({leaveRequests.length})
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('pending')}
          >
            En attente ({leaveRequests.filter(r => r.status === 'pending').length})
          </Button>
          <Button
            variant={filter === 'approved' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('approved')}
          >
            Approuvées ({leaveRequests.filter(r => r.status === 'approved').length})
          </Button>
          <Button
            variant={filter === 'rejected' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('rejected')}
          >
            Rejetées ({leaveRequests.filter(r => r.status === 'rejected').length})
          </Button>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="grid gap-4">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-gray-500">Aucune demande de congé trouvée</p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <h3 className="font-semibold text-lg">{request.employee_name}</h3>
                      {getStatusIcon(request.status)}
                      {getStatusBadge(request.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Du {format(new Date(request.start_date), 'dd/MM/yyyy', { locale: fr })} 
                          au {format(new Date(request.end_date), 'dd/MM/yyyy', { locale: fr })}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {request.total_days} jour{request.total_days > 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">
                          {getTypeLabel(request.type)}
                        </span>
                      </div>
                    </div>
                    
                    {request.reason && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Raison :</span> {request.reason}
                        </p>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      Demande créée le {format(new Date(request.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {request.status === 'pending' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusUpdate(request.id, 'approved')}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusUpdate(request.id, 'rejected')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 