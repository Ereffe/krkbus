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
import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Coordinate } from "@/types/bus";
import { StopMapPicker } from "@/components/StopMapPicker";

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

interface DraftStop {
  id: string;
  name: string;
  coordinate: Coordinate;
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

export function RoutesManagementBlock() {
  const [routes, setRoutes] = useState<ApiRoute[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"info" | "stops">("info");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stops: [] as DraftStop[],
  });
  const [mapCoordinate, setMapCoordinate] = useState<Coordinate | null>(null);
  const [newStopName, setNewStopName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateId = () => {
    return `stop-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleAddStop = () => {
    if (mapCoordinate && newStopName) {
      const newStop: DraftStop = {
        id: generateId(),
        name: newStopName,
        coordinate: mapCoordinate,
      };
      setFormData({
        ...formData,
        stops: [...formData.stops, newStop],
      });
      setNewStopName("");
      setMapCoordinate(null);
    }
  };

  const handleRemoveStop = (stopId: string) => {
    setFormData({
      ...formData,
      stops: formData.stops.filter((stop) => stop.id !== stopId),
    });
  };

  const loadRoutes = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchJson<ApiRoute[]>(`${API_BASE_URL}/api/routes`);
      setRoutes(data ?? []);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Nie udało się pobrać tras.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  const handleAddRoute = async () => {
    if (
      !formData.name ||
      !formData.description ||
      formData.stops.length === 0
    ) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const createdStops = await Promise.all(
        formData.stops.map((stop) =>
          fetchJson<ApiStop>(`${API_BASE_URL}/stops`, {
            method: "POST",
            body: JSON.stringify({
              name: stop.name,
              latitude: stop.coordinate.latitude,
              longitude: stop.coordinate.longitude,
            }),
          }),
        ),
      );

      const createdRoute = await fetchJson<ApiRoute>(
        `${API_BASE_URL}/api/routes/routes`,
        {
          method: "POST",
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            stopIds: createdStops.map((stop) => stop.stopID),
          }),
        },
      );

      setRoutes((prevRoutes) => [...prevRoutes, createdRoute]);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Nie udało się dodać trasy.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      stops: [],
    });
    setNewStopName("");
    setMapCoordinate(null);
    setSelectedTab("info");
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
        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
            {errorMessage}
          </div>
        )}
        <div className="w-full overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b dark:border-slate-700">
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Nazwa trasy
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Opis
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Przystanków
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Akcje
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow
                  key={route.routeID}
                  className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                >
                  <TableCell className="font-semibold text-gray-900 dark:text-white py-4">
                    {route.name}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                    {route.description}
                  </TableCell>
                  <TableCell className="text-gray-900 dark:text-white font-medium text-left py-4">
                    {route.stops?.length ?? 0}
                  </TableCell>
                  <TableCell className="py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300"
                      disabled={isLoading}
                    >
                      Edytuj
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && routes.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    Brak tras do wyświetlenia
                  </TableCell>
                </TableRow>
              )}
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
            <TabsList className="grid w-full grid-cols-2 gap-3 bg-gray-100 dark:bg-slate-700 p-2">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Opis
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                  placeholder="np. Trasa dalekobieżna przez główne miasta"
                />
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
                !formData.name ||
                !formData.description ||
                formData.stops.length === 0
              }
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Zapisywanie..." : "Dodaj trasę"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
