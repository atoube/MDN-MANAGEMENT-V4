export type DeliveryStatus = 'pending' | 'in_progress' | 'delivered' | 'cancelled';

export interface Delivery {
  id: string;
  client_name: string;
  address: string;
  status: DeliveryStatus;
  created_at: string;
  scheduled_date: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
  last_location_update?: string;
  tracking_number?: string;
  tracking_status?: 'pending' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed';
  tracking_updates?: Array<{
    date: string;
    status: string;
    location: string;
    description: string;
  }>;
}

export interface DeliveryLocation {
  id: string;
  latitude: number;
  longitude: number;
  deliveryId: string;
  clientName: string;
  status: DeliveryStatus;
  lastUpdate: string;
} 