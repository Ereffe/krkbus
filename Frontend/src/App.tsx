import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { MainPage } from "@/components/MainPage";
import { OwnerPage } from "@/components/OwnerPage";
import { Dashboard } from "@/views/Dashboard";
import { RouteDetail } from "@/views/RouteDetail";
import { Points } from "@/views/Points";
import { DriverDashboard } from "@/views/DriverDashboard";
import { DriverPortal } from "@/views/DriverPortal";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/route/:id" element={<RouteDetail />} />
          <Route path="/points" element={<Points />} />
          <Route path="/driver" element={<DriverPortal />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<MainPage />} />
          <Route path="/owner" element={<OwnerPage />} />
          <Route path="/admin/drivers" element={<DriverDashboard />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
