import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { 
  Search, 
  Plus, 
  FolderOpen, 
  FileText, 
  Users, 
  Eye, 
  Edit3, 
  Trash2,
  BookOpen,
  TrendingUp,
  Clock,
  Tag
} from 'lucide-react';
import { useDocumentation } from '../hooks/useDocumentation';
import { useAuth } from '../contexts/AuthContext';
import { Space, Document, Folder } from '../types/documentation';
import { SpaceCard } from '../components/documentation/SpaceCard';
import { DocumentList } from '../components/documentation/DocumentList';
import { CreateSpaceDialog } from '../components/documentation/CreateSpaceDialog';
import { CreateDocumentDialog } from '../components/documentation/CreateDocumentDialog';
import { CreateFolderDialog } from '../components/documentation/CreateFolderDialog';

export default function Documentation() {
  const { user } = useAuth();
  const {
    documents,
    spaces,
    folders,
    loading,
    searchDocuments,
    createSpace,
    createDocument,
    createFolder
  } = useDocumentation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState(false);
  const [isCreateDocumentOpen, setIsCreateDocumentOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

  // Recherche en temps réel
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchDocuments(searchQuery);
  }, [searchQuery, searchDocuments]);

  // Documents filtrés par espace et dossier
  const filteredDocuments = useMemo(() => {
    let filtered = documents;
    
    if (selectedSpace) {
      filtered = filtered.filter(doc => doc.space_id === selectedSpace.id);
    }
    
    if (selectedFolder) {
      filtered = filtered.filter(doc => doc.folder_id === selectedFolder.id);
    }
    
    return filtered;
  }, [documents, selectedSpace, selectedFolder]);

  // Statistiques
  const stats = useMemo(() => {
    const totalDocuments = documents.length;
    const publishedDocuments = documents.filter(doc => doc.status === 'published').length;
    const draftDocuments = documents.filter(doc => doc.status === 'draft').length;
    const totalViews = documents.reduce((sum, doc) => sum + doc.views_count, 0);
    const totalSpaces = spaces.length;
    const totalFolders = folders.length;

    return {
      totalDocuments,
      publishedDocuments,
      draftDocuments,
      totalViews,
      totalSpaces,
      totalFolders
    };
  }, [documents, spaces, folders]);

  const handleCreateSpace = async (spaceData: any) => {
    try {
      await createSpace(spaceData);
      setIsCreateSpaceOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création de l\'espace:', error);
    }
  };

  const handleCreateDocument = async (documentData: any) => {
    try {
      await createDocument({
        ...documentData,
        space_id: selectedSpace?.id || spaces[0]?.id || '',
        folder_id: selectedFolder?.id,
        author_id: user?.id || 0,
        author_name: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : 'Inconnu',
        permissions: [
          {
            role: 'admin',
            employee_id: user?.id || 0,
            employee_name: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : 'Inconnu',
            granted_at: new Date().toISOString(),
            granted_by: user?.id || 0
          }
        ],
        collaborators: [user?.id || 0]
      });
      setIsCreateDocumentOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création du document:', error);
    }
  };

  const handleCreateFolder = async (folderData: any) => {
    try {
      await createFolder({
        ...folderData,
        space_id: selectedSpace?.id || spaces[0]?.id || '',
        created_by: user?.id || 0
      });
      setIsCreateFolderOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création du dossier:', error);
    }
  };

  const handleSpaceSelect = (space: Space) => {
    setSelectedSpace(space);
    setSelectedFolder(null);
  };

  const handleFolderSelect = (folder: Folder) => {
    setSelectedFolder(folder);
  };

  const clearSelection = () => {
    setSelectedSpace(null);
    setSelectedFolder(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documentation</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestion et collaboration sur la documentation de l'entreprise
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsCreateFolderOpen(true)}>
            <FolderOpen className="w-4 h-4 mr-2" />
            Nouveau Dossier
          </Button>
          <Button variant="outline" onClick={() => setIsCreateDocumentOpen(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Nouveau Document
          </Button>
          <Button onClick={() => setIsCreateSpaceOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Espace
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Documents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDocuments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full">
                <BookOpen className="h-4 w-4 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Publiés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.publishedDocuments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Brouillons</p>
                <p className="text-2xl font-bold text-gray-900">{stats.draftDocuments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-full">
                <Eye className="h-4 w-4 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Vues</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-full">
                <BookOpen className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Espaces</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSpaces}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-full">
                <FolderOpen className="h-4 w-4 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Dossiers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalFolders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              className="pl-10"
              placeholder="Rechercher dans la documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {searchQuery && searchResults.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Résultats de recherche ({searchResults.length})
              </h3>
              <div className="space-y-2">
                {searchResults.slice(0, 5).map((result) => (
                  <div key={result.document.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{result.document.title}</h4>
                        <p className="text-sm text-gray-600">{result.snippet}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {result.document.category}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Score: {result.relevance_score}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Voir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation et contenu */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Espaces et dossiers */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Espaces</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={clearSelection}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Tous les espaces
              </Button>
              
              {spaces.map((space) => (
                <Button
                  key={space.id}
                  variant={selectedSpace?.id === space.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleSpaceSelect(space)}
                >
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: space.color }}
                  />
                  {space.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          {selectedSpace && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dossiers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setSelectedFolder(null)}
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Tous les dossiers
                </Button>
                
                {folders
                  .filter(folder => folder.space_id === selectedSpace.id)
                  .map((folder) => (
                    <Button
                      key={folder.id}
                      variant={selectedFolder?.id === folder.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleFolderSelect(folder)}
                    >
                      <FolderOpen className="w-4 h-4 mr-2" />
                      {folder.name}
                    </Button>
                  ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contenu principal */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="documents" className="space-y-4">
            <TabsList>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="spaces">Espaces</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedSpace ? selectedSpace.name : 'Tous les documents'}
                    {selectedFolder && ` - ${selectedFolder.name}`}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {filteredDocuments.length} document(s) trouvé(s)
                  </p>
                </div>
              </div>

              <DocumentList 
                documents={filteredDocuments}
                onDocumentSelect={(doc) => console.log('Document sélectionné:', doc)}
              />
            </TabsContent>

            <TabsContent value="spaces" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {spaces.map((space) => (
                  <SpaceCard
                    key={space.id}
                    space={space}
                    documentCount={documents.filter(doc => doc.space_id === space.id).length}
                    onSelect={() => handleSpaceSelect(space)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun template</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Les templates de documents apparaîtront ici.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modals */}
      <CreateSpaceDialog
        open={isCreateSpaceOpen}
        onClose={() => setIsCreateSpaceOpen(false)}
        onSubmit={handleCreateSpace}
      />

      <CreateDocumentDialog
        open={isCreateDocumentOpen}
        onClose={() => setIsCreateDocumentOpen(false)}
        onSubmit={handleCreateDocument}
        spaces={spaces}
        folders={folders}
        selectedSpace={selectedSpace}
        selectedFolder={selectedFolder}
      />

      <CreateFolderDialog
        open={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        onSubmit={handleCreateFolder}
        spaces={spaces}
        selectedSpace={selectedSpace}
      />
    </div>
  );
}
