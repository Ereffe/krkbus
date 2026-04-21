import { BusRoute } from "@/types/bus";
import { Link } from "react-router-dom";
import { MapPin, Clock, DollarSign, Zap } from "lucide-react";

interface BusRouteCardProps {
  route: BusRoute;
}

export function BusRouteCard({ route }: BusRouteCardProps) {
  return (
    <Link to={`/route/${route.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all p-6 cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="inline-block bg-blue-100 text-blue-700 rounded-full px-4 py-1 font-bold text-lg mb-2">
              Linia {route.number}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{route.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{route.description}</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Route Distance */}
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-sm">{route.distance} km</span>
          </div>

          {/* Time Info */}
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-4 h-4 text-green-600" />
            <span className="text-sm">{route.frequency}</span>
          </div>

          {/* Pricing Preview */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t">
            <div className="text-center">
              <p className="text-xs text-gray-500">Zwykły bilet</p>
              <p className="font-bold text-blue-600">{route.pricing.normalTicket.toFixed(2)} zł</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Student</p>
              <p className="font-bold text-green-600">{route.pricing.studentTicket.toFixed(2)} zł</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Senior</p>
              <p className="font-bold text-orange-600">{route.pricing.seniorTicket.toFixed(2)} zł</p>
            </div>
          </div>

          {/* Stops Count */}
          <div className="flex items-center gap-2 text-gray-700 pt-2 border-t">
            <Zap className="w-4 h-4 text-yellow-600" />
            <span className="text-sm">{route.stops.length} przystanków</span>
          </div>

          {/* View Details Button */}
          <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
            Szczegóły trasy
          </button>
        </div>
      </div>
    </Link>
  );
}
