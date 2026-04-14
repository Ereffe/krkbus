import React from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import SetViewOnClick from "./SetViewOnClick";
import "../styles/MapVisualization.css";

interface MapVisualizationProps {
  selectedRoute: string | null;
}

const MapVisualization: React.FC<MapVisualizationProps> = ({
  selectedRoute,
}) => {
  const route = selectedRoute ? JSON.parse(selectedRoute) : null;

  return (
    <div className="map-visualization-container">
      {route ? (
        <MapContainer
          center={[51.5, 20]}
          style={{ height: "100%", width: "100%" }}
        >
          <SetViewOnClick coords={route.coordinates[0]} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline
            positions={route.coordinates}
            pathOptions={{ color: "#667eea", weight: 4 }}
          />
        </MapContainer>
      ) : (
        <div className="map-empty">
          <p>Wybierz trasę, aby zobaczyć mapę</p>
        </div>
      )}
    </div>
  );
};

export default MapVisualization;
