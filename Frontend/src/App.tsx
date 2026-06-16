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
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, User, MapPin, Phone } from "lucide-react";

// App layout wrapper to include header
const InfoBlock = () => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center py-8">
      <Card className="w-full max-w-2xl bg-white dark:bg-slate-800 shadow-xl border dark:border-slate-700">
        <CardHeader className="border-b dark:border-slate-700 text-center">
          <CardTitle className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {t("app.info.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-8">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border dark:border-slate-700">
            <Building className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {t("app.info.companyName")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border dark:border-slate-700">
              <User className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                  {t("app.info.ownerLabel")}
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {t("app.info.owner")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border dark:border-slate-700">
              <Phone className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                  {t("app.info.phoneFaxLabel")}
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {t("app.info.phoneFax")}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border dark:border-slate-700">
            <MapPin className="w-6 h-6 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                {t("app.info.addressLabel")}
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {t("app.info.address")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

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
            <Route
              path="/"
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              }
            />
            <Route
              path="/route/:id"
              element={
                <AppLayout>
                  <RouteDetail />
                </AppLayout>
              }
            />
            <Route
              path="/info"
              element={
                <AppLayout>
                  <InfoBlock />
                </AppLayout>
              }
            />

            {/* Protected User Routes */}
            <Route
              path="/points"
              element={
                <ProtectedRoute allowedRoles={["USER"]}>
                  <AppLayout>
                    <Points />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected Driver Routes */}
            <Route
              path="/driver"
              element={
                <ProtectedRoute allowedRoles={["DRIVER", "ADMIN", "OWNER"]}>
                  <AppLayout>
                    <DriverPortal />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected Secretary/Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "SECRETARY"]}>
                  <AppLayout>
                    <MainPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/drivers"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "SECRETARY"]}>
                  <AppLayout>
                    <DriverDashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected Owner Routes */}
            <Route
              path="/owner"
              element={
                <ProtectedRoute allowedRoles={["OWNER", "ADMIN"]}>
                  <AppLayout>
                    <OwnerPage />
                  </AppLayout>
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
