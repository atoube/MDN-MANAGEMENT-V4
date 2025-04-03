import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Seller } from '../types';

export function useSellers() {
  const queryClient = useQueryClient();

  const { data: sellers, isLoading } = useQuery({
    queryKey: ['sellers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sellers')
        .select(`
          *,
          products (
            id,
            status
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (Seller & {
        products: Array<{ id: string; status: string }>;
      })[];
    }
  });

  const createSeller = useMutation({
    mutationFn: async (seller: Omit<Seller, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('sellers')
        .insert(seller)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellers'] });
    }
  });

  const updateSeller = useMutation({
    mutationFn: async ({ id, ...seller }: Partial<Seller> & { id: string }) => {
      const { data, error } = await supabase
        .from('sellers')
        .update(seller)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellers'] });
    }
  });

  const deleteSeller = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sellers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellers'] });
    }
  });

  const importSellers = useMutation({
    mutationFn: async (sellers: Omit<Seller, 'id' | 'created_at'>[]) => {
      const { data, error } = await supabase
        .from('sellers')
        .insert(sellers)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellers'] });
    }
  });

  return {
    sellers,
    isLoading,
    createSeller,
    updateSeller,
    deleteSeller,
    importSellers
  };
}