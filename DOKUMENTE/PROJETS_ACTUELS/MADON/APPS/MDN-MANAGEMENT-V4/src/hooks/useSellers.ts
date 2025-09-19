import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Seller } from '../types';

export function useSellers() {
  const queryClient = useQueryClient();

  const { data: sellers, isLoading } = useQuery({
    queryKey: ['sellers'],
    queryFn: async () => {
      // Mock data pour les vendeurs avec contexte camerounais
      const data = [
        {
          id: '1',
          name: 'Ahmadou Bello',
          email: 'ahmadou.bello@madon.cm',
          phone: '+237 6 94 12 34 56',
          region: 'Littoral (Douala)',
          commission_rate: 0.15,
          status: 'active',
          created_at: '2024-01-15T10:00:00Z',
          products: [
            { id: '1', status: 'active' },
            { id: '2', status: 'active' }
          ]
        },
        {
          id: '2',
          name: 'Fatou Ndiaye',
          email: 'fatou.ndiaye@madon.cm',
          phone: '+237 6 95 23 45 67',
          region: 'Centre (Yaoundé)',
          commission_rate: 0.12,
          status: 'active',
          created_at: '2024-02-01T09:00:00Z',
          products: [
            { id: '3', status: 'active' }
          ]
        },
        {
          id: '3',
          name: 'Kouassi Mensah',
          email: 'kouassi.mensah@madon.cm',
          phone: '+237 6 96 34 56 78',
          region: 'Ouest (Bafoussam)',
          commission_rate: 0.18,
          status: 'active',
          created_at: '2024-01-20T14:30:00Z',
          products: [
            { id: '4', status: 'active' },
            { id: '5', status: 'active' }
          ]
        },
        {
          id: '4',
          name: 'Aissatou Diallo',
          email: 'aissatou.diallo@madon.cm',
          phone: '+237 6 97 45 67 89',
          region: 'Extrême-Nord (Maroua)',
          commission_rate: 0.20,
          status: 'active',
          created_at: '2024-02-10T11:15:00Z',
          products: [
            { id: '6', status: 'active' }
          ]
        },
        {
          id: '5',
          name: 'Moussa Traoré',
          email: 'moussa.traore@madon.cm',
          phone: '+237 6 98 56 78 90',
          region: 'Adamaoua (Ngaoundéré)',
          commission_rate: 0.14,
          status: 'inactive',
          created_at: '2024-01-05T08:45:00Z',
          products: [
            { id: '7', status: 'inactive' }
          ]
        }
      ];
      
      return data as (Seller & {
        products: Array<{ id: string; status: string }>;
      })[];
    }
  });

  const createSeller = useMutation({
    mutationFn: async (seller: Omit<Seller, 'id' | 'created_at'>) => {
      // Mock insert operation
      const data = {
        id: Date.now().toString(),
        ...seller,
        created_at: new Date().toISOString(),
        products: []
      };
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellers'] });
    }
  });

  const updateSeller = useMutation({
    mutationFn: async ({ id, ...seller }: Partial<Seller> & { id: string }) => {
      // Mock update operation
      const data = {
        id,
        ...seller,
        updated_at: new Date().toISOString()
      };
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellers'] });
    }
  });

  const deleteSeller = useMutation({
    mutationFn: async (id: string) => {
      // Mock delete operation
      console.log(`Suppression du vendeur ${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellers'] });
    }
  });

  const importSellers = useMutation({
    mutationFn: async (sellers: Omit<Seller, 'id' | 'created_at'>[]) => {
      // Mock insert operation
      const data = sellers.map(seller => ({
        id: Date.now().toString() + Math.random(),
        ...seller,
        created_at: new Date().toISOString(),
        products: []
      }));
      
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