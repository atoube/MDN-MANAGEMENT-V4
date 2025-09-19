import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '../ui/Dialog';
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
import { Button } from '../ui/Button';
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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleTabChange = (tab: 'career' | 'administrative' | 'absences') => {
    setActiveTab(tab);
  };

  const handleNewAbsence = () => {
    const remainingDays = 30 - absences.filter(a => a.status === 'approved').reduce((acc, curr) => {
      const start = new Date(curr.start_date);
      const end = new Date(curr.end_date);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return acc + days;
    }, 0);

    if (remainingDays <= 0) {
      // Ajouter un toast ou une alerte
      alert("Vous n'avez plus de jours de congés disponibles");
      return;
    }
    setIsAbsenceDialogOpen(true);
  };

  const handleAbsenceSubmit = (data: Omit<Absence, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    onAddAbsence(data);
    setIsAbsenceDialogOpen(false);
  };

  return (
    <div className="relative z-50">
      {isOpen && (
        <>
          {/* Overlay avec backdrop blur */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm" 
        aria-hidden="true"
            onClick={onClose}
      />

          {/* Container principal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
            {/* Frame principal */}
            <div className="relative w-full max-w-6xl bg-white rounded-lg shadow-xl">
              {/* En-tête avec gradient */}
              <div className="h-48 bg-gradient-to-r from-blue-600 to-blue-400 relative rounded-t-lg">
                {/* Bouton de fermeture */}
            <button
              onClick={onClose}
                  className="absolute top-4 right-4 px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
                  <span className="mr-2">Fermer</span>
                  <X className="h-5 w-5 inline-block" />
            </button>

                {/* Info employé */}
                <div className="absolute bottom-0 left-6 transform translate-y-1/2 flex items-end space-x-6">
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

              {/* Contenu principal avec scroll */}
              <div className="h-[calc(90vh-12rem)] overflow-y-auto p-6 mt-16">
                {/* Navigation des onglets */}
                <nav className="flex space-x-4 mb-6 sticky top-0 bg-white py-4 border-b">
                  <button
                    onClick={() => setActiveTab('career')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'career' 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    Carrière
                  </button>
                  <button
                    onClick={() => setActiveTab('administrative')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'administrative' 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    Administratif
                  </button>
                    <button
                    onClick={() => setActiveTab('absences')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'absences' 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    Congés
                    </button>
                </nav>

                {/* Contenu des onglets */}
                <div className="mt-6">
                  {activeTab === 'career' && (
                    <CareerTracking
                      employee={employee}
                      onSubmit={onUpdate}
                      isOpen={true}
                      onClose={() => setActiveTab('career')}
                    />
                  )}

                  {activeTab === 'administrative' && (
                      <AdministrativeManagement
                        employee={employee}
                      onSubmit={onUpdate}
                      />
                  )}

                  {activeTab === 'absences' && (
                    <div className="space-y-6">
                      {/* En-tête des congés */}
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Gestion des congés</h3>
                        <button
                          onClick={handleNewAbsence}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Nouvelle demande
                        </button>
                      </div>

                      {/* Résumé des congés */}
                      <div className="bg-white rounded-lg border p-6">
                        <div className="grid grid-cols-3 gap-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">30</div>
                            <div className="text-sm text-gray-500">Jours annuels</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              {absences.filter(a => a.status === 'approved').reduce((acc, curr) => {
                                const start = new Date(curr.start_date);
                                const end = new Date(curr.end_date);
                                const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                                return acc + days;
                              }, 0)}
                            </div>
                            <div className="text-sm text-gray-500">Jours pris</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {30 - absences.filter(a => a.status === 'approved').reduce((acc, curr) => {
                                const start = new Date(curr.start_date);
                                const end = new Date(curr.end_date);
                                const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                                return acc + days;
                              }, 0)}
                            </div>
                            <div className="text-sm text-gray-500">Jours restants</div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600 transition-all duration-300"
                              style={{
                                width: `${(absences.filter(a => a.status === 'approved').reduce((acc, curr) => {
                                  const start = new Date(curr.start_date);
                                  const end = new Date(curr.end_date);
                                  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                                  return acc + days;
                                }, 0) / 30) * 100}%`
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0 jours</span>
                            <span>30 jours</span>
                          </div>
                        </div>
                      </div>

                      {/* Liste des absences */}
                      <AbsenceList absences={absences} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Dialog pour nouvelle absence */}
      <AbsenceDialog
        isOpen={isAbsenceDialogOpen}
        onClose={() => setIsAbsenceDialogOpen(false)}
        onSubmit={handleAbsenceSubmit}
        employees={[employee]}
      />
    </div>
  );
} 