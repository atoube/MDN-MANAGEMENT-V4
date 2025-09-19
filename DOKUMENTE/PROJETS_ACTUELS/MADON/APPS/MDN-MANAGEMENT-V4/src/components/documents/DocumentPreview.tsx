import React from 'react';
import { Document } from '../../types/document';
import { Button } from '../ui/Button';
import { Download, Eye, FileText, Image, File } from 'lucide-react';

interface DocumentPreviewProps {
  document: Document;
  onDownload: (document: Document) => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  onDownload
}) => {
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="w-12 h-12 text-blue-500" />;
    }
    if (type === 'application/pdf') {
      return <FileText className="w-12 h-12 text-red-500" />;
    }
    return <File className="w-12 h-12 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getFileIcon(document.type)}
          <div>
            <h3 className="font-medium">{document.name}</h3>
            <p className="text-sm text-gray-500">
              {formatFileSize(document.size)} • {document.type}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload(document)}
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(document.path, '_blank')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Voir
          </Button>
        </div>
      </div>
      
      {document.type.startsWith('image/') && (
        <div className="mt-4">
          <img
            src={document.path}
            alt={document.name}
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Créé le : {new Date(document.created_at).toLocaleDateString()}</p>
        <p>Modifié le : {new Date(document.updated_at).toLocaleDateString()}</p>
        {document.tags && document.tags.length > 0 && (
          <div className="mt-2">
            <span className="font-medium">Tags : </span>
            {document.tags.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}; 