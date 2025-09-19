import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { MultiSelect } from '../ui/MultiSelect';
import { FileUpload } from '../ui/FileUpload';
import { Document, DocumentCategory } from '../../types/document';
import { Upload, FileText } from 'lucide-react';

interface DocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Document, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => void;
  document?: Document | null;
}

export const DocumentDialog: React.FC<DocumentDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  document
}) => {
  const [title, setTitle] = useState(document?.title || '');
  const [description, setDescription] = useState(document?.description || '');
  const [category, setCategory] = useState<DocumentCategory>(document?.category as DocumentCategory || 'autre');
  const [tags, setTags] = useState<string[]>(document?.tags || []);
  const [isPublic, setIsPublic] = useState(document?.is_public || false);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!title) newErrors.title = 'Le titre est requis';
    if (!file && !document) newErrors.file = 'Un fichier est requis';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      title,
      description,
      category,
      tags,
      is_public: isPublic,
      file_url: document?.file_url || '',
      file_type: file?.type || document?.file_type || '',
      file_size: file?.size || document?.file_size || 0,
      shared_with: document?.shared_with || []
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {document ? 'Modifier le document' : 'Nouveau document'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Catégorie</label>
              <Select value={category} onValueChange={(value: DocumentCategory) => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contrat">Contrat</SelectItem>
                  <SelectItem value="facture">Facture</SelectItem>
                  <SelectItem value="rapport">Rapport</SelectItem>
                  <SelectItem value="presentation">Présentation</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <MultiSelect
                options={[
                  { value: 'important', label: 'Important' },
                  { value: 'urgent', label: 'Urgent' },
                  { value: 'confidentiel', label: 'Confidentiel' }
                ]}
                value={tags}
                onChange={setTags}
                placeholder="Ajouter des tags"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fichier</label>
            <FileUpload onFileSelect={setFile}>
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                {file ? file.name : document ? 'Changer le fichier' : 'Sélectionner un fichier'}
              </Button>
            </FileUpload>
            {errors.file && (
              <p className="mt-1 text-sm text-red-500">{errors.file}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
              Document public
            </label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {document ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 