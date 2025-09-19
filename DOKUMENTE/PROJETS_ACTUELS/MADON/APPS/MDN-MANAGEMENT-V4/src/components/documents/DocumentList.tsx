import React, { useState } from 'react';
import { Document, DocumentFilters } from '../../types/document';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { MultiSelect } from '../ui/MultiSelect';
import { FileUpload } from '../ui/FileUpload';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { FileText, Search, Download, Share2, Trash2, Eye } from 'lucide-react';
import { formatFileSize } from '../../lib/fileUtils';
import { formatDate } from '../../lib/dateUtils';
import { DocumentDialog } from './DocumentDialog';

interface DocumentListProps {
  documents: Document[];
  onUpload: (file: File) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  onDownload: (id: string) => void;
  onView: (id: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onUpload,
  onDelete,
  onShare,
  onDownload,
  onView
}) => {
  const [filters, setFilters] = useState<DocumentFilters>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleFilterChange = (key: keyof DocumentFilters, value: string | string[] | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredDocuments = documents.filter(doc => {
    if (filters.category && doc.category !== filters.category) return false;
    if (filters.search && !doc.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.tags && filters.tags.length > 0 && !filters.tags.some(tag => doc.tags.includes(tag))) return false;
    if (filters.is_public !== undefined && doc.is_public !== filters.is_public) return false;
    return true;
  });

  const handleFileUpload = (newFiles: File[]) => {
    setFiles(newFiles);
    if (newFiles.length > 0) {
      onUpload(newFiles[0]);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Documents</h2>
            <div className="flex space-x-2">
              <FileUpload files={files} onChange={handleFileUpload} />
              <Button onClick={() => setIsDialogOpen(true)}>
                <FileText className="w-4 h-4 mr-2" />
                Nouveau document
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Rechercher un document..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contrat">Contrats</SelectItem>
                <SelectItem value="facture">Factures</SelectItem>
                <SelectItem value="rapport">Rapports</SelectItem>
                <SelectItem value="presentation">Présentations</SelectItem>
                <SelectItem value="autre">Autres</SelectItem>
              </SelectContent>
            </Select>
            <MultiSelect
              options={Array.from(new Set(documents.flatMap(doc => doc.tags))).map(tag => ({
                value: tag,
                label: tag
              }))}
              value={filters.tags || []}
              onChange={(value) => handleFilterChange('tags', value)}
              placeholder="Tags"
            />
          </div>
        </div>

        <div className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">{document.title}</TableCell>
                  <TableCell>{document.category}</TableCell>
                  <TableCell>{formatFileSize(document.file_size)}</TableCell>
                  <TableCell>{formatDate(document.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {document.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(document.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownload(document.id)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onShare(document.id)}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(document.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <DocumentDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument}
        onSubmit={() => {
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
}; 