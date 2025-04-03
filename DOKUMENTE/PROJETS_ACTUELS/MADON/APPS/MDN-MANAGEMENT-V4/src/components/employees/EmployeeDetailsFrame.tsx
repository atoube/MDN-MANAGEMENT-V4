import React, { useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Calendar,
  DollarSign,
  GraduationCap,
  Briefcase,
  Languages,
  Heart
} from 'lucide-react';
import { CareerTracking } from './CareerTracking';
import { AdministrativeManagement } from './AdministrativeManagement';
import { AbsenceDialog } from './AbsenceDialog';
import { AbsenceList } from './AbsenceList';
import { Badge } from '../ui/Badge';
import type { Employee, Absence } from '../../types';

interface EmployeeDetailsFrameProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  onUpdate: (data: Partial<Employee>) => void;
  onAddAbsence: (data: Omit<Absence, 'id' | 'created_at' | 'updated_at' | 'status'>) => void;
  absences: Absence[];
}

export function EmployeeDetailsFrame({
  isOpen,
  onClose,
  employee,
  onUpdate,
  onAddAbsence,
  absences
}: EmployeeDetailsFrameProps) {
  const [activeTab, setActiveTab] = React.useState('career');
  const [isAbsenceDialogOpen, setIsAbsenceDialogOpen] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('career');
    }
  }, [isOpen]);

  const handleTabChange = (tab: 'career' | 'administrative' | 'absences') => {
    setActiveTab(tab);
  };

  const handleNewAbsence = () => {
    setIsAbsenceDialogOpen(true);
  };

  const handleAbsenceSubmit = (data: Omit<Absence, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    onAddAbsence(data);
    setIsAbsenceDialogOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-[100]"
    >
      <div 
        className="fixed inset-0 bg-black/30" 
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel 
          className="mx-auto max-w-6xl w-full h-[90vh] rounded-lg bg-white shadow-xl overflow-hidden flex flex-col"
        >
          <div className="h-48 bg-gradient-to-r from-blue-600 to-blue-400 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors cursor-pointer"
              type="button"
              aria-label="Fermer"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="absolute -bottom-16 left-6 flex items-end space-x-6">
              <div className="h-32 w-32 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-3xl font-semibold text-gray-700">
                  {`${employee.first_name[0]}${employee.last_name[0]}`}
                </span>
              </div>
              <div className="mb-14 text-white">
                <h2 className="text-2xl font-bold">{employee.first_name} {employee.last_name}</h2>
                <p className="text-blue-100">{employee.position}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="mt-20 p-6">
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="col-span-2 grid grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Informations de contact</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {employee.email}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {employee.phone || 'Non renseigné'}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {employee.addresses?.[0]?.full_address || 'Adresse non renseignée'}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Informations professionnelles</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Building2 className="h-4 w-4 mr-2" />
                        {employee.department || 'Département non renseigné'}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Entrée le {new Date(employee.hire_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'XOF',
                          maximumFractionDigits: 0
                        }).format(employee.salary)}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Formation</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        {employee.education_level || 'Niveau non renseigné'}
                      </div>
                      {employee.educations?.map((edu: { degree: string, institution: string }, index: number) => (
                        <div key={index} className="ml-6 text-sm text-gray-600">
                          {edu.degree} - {edu.institution}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Compétences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Compétences
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {employee.skills?.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center text-gray-600 mt-4">
                        <Languages className="h-4 w-4 mr-2" />
                        Langues
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {employee.languages?.map((lang: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Certifications</h3>
                    <div className="space-y-4">
                      {employee.certifications?.map((cert: { name: string; date: string; expiry_date?: string }, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span>{cert.name}</span>
                          <span className="text-gray-500">
                            ({new Date(cert.date).toLocaleDateString()}
                            {cert.expiry_date && ` - ${new Date(cert.expiry_date).toLocaleDateString()}`})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Contact d'urgence</h3>
                    <div className="space-y-3">
                      {employee.emergency_contact ? (
                        <>
                          <div className="flex items-center text-gray-600">
                            <Heart className="h-4 w-4 mr-2" />
                            {employee.emergency_contact.name}
                          </div>
                          <div className="ml-6 space-y-2 text-sm text-gray-600">
                            <div>{employee.emergency_contact?.relationship}</div>
                            <div>{employee.emergency_contact?.phone}</div>
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-500">Aucun contact d'urgence renseigné</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex space-x-4 mb-6">
                  {['career', 'administrative', 'absences'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => handleTabChange(tab as 'career' | 'administrative' | 'absences')}
                      className={`px-4 py-2 rounded-md transition-all duration-200 ${
                        activeTab === tab
                          ? 'bg-blue-100 text-blue-700 font-medium transform scale-105'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {tab === 'career' && 'Carrière'}
                      {tab === 'administrative' && 'Administratif'}
                      {tab === 'absences' && 'Congés'}
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  {activeTab === 'career' && (
                    <CareerTracking
                      isOpen={true}
                      onClose={() => handleTabChange('career')}
                      onSubmit={(data) => onUpdate(data)}
                      employee={employee}
                    />
                  )}
                  {activeTab === 'administrative' && (
                    <div className="p-6 bg-white rounded-lg">
                      <AdministrativeManagement
                        employee={employee}
                        onSubmit={(data) => onUpdate(data)}
                      />
                    </div>
                  )}
                  {activeTab === 'absences' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Gestion des congés</h3>
                        <button
                          onClick={handleNewAbsence}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Nouvelle demande
                        </button>
                      </div>
                      <AbsenceList absences={absences} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>

      <AbsenceDialog
        isOpen={isAbsenceDialogOpen}
        onClose={() => setIsAbsenceDialogOpen(false)}
        onSubmit={handleAbsenceSubmit}
        employees={[employee]}
      />
    </Dialog>
  );
} 