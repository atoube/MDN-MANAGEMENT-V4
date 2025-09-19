import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { 
  Tag, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  BarChart3
} from 'lucide-react';
import { useTags } from '../../hooks/useTags';
import { useAuth } from '../../contexts/AuthContext';

export function TagManager() {
  const { user } = useAuth();
  const {
    tags,
    createTag,
    updateTag,
    deleteTag,
    searchTags,
    getMostUsedTags,
    getRandomColor,
    predefinedColors
  } = useTags();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagDescription, setNewTagDescription] = useState('');
  const [newTagColor, setNewTagColor] = useState('');
  const [editTagName, setEditTagName] = useState('');
  const [editTagDescription, setEditTagDescription] = useState('');
  const [editTagColor, setEditTagColor] = useState('');

  const filteredTags = searchTags(searchQuery);
  const mostUsedTags = getMostUsedTags(10);

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;

    const tag = createTag({
      name: newTagName.trim(),
      color: newTagColor || getRandomColor(),
      description: newTagDescription.trim() || undefined
    });

    if (tag) {
      setIsCreating(false);
      setNewTagName('');
      setNewTagDescription('');
      setNewTagColor('');
    }
  };

  const handleEditTag = (tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    if (tag) {
      setEditingTag(tagId);
      setEditTagName(tag.name);
      setEditTagDescription(tag.description || '');
      setEditTagColor(tag.color);
    }
  };

  const handleSaveEdit = () => {
    if (!editingTag || !editTagName.trim()) return;

    updateTag(editingTag, {
      name: editTagName.trim(),
      description: editTagDescription.trim() || undefined,
      color: editTagColor
    });

    setEditingTag(null);
    setEditTagName('');
    setEditTagDescription('');
    setEditTagColor('');
  };

  const handleDeleteTag = (tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    if (tag && confirm(`Êtes-vous sûr de vouloir supprimer le tag "${tag.name}" ?`)) {
      deleteTag(tagId);
    }
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setEditTagName('');
    setEditTagDescription('');
    setEditTagColor('');
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setNewTagName('');
    setNewTagDescription('');
    setNewTagColor('');
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gestion des Tags</h2>
          <p className="text-gray-600">Organisez vos tâches avec des tags personnalisés</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Tag
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Tag className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total des tags</p>
                <p className="text-lg font-semibold">{tags.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tags utilisés</p>
                <p className="text-lg font-semibold">
                  {tags.filter(tag => tag.usageCount > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Tag className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Utilisations totales</p>
                <p className="text-lg font-semibold">
                  {tags.reduce((sum, tag) => sum + tag.usageCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Création de tag */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Créer un nouveau tag</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du tag *
              </label>
              <Input
                placeholder="Ex: Urgent, Bug, Feature..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Input
                placeholder="Description optionnelle du tag"
                value={newTagDescription}
                onChange={(e) => setNewTagDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Couleur
              </label>
              <div className="flex gap-2 flex-wrap">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewTagColor(color)}
                    className={`w-8 h-8 rounded border-2 ${color} ${
                      newTagColor === color ? 'border-gray-400' : 'border-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateTag} disabled={!newTagName.trim()}>
                Créer le tag
              </Button>
              <Button variant="outline" onClick={handleCancelCreate}>
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tags les plus utilisés */}
      {mostUsedTags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Tags les plus utilisés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mostUsedTags.map((tag, index) => (
                <div key={tag.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{index + 1}</Badge>
                    <Badge className={tag.color}>{tag.name}</Badge>
                    {tag.description && (
                      <span className="text-sm text-gray-600">{tag.description}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{tag.usageCount} utilisations</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditTag(tag.id)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTag(tag.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tous les tags ({filteredTags.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTags.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>Aucun tag trouvé</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTags.map((tag) => (
                <div key={tag.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  {editingTag === tag.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editTagName}
                        onChange={(e) => setEditTagName(e.target.value)}
                        className="text-sm"
                      />
                      <Input
                        value={editTagDescription}
                        onChange={(e) => setEditTagDescription(e.target.value)}
                        placeholder="Description"
                        className="text-sm"
                      />
                      <div className="flex gap-1">
                        {predefinedColors.slice(0, 5).map((color) => (
                          <button
                            key={color}
                            onClick={() => setEditTagColor(color)}
                            className={`w-6 h-6 rounded border-2 ${color} ${
                              editTagColor === color ? 'border-gray-400' : 'border-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          Sauvegarder
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={tag.color}>{tag.name}</Badge>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditTag(tag.id)}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteTag(tag.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {tag.description && (
                        <p className="text-sm text-gray-600">{tag.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{tag.usageCount} utilisations</span>
                        <span>Créé le {new Date(tag.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
