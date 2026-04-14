import React from "react";
import { Button } from "./ui/button";
import "../styles/RouteList.css";

interface Route {
  id: number;
  from: string;
  to: string;
  time: string;
  coordinates: [number, number][];
}

interface RouteListProps {
  onSelectRoute: (route: string) => void;
}

const RouteList: React.FC<RouteListProps> = ({ onSelectRoute }) => {
  const routes: Route[] = [
    {
      id: 1,
      from: "Kraków",
      to: "Warszawa",
      time: "8:00",
      coordinates: [
        [50.0647, 19.945],
        [52.2297, 21.0122],
      ],
    },
    {
      id: 2,
      from: "Kraków",
      to: "Katowice",
      time: "10:00",
      coordinates: [
        [50.0647, 19.945],
        [50.259, 19.021],
      ],
    },
    {
      id: 3,
      from: "Kraków",
      to: "Gdańsk",
      time: "12:00",
      coordinates: [
        [50.0647, 19.945],
        [54.352, 18.646],
      ],
    },
  ];

  return (
    <ul className="route-list">
      {routes.map((route) => (
        <li key={route.id} className="route-item">
          <Button
            className="route-button"
            onClick={() => onSelectRoute(JSON.stringify(route))}
          >
            <div className="route-info">
              <span className="route-from-to">
                {route.from} → {route.to}
              </span>
              <span className="route-time">{route.time}</span>
            </div>
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default RouteList;
