import React, { useState } from 'react';
import { Folder } from '../../types/document';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/Dialog';
import { Plus, ChevronRight, ChevronDown } from 'lucide-react';

interface DocumentExplorerProps {
  folders: Folder[];
  currentPath: string;
  onPathChange: (path: string) => void;
  onFolderCreate: (name: string) => void;
}

export const DocumentExplorer: React.FC<DocumentExplorerProps> = ({
  folders,
  currentPath,
  onPathChange,
  onFolderCreate
}) => {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/']));

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onFolderCreate(newFolderName.trim());
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolder = (folder: Folder, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isCurrent = currentPath === `${folder.path}${folder.name}/`;

    return (
      <div key={folder.id}>
        <div
          className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100 ${
            isCurrent ? 'bg-blue-50' : ''
          }`}
          style={{ paddingLeft: `${level * 16}px` }}
          onClick={() => onPathChange(`${folder.path}${folder.name}/`)}
        >
          <button
            className="mr-1"
            onClick={(e) => {
              e.stopPropagation();
              toggleFolder(folder.id);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span className="truncate">{folder.name}</span>
        </div>
        {isExpanded && folders
          .filter(f => f.parent_id === folder.id)
          .map(subFolder => renderFolder(subFolder, level + 1))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <Dialog open={isCreatingFolder} onOpenChange={setIsCreatingFolder}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau dossier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau dossier</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <Input
                placeholder="Nom du dossier"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateFolder();
                  }
                }}
              />
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => setIsCreatingFolder(false)}>
                  Annuler
                </Button>
                <Button className="ml-2" onClick={handleCreateFolder}>
                  Créer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex-1 overflow-auto p-2">
        <div
          className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100 ${
            currentPath === '/' ? 'bg-blue-50' : ''
          }`}
          onClick={() => onPathChange('/')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span>Racine</span>
        </div>
        {folders
          .filter(folder => !folder.parent_id)
          .map(folder => renderFolder(folder))}
      </div>
    </div>
  );
}; 