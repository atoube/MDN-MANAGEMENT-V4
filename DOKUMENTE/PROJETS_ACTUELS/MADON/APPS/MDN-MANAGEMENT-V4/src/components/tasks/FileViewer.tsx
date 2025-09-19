import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { File, Image, FileText, Download, Eye } from 'lucide-react';

interface FileViewerProps {
  files: string[];
  className?: string;
}

export function FileViewer({ files, className = '' }: FileViewerProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const getFileIcon = (filename: string) => {
    if (filename.includes('.pdf')) return <FileText className="h-4 w-4 text-red-500" />;
    if (filename.match(/\.(jpg|jpeg|png|gif)$/i)) return <Image className="h-4 w-4 text-blue-500" />;
    return <File className="h-4 w-4 text-gray-500" />;
  };

  const getFileType = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension || 'unknown';
  };

  const isViewableFile = (filename: string) => {
    const type = getFileType(filename);
    return ['pdf', 'jpg', 'jpeg', 'png', 'gif'].includes(type);
  };

  const handleDownload = (filename: string) => {
    // Créer un blob avec le contenu du fichier simulé
    const content = `Contenu simulé du fichier: ${filename}\n\nCeci est un fichier de démonstration.\nDans une vraie application, ce serait le vrai contenu du fichier.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenFile = (filename: string) => {
    // Créer un blob avec le contenu du fichier simulé
    const content = `Contenu simulé du fichier: ${filename}\n\nCeci est un fichier de démonstration.\nDans une vraie application, ce serait le vrai contenu du fichier.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Ouvrir dans un nouvel onglet
    window.open(url, '_blank');
    
    // Nettoyer l'URL après un délai
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const renderFilePreview = (filename: string) => {
    const type = getFileType(filename);
    const content = `Contenu simulé du fichier: ${filename}\n\nCeci est un fichier de démonstration.\nDans une vraie application, ce serait le vrai contenu du fichier.\n\nType de fichier: ${type.toUpperCase()}\nTaille: 2.5 KB\nDate de création: ${new Date().toLocaleDateString()}`;
    
    if (type === 'pdf') {
      return (
        <div className="w-full h-full bg-white border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b">
            <FileText className="h-6 w-6 text-red-500" />
            <div>
              <h3 className="font-semibold text-lg">Document PDF</h3>
              <p className="text-sm text-gray-500">{filename}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {content}
            </pre>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Dans une vraie application, ceci afficherait le contenu PDF réel.
            </p>
          </div>
        </div>
      );
    }
    
    if (['jpg', 'jpeg', 'png', 'gif'].includes(type)) {
      return (
        <div className="w-full h-full bg-white border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b">
            <Image className="h-6 w-6 text-blue-500" />
            <div>
              <h3 className="font-semibold text-lg">Image</h3>
              <p className="text-sm text-gray-500">{filename}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {content}
            </pre>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Dans une vraie application, ceci afficherait l'image réelle.
            </p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="w-full h-full bg-white border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b">
          <File className="h-6 w-6 text-gray-500" />
          <div>
            <h3 className="font-semibold text-lg">Fichier</h3>
            <p className="text-sm text-gray-500">{filename}</p>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {content}
          </pre>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> Dans une vraie application, ceci afficherait le contenu réel du fichier.
          </p>
        </div>
      </div>
    );
  };

  if (!files || files.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <File className="h-4 w-4" />
          <span className="font-medium">Fichiers attachés ({files.length})</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
            >
              {getFileIcon(file)}
              <span className="text-sm font-medium text-gray-900 truncate max-w-32">
                {file}
              </span>
              <div className="flex gap-1">
                {isViewableFile(file) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(file)}
                    className="h-6 w-6 p-0"
                    title="Visualiser"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenFile(file)}
                  className="h-6 w-6 p-0"
                  title="Ouvrir"
                >
                  <File className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(file)}
                  className="h-6 w-6 p-0"
                  title="Télécharger"
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de visualisation */}
      {selectedFile && (
        <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                {getFileIcon(selectedFile)}
                <div>
                  <span>Visualisation du fichier</span>
                  <DialogDescription className="mt-1">
                    {selectedFile} • {getFileType(selectedFile).toUpperCase()}
                    {isViewableFile(selectedFile) && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                        Visualisable
                      </span>
                    )}
                  </DialogDescription>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 h-[calc(90vh-200px)] min-h-[400px]">
              {renderFilePreview(selectedFile)}
            </div>
            <div className="mt-4 flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-500">
                {isViewableFile(selectedFile) ? (
                  <span>Fichier visualisable dans le navigateur</span>
                ) : (
                  <span>Fichier non visualisable - téléchargement requis</span>
                )}
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => handleDownload(selectedFile)}
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Télécharger</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedFile(null)}
                >
                  Fermer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
