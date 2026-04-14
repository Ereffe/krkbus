import React from "react";
import { useMap } from "react-leaflet";

interface SetViewOnClickProps {
  coords: [number, number];
}

const SetViewOnClick: React.FC<SetViewOnClickProps> = ({ coords }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(coords, 6);
    map.setZoom(8);
  }, [coords, map]);
  return null;
};

export default SetViewOnClick;
