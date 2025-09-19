import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import {
  Bold,
  Italic,
  Underline,
  Link2,
  Paperclip,
  Type,
  Palette,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/Tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';

interface DocumentEditorProps {
  projectId: string;
  documentId?: string;
  initialContent?: string;
  onSave?: () => void;
}

export function DocumentEditor({
  projectId,
  documentId,
  initialContent = '',
  onSave,
}: DocumentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  
  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleLink = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setSelectedText(selection.toString());
      setIsLinkModalOpen(true);
    } else {
      toast.error('Veuillez sélectionner du texte pour créer un lien');
    }
  };

  const insertLink = () => {
    if (linkUrl) {
      handleFormat('createLink', linkUrl);
      setIsLinkModalOpen(false);
      setLinkUrl('');
    }
  };

  const handleAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Simulated file upload - using mock data

        // Removed error check - using mock data

        // Simulated storage call - using mock data
        const publicUrl = "mock-url";

        const attachmentHtml = `<a href="${publicUrl}" target="_blank" class="attachment">${file.name}</a>`;
        handleFormat('insertHTML', attachmentHtml);
      } catch (error) {
        toast.error('Erreur lors du téléchargement du fichier');
      }
    }
  };

  const saveDocument = async () => {
    try {
      const documentData = {
        project_id: projectId,
        content: editorRef.current?.innerHTML || '',
        updated_at: new Date().toISOString(),
      };

      const { error } = documentId
// Mock from call
            .update(documentData)
// Mock eq call
// Mock from call
            .insert({ ...documentData, created_at: new Date().toISOString() });

      // Removed error check - using mock data

      toast.success('Document enregistré avec succès');
      onSave?.();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement du document');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-2 border rounded-lg bg-background">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleFormat('bold')}
              >
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Gras (Ctrl+B)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleFormat('italic')}
              >
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Italique (Ctrl+I)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleFormat('underline')}
              >
                <Underline className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Souligné (Ctrl+U)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLink}
              >
                <Link2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insérer un lien</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Joindre un fichier</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <input
          type="file"
          id="file-input"
          className="hidden"
          onChange={handleAttachment}
        />

        <div className="h-6 w-px bg-border mx-2" />

        <Select onValueChange={(value) => handleFormat('fontSize', value)}>
          <SelectTrigger className="w-24">
            <Type className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Taille" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Petit</SelectItem>
            <SelectItem value="3">Normal</SelectItem>
            <SelectItem value="5">Grand</SelectItem>
            <SelectItem value="7">Très grand</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleFormat('foreColor', value)}>
          <SelectTrigger className="w-24">
            <Palette className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Couleur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="black">Noir</SelectItem>
            <SelectItem value="red">Rouge</SelectItem>
            <SelectItem value="blue">Bleu</SelectItem>
            <SelectItem value="green">Vert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className="min-h-[200px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center">
          <div className="bg-card p-4 rounded-lg shadow-lg w-96 space-y-4">
            <h3 className="text-lg font-semibold">Insérer un lien</h3>
            <Input
              type="url"
              placeholder="https://exemple.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setIsLinkModalOpen(false)}
              >
                Annuler
              </Button>
              <Button onClick={insertLink}>Insérer</Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={saveDocument}>
          Enregistrer
        </Button>
      </div>
    </div>
  );
} 