import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  FileText, 
  Eye, 
  Edit3, 
  Trash2, 
  Calendar, 
  User, 
  Tag, 
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Document } from '../../types/documentation';

interface DocumentListProps {
  documents: Document[];
  onDocumentSelect: (document: Document) => void;
}

export function DocumentList({ documents, onDocumentSelect }: DocumentListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'draft':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'archived':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document trouvé</h3>
          <p className="text-gray-500 mb-4">
            {documents.length === 0 
              ? 'Commencez par créer votre premier document ou sélectionnez un autre espace/dossier.'
              : 'Aucun document ne correspond aux critères de recherche.'
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <Card key={document.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <h3 
                    className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                    onClick={() => onDocumentSelect(document)}
                  >
                    {document.title}
                  </h3>
                  {document.is_template && (
                    <Badge variant="outline" className="text-xs">
                      Template
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {document.content_plain ? document.content_plain.substring(0, 200) + '...' : 'Aucun contenu disponible'}
                </p>
                
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge className={getStatusColor(document.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(document.status)}
                      <span className="capitalize">{document.status}</span>
                    </div>
                  </Badge>
                  
                  {document.priority && (
                    <Badge className={getPriorityColor(document.priority)}>
                      {document.priority}
                    </Badge>
                  )}
                  
                  <Badge variant="outline" className="text-xs">
                    v{document.version}
                  </Badge>
                  
                  {document.tags && document.tags.length > 0 && document.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{document.author_name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Créé le {formatDate(document.created_at)}</span>
                  </div>
                  
                  {document.updated_at !== document.created_at && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Modifié le {formatDate(document.updated_at)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{document.views_count || 0} vue(s)</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDocumentSelect(document)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Voir
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDocumentSelect(document)}
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Modifier
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
