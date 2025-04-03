import { useState, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { EmployeeDetailsFrame } from '../components/employees/EmployeeDetailsFrame';
import { 
  Users, 
  UserPlus, 
  DollarSign, 
  Search, 
  Mail,
  Phone,
  Clock,
  Award,
  CalendarDays,
  AlertCircle,
  Trash2,
  Download
} from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees';
import { EmployeeDialog } from '../components/employees/EmployeeDialog';
import { AbsenceDialog } from '../components/employees/AbsenceDialog';
import type { Employee, NewAbsence } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const ITEMS_PER_PAGE = 10;

export function Employees() {
  const { user } = useAuth();
  const {
    employees,
    absences,
    isLoading,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    createAbsence,
    updateAbsenceStatus
  } = useEmployees();

  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [isAbsenceDialogOpen, setIsAbsenceDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [isDetailsFrameOpen, setIsDetailsFrameOpen] = useState(false);

  const isAdmin = user?.email === 'narcomc@gmail.com';

  const filteredEmployees = useMemo(() => {
    return employees?.filter(employee => {
      const matchesSearch = 
        searchTerm === '' || 
        employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPosition = positionFilter === 'all' || employee.position === positionFilter;
      const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
      
      return matchesSearch && matchesPosition && matchesStatus;
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || [];
  }, [employees, searchTerm, positionFilter, statusFilter]);

  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEmployees, currentPage]);

  const totalPages = Math.ceil((filteredEmployees?.length || 0) / ITEMS_PER_PAGE);

  const activeEmployees = useMemo(() => 
    employees?.filter(e => e.status === 'active') || [], 
    [employees]
  );
  
  const stats = useMemo(() => {
    const totalEmployees = activeEmployees.length;
    const totalSalaries = activeEmployees.reduce((sum, e) => sum + e.salary, 0);
    const averageSalary = totalEmployees > 0 ? totalSalaries / totalEmployees : 0;
    
    const currentAbsences = absences?.filter(a => {
      const now = new Date();
      const startDate = new Date(a.start_date);
      const endDate = new Date(a.end_date);
      return startDate <= now && endDate >= now && a.status === 'approved';
    }).length || 0;

    const averageYearsOfService = activeEmployees.length > 0
      ? (activeEmployees.reduce((sum, emp) => {
          const hireDate = new Date(emp.hire_date);
          const now = new Date();
          const years = (now.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
          return sum + years;
        }, 0) / activeEmployees.length).toFixed(1)
      : '0';

    return {
      totalEmployees,
      averageSalary,
      currentAbsences,
      averageYearsOfService
    };
  }, [activeEmployees, absences]);

  const handleCreateEmployee = async (data: Omit<Employee, 'id' | 'created_at' | 'status'>) => {
    try {
      setError(null);
      console.log('Starting employee creation with data:', data);
      
      const result = await createEmployee.mutateAsync(data);
      console.log('Employee creation successful:', result);
      
      setIsEmployeeDialogOpen(false);
      toast.success('Employé créé avec succès');
    } catch (error) {
      console.error('Detailed error in handleCreateEmployee:', error);
      let errorMessage = 'Une erreur est survenue lors de la création de l\'employé';
      
      if (error instanceof Error) {
        if (error.message.includes('duplicate key')) {
          errorMessage = 'Un employé avec cet email existe déjà';
        } else if (error.message.includes('violates foreign key')) {
          errorMessage = 'Erreur de référence avec un autre enregistrement';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleUpdateEmployee = async (data: Omit<Employee, 'id' | 'created_at' | 'status'>) => {
    if (!selectedEmployee) return;

    try {
      setError(null);
      await updateEmployee.mutateAsync({
        id: selectedEmployee.id,
        ...data
      });
      setIsEmployeeDialogOpen(false);
      setSelectedEmployee(undefined);
      toast.success('Employé mis à jour avec succès');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      console.error('Error updating employee:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'employé');
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) return;
    
    try {
      setError(null);
      await deleteEmployee.mutateAsync(id);
      toast.success('Employé supprimé avec succès');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      console.error('Error deleting employee:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'employé');
    }
  };

  const handleCreateAbsence = async (data: NewAbsence) => {
    try {
      await createAbsence.mutateAsync(data);
      setIsAbsenceDialogOpen(false);
      toast.success('Demande d\'absence créée avec succès');
    } catch (error) {
      console.error('Error creating absence:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création de la demande d\'absence');
    }
  };

  const handleUpdateAbsenceStatus = async (absenceId: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      await updateAbsenceStatus.mutateAsync({ id: absenceId, status });
      toast.success(`Demande d'absence ${status === 'approved' ? 'approuvée' : 'refusée'}`);
    } catch (error) {
      console.error('Error updating absence status:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour du statut');
    }
  };

  const handleEmployeeUpdate = (data: Partial<Employee>) => {
    if (!selectedEmployee) return;
    updateEmployee.mutateAsync({
      id: selectedEmployee.id,
      ...data
    });
  };

  const handleAddAbsence = (data: NewAbsence) => {
    if (!selectedEmployee) return;
    createAbsence.mutateAsync({
      ...data,
      employee_id: selectedEmployee.id,
      status: 'pending'
    });
  };

  const handleExportEmployees = () => {
    const csvContent = [
      ['Prénom', 'Nom', 'Email', 'Téléphone', 'Poste', "Date d'entrée", 'Salaire', 'Statut'],
      ...filteredEmployees.map(e => [
        e.first_name,
        e.last_name,
        e.email,
        e.phone || '',
        e.position,
        new Date(e.hire_date).toLocaleDateString(),
        e.salary.toString(),
        e.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'employees.csv';
    link.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès non autorisé</h2>
          <p className="text-gray-500">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <AlertCircle className="h-5 w-5 cursor-pointer" onClick={() => setError(null)} />
          </span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Employés</h1>
          <p className="mt-1 text-sm text-gray-500">
            {stats.totalEmployees} employé{stats.totalEmployees > 1 ? 's' : ''} actif{stats.totalEmployees > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary"
            onClick={() => setIsAbsenceDialogOpen(true)}
          >
            <CalendarDays className="w-4 h-4 mr-2" />
            Nouvelle absence
          </Button>
          <Button 
            variant="secondary"
            onClick={handleExportEmployees}
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={() => setIsEmployeeDialogOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Nouvel employé
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total</h3>
              <p className="text-3xl font-semibold text-gray-900">{stats.totalEmployees}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Salaire moyen</h3>
              <p className="text-3xl font-semibold text-gray-900">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'XOF',
                  maximumFractionDigits: 0
                }).format(stats.averageSalary)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Absences</h3>
              <p className="text-3xl font-semibold text-gray-900">{stats.currentAbsences}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Ancienneté moy.</h3>
              <p className="text-3xl font-semibold text-gray-900">
                {stats.averageYearsOfService} ans
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                className="pl-10"
                placeholder="Rechercher un employé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              options={[
                { value: 'all', label: 'Tous les postes' },
                { value: 'director', label: 'Directeur' },
                { value: 'hr_officer', label: 'RH' },
                { value: 'accountant', label: 'Comptable' },
                { value: 'sales_rep', label: 'Commercial' },
                { value: 'stock_clerk', label: 'Magasinier' },
                { value: 'delivery_driver', label: 'Livreur' },
                { value: 'technician', label: 'Technicien' },
                { value: 'support_staff', label: 'Support' }
              ]}
              className="w-48"
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'Tous les statuts' },
                { value: 'active', label: 'Actif' },
                { value: 'inactive', label: 'Inactif' }
              ]}
              className="w-40"
            />
          </div>
        </div>

        <Table
          headers={[
            'Employé',
            'Contact',
            'Poste',
            'Date d\'entrée',
            'Salaire',
            'Statut',
            'Actions'
          ]}
        >
          {paginatedEmployees.map((employee) => (
            <tr key={employee.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setIsDetailsFrameOpen(true);
                    }}
                    className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    <span className="text-gray-500 font-medium">
                      {`${employee.first_name[0]}${employee.last_name[0]}`}
                    </span>
                  </button>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {`${employee.first_name} ${employee.last_name}`}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 flex flex-col space-y-1">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-1" />
                    {employee.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-1" />
                    {employee.phone || 'Non renseigné'}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {employee.position}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(employee.hire_date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'XOF',
                  maximumFractionDigits: 0
                }).format(employee.salary)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={employee.status === 'active' ? 'success' : 'warning'}>
                  {employee.status === 'active' ? 'Actif' : 'Inactif'}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setIsEmployeeDialogOpen(true);
                    }}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteEmployee(employee.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 px-6 py-3 border-t">
            <div className="text-sm text-gray-500">
              Affichage de {((currentPage - 1) * ITEMS_PER_PAGE) + 1} à {Math.min(currentPage * ITEMS_PER_PAGE, filteredEmployees.length)} sur {filteredEmployees.length} employés
            </div>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Demandes de congés en attente</h3>
          <Table
            headers={[
              'Employé',
              'Type',
              'Période',
              'Raison',
              'Statut',
              'Actions'
            ]}
          >
            {absences?.filter(a => a.status === 'pending').map((absence) => (
              <tr key={absence.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {employees?.find(e => e.id === absence.employee_id)?.first_name} {employees?.find(e => e.id === absence.employee_id)?.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {absence.type === 'annual' ? 'Congés' : 
                   absence.type === 'sick' ? 'Maladie' : 
                   absence.type === 'other' ? 'Autre' : 'Inconnu'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(absence.start_date).toLocaleDateString()} - {new Date(absence.end_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {absence.reason}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="warning">En attente</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleUpdateAbsenceStatus(absence.id, 'approved')}
                    >
                      Valider
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleUpdateAbsenceStatus(absence.id, 'rejected')}
                    >
                      Refuser
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </div>
      </Card>

      <EmployeeDialog
        isOpen={isEmployeeDialogOpen}
        onClose={() => {
          setIsEmployeeDialogOpen(false);
          setSelectedEmployee(undefined);
        }}
        onSubmit={selectedEmployee ? handleUpdateEmployee : handleCreateEmployee}
        employee={selectedEmployee}
      />

      <AbsenceDialog
        isOpen={isAbsenceDialogOpen}
        onClose={() => {
          setIsAbsenceDialogOpen(false);
        }}
        onSubmit={(data) => handleCreateAbsence({ ...data, status: 'pending' })}
        employees={employees || []}
      />

      {selectedEmployee && (
        <EmployeeDetailsFrame
          isOpen={isDetailsFrameOpen}
          onClose={() => {
            setIsDetailsFrameOpen(false);
            setSelectedEmployee(undefined);
          }}
          employee={selectedEmployee}
          onUpdate={handleEmployeeUpdate}
          onAddAbsence={(data) => handleAddAbsence({ ...data, status: 'pending' })}
          absences={absences?.filter(a => a.employee_id === selectedEmployee.id) || []}
        />
      )}
    </div>
  );
}