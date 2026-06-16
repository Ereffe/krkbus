import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bus, Zap, Moon, Sun, LogOut, User as UserIcon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [lang, setLang] = useState("EN");
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const { i18n, t } = useTranslation();

  useEffect(() => {
    const lang = i18n.language === "en" ? "EN" : "PL";
    setLang(lang);
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "pl" : "en";
    i18n.changeLanguage(newLang);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white dark:bg-slate-900 shadow-md dark:shadow-lg dark:border-b dark:border-slate-700 transition-colors sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Bus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white hidden sm:block">
            KrkBus
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto flex-1 justify-center px-4">
          <Link
            to="/"
            className={`text-base sm:text-lg font-medium transition-colors whitespace-nowrap ${
              isActive("/")
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            {t("header.routes")}
          </Link>

          <Link
            to="/info"
            className={`text-base sm:text-lg font-medium transition-colors whitespace-nowrap ${
              isActive("/info")
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            {t("header.info")}
          </Link>

          {isAuthenticated && user?.role === "USER" && (
            <Link
              to="/points"
              className={`flex items-center gap-2 text-base sm:text-lg font-medium transition-colors whitespace-nowrap ${
                isActive("/points")
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              {t("header.points")}
            </Link>
          )}

          {isAuthenticated &&
            (user?.role === "ADMIN" || user?.role === "SECRETARY") && (
              <Link
                to="/admin"
                className={`text-base sm:text-lg font-medium transition-colors whitespace-nowrap ${
                  isActive("/admin")
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {t("header.secretaryPanel")}
              </Link>
            )}

          {isAuthenticated &&
            (user?.role === "DRIVER" || user?.role === "ADMIN") && (
              <Link
                to="/driver"
                className={`text-base sm:text-lg font-medium transition-colors whitespace-nowrap ${
                  isActive("/driver")
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {t("header.driverPanel")}
              </Link>
            )}

          {isAuthenticated &&
            (user?.role === "OWNER" || user?.role === "ADMIN") && (
              <Link
                to="/owner"
                className={`text-base sm:text-lg font-medium transition-colors whitespace-nowrap ${
                  isActive("/owner")
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {t("header.ownerPanel")}
              </Link>
            )}
        </div>

        {/* User Profile and Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-sm font-bold text-gray-700 dark:text-gray-300 w-9 flex items-center justify-center"
            title={t("header.toggleLanguage")}
          >
            {lang}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            title={t("header.toggleTheme")}
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-gray-700" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-400" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center hidden sm:flex">
                <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm sm:text-base">
                  {user?.role.charAt(0) || "U"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title={t("header.logout")}
                className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="hidden sm:flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4" />
                  {t("header.login")}
                </Button>
                <Button variant="ghost" size="icon" className="sm:hidden">
                  <UserIcon className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/register" className="hidden sm:block">
                <Button variant="default">{t("header.register")}</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
