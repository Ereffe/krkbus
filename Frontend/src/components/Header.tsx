import { Link, useLocation } from "react-router-dom";
import { Bus, Zap, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function Header() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white dark:bg-slate-900 shadow-md dark:shadow-lg dark:border-b dark:border-slate-700 transition-colors">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Bus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            KrkBus
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className={`text-lg font-medium transition-colors ${
              isActive("/")
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            Trasy
          </Link>
          <Link
            to="/points"
            className={`flex items-center gap-2 text-lg font-medium transition-colors ${
              isActive("/points")
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <Zap className="w-5 h-5" />
            Punkty
          </Link>
          <Link
            to="/admin"
            className={`text-lg font-medium transition-colors ${
              isActive("/admin")
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            Panel Administratora
          </Link>
        </div>

        {/* User Profile and Theme Toggle */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            title={`Przełącz na ${theme === "light" ? "tryb ciemny" : "tryb jasny"}`}
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-gray-700" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-400" />
            )}
          </button>

          {/* User Profile Placeholder */}
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              U
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
}
