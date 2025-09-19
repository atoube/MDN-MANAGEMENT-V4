import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Upload, X, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface LeaveRequestFormProps {
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function LeaveRequestForm({ employeeId, employeeName, employeeEmail, onSubmit, onCancel }: LeaveRequestFormProps) {
  const [formData, setFormData] = useState({
    type: '',
    start_date: '',
    end_date: '',
    reason: '',
    proof_files: [] as File[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.start_date || !formData.end_date || !formData.reason) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      toast.error('La date de début ne peut pas être postérieure à la date de fin');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simuler l'upload des fichiers
      const uploadedFiles = await Promise.all(
        formData.proof_files.map(async (file) => {
          // Simuler l'upload - en réalité, vous enverriez le fichier au serveur
          return `uploaded_${Date.now()}_${file.name}`;
        })
      );

      const requestData = {
        employee_id: employeeId,
        employee_name: employeeName,
        employee_email: employeeEmail,
        type: formData.type as 'annual' | 'sick' | 'other',
        start_date: formData.start_date,
        end_date: formData.end_date,
        reason: formData.reason,
        proof_files: uploadedFiles
      };

      onSubmit(requestData);
      toast.success('Demande de congé soumise avec succès');
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast.error('Erreur lors de la soumission de la demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      proof_files: [...prev.proof_files, ...files]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      proof_files: prev.proof_files.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Informations de l'employé</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Nom:</span>
            <p className="text-gray-900">{employeeName}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Email:</span>
            <p className="text-gray-900">{employeeEmail}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type de congé *</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type de congé" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="annual">Congés annuels</SelectItem>
              <SelectItem value="sick">Congés maladie</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="duration">Durée</Label>
          <Input
            id="duration"
            type="text"
            value={
              formData.start_date && formData.end_date
                ? `${Math.ceil((new Date(formData.end_date).getTime() - new Date(formData.start_date).getTime()) / (1000 * 60 * 60 * 24))} jours`
                : ''
            }
            disabled
            className="bg-gray-50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Raison du congé *</Label>
        <Textarea
          id="reason"
          value={formData.reason}
          onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
          placeholder="Décrivez la raison de votre demande de congé..."
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Justificatifs (optionnel)</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button type="button" variant="outline" className="cursor-pointer">
                Sélectionner des fichiers
              </Button>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Formats acceptés: PDF, DOC, DOCX, JPG, JPEG, PNG (max 5MB par fichier)
          </p>
        </div>
      </div>

      {formData.proof_files.length > 0 && (
        <div className="space-y-2">
          <Label>Fichiers sélectionnés</Label>
          <div className="space-y-2">
            {formData.proof_files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Soumission...' : 'Soumettre la demande'}
        </Button>
      </div>
    </form>
  );
} 