import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Switch } from '../ui/Switch';
import { Palette, Globe, Lock } from 'lucide-react';

interface CreateSpaceDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const SPACE_COLORS = [
  { name: 'Bleu', value: '#3B82F6' },
  { name: 'Vert', value: '#10B981' },
  { name: 'Violet', value: '#8B5CF6' },
  { name: 'Orange', value: '#F59E0B' },
  { name: 'Rouge', value: '#EF4444' },
  { name: 'Rose', value: '#EC4899' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Emeraude', value: '#059669' }
];

export function CreateSpaceDialog({ open, onClose, onSubmit }: CreateSpaceDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: '',
    color: '#3B82F6',
    is_public: true,
    default_permission: 'viewer'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de l\'espace est requis';
    }
    
    if (!formData.key.trim()) {
      newErrors.key = 'La clé de l\'espace est requise';
    } else if (!/^[a-z0-9-]+$/.test(formData.key)) {
      newErrors.key = 'La clé doit contenir uniquement des lettres minuscules, chiffres et tirets';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
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
      key: '',
      description: '',
      color: '#3B82F6',
      is_public: true,
      default_permission: 'viewer'
    });
    setErrors({});
    onClose();
  };

  const generateKey = () => {
    const key = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
    setFormData(prev => ({ ...prev, key }));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Créer un nouvel espace</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'espace *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Documentation Générale"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="key">Clé de l'espace *</Label>
              <div className="flex space-x-2">
                <Input
                  id="key"
                  value={formData.key}
                  onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                  placeholder="ex: general"
                  className={errors.key ? 'border-red-500' : ''}
                />
                <Button type="button" variant="outline" onClick={generateKey}>
                  Générer
                </Button>
              </div>
              {errors.key && <p className="text-sm text-red-500">{errors.key}</p>}
              <p className="text-xs text-gray-500">
                La clé sera utilisée dans l'URL de l'espace
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez le but et le contenu de cet espace..."
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Couleur de l'espace</Label>
              <div className="grid grid-cols-4 gap-2">
                {SPACE_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === color.value
                        ? 'border-gray-900 scale-110'
                        : 'border-gray-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="default_permission">Permission par défaut</Label>
              <Select
                value={formData.default_permission}
                onValueChange={(value) => setFormData(prev => ({ ...prev, default_permission: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Lecteur</SelectItem>
                  <SelectItem value="editor">Éditeur</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Permission accordée aux nouveaux membres
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is_public"
              checked={formData.is_public}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
            />
            <Label htmlFor="is_public" className="flex items-center space-x-2">
              {formData.is_public ? <Globe className="w-4 h-4 text-green-500" /> : <Lock className="w-4 h-4 text-red-500" />}
              <span>Espace public</span>
            </Label>
            <p className="text-xs text-gray-500">
              {formData.is_public 
                ? 'Tous les employés peuvent voir cet espace' 
                : 'Seuls les membres invités peuvent accéder'
              }
            </p>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit">
              Créer l'espace
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
