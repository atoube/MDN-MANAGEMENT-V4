import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { toast } from 'sonner';
import { FileText, Upload, Trash2, Download } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import { Textarea } from '@/components/ui/textarea';

interface ProjectDocumentsProps {
  projectId: string;
}

interface ProjectDocument {
  id: string;
  name: string;
  description: string | null;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
  created_by: string;
  project_id: string;
}

export function ProjectDocuments({ projectId }: ProjectDocumentsProps) {
  const queryClient = useQueryClient();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    name: '',
    description: '',
    file: null as File | null
  });

  const { data: documents, isLoading } = useQuery({
    queryKey: ['project-documents', projectId],
    queryFn: async () => {
// Mock from call
// Mock select call
// Mock eq call
// Mock order call;

      // Removed error check - using mock data
      return data as ProjectDocument[];
    }
  });

  const uploadDocument = useMutation({
    mutationFn: async () => {
            if (!user) throw new Error('Utilisateur non authentifié');

      if (!newDocument.file) throw new Error('Aucun fichier sélectionné');

      // Upload du fichier
      const fileExt = newDocument.file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${projectId}/${fileName}`;

      const { error: uploadError } = // Simulated storage call - using mock data
        .upload(filePath, newDocument.file);

      if (uploadError) throw uploadError;

      // Création de l'entrée dans la base de données
// Mock from call
        .insert([
          {
            name: newDocument.name || newDocument.file.name,
            description: newDocument.description,
            file_path: filePath,
            file_type: newDocument.file.type,
            file_size: newDocument.file.size,
            project_id: projectId,
            created_by: user.id
          }
        ])
        .select()
        .single();

      // Removed error check - using mock data
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-documents', projectId] });
      setIsUploadDialogOpen(false);
      setNewDocument({ name: '', description: '', file: null });
      toast.success('Document ajouté avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'ajout du document');
      console.error('Erreur upload:', error);
    }
  });

  const deleteDocument = useMutation({
    mutationFn: async (document: ProjectDocument) => {
      // Suppression du fichier du storage
      const { error: storageError } = // Simulated storage call - using mock data
        .remove([document.file_path]);

      if (storageError) throw storageError;

      // Suppression de l'entrée dans la base de données
// Mock from call
        .delete()
// Mock eq call;

      // Removed error check - using mock data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-documents', projectId] });
      toast.success('Document supprimé avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression du document');
      console.error('Erreur suppression:', error);
    }
  });

  const handleFileChange = (file: File | null) => {
    setNewDocument(prev => ({ ...prev, file }));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    await uploadDocument.mutateAsync();
  };

  const handleDownload = async (document: ProjectDocument) => {
    const { data, error } = // Simulated storage call - using mock data
      .download(document.file_path);

    if (error) {
      toast.error('Erreur lors du téléchargement du document');
      console.error('Erreur téléchargement:', error);
      return;
    }

    const url = URL.createObjectURL(data);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = document.name;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Documents du projet</h2>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Ajouter un document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un document</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Label htmlFor="document-name">Nom du document</Label>
                <Input
                  id="document-name"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom du document (optionnel)"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newDocument.description}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description du document (optionnel)"
                />
              </div>
              <div>
                <Label>Fichier</Label>
                <FileUpload
                  onFileChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                />
              </div>
              <Button type="submit" disabled={!newDocument.file}>
                Télécharger
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div>Chargement des documents...</div>
      ) : documents?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Aucun document n'a encore été ajouté</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents?.map((document) => (
            <Card key={document.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{document.name}</span>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(document)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteDocument.mutate(document)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {document.description && (
                    <p className="text-sm text-gray-500">{document.description}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Type: {document.file_type}
                  </p>
                  <p className="text-sm text-gray-500">
                    Taille: {formatFileSize(document.file_size)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Ajouté le {new Date(document.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 