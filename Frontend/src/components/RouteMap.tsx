import { MapContainer, TileLayer, Popup, Marker, Polyline, useMap } from "react-leaflet";
import { useEffect } from "react";
import type { BusRoute } from "@/types/bus";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface RouteMapProps {
  route: BusRoute;
}

const stopIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const startIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const endIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FitBounds({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, coords]);
  return null;
}

export function RouteMap({ route }: RouteMapProps) {
  // Calculate map center
  const centerLat =
    (route.startStop.coordinate.latitude +
      route.endStop.coordinate.latitude) /
    2;
  const centerLng =
    (route.startStop.coordinate.longitude +
      route.endStop.coordinate.longitude) /
    2;

  // Create polyline coordinates
  const polylineCoords = route.stops.map((stop) => [
    stop.coordinate.latitude,
    stop.coordinate.longitude,
  ]);

  return (
    <div className="rounded-lg overflow-hidden shadow-md w-full h-96">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <FitBounds coords={polylineCoords as [number, number][]} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Route line */}
        <Polyline
          positions={polylineCoords as any}
          color="blue"
          weight={3}
          opacity={0.7}
          dashArray="5, 5"
        />

        {/* Start stop */}
        <Marker
          position={[
            route.startStop.coordinate.latitude,
            route.startStop.coordinate.longitude,
          ]}
          icon={startIcon}
        >
          <Popup>
            <div>
              <p className="font-bold text-green-700">Start</p>
              <p className="text-sm">{route.startStop.name}</p>
            </div>
          </Popup>
        </Marker>

        {/* Intermediate stops */}
        {route.stops.slice(1, -1).map((stop, index) => (
          <Marker
            key={`stop-${index}`}
            position={[stop.coordinate.latitude, stop.coordinate.longitude]}
            icon={stopIcon}
          >
            <Popup>
              <div>
                <p className="font-bold text-blue-700">Przystanek {index + 1}</p>
                <p className="text-sm">{stop.name}</p>
                {stop.arrivalTime && (
                  <p className="text-xs text-gray-600">
                    Przyjazd: {stop.arrivalTime}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* End stop */}
        <Marker
          position={[
            route.endStop.coordinate.latitude,
            route.endStop.coordinate.longitude,
          ]}
          icon={endIcon}
        >
          <Popup>
            <div>
              <p className="font-bold text-red-700">Koniec</p>
              <p className="text-sm">{route.endStop.name}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
