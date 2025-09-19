import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { FolderOpen } from 'lucide-react';
import { Space } from '../../types/documentation';

interface CreateFolderDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  spaces: Space[];
  selectedSpace: Space | null;
}

export function CreateFolderDialog({ 
  open, 
  onClose, 
  onSubmit, 
  spaces, 
  selectedSpace 
}: CreateFolderDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    space_id: selectedSpace?.id || '',
    parent_folder_id: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du dossier est requis';
    }
    
    if (!formData.space_id) {
      newErrors.space_id = 'Veuillez sélectionner un espace';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      space_id: selectedSpace?.id || '',
      parent_folder_id: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FolderOpen className="w-5 h-5" />
            <span>Créer un nouveau dossier</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du dossier *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Guides utilisateur"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="space_id">Espace *</Label>
              <Select
                value={formData.space_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, space_id: value }))}
              >
                <SelectTrigger className={errors.space_id ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionner un espace" />
                </SelectTrigger>
                <SelectContent>
                  {spaces.map((space) => (
                    <SelectItem key={space.id} value={space.id}>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: space.color }}
                        />
                        <span>{space.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.space_id && <p className="text-sm text-red-500">{errors.space_id}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description du dossier (optionnel)..."
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit">
              Créer le dossier
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
