import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { MainPage } from "@/components/MainPage";
import { OwnerPage } from "@/components/OwnerPage";
import { Dashboard } from "@/views/Dashboard";
import { RouteDetail } from "@/views/RouteDetail";
import { Points } from "@/views/Points";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/route/:id" element={<RouteDetail />} />
          <Route path="/points" element={<Points />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<MainPage />} />
          <Route path="/owner" element={<OwnerPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
