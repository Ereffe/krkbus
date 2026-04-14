import React, { useState } from "react";
import Header from "../components/Header";
import RouteList from "../components/RouteList";
import Pricing from "../components/Pricing";
import MapVisualization from "../components/MapVisualization";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import "../styles/Dashboard.css";

const Dashboard: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  return (
    <div className="dashboard-wrapper">
      <Header />
      <div className="dashboard-container">
        <div className="dashboard-content">
          <Card className="route-card">
            <CardHeader>
              <CardTitle>Lista Tras</CardTitle>
            </CardHeader>
            <CardContent>
              <RouteList onSelectRoute={setSelectedRoute} />
            </CardContent>
          </Card>

          <Card className="pricing-card">
            <CardHeader>
              <CardTitle>Cennik</CardTitle>
            </CardHeader>
            <CardContent>
              <Pricing selectedRoute={selectedRoute} />
            </CardContent>
          </Card>

          <Card className="map-card">
            <CardHeader>
              <CardTitle>Mapa Trasy</CardTitle>
            </CardHeader>
            <CardContent>
              <MapVisualization selectedRoute={selectedRoute} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
