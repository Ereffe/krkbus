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
    "normal"
  );

  const route = mockBusRoutes.find((r) => r.id === id);

  if (!route) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">Trasa nie znaleziona</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
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
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Wróć do tras
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="inline-block bg-blue-100 text-blue-700 rounded-full px-6 py-2 font-bold text-2xl mb-3">
                Linia {route.number}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{route.name}</h1>
              <p className="text-gray-600 text-lg mt-2">{route.description}</p>
            </div>
          </div>

          {/* Key Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Odległość</p>
                <p className="font-semibold text-gray-900">{route.distance} km</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-green-600 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Częstotliwość</p>
                <p className="font-semibold text-gray-900">{route.frequency}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Zap className="w-5 h-5 text-yellow-600 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Przystanków</p>
                <p className="font-semibold text-gray-900">{route.stops.length}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Banknote className="w-5 h-5 text-orange-600 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Cena</p>
                <p className="font-semibold text-gray-900">
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Mapa trasy
              </h2>
              <RouteMap route={route} />
            </div>

            {/* Stops List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Lista przystanków
              </h2>
              <div className="space-y-3">
                {route.stops.map((stop, index) => (
                  <div
                    key={stop.id}
                    className="flex items-start gap-4 pb-4 border-b last:border-b-0"
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Harmonogram
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2 px-4 text-gray-700 font-semibold">
                        Odjazd
                      </th>
                      <th className="text-left py-2 px-4 text-gray-700 font-semibold">
                        Przyjazd
                      </th>
                      <th className="text-left py-2 px-4 text-gray-700 font-semibold">
                        Dni
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {route.schedule.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900 font-medium">
                          {item.departure}
                        </td>
                        <td className="py-3 px-4 text-gray-900">{item.arrival}</td>
                        <td className="py-3 px-4 text-gray-600">
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
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Typ biletu
              </h3>

              <div className="space-y-3 mb-8">
                {[
                  { id: "normal", label: "Bilet normalny", price: route.pricing.normalTicket },
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
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
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
                      <p className="font-semibold text-gray-900">
                        {option.label}
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {option.price.toFixed(2)} zł
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Passe Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Karnet dobowy
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {route.pricing.dayPass.toFixed(2)} zł
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Nieograniczony dostęp na dzień
                </p>
              </div>

              {/* Buy Button */}
              <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
                Kup bilet
              </button>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-900">
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
