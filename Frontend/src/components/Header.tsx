import { Link, useLocation } from "react-router-dom";
import { Bus, Zap } from "lucide-react";

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Bus className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">KrkBus</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className={`text-lg font-medium transition-colors ${
              isActive("/")
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            Trasy
          </Link>
          <Link
            to="/points"
            className={`flex items-center gap-2 text-lg font-medium transition-colors ${
              isActive("/points")
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            <Zap className="w-5 h-5" />
            Punkty
          </Link>
          <Link
            to="/admin"
            className={`text-lg font-medium transition-colors ${
              isActive("/admin")
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            Panel Administratora
          </Link>
        </div>

        {/* User Profile (placeholder) */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">U</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
