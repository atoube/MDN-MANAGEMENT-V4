const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const geocodeAddress = async (address: string) => {
  try {
        if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la géocodification');
    }

    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
        formattedAddress: data.results[0].formatted_address
      };
    }

    throw new Error('Adresse non trouvée');
  } catch (error) {
    console.error('Erreur de géocodage:', error);
    throw error;
  }
};

export const reverseGeocode = async (latitude: number, longitude: number) => {
  try {
        if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Erreur lors du géocodage inverse');
    }

    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].formatted_address;
    }

    throw new Error('Adresse non trouvée');
  } catch (error) {
    console.error('Erreur de géocodage inverse:', error);
    throw error;
  }
};

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  address: string;
}

export async function updateDeliveryLocation(deliveryId: string, address: string): Promise<boolean> {
  try {
    const geocodingResult = await geocodeAddress(address);
    
    if (!geocodingResult) {
      return false;
    }

    // Mock update operation
    console.log(`Mise à jour de la position pour la livraison ${deliveryId}:`, {
      latitude: geocodingResult.latitude,
      longitude: geocodingResult.longitude,
      last_location_update: new Date().toISOString()
    });

    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la position:', error);
    return false;
  }
} 