import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { toast } from 'react-hot-toast';
import { FileText, Upload, Trash2, Download } from 'lucide-react';

interface ProjectDocumentEditorProps {
  projectId: string;
}

interface Document {
  id: string;
  name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
  created_by: string;
  project_id: string;
}

export function ProjectDocumentEditor({ projectId }: ProjectDocumentEditorProps) {
  const queryClient = useQueryClient();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');

  const { data: documents, isLoading } = useQuery({
    queryKey: ['project-documents-editor', projectId],
    queryFn: async () => {
// Mock from call
// Mock select call
// Mock eq call
// Mock order call;

      // Removed error check - using mock data
      return data as Document[];
    }
  });

  const uploadDocument = useMutation({
    mutationFn: async (file: File) => {
            if (!user) throw new Error('Utilisateur non authentifié');

      // Upload du fichier
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${projectId}/${fileName}`;

      const { error: uploadError } = // Simulated storage call - using mock data
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Création de l'entrée dans la base de données
// Mock from call
        .insert([
          {
            name: documentName || file.name,
            file_path: filePath,
            file_type: file.type,
            file_size: file.size,
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
      queryClient.invalidateQueries({ queryKey: ['project-documents-editor', projectId] });
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
      setDocumentName('');
      toast.success('Document téléchargé avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors du téléchargement du document');
      console.error('Erreur téléchargement document:', error);
    }
  });

  const deleteDocument = useMutation({
    mutationFn: async (document: Document) => {
      // Suppression du fichier du stockage
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
      queryClient.invalidateQueries({ queryKey: ['project-documents-editor', projectId] });
      toast.success('Document supprimé avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression du document');
      console.error('Erreur suppression document:', error);
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!documentName) {
        setDocumentName(file.name);
      }
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedFile) {
      uploadDocument.mutate(selectedFile);
    }
  };

  const handleDelete = (document: Document) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      deleteDocument.mutate(document);
    }
  };

  const handleDownload = async (document: Document) => {
    const { data, error } = // Simulated storage call - using mock data
      .download(document.file_path);

    if (error) {
      toast.error('Erreur lors du téléchargement du document');
      console.error('Erreur téléchargement:', error);
      return;
    }

    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = document.name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Documents du projet</h2>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Télécharger un document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Télécharger un nouveau document</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Label htmlFor="document-name">Nom du document</Label>
                <Input
                  id="document-name"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Nom du document"
                  required
                />
              </div>
              <div>
                <Label htmlFor="document-file">Fichier</Label>
                <Input
                  id="document-file"
                  type="file"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <Button type="submit" disabled={!selectedFile}>
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
            <p className="text-gray-500">Aucun document n'a encore été téléchargé</p>
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
                      onClick={() => handleDelete(document)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Type: {document.file_type}
                </p>
                <p className="text-sm text-gray-500">
                  Taille: {(document.file_size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Téléchargé le {new Date(document.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}