import { useParams, useNavigate } from "react-router-dom";
import { mockBusRoutes } from "@/data/mockRoutes";
import { Layout } from "@/components/Layout";
import { RouteMap } from "@/components/RouteMap";
import { ArrowLeft, MapPin, Clock, Banknote, Zap } from "lucide-react";
import { useState } from "react";

export function RouteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticketType, setTicketType] = useState<"normal" | "student" | "senior">(
    "normal",
  );

  const route = mockBusRoutes.find((r) => r.id === id);

  if (!route) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            Trasa nie znaleziona
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
                  {route.frequency}
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
                  {currentPrice.toFixed(2)} zł
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
              <RouteMap route={route} />
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
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{stop.name}</p>
                      {stop.arrivalTime && (
                        <p className="text-sm text-gray-500">
                          Przyjazd: {stop.arrivalTime}
                        </p>
                      )}
                      
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Współrzędne</p>
                      <p className="text-sm text-gray-700">
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
            </div>
          </div>

          {/* Sidebar - Pricing */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-900/50 p-6 sticky top-6 border dark:border-slate-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Typ biletu
              </h3>

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
                    className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition border-2 ${
                      ticketType === option.id
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

              {/* Passe Info */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-6 border border-gray-200 dark:border-slate-600">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Karnet dobowy
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {route.pricing.dayPass.toFixed(2)} zł
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Nieograniczony dostęp na dzień
                </p>
              </div>

              {/* Buy Button */}
              <button className="w-full bg-blue-600 dark:bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 transition">
                Kup bilet
              </button>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-xs text-blue-900 dark:text-blue-300">
                  💡 Zapamiętaj, że możesz wygodnie kupić bilet za pośrednictwem
                  naszej aplikacji mobilnej
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
