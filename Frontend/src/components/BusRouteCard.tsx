import type { BusRoute } from "@/types/bus";
import { Link } from "react-router-dom";
import { MapPin, Clock, Zap } from "lucide-react";

interface BusRouteCardProps {
  route: BusRoute;
}

export function BusRouteCard({ route }: BusRouteCardProps) {
  const hasPricing =
    route.pricing.normalTicket > 0 ||
    route.pricing.studentTicket > 0 ||
    route.pricing.seniorTicket > 0;
  const hasFrequency = route.frequency && route.frequency !== "Brak danych";

  return (
    <Link to={`/route/${route.id}`}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl dark:hover:shadow-xl dark:shadow-slate-900/50 hover:scale-105 transition-all p-6 cursor-pointer border dark:border-slate-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full px-4 py-1 font-bold text-lg mb-2">
              Linia {route.number}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {route.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {route.description}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Route Distance */}
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm">{route.distance} km</span>
          </div>

          {/* Time Info */}
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm">
              {hasFrequency ? route.frequency : "Brak danych"}
            </span>
          </div>

          {/* Pricing Preview */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t dark:border-slate-700">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Zwykły bilet
              </p>
              <p className="font-bold text-blue-600 dark:text-blue-400">
                {hasPricing
                  ? `${route.pricing.normalTicket.toFixed(2)} zł`
                  : "—"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Student
              </p>
              <p className="font-bold text-green-600 dark:text-green-400">
                {hasPricing
                  ? `${route.pricing.studentTicket.toFixed(2)} zł`
                  : "—"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Senior</p>
              <p className="font-bold text-orange-600 dark:text-orange-400">
                {hasPricing
                  ? `${route.pricing.seniorTicket.toFixed(2)} zł`
                  : "—"}
              </p>
            </div>
          </div>

          {/* Stops Count */}
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 pt-2 border-t dark:border-slate-700">
            <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm">{route.stops.length} przystanków</span>
          </div>

          {/* View Details Button */}
          <button className="w-full mt-4 bg-blue-600 dark:bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition font-medium">
            Szczegóły trasy
          </button>
        </div>
      </div>
    </Link>
  );
}
