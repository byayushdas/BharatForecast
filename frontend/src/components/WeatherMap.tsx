import { useEffect, useRef, useState } from 'react';
import { Map as MapLibre, Marker, NavigationControl, setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';
import { LocateFixed, MapPin, Map as MapIcon } from 'lucide-react';
import type { Location } from '../types/weather';

interface Props { location: Location; locations?: Location[]; onLocationSelect: (id: string) => void }
setWorkerUrl(workerUrl);
export default function WeatherMap({ location, locations = [], onLocationSelect }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibre | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const selectRef = useRef(onLocationSelect);
  useEffect(() => { selectRef.current = onLocationSelect; }, [onLocationSelect]);
  useEffect(() => {
    if (!container.current) return;
    let instance: MapLibre | undefined;
    const timeout = window.setTimeout(() => setFailed(true), 15000);
    try {
      instance = new MapLibre({
        container: container.current,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: [82.5, 22.5], zoom: 3.7, minZoom: 2, maxZoom: 10,
        attributionControl: { compact: true }, scrollZoom: false,
      });
      map.current = instance;
      instance.fitBounds([[68, 7], [97, 34]], { padding: { top: 66, right: 30, bottom: 42, left: 30 }, duration: 0 });
      instance.addControl(new NavigationControl({ showCompass: false }), 'top-right');
      instance.on('load', () => { clearTimeout(timeout); setLoaded(true); setFailed(false); });
      instance.on('error', () => { if (!instance?.isStyleLoaded()) setFailed(true); });
    } catch { clearTimeout(timeout); queueMicrotask(() => setFailed(true)); }
    const observer = new ResizeObserver(() => instance?.resize());
    observer.observe(container.current);
    return () => { clearTimeout(timeout); observer.disconnect(); instance?.remove(); map.current = null; };
  }, []);

  useEffect(() => {
    if (!map.current || !loaded) return;
    const markers = locations.map(city => {
      const el = document.createElement('button');
      el.type = 'button'; el.className = `map-marker ${city.id === location.id ? 'active' : ''}`;
      el.setAttribute('aria-label', `Select ${city.name} on map`);
      el.setAttribute('aria-pressed', String(city.id === location.id));
      const dot = document.createElement('span'); dot.className = 'map-marker-dot';
      const label = document.createElement('span'); label.className = 'map-marker-label'; label.textContent = city.name;
      el.append(dot, label);
      el.addEventListener('click', () => selectRef.current(city.id));
      return new Marker({ element: el, anchor: 'left', offset: [-6, 0] }).setLngLat([city.longitude, city.latitude]).addTo(map.current!);
    });
    return () => markers.forEach(marker => marker.remove());
  }, [loaded, location.id, locations]);

  return <section className="panel weather-map"><div className="map-heading"><div><span className="eyebrow">A WIDER PERSPECTIVE</span><h2>Across the subcontinent</h2></div><span className="map-label"><MapPin size={12} />{locations.length} locations</span></div><div className="map-container" ref={container} aria-label="Interactive map of supported forecast locations" />
    {!loaded && !failed && <div className="map-loading" role="status">Loading regional map…</div>}
    {failed && <div className="map-fallback"><MapIcon size={32} /><strong>The basemap is unavailable</strong><p>You can still explore every location.</p><div>{locations.map(city => <button key={city.id} aria-pressed={city.id === location.id} onClick={() => onLocationSelect(city.id)}>{city.name}</button>)}</div></div>}
    {!failed && <><div className="map-selected"><span className="map-selected-dot" /><div><strong>{location.name}</strong><span>{location.latitude.toFixed(2)}° N · {location.longitude.toFixed(2)}° E</span></div></div><button className="map-reset" aria-label="Reset map to India" title="Reset map to India" onClick={() => map.current?.fitBounds([[68, 7], [97, 34]], { padding: { top: 66, right: 30, bottom: 42, left: 30 }, duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 600 })}><LocateFixed size={17} /></button><div className="map-hint"><span className="small-dot" />Select a city to explore its forecast</div></>}
  </section>;
}
