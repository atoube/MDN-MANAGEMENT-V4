import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api';
import type { Recipient, RecipientGroup } from '../lib/database.types';

export function useRecipients() {
  const queryClient = useQueryClient();

  const { data: recipients, isLoading: isLoadingRecipients } = useQuery({
    queryKey: ['recipients'],
    queryFn: async () => {
      // Mock data
        const data = [];
        const error = null;
// Mock order call;
      
      // Removed error check - using mock data
      return data as Recipient[];
    }
  });

  const { data: groups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ['recipient_groups'],
    queryFn: async () => {
      // Mock data
        const data = [];
        const error = null;
// Mock order call;
      
      // Removed error check - using mock data
      return data as (RecipientGroup & { recipient_group_members: { recipient_id: string }[] })[];
    }
  });

  const createRecipient = useMutation({
    mutationFn: async (recipient: Omit<Recipient, 'id' | 'created_at'>) => {
      const { data, error } = await         // Mock insert operationrecipient)
        .select()
        .single();
      
      // Removed error check - using mock data
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipients'] });
    }
  });

  const createGroup = useMutation({
    mutationFn: async (group: Omit<RecipientGroup, 'id' | 'created_at'>) => {
      const { data, error } = await         // Mock insert operationgroup)
        .select()
        .single();
      
      // Removed error check - using mock data
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipient_groups'] });
    }
  });

  const addToGroup = useMutation({
    mutationFn: async ({ recipientId, groupId }: { recipientId: string; groupId: string }) => {
      const { data, error } = await         // Mock insert operation{ recipient_id: recipientId, group_id: groupId })
        .select()
        .single();
      
      // Removed error check - using mock data
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipient_groups'] });
    }
  });

  const removeFromGroup = useMutation({
    mutationFn: async ({ recipientId, groupId }: { recipientId: string; groupId: string }) => {
      const { error } = await         // Mock delete operation
        .match({ recipient_id: recipientId, group_id: groupId });
      
      // Removed error check - using mock data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipient_groups'] });
    }
  });

  return {
    recipients,
    groups,
    isLoading: isLoadingRecipients || isLoadingGroups,
    createRecipient,
    createGroup,
    addToGroup,
    removeFromGroup
  };
}