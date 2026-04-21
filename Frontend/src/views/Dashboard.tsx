import { Layout } from "@/components/Layout";
import { BusRouteCard } from "@/components/BusRouteCard";
import { mockBusRoutes } from "@/data/mockRoutes";
import { Search } from "lucide-react";
import { useState } from "react";

export function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRoutes = mockBusRoutes.filter(
    (route) =>
      route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.number.includes(searchTerm) ||
      route.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Trasy autobusowe Krakowa
          </h1>
          <p className="text-lg text-gray-600">
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
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition bg-white"
            />
          </div>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((route) => (
            <BusRouteCard key={route.id} route={route} />
          ))}
        </div>

        {/* No Results */}
        {filteredRoutes.length === 0 && (
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
