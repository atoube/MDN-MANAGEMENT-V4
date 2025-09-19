import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Card, CardContent } from '../ui/Card';
import { 
  FileText, 
  Plus, 
  Search,
  Clock,
  Tag,
  CheckSquare,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { useTaskTemplates } from '../../hooks/useTaskTemplates';
import { useAuth } from '../../contexts/AuthContext';

interface TemplateSelectorProps {
  onTemplateSelect: (template: any) => void;
  onClose: () => void;
}

export function TemplateSelector({ onTemplateSelect, onClose }: TemplateSelectorProps) {
  const { user } = useAuth();
  const {
    templates,
    categories,
    getTemplatesByCategory,
    getMostUsedTemplates,
    searchTemplates,
    duplicateTemplate,
    useTemplate
  } = useTaskTemplates();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPublicOnly, setShowPublicOnly] = useState(false);

  const filteredTemplates = React.useMemo(() => {
    let filtered = searchQuery ? searchTemplates(searchQuery) : templates;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }
    
    if (showPublicOnly) {
      filtered = filtered.filter(template => template.isPublic);
    }
    
    return filtered;
  }, [templates, searchQuery, selectedCategory, showPublicOnly, searchTemplates]);

  const handleTemplateSelect = (template: any) => {
    useTemplate(template.id);
    onTemplateSelect(template);
    onClose();
  };

  const handleDuplicate = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateTemplate(templateId);
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || {
      name: 'Autre',
      color: 'bg-gray-100 text-gray-800',
      icon: '📁'
    };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* En-tête */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Sélectionner un Template</h2>
              <p className="text-gray-600">Choisissez un template pour créer rapidement une nouvelle tâche</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>

        {/* Filtres */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un template..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Catégorie */}
            <div className="lg:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre public */}
            <Button
              variant={showPublicOnly ? "default" : "outline"}
              onClick={() => setShowPublicOnly(!showPublicOnly)}
              className="flex items-center gap-2"
            >
              {showPublicOnly ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              Publics seulement
            </Button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Aucun template trouvé</p>
              <p className="text-sm text-gray-400">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => {
                const categoryInfo = getCategoryInfo(template.category);
                
                return (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* En-tête */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 line-clamp-2">
                              {template.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={categoryInfo.color}>
                                {categoryInfo.icon} {categoryInfo.name}
                              </Badge>
                              <Badge className={getPriorityColor(template.priority)}>
                                {template.priority}
                              </Badge>
                            </div>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleDuplicate(template.id, e)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {template.description}
                        </p>

                        {/* Métadonnées */}
                        <div className="space-y-2">
                          {template.estimatedHours && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{template.estimatedHours}h estimées</span>
                            </div>
                          )}

                          {template.tags.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Tag className="h-3 w-3" />
                              <span>{template.tags.length} tag{template.tags.length > 1 ? 's' : ''}</span>
                            </div>
                          )}

                          {template.checklist.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <CheckSquare className="h-3 w-3" />
                              <span>{template.checklist.length} étape{template.checklist.length > 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        {template.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {template.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {template.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{template.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Statistiques */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="text-xs text-gray-500">
                            Utilisé {template.usageCount} fois
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(template.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Pied de page */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {filteredTemplates.length} template{filteredTemplates.length > 1 ? 's' : ''} trouvé{filteredTemplates.length > 1 ? 's' : ''}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
