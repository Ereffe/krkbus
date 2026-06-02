import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MainPage } from "@/components/MainPage";
import { OwnerPage } from "@/components/OwnerPage";
import { Dashboard } from "@/views/Dashboard";
import { RouteDetail } from "@/views/RouteDetail";
import { Points } from "@/views/Points";
import { DriverDashboard } from "@/views/DriverDashboard";
import { DriverPortal } from "@/views/DriverPortal";
import { Login } from "@/views/Login";
import { Register } from "@/views/Register";
import { Header } from "@/components/Header";

// App layout wrapper to include header
const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
    <Header />
    <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Public Routes with Header */}
            <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/route/:id" element={<AppLayout><RouteDetail /></AppLayout>} />
            
            {/* Protected User Routes */}
            <Route 
              path="/points" 
              element={
                <ProtectedRoute allowedRoles={["USER"]}>
                  <AppLayout><Points /></AppLayout>
                </ProtectedRoute>
              } 
            />

            {/* Protected Driver Routes */}
            <Route 
              path="/driver" 
              element={
                <ProtectedRoute allowedRoles={["DRIVER"]}>
                  <AppLayout><DriverPortal /></AppLayout>
                </ProtectedRoute>
              } 
            />

            {/* Protected Secretary/Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "SECRETARY"]}>
                  <AppLayout><MainPage /></AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/drivers" 
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "SECRETARY"]}>
                  <AppLayout><DriverDashboard /></AppLayout>
                </ProtectedRoute>
              } 
            />

            {/* Protected Owner Routes */}
            <Route 
              path="/owner" 
              element={
                <ProtectedRoute allowedRoles={["OWNER", "ADMIN"]}>
                  <AppLayout><OwnerPage /></AppLayout>
                </ProtectedRoute>
              } 
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
