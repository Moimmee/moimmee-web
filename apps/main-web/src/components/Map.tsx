"use client";

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import PartyDetail from './PartyDetail';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapProps {
  center?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
  markers?: Array<{
    position: [number, number];
    popup?: string;
  }>;
}

export const Map = ({ 
  center = [37.5665, 126.9780],
  zoom = 13,
  height = '100svh',
  className = '',
  markers = []
}: MapProps) => {
  const [isPartyDetailOpen, setIsPartyDetailOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<{position: [number, number], popup?: string} | null>(null);

  const handleClosePartyDetail = () => {
    setIsPartyDetailOpen(false);
    setSelectedMarker(null);
  };

  const handleMarkerClick = (marker: {position: [number, number], popup?: string}) => {
    setSelectedMarker(marker);
    setIsPartyDetailOpen(true);
  };

  return (
    <div 
      style={{ height }} 
      className={`w-full overflow-hidden ${className}`}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        {markers.map((marker, index) => (
          <Marker 
            key={index} 
            position={marker.position}
            eventHandlers={{
              click: () => handleMarkerClick(marker)
            }}
          >
            {marker.popup && <Popup>{marker.popup}</Popup>}
          </Marker>
        ))}
      </MapContainer>
      {isPartyDetailOpen && selectedMarker && (
        <PartyDetail 
          onClose={handleClosePartyDetail} 
          markerData={selectedMarker}
        />
      )}
    </div>
  );
};