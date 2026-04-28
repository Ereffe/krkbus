import React from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";

interface MapVisualizationProps {
  selectedRoute: string | null;
}

const MapVisualization: React.FC<MapVisualizationProps> = ({
  selectedRoute,
}) => {
  const route = selectedRoute ? JSON.parse(selectedRoute) : null;

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-slate-900 shadow-inner border border-slate-700/40">
      {route ? (
        <MapContainer
          center={[51.5, 20]}
          zoom={10}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline
            positions={route.coordinates}
            pathOptions={{ color: "#00d9ff", weight: 3, opacity: 0.8 }}
          />
        </MapContainer>
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800">
          <div className="text-center px-4">
            <div className="inline-block p-4 rounded-full bg-slate-700/40 mb-4">
              <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 003 16.382V5.618a1 1 0 011.553-.894L9 7m0 13l6.447 3.268A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <p className="text-slate-300 text-lg font-semibold">Wybierz trasę</p>
            <p className="text-slate-500 text-sm mt-2">aby zobaczyć mapę trasy</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapVisualization;
