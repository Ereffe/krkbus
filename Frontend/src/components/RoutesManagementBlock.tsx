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
import { Plus } from "lucide-react";

interface Route {
  id: number;
  number: string;
  name: string;
  distance: string;
  frequency: string;
  stops: number;
  status: string;
}

export function RoutesManagementBlock() {
  const [routes, setRoutes] = useState<Route[]>([
    {
      id: 1,
      number: "1",
      name: "Kraków - Warszawa",
      distance: "280 km",
      frequency: "Co 2 godziny",
      stops: 8,
      status: "Aktywna",
    },
    {
      id: 2,
      number: "2",
      name: "Warszawa - Gdańsk",
      distance: "340 km",
      frequency: "Co 3 godziny",
      stops: 6,
      status: "Aktywna",
    },
    {
      id: 3,
      number: "3",
      name: "Kraków - Gdańsk",
      distance: "620 km",
      frequency: "Codziennie",
      stops: 12,
      status: "Nieaktywna",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    number: "",
    name: "",
    distance: "",
    frequency: "",
    stops: "",
    status: "Aktywna",
  });

  const handleAddRoute = () => {
    if (
      formData.number &&
      formData.name &&
      formData.distance &&
      formData.frequency &&
      formData.stops
    ) {
      const newRoute: Route = {
        id: Math.max(...routes.map((r) => r.id), 0) + 1,
        number: formData.number,
        name: formData.name,
        distance: formData.distance,
        frequency: formData.frequency,
        stops: parseInt(formData.stops),
        status: formData.status,
      };
      setRoutes([...routes, newRoute]);
      setFormData({
        number: "",
        name: "",
        distance: "",
        frequency: "",
        stops: "",
        status: "Aktywna",
      });
      setIsDialogOpen(false);
    }
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
                    {route.distance}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                    {route.frequency}
                  </TableCell>
                  <TableCell className="text-gray-900 dark:text-white font-medium text-center py-4">
                    {route.stops}
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
        <DialogContent className="bg-white dark:bg-slate-800 border dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Dodaj Nową Trasę
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dystans
              </label>
              <input
                type="text"
                value={formData.distance}
                onChange={(e) =>
                  setFormData({ ...formData, distance: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                placeholder="np. 280 km"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Liczba Przystanków
              </label>
              <input
                type="number"
                value={formData.stops}
                onChange={(e) =>
                  setFormData({ ...formData, stops: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                placeholder="np. 8"
              />
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
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300"
            >
              Anuluj
            </Button>
            <Button
              onClick={handleAddRoute}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
            >
              Dodaj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
