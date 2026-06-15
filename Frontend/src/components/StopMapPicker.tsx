import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMapEvents } from "react-leaflet";
import type { Coordinate } from "@/types/bus";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useT } from "@/i18n";

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

const clickIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapClickHandlerProps {
  onCoordinateSelect: (coordinate: Coordinate) => void;
}

function MapClickHandler({ onCoordinateSelect }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      const coordinate: Coordinate = {
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      };
      onCoordinateSelect(coordinate);
    },
  });
  return null;
}

interface StopMapPickerProps {
  onCoordinateSelect: (coordinate: Coordinate) => void;
  selectedCoordinate: Coordinate | null;
}

export function StopMapPicker({
  onCoordinateSelect,
  selectedCoordinate,
}: StopMapPickerProps) {
  const t = useT();

  // Default center on Poland
  const defaultCenter: [number, number] = [51.9194, 19.1451];

  return (
    <div className="rounded-lg overflow-hidden border border-gray-300 dark:border-slate-600">
      <MapContainer
        center={
          selectedCoordinate
            ? [selectedCoordinate.latitude, selectedCoordinate.longitude]
            : defaultCenter
        }
        zoom={selectedCoordinate ? 13 : 7}
        style={{ height: "400px", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler onCoordinateSelect={onCoordinateSelect} />
        {selectedCoordinate && (
          <Marker
            position={[
              selectedCoordinate.latitude,
              selectedCoordinate.longitude,
            ]}
            icon={clickIcon}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{t("app.owner.routes.selectedStop")}</p>
                <p>
                  {selectedCoordinate.latitude.toFixed(4)},{" "}
                  {selectedCoordinate.longitude.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      <div className="bg-blue-50 dark:bg-blue-900/20 border-t border-gray-300 dark:border-slate-600 p-3 text-sm text-blue-900 dark:text-blue-300">
        {t("app.owner.routes.clickMapHint")}
      </div>
    </div>
  );
}
