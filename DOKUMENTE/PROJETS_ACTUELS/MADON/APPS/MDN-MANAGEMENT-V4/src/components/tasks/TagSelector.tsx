import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { 
  Tag, 
  Plus, 
  X, 
  Search,
  Edit3,
  Trash2
} from 'lucide-react';
import { useTags } from '../../hooks/useTags';
import { useAuth } from '../../contexts/AuthContext';

interface TagSelectorProps {
  taskId: string;
  selectedTags: any[];
  onTagsChange: (tags: any[]) => void;
  compact?: boolean;
  showCreate?: boolean;
}

export function TagSelector({ 
  taskId, 
  selectedTags, 
  onTagsChange, 
  compact = false,
  showCreate = true 
}: TagSelectorProps) {
  const { user } = useAuth();
  const {
    tags,
    createTag,
    addTagToTask,
    removeTagFromTask,
    getTaskTags,
    searchTags,
    getRandomColor
  } = useTags();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('');
  const [newTagDescription, setNewTagDescription] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setIsCreating(false);
        setNewTagName('');
        setNewTagDescription('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialiser la couleur aléatoire
  useEffect(() => {
    if (isCreating && !newTagColor) {
      setNewTagColor(getRandomColor());
    }
  }, [isCreating, newTagColor, getRandomColor]);

  const filteredTags = searchTags(searchQuery);
  const availableTags = filteredTags.filter(tag => 
    !selectedTags.some(selectedTag => selectedTag.id === tag.id)
  );

  const handleTagSelect = (tag: any) => {
    addTagToTask(taskId, tag.id);
    onTagsChange([...selectedTags, tag]);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleTagRemove = (tagId: string) => {
    removeTagFromTask(taskId, tagId);
    onTagsChange(selectedTags.filter(tag => tag.id !== tagId));
  };

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;

    const newTag = createTag({
      name: newTagName.trim(),
      color: newTagColor,
      description: newTagDescription.trim() || undefined
    });

    if (newTag) {
      addTagToTask(taskId, newTag.id);
      onTagsChange([...selectedTags, newTag]);
      setIsCreating(false);
      setNewTagName('');
      setNewTagDescription('');
      setNewTagColor('');
      setIsOpen(false);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1 flex-wrap">
        {selectedTags.map((tag) => (
          <Badge
            key={tag.id}
            className={`${tag.color} text-xs cursor-pointer hover:opacity-80`}
            onClick={() => handleTagRemove(tag.id)}
          >
            {tag.name}
            <X className="h-3 w-3 ml-1" />
          </Badge>
        ))}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsOpen(true)}
          className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Tags sélectionnés */}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        {selectedTags.map((tag) => (
          <Badge
            key={tag.id}
            className={`${tag.color} text-sm cursor-pointer hover:opacity-80`}
            onClick={() => handleTagRemove(tag.id)}
          >
            {tag.name}
            <X className="h-3 w-3 ml-1" />
          </Badge>
        ))}
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="text-gray-600 hover:text-gray-800"
        >
          <Plus className="h-4 w-4 mr-1" />
          Ajouter un tag
        </Button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3">
            {/* Recherche */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Créer un nouveau tag */}
            {showCreate && user && (
              <div className="mb-3">
                {!isCreating ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsCreating(true)}
                    className="w-full justify-start text-gray-600 hover:text-gray-800"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un nouveau tag
                  </Button>
                ) : (
                  <div className="space-y-2 p-3 bg-gray-50 rounded border">
                    <Input
                      placeholder="Nom du tag"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      className="text-sm"
                    />
                    <Input
                      placeholder="Description (optionnelle)"
                      value={newTagDescription}
                      onChange={(e) => setNewTagDescription(e.target.value)}
                      className="text-sm"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">Couleur:</span>
                      <div className="flex gap-1">
                        {['bg-red-100 text-red-800', 'bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-yellow-100 text-yellow-800', 'bg-purple-100 text-purple-800'].map((color) => (
                          <button
                            key={color}
                            onClick={() => setNewTagColor(color)}
                            className={`w-6 h-6 rounded border-2 ${color} ${
                              newTagColor === color ? 'border-gray-400' : 'border-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleCreateTag}
                        disabled={!newTagName.trim()}
                        className="flex-1"
                      >
                        Créer
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsCreating(false);
                          setNewTagName('');
                          setNewTagDescription('');
                          setNewTagColor('');
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Liste des tags disponibles */}
            <div className="max-h-48 overflow-y-auto">
              {availableTags.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  {searchQuery ? 'Aucun tag trouvé' : 'Aucun tag disponible'}
                </div>
              ) : (
                <div className="space-y-1">
                  {availableTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagSelect(tag)}
                      className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Badge className={`${tag.color} text-xs`}>
                          {tag.name}
                        </Badge>
                        {tag.description && (
                          <span className="text-xs text-gray-500 truncate">
                            {tag.description}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        {tag.usageCount} utilisations
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
