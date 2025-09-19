import { useEffect, useState, useRef } from 'react';
import { Employee } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

interface EmployeeDetailsProps {
  employee: Employee;
  onClose: () => void;
}

interface AbsenceStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

// Ajoutons une image par défaut
const DEFAULT_AVATAR = '/assets/default-avatar.png'; // Assurez-vous d'avoir cette image dans votre dossier public

// Modifions la fonction uploadEmployeePhoto pour gérer les erreurs plus précisément
const uploadEmployeePhoto = async (employeeId: string, file: File) => {
  try {
    // Vérification supplémentaire du format
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Format de fichier non supporté. Utilisez JPG, PNG ou GIF.');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${employeeId}_${Date.now()}.${fileExt}`; // Ajout d'un timestamp pour éviter les conflits
    const filePath = `employee-photos/${fileName}`;

    // Compression de l'image avant upload si nécessaire
    let fileToUpload = file;
    if (file.size > 1024 * 1024) { // Si plus grand que 1MB
      // Ici vous pourriez ajouter une fonction de compression d'image
      toast.success('Compression de l\'image en cours...');
    }

    // Upload du fichier dans le bucket storage
    const { error: uploadError } = // Simulated storage call - using mock data
      .upload(filePath, fileToUpload, { 
        upsert: true,
        cacheControl: '3600',
        contentType: file.type
      });

    if (uploadError) throw uploadError;

    // Suppression de l'ancienne photo si elle existe
    const oldPhotoUrl = employee.photo_url;
    if (oldPhotoUrl) {
      // Simulated storage call - using mock data
        .remove([oldPhotoUrl]);
    }

    // Mise à jour de l'URL de la photo dans la table employees
// Mock from call
      .update({ photo_url: filePath })
// Mock eq call;

    if (updateError) throw updateError;

    return filePath;
  } catch (error) {
    console.error('Erreur upload:', error);
    throw error;
  }
};

// Ajoutons une interface pour les absences
interface EmployeeAbsence {
  id: string;
  start_date: string;
  end_date: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  created_at: string;
  total_days: number;
}

export const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employee, onClose }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'absences' | 'history'>('info');
  const [photoUrl, setPhotoUrl] = useState<string | null>(employee.photo_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Récupérer les statistiques d'absence
  const { data: absenceStats } = useQuery<AbsenceStats>({
    queryKey: ['absenceStats', employee.id],
    queryFn: async () => {
// Mock from call
// Mock select call
// Mock eq call;

      // Removed error check - using mock data

      return absences.reduce((acc, curr) => ({
        ...acc,
        total: acc.total + 1,
        [curr.status]: acc[curr.status] + 1
      }), { total: 0, approved: 0, pending: 0, rejected: 0 });
    }
  });

  // Dans le composant, ajoutons la requête pour récupérer les absences
  const { data: absences = [] } = useQuery<EmployeeAbsence[]>({
    queryKey: ['employeeAbsences', employee.id],
    queryFn: async () => {
// Mock from call
// Mock select call
// Mock eq call
// Mock order call;

      // Removed error check - using mock data
      return data;
    }
  });

  // Fonction pour gérer l'upload de photo
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérification du type et de la taille du fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB max
      toast.error('La taille de l\'image ne doit pas dépasser 5MB');
      return;
    }

    try {
      toast.loading('Upload en cours...');
      setIsUploading(true);
      const filePath = await uploadEmployeePhoto(employee.id, file);
      
      // Obtenir l'URL publique de la photo
      // Simulated storage call - using mock data
        const publicUrl = "mock-url";

      setPhotoUrl(publicUrl);
      toast.success('Photo mise à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'upload de la photo');
    } finally {
      setIsUploading(false);
    }
  };

  // Gestion de la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="relative group">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handlePhotoUpload}
                />
                <div className="relative w-20 h-20">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={`${employee.first_name} ${employee.last_name}`}
                      className="w-20 h-20 rounded-full object-cover cursor-pointer group-hover:opacity-80 transition-opacity"
                      onClick={() => fileInputRef.current?.click()}
                      onError={(e) => {
                        // En cas d'erreur de chargement, afficher l'image par défaut
                        (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                      }}
                    />
                  ) : (
                    <div 
                      className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-medium cursor-pointer group-hover:bg-indigo-200 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {employee.first_name[0]}{employee.last_name[0]}
                    </div>
                  )}
                  
                  {/* Overlay au survol */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black bg-opacity-50 rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Indicateur de chargement */}
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                    </div>
                  )}
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {employee.first_name} {employee.last_name}
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {employee.position}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      employee.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {employee.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Onglets */}
          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'info'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Informations
            </button>
            <button
              onClick={() => setActiveTab('absences')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'absences'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Absences
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'history'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Historique
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {activeTab === 'info' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900 font-medium">{employee.email}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="text-gray-900 font-medium">{employee.phone}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Département</p>
                    <p className="text-gray-900 font-medium">{employee.department}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Informations professionnelles</h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Date d'embauche</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(employee.hire_date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Salaire</p>
                    <p className="text-gray-900 font-medium">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'XOF',
                        minimumFractionDigits: 0
                      }).format(parseInt(employee.salary))}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Ancienneté</p>
                    <p className="text-gray-900 font-medium">
                      {Math.floor((new Date().getTime() - new Date(employee.hire_date).getTime()) / 
                        (1000 * 60 * 60 * 24 * 365))} ans
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'absences' && (
            <div className="space-y-6">
              {/* Statistiques */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-indigo-600">Total des absences</p>
                  <p className="text-2xl font-bold text-indigo-700">{absenceStats?.total || 0}</p>
                  <p className="text-xs text-indigo-500 mt-1">
                    {absenceStats?.total === 1 ? 'demande' : 'demandes'} au total
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Approuvées</p>
                  <p className="text-2xl font-bold text-green-700">{absenceStats?.approved || 0}</p>
                  <p className="text-xs text-green-500 mt-1">
                    {Math.round((absenceStats?.approved || 0) / (absenceStats?.total || 1) * 100)}% du total
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-600">En attente</p>
                  <p className="text-2xl font-bold text-yellow-700">{absenceStats?.pending || 0}</p>
                  <p className="text-xs text-yellow-500 mt-1">
                    à traiter
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-600">Refusées</p>
                  <p className="text-2xl font-bold text-red-700">{absenceStats?.rejected || 0}</p>
                  <p className="text-xs text-red-500 mt-1">
                    non approuvées
                  </p>
                </div>
              </div>

              {/* Liste des absences */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Historique des demandes</h3>
                <div className="bg-white rounded-lg border divide-y">
                  {absences.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      Aucune demande de congé enregistrée
                    </div>
                  ) : (
                    absences.map((absence) => (
                      <div key={absence.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-2 h-2 rounded-full ${
                              absence.status === 'approved' ? 'bg-green-500' :
                              absence.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                            <div>
                              <p className="font-medium text-gray-900">
                                {absence.type}
                              </p>
                              <p className="text-sm text-gray-500">
                                Du {new Date(absence.start_date).toLocaleDateString('fr-FR')} au{' '}
                                {new Date(absence.end_date).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              absence.status === 'approved' ? 'bg-green-100 text-green-800' :
                              absence.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {absence.status === 'approved' ? 'Approuvée' :
                               absence.status === 'pending' ? 'En attente' : 'Refusée'}
                            </span>
                            <p className="text-sm text-gray-500 mt-1">
                              {absence.total_days} jour{absence.total_days > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        {absence.rejection_reason && (
                          <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                            Motif du refus : {absence.rejection_reason}
                          </div>
                        )}
                        <div className="mt-2 text-xs text-gray-400">
                          Demande créée le {new Date(absence.created_at).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Graphique des absences par mois (à implémenter) */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Répartition des absences</h3>
                <div className="bg-white rounded-lg border p-4 h-64">
                  {/* Ici vous pourriez ajouter un graphique avec une bibliothèque comme recharts */}
                  <p className="text-center text-gray-500">Graphique à venir...</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <p className="text-gray-500 text-center">Historique des modifications à venir...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 