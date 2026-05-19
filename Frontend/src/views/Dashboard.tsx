import { Layout } from "@/components/Layout";
import { BusRouteCard } from "@/components/BusRouteCard";
import type { BusRoute, BusStop } from "@/types/bus";
import { Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface ApiStop {
  stopID: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface ApiRoute {
  routeID: number;
  name: string;
  description: string;
  stops?: ApiStop[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

const fetchJson = async <T,>(url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
};

const toRadians = (value: number) => (value * Math.PI) / 180;

const calculateDistanceKm = (stops: BusStop[]) => {
  if (stops.length < 2) {
    return 0;
  }

  const radiusKm = 6371;
  let total = 0;

  for (let i = 1; i < stops.length; i += 1) {
    const prev = stops[i - 1].coordinate;
    const next = stops[i].coordinate;
    const deltaLat = toRadians(next.latitude - prev.latitude);
    const deltaLng = toRadians(next.longitude - prev.longitude);
    const lat1 = toRadians(prev.latitude);
    const lat2 = toRadians(next.latitude);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLng / 2) *
        Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    total += radiusKm * c;
  }

  return Math.round(total * 10) / 10;
};

const mapApiRoute = (route: ApiRoute): BusRoute => {
  const stops: BusStop[] = (route.stops ?? []).map((stop) => ({
    id: stop.stopID.toString(),
    name: stop.name,
    coordinate: {
      latitude: stop.latitude,
      longitude: stop.longitude,
    },
  }));
  const startStop = stops[0] ?? {
    id: "start",
    name: "Brak danych",
    coordinate: { latitude: 0, longitude: 0 },
  };
  const endStop = stops[stops.length - 1] ?? startStop;

  return {
    id: route.routeID.toString(),
    name: route.name,
    number: route.routeID.toString(),
    description: route.description,
    startStop,
    endStop,
    stops,
    schedule: [],
    pricing: {
      studentTicket: 0,
      normalTicket: 0,
      seniorTicket: 0,
      dayPass: 0,
    },
    frequency: "Brak danych",
    distance: calculateDistanceKm(stops),
  };
};

export function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadRoutes = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchJson<ApiRoute[]>(`${API_BASE_URL}/api/routes`);
      setRoutes((data ?? []).map(mapApiRoute));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Nie udało się pobrać listy tras.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  const filteredRoutes = useMemo(
    () =>
      routes.filter(
        (route) =>
          route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          route.number.includes(searchTerm) ||
          route.description.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [routes, searchTerm],
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Trasy autobusowe Krakowa
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Znajdź i sprawdź harmonogram i ceny Twojej trasę
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj trasy po nazwie, numerze lub opisie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-600 focus:border-blue-600 dark:focus:border-blue-400 focus:outline-none transition bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((route) => (
            <BusRouteCard key={route.id} route={route} />
          ))}
        </div>

        {errorMessage && (
          <div className="text-center text-sm text-red-600 dark:text-red-300">
            {errorMessage}
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredRoutes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Nie znaleziono tras pasujących do wyszukiwania
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
