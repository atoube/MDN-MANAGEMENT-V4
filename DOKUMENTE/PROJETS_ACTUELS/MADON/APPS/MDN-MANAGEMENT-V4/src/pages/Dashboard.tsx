import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { useEmployees } from '@/hooks/useEmployees';
import { useLeaveRequests } from '@/hooks/useLeaveRequests';
import { useTasks } from '@/hooks/useTasks';
import { useSalaryVisibility } from '@/hooks/useSalaryVisibility';
import { useDocuments } from '@/hooks/useDocuments';
import { NotificationTest } from '@/components/ui/NotificationTest';
import { RoleBasedMetrics } from '@/components/dashboard/RoleBasedMetrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock,
  FileText,
  User,
  Eye,
  EyeOff,
  Plus,
  Activity,
  Settings,
  File
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const { notifyInfo } = useNotificationContext();
  const { employees, loading: employeesLoading } = useEmployees();
  const { leaveRequests, loading: leaveLoading } = useLeaveRequests();
  const { tasks, isLoading: tasksLoading } = useTasks();
  const { isSalaryVisible, toggleSalaryVisibility } = useSalaryVisibility();
  const { documents, loading: documentsLoading, getRecentDocuments, getDocumentStats } = useDocuments();
  
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);

  useEffect(() => {
    if (employees && user?.email) {
      const employee = employees.find(emp => emp.email === user.email);
      setCurrentEmployee(employee);
    }
  }, [employees, user?.email]);

  // Notification de bienvenue
  useEffect(() => {
    if (user && !employeesLoading && !leaveLoading && !tasksLoading && !documentsLoading) {
      const welcomeMessage = `Bienvenue sur votre tableau de bord, ${user.firstName || user.email}!`;
      notifyInfo(welcomeMessage, 'Bienvenue');
    }
  }, [user, employeesLoading, leaveLoading, tasksLoading, documentsLoading, notifyInfo]);

  // Statistiques pour employé général
  const getEmployeeStats = () => {
    if (!currentEmployee || !leaveRequests) return null;
    
    const employeeRequests = leaveRequests.filter(req => req.employee_email === user?.email);
    const pendingRequests = employeeRequests.filter(req => req.status === 'pending');
    const approvedRequests = employeeRequests.filter(req => req.status === 'approved');
    const rejectedRequests = employeeRequests.filter(req => req.status === 'rejected');
    
    return {
      totalRequests: employeeRequests.length,
      pendingRequests: pendingRequests.length,
      approvedRequests: approvedRequests.length,
      rejectedRequests: rejectedRequests.length,
      recentRequests: employeeRequests.slice(0, 3)
    };
  };

  // Statistiques pour RH
  const getHRStats = () => {
    if (!leaveRequests || !employees) return null;
    
    const allRequests = leaveRequests;
    const pendingRequests = allRequests.filter(req => req.status === 'pending');
    const approvedRequests = allRequests.filter(req => req.status === 'approved');
    const rejectedRequests = allRequests.filter(req => req.status === 'rejected');
    const activeEmployees = employees.filter(emp => emp.status === 'active');
    
    return {
      totalRequests: allRequests.length,
      pendingRequests: pendingRequests.length,
      approvedRequests: approvedRequests.length,
      rejectedRequests: rejectedRequests.length,
      activeEmployees: activeEmployees.length,
      totalEmployees: employees.length,
      recentRequests: allRequests.slice(0, 5)
    };
  };

  // Statistiques pour Admin
  const getAdminStats = () => {
    if (!leaveRequests || !employees || !tasks) return null;
    
    const allRequests = leaveRequests;
    const pendingRequests = allRequests.filter(req => req.status === 'pending');
    const activeEmployees = employees.filter(emp => emp.status === 'active');
    const totalSalary = activeEmployees.reduce((sum, emp) => sum + parseInt(emp.salary || '0'), 0);
    const pendingTasks = tasks.filter((task: any) => task.status === 'pending');
    const completedTasks = tasks.filter((task: any) => task.status === 'completed');
    
    return {
      totalRequests: allRequests.length,
      pendingRequests: pendingRequests.length,
      activeEmployees: activeEmployees.length,
      totalEmployees: employees.length,
      totalSalary,
      totalTasks: tasks.length,
      pendingTasks: pendingTasks.length,
      completedTasks: completedTasks.length,
      recentRequests: allRequests.slice(0, 5),
      recentTasks: tasks.slice(0, 5)
    };
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' F CFA';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  const getLeaveTypeLabel = (type: string) => {
    switch (type) {
      case 'conges_annuels': return 'Congés annuels';
      case 'conges_maladie': return 'Congés maladie';
      case 'conges_maternite': return 'Congés maternité';
      case 'conges_paternite': return 'Congés paternité';
      case 'conges_exceptionnels': return 'Congés exceptionnels';
      default: return type;
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <File className="h-4 w-4 text-red-500" />;
      case 'doc': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'xls': return <FileText className="h-4 w-4 text-green-500" />;
      case 'ppt': return <FileText className="h-4 w-4 text-orange-500" />;
      case 'image': return <File className="h-4 w-4 text-purple-500" />;
      default: return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDocumentCategoryLabel = (category: string) => {
    switch (category) {
      case 'contract': return 'Contrat';
      case 'report': return 'Rapport';
      case 'presentation': return 'Présentation';
      case 'financial': return 'Financier';
      case 'hr': return 'RH';
      case 'other': return 'Autre';
      default: return category;
    }
  };

  const getDocumentCategoryColor = (category: string) => {
    switch (category) {
      case 'contract': return 'bg-blue-100 text-blue-800';
      case 'report': return 'bg-green-100 text-green-800';
      case 'presentation': return 'bg-purple-100 text-purple-800';
      case 'financial': return 'bg-yellow-100 text-yellow-800';
      case 'hr': return 'bg-pink-100 text-pink-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Rendu du dashboard selon le rôle
  const renderEmployeeDashboard = () => {
    const stats = getEmployeeStats();
    if (!stats) return null;

    const userTasks = tasks.filter((task: any) => task.assignedTo === user?.email);
    const pendingTasks = userTasks.filter((task: any) => task.status === 'pending');
    const completedTasks = userTasks.filter((task: any) => task.status === 'completed');
    const recentDocuments = getRecentDocuments(3);

    return (
      <div className="space-y-6">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Total Demandes</h3>
                  <p className="text-3xl font-semibold text-gray-900">{stats.totalRequests}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Tâches En Cours</h3>
                  <p className="text-3xl font-semibold text-gray-900">{pendingTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Tâches Terminées</h3>
                  <p className="text-3xl font-semibold text-gray-900">{completedTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <File className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Mes Documents</h3>
                  <p className="text-3xl font-semibold text-gray-900">{documents.filter(doc => doc.uploadedBy === user?.email).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Métriques personnalisées selon le rôle */}
        <RoleBasedMetrics />

        {/* Test des notifications (temporaire) */}
        <div className="mb-6">
          <NotificationTest />
        </div>

        {/* Actions rapides et activités */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/employees" className="w-full">
                <Button className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Nouvelle Demande de Congés
                </Button>
              </Link>
              <Link to="/tasks" className="w-full">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Mes Tâches
                </Button>
              </Link>
              <Link to="/documents" className="w-full">
                <Button variant="outline" className="w-full justify-start">
                  <File className="h-4 w-4 mr-2" />
                  Mes Documents
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Tâches Récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userTasks.length > 0 ? (
                <div className="space-y-3">
                  {userTasks.slice(0, 3).map((task: any) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-gray-600">{task.description}</p>
                      </div>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status === 'completed' ? 'Terminé' : 'En cours'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Aucune tâche assignée</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <File className="h-5 w-5" />
                Documents Récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentDocuments.length > 0 ? (
                <div className="space-y-3">
                  {recentDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getDocumentTypeIcon(doc.type)}
                        <div>
                          <p className="font-medium text-sm">{doc.title}</p>
                          <p className="text-xs text-gray-600">{doc.size}</p>
                        </div>
                      </div>
                      <Badge className={getDocumentCategoryColor(doc.category)}>
                        {getDocumentCategoryLabel(doc.category)}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Aucun document récent</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderHRDashboard = () => {
    const stats = getHRStats();
    if (!stats) return null;

    const hrTasks = tasks.filter((task: any) => task.assignedTo === user?.email || task.category === 'hr');
    const pendingTasks = hrTasks.filter((task: any) => task.status === 'pending');
    const documentStats = getDocumentStats();
    const recentDocuments = getRecentDocuments(5);

    return (
      <div className="space-y-6">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Total Demandes</h3>
                  <p className="text-3xl font-semibold text-gray-900">{stats.totalRequests}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Tâches RH</h3>
                  <p className="text-3xl font-semibold text-gray-900">{pendingTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Employés Actifs</h3>
                  <p className="text-3xl font-semibold text-gray-900">{stats.activeEmployees}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <File className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Documents RH</h3>
                  <p className="text-3xl font-semibold text-gray-900">{documentStats.byCategory.hr || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides et activités */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/employees" className="w-full">
                <Button className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Gérer les Employés
                </Button>
              </Link>
              <Link to="/employees" className="w-full">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Valider les Congés
                </Button>
              </Link>
              <Link to="/documents" className="w-full">
                <Button variant="outline" className="w-full justify-start">
                  <File className="h-4 w-4 mr-2" />
                  Documents RH
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Demandes Récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentRequests.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{request.employee_name}</p>
                        <p className="text-sm text-gray-600">{getLeaveTypeLabel(request.leave_type)}</p>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusLabel(request.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Aucune demande récente</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <File className="h-5 w-5" />
                Documents RH
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentDocuments.filter(doc => doc.category === 'hr' || doc.category === 'contract').length > 0 ? (
                <div className="space-y-3">
                  {recentDocuments.filter(doc => doc.category === 'hr' || doc.category === 'contract').slice(0, 3).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getDocumentTypeIcon(doc.type)}
                        <div>
                          <p className="font-medium text-sm">{doc.title}</p>
                          <p className="text-xs text-gray-600">{doc.size}</p>
                        </div>
                      </div>
                      <Badge className={getDocumentCategoryColor(doc.category)}>
                        {getDocumentCategoryLabel(doc.category)}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Aucun document RH récent</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderAdminDashboard = () => {
    const stats = getAdminStats();
    if (!stats) return null;

    const documentStats = getDocumentStats();
    const recentDocuments = getRecentDocuments(5);

    return (
      <div className="space-y-6">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Employés Actifs</h3>
                  <p className="text-3xl font-semibold text-gray-900">{stats.activeEmployees}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Congés En Attente</h3>
                  <p className="text-3xl font-semibold text-gray-900">{stats.pendingRequests}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Tâches Complétées</h3>
                  <p className="text-3xl font-semibold text-gray-900">{stats.completedTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <File className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Total Documents</h3>
                  <p className="text-3xl font-semibold text-gray-900">{documentStats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contrôle de visibilité des salaires */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Contrôles Administrateur
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSalaryVisibility}
                className="flex items-center gap-2"
              >
                {isSalaryVisible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {isSalaryVisible ? 'Masquer Salaires' : 'Afficher Salaires'}
              </Button>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Actions rapides et activités récentes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/employees" className="w-full">
                <Button className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Gérer les Employés
                </Button>
              </Link>
              <Link to="/user-management" className="w-full">
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Gestion Utilisateurs
                </Button>
              </Link>
              <Link to="/tasks" className="w-full">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Gérer les Tâches
                </Button>
              </Link>
              <Link to="/documents" className="w-full">
                <Button variant="outline" className="w-full justify-start">
                  <File className="h-4 w-4 mr-2" />
                  Gérer les Documents
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activité Récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="requests" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="requests">Demandes</TabsTrigger>
                  <TabsTrigger value="tasks">Tâches</TabsTrigger>
                </TabsList>
                <TabsContent value="requests" className="mt-4">
                  {stats.recentRequests.length > 0 ? (
                    <div className="space-y-3">
                      {stats.recentRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{request.employee_name}</p>
                            <p className="text-sm text-gray-600">{getLeaveTypeLabel(request.leave_type)}</p>
                          </div>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusLabel(request.status)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">Aucune demande récente</p>
                  )}
                </TabsContent>
                <TabsContent value="tasks" className="mt-4">
                  {stats.recentTasks.length > 0 ? (
                    <div className="space-y-3">
                      {stats.recentTasks.map((task: any) => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-gray-600">{task.description}</p>
                          </div>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status === 'completed' ? 'Terminé' : 'En cours'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">Aucune tâche récente</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <File className="h-5 w-5" />
                Documents Récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentDocuments.length > 0 ? (
                <div className="space-y-3">
                  {recentDocuments.slice(0, 4).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getDocumentTypeIcon(doc.type)}
                        <div>
                          <p className="font-medium text-sm">{doc.title}</p>
                          <p className="text-xs text-gray-600">{doc.size}</p>
                        </div>
                      </div>
                      <Badge className={getDocumentCategoryColor(doc.category)}>
                        {getDocumentCategoryLabel(doc.category)}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Aucun document récent</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  if (employeesLoading || leaveLoading || tasksLoading || documentsLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de Bord
        </h1>
        <p className="text-gray-600">
          Bienvenue {user?.name || user?.email} ! 
          {user?.role === 'admin' && ' - Vue Administrateur'}
          {user?.role === 'hr' && ' - Vue Ressources Humaines'}
          {user?.role === 'employee' && ' - Vue Employé'}
        </p>
      </div>

      {/* Rendu conditionnel selon le rôle */}
      {user?.role === 'admin' && renderAdminDashboard()}
      {user?.role === 'hr' && renderHRDashboard()}
      {user?.role === 'employee' && renderEmployeeDashboard()}
    </div>
  );
}