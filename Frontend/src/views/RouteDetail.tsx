import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { RouteMap } from "@/components/RouteMap";
import { ArrowLeft, MapPin, Clock, Banknote, Zap } from "lucide-react";
import type { BusRoute, BusStop } from "@/types/bus";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Toast, type ToastState } from "@/components/Toast";



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

interface ApiPrice {
  priceID: number;
  normalTicket: number;
  studentTicket: number;
  seniorTicket: number;
  dayPass: number;
  route?: { routeID: number };
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

const mapApiRoute = (
  route: ApiRoute,
  priceByRouteId: Map<number, ApiPrice>,
): BusRoute => {
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

  const price = priceByRouteId.get(route.routeID);

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
      studentTicket: price?.studentTicket ?? 0,
      normalTicket: price?.normalTicket ?? 0,
      seniorTicket: price?.seniorTicket ?? 0,
      dayPass: price?.dayPass ?? 0,
    },
    frequency: "Brak danych",
    distance: calculateDistanceKm(stops),
  };
};

export function RouteDetail() {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    variant: "success",
    title: "",
    message: "",
  });

  const showToast = ({
    title,
    message,
    variant,
  }: {
    title?: string;
    message?: string;
    variant: ToastState["variant"];
  }) => {
    setToast({ open: true, title, message, variant });
  };

  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  const toastProps = {
    toast: toast,
    onClose: closeToast,
  };

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticketType, setTicketType] = useState<"normal" | "student" | "senior">(
    "normal",
  );
  const [route, setRoute] = useState<BusRoute | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadRoute = useCallback(async () => {
    if (!id) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [routeData, pricesData] = await Promise.all([
        fetchJson<ApiRoute>(`${API_BASE_URL}/api/routes/${id}`),
        fetchJson<ApiPrice[]>(`${API_BASE_URL}/api/prices`),
      ]);
      const priceByRouteId = new Map<number, ApiPrice>();
      (pricesData ?? []).forEach((price) => {
        if (price.route?.routeID) {
          priceByRouteId.set(price.route.routeID, price);
        }
      });
      setRoute(mapApiRoute(routeData, priceByRouteId));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Nie udało się pobrać szczegółów trasy.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadRoute();
  }, [loadRoute]);

  const hasPricing = useMemo(
    () =>
      !!route &&
      (route.pricing.normalTicket > 0 ||
        route.pricing.studentTicket > 0 ||
        route.pricing.seniorTicket > 0),
    [route],
  );
  const hasSchedule = route ? route.schedule.length > 0 : false;
  const canShowMap = route ? route.stops.length >= 2 : false;

  if (!route) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            {isLoading
              ? "Ładowanie trasy..."
              : (errorMessage ?? "Trasa nie znaleziona")}
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
          >
            Wróć do tras
          </button>
        </div>
      </Layout>
    );
  }

  const prices = {
    normal: route.pricing.normalTicket,
    student: route.pricing.studentTicket,
    senior: route.pricing.seniorTicket,
  };

  const currentPrice = prices[ticketType];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Wróć do tras
        </button>

        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-900/50 p-8 border dark:border-slate-700">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full px-6 py-2 font-bold text-2xl mb-3">
                Linia {route.number}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {route.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">
                {route.description}
              </p>
            </div>
          </div>

          {/* Key Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t dark:border-slate-700">
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Odległość
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {route.distance} km
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Częstotliwość
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {route.frequency !== "Brak danych"
                    ? route.frequency
                    : "Brak danych"}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Przystanków
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {route.stops.length}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Banknote className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Cena</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {hasPricing ? `${currentPrice.toFixed(2)} zł` : "Brak danych"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Map */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-900/50 p-6 border dark:border-slate-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Mapa trasy
              </h2>
              {canShowMap ? (
                <RouteMap route={route} />
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 dark:border-slate-600 p-6 text-sm text-gray-500 dark:text-gray-400">
                  Brak danych o trasie do wyświetlenia na mapie.
                </div>
              )}
            </div>

            {/* Stops List */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-900/50 p-6 border dark:border-slate-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Lista przystanków
              </h2>
              <div className="space-y-3">
                {route.stops.map((stop, index) => (
                  <div
                    key={stop.id}
                    className="flex items-start gap-4 pb-4 border-b dark:border-slate-700 last:border-b-0"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {stop.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Współrzędne
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {stop.coordinate.latitude.toFixed(4)},{" "}
                        {stop.coordinate.longitude.toFixed(4)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-900/50 p-6 border dark:border-slate-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Harmonogram
              </h2>
              {hasSchedule ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-200 dark:border-slate-600">
                        <th className="text-left py-2 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                          Odjazd
                        </th>
                        <th className="text-left py-2 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                          Przyjazd
                        </th>
                        <th className="text-left py-2 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                          Dni
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {route.schedule.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                        >
                          <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                            {item.departure}
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {item.arrival}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {item.daysOfWeek.includes(1) &&
                              item.daysOfWeek.includes(5)
                              ? item.daysOfWeek.includes(6)
                                ? "Codziennie"
                                : "Dni robocze"
                              : "Weekendy"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 dark:border-slate-600 p-6 text-sm text-gray-500 dark:text-gray-400">
                  Harmonogram nie jest jeszcze dostępny dla tej trasy.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Pricing */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-900/50 p-6 sticky top-6 border dark:border-slate-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Typ biletu
              </h3>
              {hasPricing ? (
                <div className="space-y-3 mb-8">
                  {[
                    {
                      id: "normal",
                      label: "Bilet normalny",
                      price: route.pricing.normalTicket,
                    },
                    {
                      id: "student",
                      label: "Bilet studencki",
                      price: route.pricing.studentTicket,
                    },
                    {
                      id: "senior",
                      label: "Bilet seniorski",
                      price: route.pricing.seniorTicket,
                    },
                  ].map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition border-2 ${ticketType === option.id
                        ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900"
                        : "border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500"
                        }`}
                    >
                      <input
                        type="radio"
                        name="ticket"
                        value={option.id}
                        checked={ticketType === option.id}
                        onChange={(e) =>
                          setTicketType(e.target.value as typeof ticketType)
                        }
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {option.label}
                        </p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {option.price.toFixed(2)} zł
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 dark:border-slate-600 p-4 text-sm text-gray-500 dark:text-gray-400 mb-8">
                  Cennik nie jest jeszcze dostępny dla tej trasy.
                </div>
              )}

              {/* Passe Info */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-6 border border-gray-200 dark:border-slate-600">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Karnet dobowy
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {hasPricing
                    ? `${route.pricing.dayPass.toFixed(2)} zł`
                    : "Brak danych"}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Nieograniczony dostęp na dzień
                </p>
              </div>

              {/* Buy Button */}
              <button
                type="button"
                disabled={isLoading}
                onClick={async () => {
                  setErrorMessage(null);
                  setIsLoading(true);
                  try {
                    // For now, frontend “kup bilet” maps to reservation creation by route+date.
                    // We need user to be logged in (ReservationService resolves Client from security context).
                    const reservationDate = new Date().toISOString().split("T")[0];

                    const payload = {
                      routeID: Number(id),
                      // Backend expects LocalDate (no time). Send ISO date string.
                      reservationDate: reservationDate,
                      seatCount: 1,
                    };

                    const res = await fetch(`${API_BASE_URL}/api/reservations/create`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        ...(localStorage.getItem("token")
                          ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
                          : {}),
                      },
                      body: JSON.stringify(payload),
                    });

                    if (!res.ok) {
                      const message = await res.text();
                      throw new Error(message || `Request failed (${res.status})`);
                    }

                    // “jak rezerwacje” => po sukcesie wyświetl komunikat jako toast
                    showToast({
                      title: "Sukces",
                      message: "Bilet został kupiony (utworzono rezerwację).",
                      variant: "success",
                    });
                  } catch (e) {
                    setErrorMessage(
                      e instanceof Error
                        ? e.message
                        : "Nie udało się kupić biletu.",
                    );
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-400/50 transition"
              >
                {isLoading ? "Kupuję..." : "Kup bilet"}
              </button>
            </div>
          </div>
        </div>

        <Toast {...toastProps} />
      </div>
    </Layout>
  );
}
