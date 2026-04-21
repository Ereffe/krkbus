import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainPage } from "@/components/MainPage";
import { Dashboard } from "@/views/Dashboard";
import { RouteDetail } from "@/views/RouteDetail";
import { Points } from "@/views/Points";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/route/:id" element={<RouteDetail />} />
        <Route path="/points" element={<Points />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
