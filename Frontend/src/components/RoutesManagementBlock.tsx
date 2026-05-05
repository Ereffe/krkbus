import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Plus, Trash2, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BusStop, Coordinate } from "@/types/bus";
import { StopMapPicker } from "@/components/StopMapPicker";

interface Route {
  id: string;
  number: string;
  name: string;
  distance: number;
  frequency: string;
  stops: BusStop[];
  status: string;
}

export function RoutesManagementBlock() {
  const [routes, setRoutes] = useState<Route[]>([
    {
      id: "1",
      number: "1",
      name: "Kraków - Warszawa",
      distance: 280,
      frequency: "Co 2 godziny",
      stops: [
        {
          id: "stop-1",
          name: "Kraków - Centrum",
          coordinate: { latitude: 50.0467, longitude: 19.9454 },
          arrivalTime: "00:00",
        },
        {
          id: "stop-2",
          name: "Warszawa - Centrum",
          coordinate: { latitude: 52.2297, longitude: 21.012 },
          arrivalTime: "04:30",
        },
      ],
      status: "Aktywna",
    },
    {
      id: "2",
      number: "2",
      name: "Warszawa - Gdańsk",
      distance: 340,
      frequency: "Co 3 godziny",
      stops: [
        {
          id: "stop-w1",
          name: "Warszawa - Centrum",
          coordinate: { latitude: 52.2297, longitude: 21.012 },
          arrivalTime: "00:00",
        },
        {
          id: "stop-g1",
          name: "Gdańsk - Centrum",
          coordinate: { latitude: 54.372, longitude: 18.6466 },
          arrivalTime: "05:00",
        },
      ],
      status: "Aktywna",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"info" | "stops">("info");
  const [formData, setFormData] = useState({
    number: "",
    name: "",
    distance: "",
    frequency: "",
    stops: [] as BusStop[],
    status: "Aktywna",
  });
  const [mapCoordinate, setMapCoordinate] = useState<Coordinate | null>(null);
  const [newStopName, setNewStopName] = useState("");
  const [newStopTime, setNewStopTime] = useState("");

  const generateId = () => {
    return `stop-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleAddStop = () => {
    if (mapCoordinate && newStopName) {
      const newStop: BusStop = {
        id: generateId(),
        name: newStopName,
        coordinate: mapCoordinate,
        arrivalTime: newStopTime || "00:00",
      };
      setFormData({
        ...formData,
        stops: [...formData.stops, newStop],
      });
      setNewStopName("");
      setNewStopTime("");
      setMapCoordinate(null);
    }
  };

  const handleRemoveStop = (stopId: string) => {
    setFormData({
      ...formData,
      stops: formData.stops.filter((stop) => stop.id !== stopId),
    });
  };

  const handleAddRoute = () => {
    if (
      formData.number &&
      formData.name &&
      formData.distance &&
      formData.frequency &&
      formData.stops.length > 0
    ) {
      const newRoute: Route = {
        id: generateId().replace("stop-", "route-"),
        number: formData.number,
        name: formData.name,
        distance: parseFloat(formData.distance),
        frequency: formData.frequency,
        stops: formData.stops,
        status: formData.status,
      };
      setRoutes([...routes, newRoute]);
      resetForm();
      setIsDialogOpen(false);
    }
  };

  const resetForm = () => {
    setFormData({
      number: "",
      name: "",
      distance: "",
      frequency: "",
      stops: [],
      status: "Aktywna",
    });
    setNewStopName("");
    setNewStopTime("");
    setMapCoordinate(null);
    setSelectedTab("info");
  };

  const getStatusBadgeColor = (status: string) => {
    return status === "Aktywna"
      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
  };

  return (
    <Card className="shadow-md dark:shadow-slate-900/50 border dark:border-slate-700">
      <CardHeader className="border-b dark:border-slate-700 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold">
            Ustaw Trasy
          </CardTitle>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Dodaj Trasę
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="w-full overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b dark:border-slate-700">
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Linia
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Nazwa Trasy
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Dystans
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Częstotliwość
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-center">
                  Przystanków
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Status
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Akcje
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow
                  key={route.id}
                  className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                >
                  <TableCell className="font-bold text-blue-600 dark:text-blue-400 py-4">
                    {route.number}
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900 dark:text-white py-4">
                    {route.name}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                    {route.distance} km
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                    {route.frequency}
                  </TableCell>
                  <TableCell className="text-gray-900 dark:text-white font-medium text-center py-4">
                    {route.stops.length}
                  </TableCell>
                  <TableCell className="py-4">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${getStatusBadgeColor(
                        route.status,
                      )}`}
                    >
                      {route.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      Edytuj
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white dark:bg-slate-800 border dark:border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Dodaj Nową Trasę
            </DialogTitle>
          </DialogHeader>

          <Tabs
            value={selectedTab}
            onValueChange={(v: string) => setSelectedTab(v as "info" | "stops")}
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-slate-700">
              <TabsTrigger
                value="info"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
              >
                Informacje o trasie
              </TabsTrigger>
              <TabsTrigger
                value="stops"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
              >
                Przystanki ({formData.stops.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Numer Linii
                </label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) =>
                    setFormData({ ...formData, number: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                  placeholder="np. 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nazwa Trasy
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                  placeholder="np. Kraków - Warszawa"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dystans (km)
                  </label>
                  <input
                    type="number"
                    value={formData.distance}
                    onChange={(e) =>
                      setFormData({ ...formData, distance: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                    placeholder="np. 280"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Częstotliwość
                  </label>
                  <input
                    type="text"
                    value={formData.frequency}
                    onChange={(e) =>
                      setFormData({ ...formData, frequency: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                    placeholder="np. Co 2 godziny"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                >
                  <option value="Aktywna">Aktywna</option>
                  <option value="Nieaktywna">Nieaktywna</option>
                </select>
              </div>
            </TabsContent>

            <TabsContent value="stops" className="space-y-4 py-4">
              {/* Mapa do wyboru przystanków */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Kliknij na mapę, aby dodać przystanekk
                </label>
                <StopMapPicker
                  onCoordinateSelect={setMapCoordinate}
                  selectedCoordinate={mapCoordinate}
                />
              </div>

              {/* Forma do wpisania danych przystanku */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 space-y-3 border border-gray-200 dark:border-slate-600">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nazwa przystanku
                    </label>
                    <input
                      type="text"
                      value={newStopName}
                      onChange={(e) => setNewStopName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                      placeholder="np. Kraków - Centrum"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Współrzędne
                      </label>
                      <div className="px-3 py-2 bg-gray-100 dark:bg-slate-600 rounded-lg text-sm text-gray-600 dark:text-gray-300">
                        {mapCoordinate
                          ? `${mapCoordinate.latitude.toFixed(4)}, ${mapCoordinate.longitude.toFixed(4)}`
                          : "Kliknij na mapę"}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Czas przyjazdu (HH:MM)
                      </label>
                      <input
                        type="time"
                        value={newStopTime}
                        onChange={(e) => setNewStopTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleAddStop}
                  disabled={!newStopName || !mapCoordinate}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Dodaj przystanekk
                </Button>
              </div>

              {/* Lista przystanków */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dodane przystanki ({formData.stops.length})
                </label>
                {formData.stops.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-700 rounded-lg border border-dashed border-gray-300 dark:border-slate-600">
                    Brak dodanych przystanków
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {formData.stops.map((stop, index) => (
                      <div
                        key={stop.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400 text-xs font-bold">
                              {index + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white truncate">
                                {stop.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {stop.coordinate.latitude.toFixed(4)},{" "}
                                {stop.coordinate.longitude.toFixed(4)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                            {stop.arrivalTime}
                          </span>
                          <button
                            onClick={() => handleRemoveStop(stop.id)}
                            className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="pt-4 border-t dark:border-slate-700">
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsDialogOpen(false);
              }}
              className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300"
            >
              Anuluj
            </Button>
            <Button
              onClick={handleAddRoute}
              disabled={
                !formData.number ||
                !formData.name ||
                !formData.distance ||
                !formData.frequency ||
                formData.stops.length === 0
              }
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Dodaj trasę
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
