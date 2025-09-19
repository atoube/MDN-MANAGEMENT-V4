import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardContent } from '../ui/Card';
import { 
  MessageCircle, 
  Send, 
  Edit3, 
  Trash2, 
  Reply,
  AtSign,
  Paperclip,
  MoreVertical
} from 'lucide-react';
import { useComments } from '../../hooks/useComments';
import { useAuth } from '../../contexts/AuthContext';
import { useEmployees } from '../../hooks/useEmployees';

interface CommentSectionProps {
  taskId: string;
  taskTitle: string;
  compact?: boolean;
}

export function CommentSection({ taskId, taskTitle, compact = false }: CommentSectionProps) {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const {
    getTaskComments,
    addComment,
    updateComment,
    deleteComment,
    formatRelativeTime,
    extractMentions
  } = useComments();

  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showAllComments, setShowAllComments] = useState(!compact);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);

  const comments = getTaskComments(taskId);
  const visibleComments = compact && !showAllComments ? comments.slice(0, 2) : comments;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [newComment]);

  useEffect(() => {
    if (replyTextareaRef.current) {
      replyTextareaRef.current.style.height = 'auto';
      replyTextareaRef.current.style.height = replyTextareaRef.current.scrollHeight + 'px';
    }
  }, [replyContent]);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const mentions = extractMentions(newComment);
    addComment(taskId, newComment, undefined, mentions);
    setNewComment('');
  };

  const handleSubmitReply = (parentId: string) => {
    if (!replyContent.trim()) return;

    const mentions = extractMentions(replyContent);
    addComment(taskId, replyContent, parentId, mentions);
    setReplyContent('');
    setReplyingTo(null);
  };

  const handleEditComment = (commentId: string, content: string) => {
    setEditingComment(commentId);
    setEditContent(content);
  };

  const handleSaveEdit = () => {
    if (!editingComment || !editContent.trim()) return;

    updateComment(editingComment, editContent);
    setEditingComment(null);
    setEditContent('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      deleteComment(commentId);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      action();
    }
  };

  const getEmployeeName = (userId: string) => {
    const employee = employees.find(emp => emp.id.toString() === userId);
    return employee ? `${employee.first_name} ${employee.last_name}` : 'Utilisateur inconnu';
  };

  const highlightMentions = (content: string) => {
    return content.replace(/@(\w+)/g, '<span class="bg-blue-100 text-blue-800 px-1 rounded text-sm">@$1</span>');
  };

  if (compact && !showAllComments && comments.length === 0) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <MessageCircle className="h-4 w-4" />
        <span>Aucun commentaire</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-900">
            Commentaires ({comments.length})
          </span>
        </div>
        {compact && comments.length > 2 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllComments(!showAllComments)}
          >
            {showAllComments ? 'Réduire' : `Voir tout (${comments.length})`}
          </Button>
        )}
      </div>

      {/* Nouveau commentaire */}
      {user && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {user.first_name} {user.last_name}
                </span>
              </div>
              
              <textarea
                ref={textareaRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, handleSubmitComment)}
                placeholder={`Commenter sur "${taskTitle}"... (Ctrl+Entrée pour envoyer)`}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <AtSign className="h-3 w-3" />
                  <span>Utilisez @nom pour mentionner quelqu'un</span>
                </div>
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des commentaires */}
      <div className="space-y-4">
        {visibleComments.map((thread) => (
          <div key={thread.comment.id} className="space-y-3">
            {/* Commentaire principal */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {thread.comment.userName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">
                          {thread.comment.userName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatRelativeTime(thread.comment.createdAt)}
                          {thread.comment.isEdited && (
                            <span className="ml-1 text-gray-400">(modifié)</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {user && user.id.toString() === thread.comment.userId && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditComment(thread.comment.id, thread.comment.content)}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteComment(thread.comment.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {editingComment === thread.comment.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          Sauvegarder
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingComment(null);
                            setEditContent('');
                          }}
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="text-sm text-gray-700"
                      dangerouslySetInnerHTML={{ __html: highlightMentions(thread.comment.content) }}
                    />
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setReplyingTo(thread.comment.id)}
                    >
                      <Reply className="h-3 w-3 mr-1" />
                      Répondre
                    </Button>
                    {thread.replies.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {thread.replies.length} réponse{thread.replies.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Réponses */}
            {thread.replies.length > 0 && (
              <div className="ml-8 space-y-2">
                {thread.replies.map((reply) => (
                  <Card key={reply.id} className="bg-gray-50">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">
                                {reply.userName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-xs text-gray-900">
                                {reply.userName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatRelativeTime(reply.createdAt)}
                                {reply.isEdited && (
                                  <span className="ml-1 text-gray-400">(modifié)</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {user && user.id.toString() === reply.userId && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditComment(reply.id, reply.content)}
                                className="h-6 w-6 p-0"
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteComment(reply.id)}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {editingComment === reply.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleSaveEdit}>
                                Sauvegarder
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingComment(null);
                                  setEditContent('');
                                }}
                              >
                                Annuler
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="text-xs text-gray-700"
                            dangerouslySetInnerHTML={{ __html: highlightMentions(reply.content) }}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Formulaire de réponse */}
            {replyingTo === thread.comment.id && (
              <div className="ml-8">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {user?.first_name?.[0]}{user?.last_name?.[0]}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-gray-900">
                          Répondre à {thread.comment.userName}
                        </span>
                      </div>
                      
                      <textarea
                        ref={replyTextareaRef}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, () => handleSubmitReply(thread.comment.id))}
                        placeholder="Tapez votre réponse..."
                        className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        rows={2}
                      />
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSubmitReply(thread.comment.id)}
                          disabled={!replyContent.trim()}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Envoyer
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                          }}
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p>Aucun commentaire pour cette tâche</p>
          <p className="text-sm">Soyez le premier à commenter !</p>
        </div>
      )}
    </div>
  );
}
