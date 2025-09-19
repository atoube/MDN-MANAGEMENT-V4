import React from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Upload, Search, Filter, Share2, Download, Trash2 } from 'lucide-react';
import { Document } from '../../types/document';

interface DocumentToolbarProps {
  onUpload: () => void;
  onSearch: (query: string) => void;
  onFilter: () => void;
  onShare: (documents: Document[]) => void;
  onDownload: (documents: Document[]) => void;
  onDelete: (documents: Document[]) => void;
  selectedDocuments: Document[];
}

export const DocumentToolbar: React.FC<DocumentToolbarProps> = ({
  onUpload,
  onSearch,
  onFilter,
  onShare,
  onDownload,
  onDelete,
  selectedDocuments
}) => {
  const hasSelection = selectedDocuments.length > 0;

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <Button onClick={onUpload}>
          <Upload className="w-4 h-4 mr-2" />
          Télécharger
        </Button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            className="pl-10 w-64"
            placeholder="Rechercher..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={onFilter}>
          <Filter className="w-4 h-4 mr-2" />
          Filtrer
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          onClick={() => onShare(selectedDocuments)}
          disabled={!hasSelection}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Partager
        </Button>
        <Button
          variant="outline"
          onClick={() => onDownload(selectedDocuments)}
          disabled={!hasSelection}
        >
          <Download className="w-4 h-4 mr-2" />
          Télécharger
        </Button>
        <Button
          variant="outline"
          onClick={() => onDelete(selectedDocuments)}
          disabled={!hasSelection}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Supprimer
        </Button>
      </div>
    </div>
  );
}; 