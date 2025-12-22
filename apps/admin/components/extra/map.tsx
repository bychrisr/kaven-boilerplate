import * as React from 'react';
import { MapPin, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  icon?: React.ReactNode;
}

export interface MapProps {
  /**
   * Center coordinates
   */
  center?: { lat: number; lng: number };
  /**
   * Zoom level
   */
  zoom?: number;
  /**
   * Markers
   */
  markers?: MapMarker[];
  /**
   * Height
   */
  height?: number;
  /**
   * Callback when marker clicked
   */
  onMarkerClick?: (marker: MapMarker) => void;
}

export const Map: React.FC<MapProps> = ({
  center = { lat: -23.5505, lng: -46.6333 }, // São Paulo
  zoom: initialZoom = 12,
  markers = [],
  height = 400,
  onMarkerClick,
}) => {
  const [zoom, setZoom] = React.useState(initialZoom);

  // Simplified map visualization (placeholder for real map integration)
  return (
    <div
      className="relative bg-gray-100 rounded-lg overflow-hidden border border-divider"
      style={{ height: `${height}px` }}
    >
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ccc 1px, transparent 1px),
            linear-gradient(to bottom, #ccc 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Markers */}
      {markers.map((marker) => (
        <button
          key={marker.id}
          onClick={() => onMarkerClick?.(marker)}
          className="absolute transform -translate-x-1/2 -translate-y-full hover:scale-110 transition-transform"
          style={{
            left: `${50 + (marker.lng - center.lng) * 10}%`,
            top: `${50 + (center.lat - marker.lat) * 10}%`,
          }}
          title={marker.label}
        >
          {marker.icon || <MapPin className="size-8 text-error-main drop-shadow-lg" />}
        </button>
      ))}

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setZoom(Math.min(zoom + 1, 20))}
          className="p-2 bg-white rounded shadow hover:bg-gray-50 transition-colors"
          title="Aumentar zoom"
        >
          <ZoomIn className="size-5" />
        </button>
        <button
          onClick={() => setZoom(Math.max(zoom - 1, 1))}
          className="p-2 bg-white rounded shadow hover:bg-gray-50 transition-colors"
          title="Diminuir zoom"
        >
          <ZoomOut className="size-5" />
        </button>
      </div>

      {/* Info */}
      <div className="absolute bottom-4 left-4 px-3 py-2 bg-white rounded shadow text-sm">
        Zoom: {zoom} | Lat: {center.lat.toFixed(4)}, Lng: {center.lng.toFixed(4)}
      </div>

      {/* Placeholder Notice */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="px-4 py-2 bg-white/90 rounded-lg shadow">
          <p className="text-sm font-medium">Mapa Simplificado</p>
          <p className="text-xs text-text-secondary mt-1">
            Integre Mapbox ou Google Maps para funcionalidade completa
          </p>
        </div>
      </div>
    </div>
  );
};

Map.displayName = 'Map';
