'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Truck, MapPin } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix for default marker icons in Leaflet with Next.js
const createCustomIcon = (color: string, icon: React.ReactNode) => {
  const iconHtml = renderToStaticMarkup(
    <div style={{ 
      backgroundColor: color, 
      color: 'white', 
      padding: '8px', 
      borderRadius: '50%', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {icon}
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: 'custom-leaflet-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

interface MapProps {
  center: [number, number];
  collectorPos?: [number, number];
  pickupPos?: [number, number];
  zoom?: number;
}

// Helper component to auto-recenter map when positions change
function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function LiveTrackingMap({ center, collectorPos, pickupPos, zoom = 15 }: MapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="w-full h-full bg-muted animate-pulse rounded-2xl" />;

  const truckIcon = createCustomIcon('#FF8C00', <Truck size={20} />);
  const pinIcon = createCustomIcon('#228B22', <MapPin size={20} />);

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {pickupPos && (
          <Marker position={pickupPos} icon={pinIcon}>
            <Popup>Ama's Pickup Location</Popup>
          </Marker>
        )}

        {collectorPos && (
          <Marker position={collectorPos} icon={truckIcon}>
            <Popup>Kwame (Collector) is here</Popup>
          </Marker>
        )}

        <RecenterMap center={center} />
      </MapContainer>
      
      {/* Visual Overlay to make it feel more "App-like" */}
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 rounded-2xl" />
    </div>
  );
}