import { useState, useEffect } from 'react';
import { DocumentEditor } from './DocumentEditor';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Document {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface DocumentTabProps {
  projectId: string;
}

export function DocumentTab({ projectId }: DocumentTabProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  useEffect(() => {
    loadDocuments();
  }, [projectId]);

  const loadDocuments = async () => {
    try {
      // Mock data pour les documents
      const data = [
        {
          id: '1',
          title: 'Spécifications techniques',
          content: 'Document contenant les spécifications techniques du projet...',
          created_at: '2024-03-01T10:00:00Z',
          updated_at: '2024-03-15T14:30:00Z'
        },
        {
          id: '2',
          title: 'Plan de développement',
          content: 'Plan détaillé du développement de l\'application...',
          created_at: '2024-03-05T09:00:00Z',
          updated_at: '2024-03-10T16:45:00Z'
        }
      ];

      setDocuments(data);
    } catch {
      toast.error('Erreur lors du chargement des documents');
    }
  };

  const handleCreateNew = () => {
    setSelectedDocument(null);
    setIsCreating(true);
  };

  const handleDocumentSaved = () => {
    setIsCreating(false);
    loadDocuments();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Documents</h2>
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau document
        </Button>
      </div>

      {isCreating && (
        <DocumentEditor
          projectId={projectId}
          onSave={handleDocumentSaved}
        />
      )}

      <div className="grid gap-4">
        {documents.map((document) => (
          <div
            key={document.id}
            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => setSelectedDocument(document)}
          >
            <h3 className="font-medium">{document.title}</h3>
            <p className="text-sm text-gray-500">
              Dernière modification: {new Date(document.updated_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {selectedDocument && (
        <DocumentEditor
          projectId={projectId}
          documentId={selectedDocument.id}
          initialContent={selectedDocument.content}
          onSave={handleDocumentSaved}
        />
      )}
    </div>
  );
} 