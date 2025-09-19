import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { X, Plus, FileText } from 'lucide-react';
import { Space, Folder } from '../../types/documentation';
import { RichTextEditor } from './RichTextEditor';

interface CreateDocumentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  spaces: Space[];
  folders: Folder[];
  selectedSpace: Space | null;
  selectedFolder: Folder | null;
}

const DOCUMENT_CATEGORIES = [
  'Documentation',
  'Procédure',
  'Guide',
  'Manuel',
  'Rapport',
  'Politique',
  'Formation',
  'Autre'
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Basse', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Moyenne', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'Haute', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-800' }
];

export function CreateDocumentDialog({ 
  open, 
  onClose, 
  onSubmit, 
  spaces, 
  folders, 
  selectedSpace, 
  selectedFolder 
}: CreateDocumentDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    space_id: selectedSpace?.id || '',
    folder_id: selectedFolder?.id || '',
    category: '',
    priority: 'medium',
    tags: [] as string[],
    is_template: false,
    template_type: ''
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre du document est requis';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Le contenu du document est requis';
    }
    
    if (!formData.space_id) {
      newErrors.space_id = 'Veuillez sélectionner un espace';
    }
    
    if (!formData.category) {
      newErrors.category = 'Veuillez sélectionner une catégorie';
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
      title: '',
      description: '',
      content: '',
      space_id: selectedSpace?.id || '',
      folder_id: selectedFolder?.id || '',
      category: '',
      priority: 'medium',
      tags: [],
      is_template: false,
      template_type: ''
    });
    setErrors({});
    setNewTag('');
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const filteredFolders = folders.filter(folder => 
    !formData.space_id || folder.space_id === formData.space_id
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Créer un nouveau document</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du document *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Guide d'utilisation de l'application"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brève description du document..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="space_id">Espace *</Label>
              <Select
                value={formData.space_id}
                onValueChange={(value) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    space_id: value,
                    folder_id: '' // Réinitialiser le dossier si l'espace change
                  }));
                }}
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
            
            <div className="space-y-2">
              <Label htmlFor="folder_id">Dossier (optionnel)</Label>
              <Select
                value={formData.folder_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, folder_id: value }))}
                disabled={!formData.space_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un dossier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun dossier</SelectItem>
                  {filteredFolders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_LEVELS.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center space-x-2">
                        <Badge className={priority.color}>
                          {priority.label}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ajouter un tag..."
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Contenu du document *</Label>
            <div className={errors.content ? 'border-red-500' : ''}>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Contenu du document... Utilisez les outils de formatage ci-dessus."
              />
            </div>
            {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
            <p className="text-xs text-gray-500">
              Utilisez les boutons de formatage pour créer un document riche et bien structuré.
            </p>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit">
              Créer le document
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
