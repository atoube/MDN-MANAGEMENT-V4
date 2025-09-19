import { useState, useEffect } from 'react';
import { apiService } from '../lib/api';

export interface MarketingData {
  id: number;
  campaign_name: string;
  status: string;
  budget: number;
  start_date: string;
  end_date: string;
  created_at: string;
}

export function useMarketing() {
  const [marketingData, setMarketingData] = useState<MarketingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketingData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Pour l'instant, utiliser des données simulées
        const mockData: MarketingData[] = [
          {
            id: 1,
            campaign_name: 'Campagne Printemps 2024',
            status: 'active',
            budget: 5000,
            start_date: '2024-03-01',
            end_date: '2024-05-31',
            created_at: '2024-03-01T00:00:00Z'
          },
          {
            id: 2,
            campaign_name: 'Promotion Été',
            status: 'planned',
            budget: 3000,
            start_date: '2024-06-01',
            end_date: '2024-08-31',
            created_at: '2024-02-15T00:00:00Z'
          }
        ];
        
        setMarketingData(mockData);
      } catch (err) {
        setError('Erreur lors du chargement des données marketing');
        console.error('Erreur useMarketing:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketingData();
  }, []);

  return { 
    marketingData, 
    loading, 
    error 
  };
}