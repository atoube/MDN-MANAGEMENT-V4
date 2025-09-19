import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { 
  FileText, 
  Plus, 
  Search,
  Edit3,
  Trash2,
  Copy,
  Clock,
  Tag,
  CheckSquare,
  BarChart3,
  Eye,
  EyeOff
} from 'lucide-react';
import { useTaskTemplates } from '../../hooks/useTaskTemplates';
import { useAuth } from '../../contexts/AuthContext';

export function TemplateManager() {
  const { user } = useAuth();
  const {
    templates,
    categories,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    getTemplatesByCategory,
    getMostUsedTemplates,
    searchTemplates,
    getTemplateStats
  } = useTaskTemplates();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [showPublicOnly, setShowPublicOnly] = useState(false);

  // Formulaire de création/édition
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'development',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    estimatedHours: '',
    tags: [] as string[],
    checklist: [] as Array<{ id: string; text: string; completed: boolean }>,
    isPublic: true
  });

  const [newTag, setNewTag] = useState('');
  const [newChecklistItem, setNewChecklistItem] = useState('');

  const stats = getTemplateStats();
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

  const mostUsedTemplates = getMostUsedTemplates(5);

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

  const handleCreateTemplate = () => {
    if (!formData.name.trim()) return;

    const templateData = {
      ...formData,
      estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
      tags: formData.tags.filter(tag => tag.trim()),
      checklist: formData.checklist.filter(item => item.text.trim())
    };

    createTemplate(templateData);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      category: 'development',
      priority: 'medium',
      estimatedHours: '',
      tags: [],
      checklist: [],
      isPublic: true
    });
    setIsCreating(false);
  };

  const handleEditTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData({
        name: template.name,
        description: template.description,
        category: template.category,
        priority: template.priority,
        estimatedHours: template.estimatedHours?.toString() || '',
        tags: template.tags,
        checklist: template.checklist,
        isPublic: template.isPublic
      });
      setEditingTemplate(templateId);
      setIsCreating(true);
    }
  };

  const handleSaveEdit = () => {
    if (!editingTemplate || !formData.name.trim()) return;

    const updates = {
      ...formData,
      estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
      tags: formData.tags.filter(tag => tag.trim()),
      checklist: formData.checklist.filter(item => item.text.trim())
    };

    updateTemplate(editingTemplate, updates);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      category: 'development',
      priority: 'medium',
      estimatedHours: '',
      tags: [],
      checklist: [],
      isPublic: true
    });
    setEditingTemplate(null);
    setIsCreating(false);
  };

  const handleDeleteTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template && confirm(`Êtes-vous sûr de vouloir supprimer le template "${template.name}" ?`)) {
      deleteTemplate(templateId);
    }
  };

  const handleDuplicateTemplate = (templateId: string) => {
    duplicateTemplate(templateId);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setFormData(prev => ({
        ...prev,
        checklist: [...prev.checklist, {
          id: `check-${Date.now()}`,
          text: newChecklistItem.trim(),
          completed: false
        }]
      }));
      setNewChecklistItem('');
    }
  };

  const removeChecklistItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.filter(item => item.id !== itemId)
    }));
  };

  const cancelForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'development',
      priority: 'medium',
      estimatedHours: '',
      tags: [],
      checklist: [],
      isPublic: true
    });
    setEditingTemplate(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gestion des Templates</h2>
          <p className="text-gray-600">Créez et gérez vos templates de tâches réutilisables</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Template
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total templates</p>
                <p className="text-lg font-semibold">{stats.totalTemplates}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Templates publics</p>
                <p className="text-lg font-semibold">{stats.publicTemplates}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Utilisations totales</p>
                <p className="text-lg font-semibold">{stats.totalUsage}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Tag className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Catégories</p>
                <p className="text-lg font-semibold">{stats.categoriesUsed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates les plus utilisés */}
      {mostUsedTemplates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Templates les plus utilisés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mostUsedTemplates.map((template, index) => {
                const categoryInfo = getCategoryInfo(template.category);
                return (
                  <div key={template.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{index + 1}</Badge>
                      <div>
                        <div className="font-medium text-sm">{template.name}</div>
                        <div className="text-xs text-gray-500">
                          {categoryInfo.icon} {categoryInfo.name} • {template.checklist.length} étapes
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{template.usageCount} utilisations</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditTemplate(template.id)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDuplicateTemplate(template.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulaire de création/édition */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingTemplate ? 'Modifier le template' : 'Créer un nouveau template'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du template *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Développement de fonctionnalité"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description du template..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priorité
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Élevée</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heures estimées
                </label>
                <Input
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
                  placeholder="8"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                  Template public
                </label>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Ajouter un tag..."
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button onClick={addTag} disabled={!newTag.trim()}>
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Checklist */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Checklist
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  placeholder="Ajouter une étape..."
                  onKeyPress={(e) => e.key === 'Enter' && addChecklistItem()}
                />
                <Button onClick={addChecklistItem} disabled={!newChecklistItem.trim()}>
                  Ajouter
                </Button>
              </div>
              <div className="space-y-2">
                {formData.checklist.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <CheckSquare className="h-4 w-4 text-gray-400" />
                    <span className="flex-1 text-sm">{item.text}</span>
                    <button
                      onClick={() => removeChecklistItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={editingTemplate ? handleSaveEdit : handleCreateTemplate}>
                {editingTemplate ? 'Sauvegarder' : 'Créer le template'}
              </Button>
              <Button variant="outline" onClick={cancelForm}>
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
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
            <Button
              variant={showPublicOnly ? "default" : "outline"}
              onClick={() => setShowPublicOnly(!showPublicOnly)}
              className="flex items-center gap-2"
            >
              {showPublicOnly ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              Publics seulement
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des templates */}
      <Card>
        <CardHeader>
          <CardTitle>Tous les templates ({filteredTemplates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>Aucun template trouvé</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => {
                const categoryInfo = getCategoryInfo(template.category);
                
                return (
                  <div key={template.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{template.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={categoryInfo.color}>
                              {categoryInfo.icon} {categoryInfo.name}
                            </Badge>
                            <Badge className={getPriorityColor(template.priority)}>
                              {template.priority}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditTemplate(template.id)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDuplicateTemplate(template.id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                      
                      <div className="space-y-2">
                        {template.estimatedHours && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{template.estimatedHours}h estimées</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <CheckSquare className="h-3 w-3" />
                          <span>{template.checklist.length} étapes</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Tag className="h-3 w-3" />
                          <span>{template.tags.length} tags</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Utilisé {template.usageCount} fois</span>
                        <span>{new Date(template.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
