import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { 
  MessageCircle, 
  Search,
  TrendingUp,
  Users,
  AtSign,
  BarChart3
} from 'lucide-react';
import { useComments } from '../../hooks/useComments';
import { useAuth } from '../../contexts/AuthContext';
import { useEmployees } from '../../hooks/useEmployees';

export function CommentManager() {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const {
    comments,
    getRecentComments,
    searchComments,
    getUserMentions,
    getCommentStats,
    formatRelativeTime
  } = useComments();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('all');

  const stats = getCommentStats();
  const recentComments = getRecentComments(20);
  const filteredComments = searchQuery ? searchComments(searchQuery) : recentComments;
  const userMentions = user ? getUserMentions(user.id.toString()) : [];

  const getEmployeeName = (userId: string) => {
    const employee = employees.find(emp => emp.id.toString() === userId);
    return employee ? `${employee.first_name} ${employee.last_name}` : 'Utilisateur inconnu';
  };

  const getTaskTitle = (taskId: string) => {
    // Dans un vrai système, on récupérerait le titre depuis les tâches
    return `Tâche #${taskId}`;
  };

  const highlightSearchTerm = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gestion des Commentaires</h2>
          <p className="text-gray-600">Suivi des discussions et collaborations</p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total commentaires</p>
                <p className="text-lg font-semibold">{stats.totalComments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Réponses</p>
                <p className="text-lg font-semibold">{stats.totalReplies}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <AtSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Mentions</p>
                <p className="text-lg font-semibold">{stats.totalMentions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Utilisateurs actifs</p>
                <p className="text-lg font-semibold">{stats.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mentions pour l'utilisateur connecté */}
      {userMentions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AtSign className="h-5 w-5" />
              Vos mentions ({userMentions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userMentions.slice(0, 5).map((comment) => (
                <div key={comment.id} className="p-3 bg-blue-50 rounded border border-blue-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-gray-900">
                          {comment.userName}
                        </span>
                        <span className="text-xs text-gray-500">
                          sur {getTaskTitle(comment.taskId)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatRelativeTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {userMentions.length > 5 && (
                <div className="text-center">
                  <Button variant="outline" size="sm">
                    Voir toutes les mentions ({userMentions.length})
                  </Button>
                </div>
              )}
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
              placeholder="Rechercher dans les commentaires..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des commentaires récents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {searchQuery ? `Résultats de recherche (${filteredComments.length})` : `Commentaires récents (${filteredComments.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredComments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>{searchQuery ? 'Aucun commentaire trouvé' : 'Aucun commentaire'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComments.map((comment) => (
                <div key={comment.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {comment.userName ? comment.userName.split(' ').map(n => n[0]).join('') : 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900">
                            {comment.userName || 'Utilisateur inconnu'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getTaskTitle(comment.taskId)} • {formatRelativeTime(comment.createdAt)}
                            {comment.isEdited && (
                              <span className="ml-1 text-gray-400">(modifié)</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div
                        className="text-sm text-gray-700"
                        dangerouslySetInnerHTML={{ 
                          __html: highlightSearchTerm(comment.content, searchQuery) 
                        }}
                      />
                      
                      {comment.mentions && comment.mentions.length > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          <AtSign className="h-3 w-3 text-gray-400" />
                          <div className="flex gap-1">
                            {comment.mentions.map((mention, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                @{getEmployeeName(mention)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
