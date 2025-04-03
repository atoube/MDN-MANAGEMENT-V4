import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Module } from '../lib/database.types';

export function useModules() {
  const queryClient = useQueryClient();

  const { data: modules, isLoading } = useQuery({
    queryKey: ['modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .order('order');
      
      if (error) throw error;
      return data as Module[];
    }
  });

  const updateModuleOrder = useMutation({
    mutationFn: async (updatedModules: Module[]) => {
      // Mettre à jour l'ordre de tous les modules en une seule transaction
      const updates = updatedModules.map((module, index) => ({
        id: module.id,
        order: index
      }));

      const { error } = await supabase
        .from('modules')
        .upsert(updates, { onConflict: 'id' });
      
      if (error) throw error;
    },
    onMutate: async (newModules) => {
      await queryClient.cancelQueries({ queryKey: ['modules'] });
      const previousModules = queryClient.getQueryData<Module[]>(['modules']);
      queryClient.setQueryData(['modules'], newModules);
      return { previousModules };
    },
    onError: (err, newModules, context) => {
      if (context?.previousModules) {
        queryClient.setQueryData(['modules'], context.previousModules);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
    }
  });

  const toggleModule = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { error } = await supabase
        .from('modules')
        .update({ enabled })
        .eq('id', id);
      
      if (error) throw error;
    },
    onMutate: async ({ id, enabled }) => {
      await queryClient.cancelQueries({ queryKey: ['modules'] });
      const previousModules = queryClient.getQueryData<Module[]>(['modules']);

      if (previousModules) {
        const newModules = previousModules.map(module =>
          module.id === id ? { ...module, enabled } : module
        );
        queryClient.setQueryData(['modules'], newModules);
      }

      return { previousModules };
    },
    onError: (err, variables, context) => {
      if (context?.previousModules) {
        queryClient.setQueryData(['modules'], context.previousModules);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
    }
  });

  return {
    modules: modules?.sort((a, b) => a.order - b.order),
    isLoading,
    updateModuleOrder,
    toggleModule
  };
}