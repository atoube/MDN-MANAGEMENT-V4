import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { 
  User, 
  Calendar, 
  FileText, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  DollarSign,
  Plus,
  CheckCircle,
  XCircle,
  Clock as ClockIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface LeaveRequest {
  id: string;
  type: 'annual' | 'sick' | 'other';
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  days_requested: number;
}

interface SalaryHistory {
  id: string;
  month: string;
  base_salary: number;
  bonus: number;
  deductions: number;
  net_salary: number;
  status: 'paid' | 'pending';
}

export default function EmployeeProfile() {
  const { user, employee } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      type: 'annual',
      start_date: '2024-07-15',
      end_date: '2024-07-22',
      reason: 'Vacances d\'été en famille',
      status: 'approved',
      created_at: '2024-06-01T10:00:00Z',
      days_requested: 8
    },
    {
      id: '2',
      type: 'sick',
      start_date: '2024-05-10',
      end_date: '2024-05-12',
      reason: 'Grippe',
      status: 'approved',
      created_at: '2024-05-09T14:30:00Z',
      days_requested: 3
    },
    {
      id: '3',
      type: 'other',
      start_date: '2024-08-20',
      end_date: '2024-08-21',
      reason: 'Rendez-vous médical',
      status: 'pending',
      created_at: '2024-08-15T09:15:00Z',
      days_requested: 2
    }
  ]);

  const [salaryHistory] = useState<SalaryHistory[]>([
    {
      id: '1',
      month: 'Mars 2024',
      base_salary: 450000,
      bonus: 50000,
      deductions: 25000,
      net_salary: 475000,
      status: 'paid'
    },
    {
      id: '2',
      month: 'Février 2024',
      base_salary: 450000,
      bonus: 30000,
      deductions: 25000,
      net_salary: 455000,
      status: 'paid'
    },
    {
      id: '3',
      month: 'Janvier 2024',
      base_salary: 450000,
      bonus: 75000,
      deductions: 25000,
      net_salary: 500000,
      status: 'paid'
    }
  ]);

  const [isNewLeaveDialogOpen, setIsNewLeaveDialogOpen] = useState(false);
  const [newLeaveData, setNewLeaveData] = useState({
    type: 'annual' as 'annual' | 'sick' | 'other',
    start_date: '',
    end_date: '',
    reason: ''
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Refusé';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'annual': return 'Congés annuels';
      case 'sick': return 'Congés maladie';
      case 'other': return 'Autre';
      default: return type;
    }
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // +1 car on compte les jours inclus
  };

  const handleNewLeaveRequest = () => {
    if (!newLeaveData.start_date || !newLeaveData.end_date || !newLeaveData.reason) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const daysRequested = calculateDays(newLeaveData.start_date, newLeaveData.end_date);
    
    const newRequest: LeaveRequest = {
      id: Date.now().toString(),
      ...newLeaveData,
      status: 'pending',
      created_at: new Date().toISOString(),
      days_requested: daysRequested
    };

    setLeaveRequests(prev => [newRequest, ...prev]);
    setNewLeaveData({
      type: 'annual',
      start_date: '',
      end_date: '',
      reason: ''
    });
    setIsNewLeaveDialogOpen(false);
    toast.success('Demande de congé envoyée avec succès');
  };

  const stats = useMemo(() => {
    const totalRequests = leaveRequests.length;
    const approvedRequests = leaveRequests.filter(r => r.status === 'approved').length;
    const pendingRequests = leaveRequests.filter(r => r.status === 'pending').length;
    const totalDaysTaken = leaveRequests
      .filter(r => r.status === 'approved')
      .reduce((sum, r) => sum + r.days_requested, 0);

    return {
      totalRequests,
      approvedRequests,
      pendingRequests,
      totalDaysTaken
    };
  }, [leaveRequests]);

  if (!user || !employee) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">Aucune information d'employé disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête du profil */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-500 mt-1">
            Bienvenue, {employee.first_name} {employee.last_name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={employee.status === 'active' ? 'success' : 'destructive'}>
            {employee.status === 'active' ? 'Actif' : 'Inactif'}
          </Badge>
        </div>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte d'identité */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Informations Personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nom complet</label>
                <p className="text-gray-900">{employee.first_name} {employee.last_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  {employee.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Téléphone</label>
                <p className="text-gray-900 flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  {employee.phone}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Adresse</label>
                <p className="text-gray-900 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  {employee.address}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations professionnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Informations Professionnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Département</label>
              <p className="text-gray-900">{employee.department}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Poste</label>
              <p className="text-gray-900">{employee.position}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Date d'embauche</label>
              <p className="text-gray-900">{new Date(employee.hire_date).toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Salaire</label>
              <p className="text-gray-900 flex items-center font-semibold">
                <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                {formatPrice(parseInt(employee.salary))}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets pour les différentes sections */}
      <Tabs defaultValue="leaves" className="space-y-6">
        <TabsList>
          <TabsTrigger value="leaves" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Mes Congés
          </TabsTrigger>
          <TabsTrigger value="salary" className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Historique Salaires
          </TabsTrigger>
          <TabsTrigger value="emergency" className="flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            Contact d'Urgence
          </TabsTrigger>
        </TabsList>

        {/* Onglet Congés */}
        <TabsContent value="leaves" className="space-y-6">
          {/* Statistiques des congés */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Total Demandes</h3>
                  <p className="text-3xl font-semibold text-gray-900">{stats.totalRequests}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Approuvées</h3>
                  <p className="text-3xl font-semibold text-gray-900">{stats.approvedRequests}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <ClockIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">En Attente</h3>
                  <p className="text-3xl font-semibold text-gray-900">{stats.pendingRequests}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Jours Pris</h3>
                  <p className="text-3xl font-semibold text-gray-900">{stats.totalDaysTaken}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Liste des demandes de congés */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Mes Demandes de Congés</CardTitle>
              <Button onClick={() => setIsNewLeaveDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Demande
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant={getStatusColor(request.status) as any}>
                            {getStatusLabel(request.status)}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {getTypeLabel(request.type)}
                          </span>
                        </div>
                        <p className="text-gray-900 font-medium mb-1">{request.reason}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>
                            Du {new Date(request.start_date).toLocaleDateString('fr-FR')}
                          </span>
                          <span>
                            Au {new Date(request.end_date).toLocaleDateString('fr-FR')}
                          </span>
                          <span>
                            {request.days_requested} jour(s)
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {new Date(request.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                ))}

                {leaveRequests.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p>Aucune demande de congé</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Historique Salaires */}
        <TabsContent value="salary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Salaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salaryHistory.map((salary) => (
                  <div key={salary.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">{salary.month}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>Salaire de base: {formatPrice(salary.base_salary)}</span>
                          <span>Bonus: {formatPrice(salary.bonus)}</span>
                          <span>Déductions: {formatPrice(salary.deductions)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPrice(salary.net_salary)}
                        </p>
                        <Badge variant={salary.status === 'paid' ? 'success' : 'warning'}>
                          {salary.status === 'paid' ? 'Payé' : 'En attente'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Contact d'Urgence */}
        <TabsContent value="emergency" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact d'Urgence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nom du contact</label>
                  <p className="text-gray-900">{employee.emergency_contact}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Téléphone</label>
                  <p className="text-gray-900 flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {employee.emergency_phone}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal pour nouvelle demande de congé */}
      {isNewLeaveDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nouvelle Demande de Congé</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de congé
                </label>
                <select
                  value={newLeaveData.type}
                  onChange={(e) => setNewLeaveData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="annual">Congés annuels</option>
                  <option value="sick">Congés maladie</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de début
                </label>
                <input
                  type="date"
                  value={newLeaveData.start_date}
                  onChange={(e) => setNewLeaveData(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={newLeaveData.end_date}
                  onChange={(e) => setNewLeaveData(prev => ({ ...prev, end_date: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Raison
                </label>
                <textarea
                  value={newLeaveData.reason}
                  onChange={(e) => setNewLeaveData(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                  placeholder="Décrivez la raison de votre demande..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="secondary" onClick={() => setIsNewLeaveDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleNewLeaveRequest}>
                Envoyer la demande
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
