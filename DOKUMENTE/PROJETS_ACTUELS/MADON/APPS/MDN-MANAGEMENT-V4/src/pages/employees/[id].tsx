import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { 
  CalendarDays, 
  Briefcase,
  FileText, 
  Settings,
  Mail,
  Phone,
  MapPin,
  Building2,
  Award,
  Camera,
  Clock,
  DollarSign,
  GraduationCap,
  Shield,
  Heart,
  Users,
  ChevronRight
} from 'lucide-react';
import { useEmployees } from '../../hooks/useEmployees';
import { AbsenceDialog } from '../../components/employees/AbsenceDialog';
import { CareerTracking } from '../../components/employees/CareerTracking';
import { AdministrativeManagement } from '../../components/employees/AdministrativeManagement';
import { EmployeeDashboard } from '../../components/employees/EmployeeDashboard';
import { OnboardingChecklist } from '../../components/employees/OnboardingChecklist';
import type { Absence } from '../../types';

export function EmployeeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const {
    employees,
    absences,
    isLoading,
    createAbsence
  } = useEmployees();

  const [isAbsenceDialogOpen, setIsAbsenceDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const employee = employees?.find(e => e.id === id);
  const employeeAbsences = absences?.filter(a => a.employee_id === id) || [];
  const approvedAbsences = employeeAbsences.filter(a => a.status === 'approved');
  const pendingAbsences = employeeAbsences.filter(a => a.status === 'pending');
  const rejectedAbsences = employeeAbsences.filter(a => a.status === 'rejected');

  const totalDaysOff = 25; // À configurer selon la politique de l'entreprise
  const usedDaysOff = approvedAbsences.reduce((total, absence) => {
    const start = new Date(absence.start_date);
    const end = new Date(absence.end_date);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return total + days;
  }, 0);
  const remainingDaysOff = totalDaysOff - usedDaysOff;

  const handleCreateAbsence = async (data: Omit<Absence, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      await createAbsence.mutateAsync({
        ...data,
        employee_id: id as string,
        status: 'pending'
      });
      setIsAbsenceDialogOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      console.error('Error creating absence:', error);
    }
  };

  if (isLoading || !employee) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-white p-1">
                <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-4xl font-medium text-gray-500">
                    {`${employee.first_name[0]}${employee.last_name[0]}`}
                  </span>
                </div>
              </div>
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-sm hover:bg-gray-50">
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {employee.first_name} {employee.last_name}
              </h1>
              <p className="mt-1 text-sm text-gray-500">{employee.position}</p>
            </div>
            <Button onClick={() => setIsAbsenceDialogOpen(true)}>
              <CalendarDays className="w-4 h-4 mr-2" />
              Demander un congé
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Informations personnelles</h2>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  {employee.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  {employee.phone || 'Non renseigné'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  {employee.addresses?.[0]?.full_address || 'Adresse non renseignée'}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Informations professionnelles</h2>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                  {employee.position}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                  {employee.department || 'Département non renseigné'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  Entré le {new Date(employee.hire_date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'XOF',
                    maximumFractionDigits: 0
                  }).format(employee.salary)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Compétences & Formation</h2>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                  {employee.education_level || 'Formation non renseignée'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Award className="h-4 w-4 mr-2 text-gray-400" />
                  {employee.skills?.length || 0} compétences
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                  {employee.certifications?.length || 0} certifications
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Statistiques des congés</h2>
              <Button variant="secondary" onClick={() => setIsAbsenceDialogOpen(true)}>
                <CalendarDays className="w-4 h-4 mr-2" />
                Nouvelle demande
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Total</div>
                <div className="text-2xl font-semibold text-blue-700">{totalDaysOff} jours</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Restants</div>
                <div className="text-2xl font-semibold text-green-700">{remainingDaysOff} jours</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-sm text-yellow-600 font-medium">Utilisés</div>
                <div className="text-2xl font-semibold text-yellow-700">{usedDaysOff} jours</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">En attente</h3>
              <div className="space-y-2">
                {pendingAbsences.map(absence => (
                  <div key={absence.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                    <div>
                      <p className="font-medium">
                        {absence.type === 'annual' ? 'Congés' : 
                         absence.type === 'sick' ? 'Maladie' : 
                         absence.type === 'other' ? 'Autre' : 'Inconnu'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(absence.start_date).toLocaleDateString()} - {new Date(absence.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="warning">En attente</Badge>
                  </div>
                ))}
              </div>
            </div>

            {approvedAbsences.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Approuvés</h3>
                <div className="space-y-2">
                  {approvedAbsences.map(absence => (
                    <div key={absence.id} className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <div>
                        <p className="font-medium">
                          {absence.type === 'annual' ? 'Congés' : 
                           absence.type === 'sick' ? 'Maladie' : 
                           absence.type === 'other' ? 'Autre' : 'Inconnu'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(absence.start_date).toLocaleDateString()} - {new Date(absence.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="success">Approuvé</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {rejectedAbsences.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Refusés</h3>
                <div className="space-y-2">
                  {rejectedAbsences.map(absence => (
                    <div key={absence.id} className="flex items-center justify-between p-3 bg-red-50 rounded">
                      <div>
                        <p className="font-medium">
                          {absence.type === 'annual' ? 'Congés' : 
                           absence.type === 'sick' ? 'Maladie' : 
                           absence.type === 'other' ? 'Autre' : 'Inconnu'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(absence.start_date).toLocaleDateString()} - {new Date(absence.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="danger">Refusé</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Actions rapides</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                  Voir le contrat
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-gray-400" />
                  Gérer les accès
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-gray-400" />
                  Gérer les avantages
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-400" />
                  Voir l'équipe
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="career" className="space-y-4">
        <TabsList>
          <TabsTrigger value="career">
            <Briefcase className="w-4 h-4 mr-2" />
            Carrière
          </TabsTrigger>
          <TabsTrigger value="administrative">
            <FileText className="w-4 h-4 mr-2" />
            Administratif
          </TabsTrigger>
          <TabsTrigger value="dashboard">
            <Settings className="w-4 h-4 mr-2" />
            Tableau de bord
          </TabsTrigger>
          <TabsTrigger value="onboarding">
            <Award className="w-4 h-4 mr-2" />
            Intégration
          </TabsTrigger>
        </TabsList>
        <TabsContent value="career">
          <CareerTracking employee={employee} isOpen={true} onClose={() => {}} onSubmit={() => {}} />
        </TabsContent>

        <TabsContent value="administrative">
          <AdministrativeManagement 
            employee={employee}
            onSubmit={() => {}}
          />
        </TabsContent>

        <TabsContent value="dashboard">
          <EmployeeDashboard employee={employee} />
        </TabsContent>

        <TabsContent value="onboarding">
          <OnboardingChecklist employee={employee} isOpen={true} onClose={() => {}} onSubmit={() => {}} />
        </TabsContent>
      </Tabs>

      <Card>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Historique des congés</h2>
        <div className="space-y-4">
          {employeeAbsences.length === 0 ? (
            <p className="text-gray-500">Aucun congé enregistré</p>
          ) : (
            <div className="space-y-4">
              {pendingAbsences.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">En attente</h3>
                  <div className="space-y-2">
                    {pendingAbsences.map(absence => (
                      <div key={absence.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                        <div>
                          <p className="font-medium">
                            {absence.type === 'annual' ? 'Congés' : 
                             absence.type === 'sick' ? 'Maladie' : 
                             absence.type === 'other' ? 'Autre' : 'Inconnu'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(absence.start_date).toLocaleDateString()} - {new Date(absence.end_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="warning">En attente</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {approvedAbsences.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Approuvés</h3>
                  <div className="space-y-2">
                    {approvedAbsences.map(absence => (
                      <div key={absence.id} className="flex items-center justify-between p-3 bg-green-50 rounded">
                        <div>
                          <p className="font-medium">
                            {absence.type === 'annual' ? 'Congés' : 
                             absence.type === 'sick' ? 'Maladie' : 
                             absence.type === 'other' ? 'Autre' : 'Inconnu'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(absence.start_date).toLocaleDateString()} - {new Date(absence.end_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="success">Approuvé</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {rejectedAbsences.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Refusés</h3>
                  <div className="space-y-2">
                    {rejectedAbsences.map(absence => (
                      <div key={absence.id} className="flex items-center justify-between p-3 bg-red-50 rounded">
                        <div>
                          <p className="font-medium">
                            {absence.type === 'annual' ? 'Congés' : 
                             absence.type === 'sick' ? 'Maladie' : 
                             absence.type === 'other' ? 'Autre' : 'Inconnu'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(absence.start_date).toLocaleDateString()} - {new Date(absence.end_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="danger">Refusé</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      <AbsenceDialog
        isOpen={isAbsenceDialogOpen}
        onClose={() => {
          setIsAbsenceDialogOpen(false);
          setError(null);
        }}
        onSubmit={(data) => handleCreateAbsence({ ...data, status: 'pending' })}
        employees={[employee]}
      />
    </div>
  );
} 