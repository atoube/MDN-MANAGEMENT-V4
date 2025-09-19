"use client";

import React, { useMemo, useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Route, X } from 'lucide-react';
import { MarkerClusterer } from '@react-google-maps/api';

interface DeliveryLocation {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  status: string;
}

interface DeliveryMapProps {
  locations: DeliveryLocation[];
  googleMapsApiKey: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 4.0511,
  lng: 9.7679,
};

const getMarkerIcon = (status: string) => {
  const colors = {
    pending: 'blue',
    in_progress: 'green',
    delivered: 'gold',
    cancelled: 'red'
  };
  return `http://maps.google.com/mapfiles/ms/icons/${colors[status as keyof typeof colors]}-dot.png`;
};

const DeliveryMap: React.FC<DeliveryMapProps> = ({ locations, googleMapsApiKey }) => {
  const [selectedLocation, setSelectedLocation] = useState<DeliveryLocation | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries: ['places']
  });

  const center = useMemo(() => {
    if (locations.length === 0) return defaultCenter;
    
    const avgLat = locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length;
    const avgLng = locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length;
    
    return { lat: avgLat, lng: avgLng };
  }, [locations]);

  const filteredLocations = useMemo(() => {
    if (filterStatus === 'all') return locations;
    return locations.filter(location => location.status === filterStatus);
  }, [locations, filterStatus]);

  const handleCenterMap = () => {
    if (map && filteredLocations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      filteredLocations.forEach(location => {
        bounds.extend({ lat: location.latitude, lng: location.longitude });
      });
      map.fitBounds(bounds);
    }
  };

  const calculateRoute = useCallback(() => {
    if (filteredLocations.length < 2) return;

    const directionsService = new google.maps.DirectionsService();
    const waypoints = filteredLocations.slice(1, -1).map(location => ({
      location: new google.maps.LatLng(location.latitude, location.longitude),
      stopover: true
    }));

    directionsService.route(
      {
        origin: new google.maps.LatLng(filteredLocations[0].latitude, filteredLocations[0].longitude),
        destination: new google.maps.LatLng(
          filteredLocations[filteredLocations.length - 1].latitude,
          filteredLocations[filteredLocations.length - 1].longitude
        ),
        waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === 'OK' && result) {
          setDirections(result);
        }
      }
    );
  }, [filteredLocations]);

  const onLoad = useCallback((event: React.SyntheticEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    if (input) {
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location && map) {
          map.panTo(place.geometry.location);
          map.setZoom(15);
        }
      });
    }
  }, [map]);

  if (loadError) {
    return <div>Erreur lors du chargement de la carte</div>;
  }

  if (!isLoaded) {
    return <div className="h-[500px] w-full rounded-lg bg-gray-100 animate-pulse" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Rechercher une adresse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onLoad={onLoad}
            className="w-full"
          />
        </div>

        <Select value={mapType} onValueChange={(value: 'roadmap' | 'satellite' | 'hybrid' | 'terrain') => setMapType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type de carte" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="roadmap">Standard</SelectItem>
            <SelectItem value="satellite">Satellite</SelectItem>
            <SelectItem value="hybrid">Hybride</SelectItem>
            <SelectItem value="terrain">Terrain</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="in_progress">En cours</SelectItem>
            <SelectItem value="delivered">Livré</SelectItem>
            <SelectItem value="cancelled">Annulé</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleCenterMap}>
          Centrer sur les livraisons
        </Button>

        <Button 
          variant={showRoute ? "destructive" : "default"}
          onClick={() => {
            if (showRoute) {
              setDirections(null);
            } else {
              calculateRoute();
            }
            setShowRoute(!showRoute);
          }}
        >
          {showRoute ? <X className="w-4 h-4 mr-2" /> : <Route className="w-4 h-4 mr-2" />}
          {showRoute ? "Masquer l'itinéraire" : "Afficher l'itinéraire"}
        </Button>
      </div>

      <div className="flex gap-4 p-2 bg-gray-100 rounded-lg">
        <div className="flex items-center gap-2">
          <img src={getMarkerIcon('pending')} alt="En attente" className="w-4 h-4" />
          <span>En attente</span>
        </div>
        <div className="flex items-center gap-2">
          <img src={getMarkerIcon('in_progress')} alt="En cours" className="w-4 h-4" />
          <span>En cours</span>
        </div>
        <div className="flex items-center gap-2">
          <img src={getMarkerIcon('delivered')} alt="Livré" className="w-4 h-4" />
          <span>Livré</span>
        </div>
        <div className="flex items-center gap-2">
          <img src={getMarkerIcon('cancelled')} alt="Annulé" className="w-4 h-4" />
          <span>Annulé</span>
        </div>
      </div>

      <div className="h-[500px] w-full rounded-lg overflow-hidden">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={center}
          options={{
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: false,
            mapTypeId: mapType,
            zoomControl: true
          }}
          onLoad={setMap}
        >
          <MarkerClusterer>
            {(clusterer) => (
              <>
                {filteredLocations.map((location) => (
                  <Marker
                    key={location.id}
                    position={{ lat: location.latitude, lng: location.longitude }}
                    icon={{
                      url: getMarkerIcon(location.status),
                    }}
                    onClick={() => setSelectedLocation(location)}
                    clusterer={clusterer}
                  />
                ))}
              </>
            )}
          </MarkerClusterer>

          {directions && <DirectionsRenderer directions={directions} />}

          {selectedLocation && (
            <InfoWindow
              position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <div className="p-2">
                <h3 className="font-bold">{selectedLocation.name}</h3>
                <p className="text-sm">
                  Statut: {selectedLocation.status === 'pending' ? 'En attente' :
                          selectedLocation.status === 'in_progress' ? 'En cours' :
                          selectedLocation.status === 'delivered' ? 'Livré' : 'Annulé'}
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default DeliveryMap; 