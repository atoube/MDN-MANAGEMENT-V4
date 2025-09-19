import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from '@/components/ui/Textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { toast } from 'sonner';
import { FileUpload } from '@/components/ui/file-upload';

interface Document {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  file_url: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface DocumentManagementProps {
  projectId: string;
}

export function DocumentManagement({ projectId }: DocumentManagementProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDocument, setNewDocument] = useState({
    name: '',
    description: '',
    file: null as File | null
  });

  useEffect(() => {
    fetchDocuments();
  }, [projectId]);

  const fetchDocuments = async () => {
    try {
      // Mock data
        const data = [];
        const error = null;
// Mock eq call
// Mock order call;

      // Removed error check - using mock data
      setDocuments(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
      toast.error('Erreur lors de la récupération des documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (file: File | null) => {
    setNewDocument(prev => ({ ...prev, file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocument.file) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }

    try {
            const fileExt = newDocument.file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${projectId}/${fileName}`;

      // Simulated upload - using mock data
        .upload(filePath, newDocument.file);

      if (uploadError) throw uploadError;

      // 2. Récupération de l'URL du fichier
      // Simulated storage call - using mock data
        const publicUrl = "mock-url";

      // 3. Création de l'entrée dans la table documents
      const { error: insertError } = await         // Mock insert operation{
          project_id: projectId,
          name: newDocument.name,
          description: newDocument.description,
          file_url: publicUrl
        });

      if (insertError) throw insertError;

      toast.success('Document ajouté avec succès');
      setNewDocument({ name: '', description: '', file: null });
      fetchDocuments();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du document:', error);
      toast.error('Erreur lors de l\'ajout du document');
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      const { error } = await         // Mock delete operation
// Mock eq call;

      // Removed error check - using mock data

      toast.success('Document supprimé avec succès');
      fetchDocuments();
    } catch (error) {
      console.error('Erreur lors de la suppression du document:', error);
      toast.error('Erreur lors de la suppression du document');
    }
  };

  if (loading) {
    return <div>Chargement des documents...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Documents du projet</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Ajouter un document</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau document</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Nom du document
                </label>
                <Input
                  id="name"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={newDocument.description}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Fichier
                </label>
                <FileUpload
                  onFileChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                />
              </div>
              <Button type="submit" className="w-full">
                Ajouter le document
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {documents.map((document) => (
          <div key={document.id} className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">{document.name}</h3>
              {document.description && (
                <p className="text-sm text-gray-500">{document.description}</p>
              )}
              <a
                href={document.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                Télécharger
              </a>
            </div>
            <Button
              variant="ghost"
              onClick={() => handleDelete(document.id)}
              className="text-red-500 hover:text-red-700"
            >
              Supprimer
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 