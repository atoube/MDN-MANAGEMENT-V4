import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Calendar, Upload, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLeaveRequests } from '../../hooks/useLeaveRequests';
import { useEmployees } from '../../hooks/useEmployees';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { toast } from 'sonner';

interface CreateLeaveRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateLeaveRequestDialog({ isOpen, onClose }: CreateLeaveRequestDialogProps) {
  const { user } = useAuth();
  const { createLeaveRequest } = useLeaveRequests();
  const { employees } = useEmployees();
  const { notifySuccess, notifyError } = useNotificationContext();
  
  const [formData, setFormData] = useState({
    leave_type: 'congés_payés',
    start_date: '',
    end_date: '',
    reason: '',
    proof_documents: [] as File[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);

  // Récupérer les données complètes de l'employé connecté
  useEffect(() => {
    if (user?.email && employees.length > 0) {
      const employee = employees.find(emp => emp.email === user.email);
      if (employee) {
        console.log('Employé trouvé:', employee);
        setCurrentEmployee(employee);
      } else {
        console.log('Employé non trouvé pour:', user.email);
        console.log('Employés disponibles:', employees.map(emp => emp.email));
      }
    }
  }, [user?.email, employees]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.start_date || !formData.end_date || !formData.reason) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    
    if (startDate >= endDate) {
      toast.error('La date de fin doit être postérieure à la date de début');
      return;
    }

    // Calculer le nombre de jours (excluant les weekends)
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const workingDays = Math.ceil(daysDiff * 5 / 7); // Approximation des jours ouvrables

    setIsSubmitting(true);
    
    try {
      await createLeaveRequest({
        employee_id: currentEmployee?.id || user?.id || 0,
        employee_name: currentEmployee ? `${currentEmployee.first_name} ${currentEmployee.last_name}` : (user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : 'Inconnu'),
        employee_email: user?.email || '',
        request_date: new Date().toISOString(),
        leave_type: formData.leave_type as any,
        start_date: formData.start_date,
        end_date: formData.end_date,
        number_of_days: workingDays,
        reason: formData.reason,
        proof_documents: formData.proof_documents.map(file => file.name)
      });

      toast.success('Demande de congés créée avec succès');
      notifySuccess('Votre demande de congés a été soumise avec succès et est en attente de validation.', 'Demande de congés créée');
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast.error('Erreur lors de la création de la demande');
      notifyError('Une erreur est survenue lors de la création de votre demande de congés.', 'Erreur de création');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      leave_type: 'congés_payés',
      start_date: '',
      end_date: '',
      reason: '',
      proof_documents: []
    });
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      proof_documents: [...prev.proof_documents, ...files]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      proof_documents: prev.proof_documents.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Nouvelle Demande de Congés
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type de congés */}
          <div className="space-y-2">
            <Label htmlFor="leave_type">Type de congés *</Label>
            <Select
              value={formData.leave_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, leave_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="congés_payés">Congés Payés</SelectItem>
                <SelectItem value="congés_sans_solde">Congés Sans Solde</SelectItem>
                <SelectItem value="congés_maladie">Congés Maladie</SelectItem>
                <SelectItem value="repos_compensateur">Repos Compensateur</SelectItem>
                <SelectItem value="congés_exceptionnels">Congés Exceptionnels</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Date de début *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">Date de fin *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                min={formData.start_date || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Raison */}
          <div className="space-y-2">
            <Label htmlFor="reason">Motif de la demande *</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Décrivez le motif de votre demande de congés..."
              rows={4}
              required
            />
          </div>

          {/* Upload de documents */}
          <div className="space-y-2">
            <Label>Documents justificatifs (optionnel)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500">
                      Cliquez pour télécharger
                    </span>
                    <span className="text-gray-500"> ou glissez-déposez</span>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, Word, JPG, PNG jusqu'à 10MB
                </p>
              </div>
            </div>

            {/* Liste des fichiers */}
            {formData.proof_documents.length > 0 && (
              <div className="space-y-2">
                <Label>Fichiers sélectionnés:</Label>
                {formData.proof_documents.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Informations sur l'employé */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Informations employé</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Nom:</span> {currentEmployee ? `${currentEmployee.first_name} ${currentEmployee.last_name}` : (user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : 'Non spécifié')}
              </div>
              <div>
                <span className="text-blue-700">Email:</span> {user?.email || 'Non spécifié'}
              </div>
              <div>
                <span className="text-blue-700">Département:</span> {currentEmployee?.department || user?.department || 'Non spécifié'}
              </div>
              <div>
                <span className="text-blue-700">Fonction:</span> {currentEmployee?.position || user?.position || 'Non spécifiée'}
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Création...' : 'Créer la demande'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


