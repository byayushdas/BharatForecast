import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Location } from '../types/weather';

interface WeatherMapProps {
  location: Location;
  locations?: Location[];
  variable: string;
  onLocationSelect?: (id: string) => void;
}

export default function WeatherMap({ location, locations = [], variable, onLocationSelect }: WeatherMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Record<string, maplibregl.Marker>>({});
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!map.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: [location.longitude, location.latitude],
        zoom: 4,
        attributionControl: false
      });

      map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

      map.current.on('load', () => {
        setMapLoaded(true);
      });
    }
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    const pointsToRender = locations.length > 0 ? locations : [location];

    pointsToRender.forEach(loc => {
      const isSelected = loc.id === location.id;
      const el = document.createElement('div');
      
      if (isSelected) {
        el.className = 'w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md relative cursor-pointer z-10';
        const ping = document.createElement('div');
        ping.className = 'absolute top-0 left-0 w-full h-full bg-primary rounded-full animate-ping opacity-75';
        el.appendChild(ping);
      } else {
        el.className = 'w-3 h-3 bg-gray-400 rounded-full border border-white shadow-sm hover:scale-125 hover:bg-primary-light transition-all cursor-pointer z-0';
      }

      if (onLocationSelect) {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onLocationSelect(loc.id);
        });
      }

      const m = new maplibregl.Marker({ element: el })
        .setLngLat([loc.longitude, loc.latitude])
        .addTo(map.current!);
        
      markersRef.current[loc.id] = m;
    });

    map.current.flyTo({
      center: [location.longitude, location.latitude],
      zoom: 5,
      essential: true,
      duration: 1500
    });
  }, [location, locations, mapLoaded, onLocationSelect]);

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden h-full flex flex-col relative shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300">
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-2 rounded-lg border border-border shadow-sm">
        <h3 className="font-medium text-sm text-text-primary">{location.name}</h3>
        <p className="text-xs text-text-secondary">{location.state}</p>
      </div>

      <div className="absolute bottom-6 left-4 z-10 bg-white/90 backdrop-blur px-3 py-2 rounded-lg border border-border shadow-sm text-xs w-48">
        <div className="font-medium text-text-primary mb-2">{variable} Intensity</div>
        <div className="flex items-center gap-2 w-full">
          <span className="text-text-secondary">Low</span>
          <div className={`h-2 flex-1 rounded-full ${
            variable === 'Rainfall' ? 'bg-gradient-to-r from-blue-100 to-blue-600' :
            variable === 'Temperature' ? 'bg-gradient-to-r from-yellow-200 to-red-600' :
            'bg-gradient-to-r from-green-100 to-green-700'
          }`}></div>
          <span className="text-text-secondary">High</span>
        </div>
      </div>

      <div ref={mapContainer} className="w-full h-full min-h-[350px]" />
    </div>
  );
}
