import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Recipient, RecipientGroup } from '../lib/database.types';

export function useRecipients() {
  const queryClient = useQueryClient();

  const { data: recipients, isLoading: isLoadingRecipients } = useQuery({
    queryKey: ['recipients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Recipient[];
    }
  });

  const { data: groups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ['recipient_groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipient_groups')
        .select('*, recipient_group_members(recipient_id)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (RecipientGroup & { recipient_group_members: { recipient_id: string }[] })[];
    }
  });

  const createRecipient = useMutation({
    mutationFn: async (recipient: Omit<Recipient, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('recipients')
        .insert(recipient)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipients'] });
    }
  });

  const createGroup = useMutation({
    mutationFn: async (group: Omit<RecipientGroup, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('recipient_groups')
        .insert(group)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipient_groups'] });
    }
  });

  const addToGroup = useMutation({
    mutationFn: async ({ recipientId, groupId }: { recipientId: string; groupId: string }) => {
      const { data, error } = await supabase
        .from('recipient_group_members')
        .insert({ recipient_id: recipientId, group_id: groupId })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipient_groups'] });
    }
  });

  const removeFromGroup = useMutation({
    mutationFn: async ({ recipientId, groupId }: { recipientId: string; groupId: string }) => {
      const { error } = await supabase
        .from('recipient_group_members')
        .delete()
        .match({ recipient_id: recipientId, group_id: groupId });
      
      if (error) throw error;
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