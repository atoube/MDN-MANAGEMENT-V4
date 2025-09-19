import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/Button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { useLeavePermissions } from '../../hooks/useLeavePermissions';
import { useNotificationContext } from '../../contexts/NotificationContext';

interface LeaveRequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: {
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
    employee: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      department: string;
      position: string;
    };
    proof_documents?: string[];
  } | null;
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string, reason: string) => void;
}

const formatDate = (date: string): string => {
  try {
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return date;
  }
};

const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: { 
      label: 'En attente', 
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    approved: { 
      label: 'Approuvée', 
      className: 'bg-green-100 text-green-800 border-green-200',
      icon: (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    rejected: { 
      label: 'Refusée', 
      className: 'bg-red-100 text-red-800 border-red-200',
      icon: (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  
  return (
    <Badge className={`${config.className} flex items-center`}>
      {config.icon}
      {config.label}
    </Badge>
  );
};

const getLeaveTypeLabel = (type: string) => {
  const typeLabels = {
    'congés_payés': 'Congés payés',
    'congés_sans_solde': 'Congés sans solde',
    'congés_maladie': 'Congés maladie',
    'repos_compensateur': 'Repos compensateur',
    'congés_exceptionnels': 'Congés exceptionnels',
    'congé payé': 'Congés payés',
    'maladie': 'Congés maladie',
    'vacances': 'Vacances'
  };
  
  return typeLabels[type as keyof typeof typeLabels] || type;
};

const DocumentViewer = ({ documents }: { documents: string[] }) => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return (
          <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return (
          <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
          </svg>
        );
      case 'doc':
      case 'docx':
        return (
          <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        );
    }
  };

  const getFileType = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension || 'unknown';
  };

  const isViewableFile = (filename: string) => {
    const extension = getFileType(filename);
    return ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
  };

  const handleDownload = (document: string) => {
    // Simulation du téléchargement
    toast.success(`Téléchargement de ${document}...`);
  };

  const handleView = (document: string) => {
    setSelectedDocument(document);
  };

  const renderDocumentPreview = (filename: string) => {
    const fileType = getFileType(filename);
    
    if (fileType === 'pdf') {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg relative">
          {/* Simulation d'un PDF */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-80 h-96 mx-auto mb-4 bg-white rounded-lg shadow-lg flex flex-col border-2 border-gray-200">
                {/* En-tête du PDF simulé */}
                <div className="bg-red-500 text-white p-3 rounded-t-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                    <span className="text-sm font-medium">PDF Document</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-white rounded-full opacity-60"></div>
                    <div className="w-3 h-3 bg-white rounded-full opacity-60"></div>
                    <div className="w-3 h-3 bg-white rounded-full opacity-60"></div>
                  </div>
                </div>
                
                {/* Contenu du PDF simulé */}
                <div className="flex-1 p-6 bg-white">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/5"></div>
                  </div>
                </div>
                
                {/* Pied de page du PDF simulé */}
                <div className="bg-gray-50 p-3 rounded-b-lg border-t">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Page 1 sur 1</span>
                    <span>{filename}</span>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">PDF Document</h3>
              <p className="text-gray-600 mb-4">{filename}</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Dans un environnement de production, le PDF serait affiché ici dans un iframe.
                </p>
                <p className="text-sm text-gray-500 font-mono bg-gray-200 px-2 py-1 rounded">
                  &lt;iframe src="/documents/{filename}" /&gt;
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileType)) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg relative">
          {/* Simulation d'une image réelle */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-64 h-64 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-300">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
                  </svg>
                  <p className="text-sm text-blue-600 font-medium">Aperçu de l'image</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Image</h3>
              <p className="text-gray-600 mb-4">{filename}</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Dans un environnement de production, l'image serait affichée ici.
                </p>
                <p className="text-sm text-gray-500 font-mono bg-gray-200 px-2 py-1 rounded">
                  &lt;img src="/documents/{filename}" alt="{filename}" /&gt;
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <svg className="w-20 h-20 mx-auto mb-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Fichier non visualisable</h3>
          <p className="text-gray-600 mb-4">{filename}</p>
          <p className="text-sm text-gray-500">
            Ce type de fichier ne peut pas être prévisualisé. Utilisez le bouton "Télécharger" pour l'ouvrir.
          </p>
        </div>
      </div>
    );
  };

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>Aucun document joint</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Documents joints ({documents.length})</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {documents.map((document, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                {getFileIcon(document)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {document}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getFileType(document).toUpperCase()} • {Math.floor(Math.random() * 1000) + 100} KB
                    {isViewableFile(document) && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                        Visualisable
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(document)}
                    className="text-xs"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Voir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(document)}
                    className="text-xs"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Télécharger
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de visualisation de document */}
      {selectedDocument && (
        <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                {getFileIcon(selectedDocument)}
                <div>
                  <span>Visualisation du document</span>
                  <DialogDescription className="mt-1">
                    {selectedDocument} • {getFileType(selectedDocument).toUpperCase()}
                    {isViewableFile(selectedDocument) && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                        Visualisable
                      </span>
                    )}
                  </DialogDescription>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 h-[calc(90vh-200px)] min-h-[400px]">
              {renderDocumentPreview(selectedDocument)}
            </div>
            <div className="mt-4 flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-500">
                {isViewableFile(selectedDocument) ? (
                  <span>Document visualisable dans le navigateur</span>
                ) : (
                  <span>Document non visualisable - téléchargement requis</span>
                )}
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => handleDownload(selectedDocument)}
                  className="flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Télécharger</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedDocument(null)}
                >
                  Fermer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export const LeaveRequestDetailsModal: React.FC<LeaveRequestDetailsModalProps> = ({
  isOpen,
  onClose,
  request,
  onApprove,
  onReject
}) => {
  const { user } = useAuth();
  const { canApproveRequest, canRejectRequest } = useLeavePermissions();
  const { notifySuccess, notifyError } = useNotificationContext();
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Vérifier si l'utilisateur peut approuver/rejeter selon les permissions
  const canApprove = request ? canApproveRequest(request.employee.email) : false;
  const canReject = request ? canRejectRequest(request.employee.email) : false;
  const isPending = request?.status === 'pending';

  const handleApprove = () => {
    if (request && onApprove) {
      onApprove(request.id);
      notifySuccess(`Demande de congés de ${request.employee.first_name} ${request.employee.last_name} approuvée avec succès.`, 'Demande approuvée');
      onClose();
    }
  };

  const handleReject = () => {
    if (request && onReject && rejectionReason.trim()) {
      onReject(request.id, rejectionReason.trim());
      notifySuccess(`Demande de congés de ${request.employee.first_name} ${request.employee.last_name} rejetée.`, 'Demande rejetée');
      setRejectionReason('');
      setShowRejectForm(false);
      onClose();
    }
  };

  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Détails de la demande de congés</span>
            {getStatusBadge(request.status)}
          </DialogTitle>
          <DialogDescription>
            Demande de congés de {request.employee.first_name} {request.employee.last_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations de l'employé */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations de l'employé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nom complet</label>
                  <p className="text-sm text-gray-900">
                    {request.employee.first_name} {request.employee.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm text-gray-900">{request.employee.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Département</label>
                  <p className="text-sm text-gray-900">{request.employee.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Poste</label>
                  <p className="text-sm text-gray-900">{request.employee.position}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Détails de la demande */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détails de la demande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Type de congé</label>
                  <p className="text-sm text-gray-900">{getLeaveTypeLabel(request.type)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre de jours</label>
                  <p className="text-sm text-gray-900">{request.total_days} jour(s)</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date de début</label>
                  <p className="text-sm text-gray-900">{formatDate(request.start_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date de fin</label>
                  <p className="text-sm text-gray-900">{formatDate(request.end_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date de demande</label>
                  <p className="text-sm text-gray-900">{formatDate(request.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Dernière mise à jour</label>
                  <p className="text-sm text-gray-900">{formatDate(request.updated_at)}</p>
                </div>
              </div>
              
              {request.reason && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Motif</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {request.reason}
                  </p>
                </div>
              )}

              {request.status === 'rejected' && request.rejection_reason && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Raison du rejet</label>
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    {request.rejection_reason}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents joints */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Documents joints</CardTitle>
              <CardDescription>
                Documents de justificatif fournis par l'employé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentViewer documents={request.proof_documents || []} />
            </CardContent>
          </Card>

          {/* Actions pour admin/RH */}
          {canApprove && isPending && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions d'approbation</CardTitle>
                <CardDescription>
                  En tant qu'administrateur ou responsable RH, vous pouvez approuver ou rejeter cette demande.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showRejectForm ? (
                  <div className="flex space-x-4">
                    <Button
                      onClick={handleApprove}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Approuver la demande
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowRejectForm(true)}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Rejeter la demande
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Raison du rejet *
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        rows={4}
                        placeholder="Veuillez indiquer la raison du rejet de cette demande..."
                      />
                    </div>
                    <div className="flex space-x-4">
                      <Button
                        onClick={handleReject}
                        disabled={!rejectionReason.trim()}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
                      >
                        Confirmer le rejet
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowRejectForm(false);
                          setRejectionReason('');
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
