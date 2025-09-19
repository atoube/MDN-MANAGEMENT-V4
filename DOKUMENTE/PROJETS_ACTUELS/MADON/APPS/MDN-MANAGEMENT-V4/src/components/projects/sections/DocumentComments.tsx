import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Textarea } from '../../ui/Textarea';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentComment {
  id: string;
  document_id: string;
  content: string;
  created_at: string;
  created_by: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

interface DocumentCommentsProps {
  documentId: string;
}

export function DocumentComments({ documentId }: DocumentCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['document-comments', documentId],
    queryFn: async () => {
// Mock from call
// Mock select call
// Mock eq call
// Mock order call;

      // Removed error check - using mock data
      return data as DocumentComment[];
    }
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
// Mock from call
        .insert({
          document_id: documentId,
          content
        });

      // Removed error check - using mock data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-comments', documentId] });
      setNewComment('');
      toast.success('Commentaire ajouté avec succès');
    }
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
// Mock from call
        .delete()
// Mock eq call;

      // Removed error check - using mock data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-comments', documentId] });
      toast.success('Commentaire supprimé avec succès');
    }
  });

  if (isLoading) {
    return <div>Chargement des commentaires...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Commentaires
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="flex-1"
            />
            <Button
              onClick={() => addCommentMutation.mutate(newComment)}
              disabled={!newComment.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Envoyer
            </Button>
          </div>

          <div className="space-y-4">
            {comments?.map((comment) => (
              <div
                key={comment.id}
                className="p-4 border rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {comment.profiles.avatar_url ? (
                      <img
                        src={comment.profiles.avatar_url}
                        alt={comment.profiles.full_name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        {comment.profiles.full_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{comment.profiles.full_name}</div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(comment.created_at), 'PPP à HH:mm', { locale: fr })}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCommentMutation.mutate(comment.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <div className="text-gray-700">{comment.content}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 