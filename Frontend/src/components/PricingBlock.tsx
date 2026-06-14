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
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

const fetchJson = async <T,>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
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

type ApiStop = {
  stopID: number;
  name: string;
  latitude: number;
  longitude: number;
};

type ApiRoute = {
  routeID: number;
  name: string;
  description: string;
  stops?: ApiStop[];
};

type ApiPrice = {
  priceID: number;
  normalTicket: number;
  studentTicket: number;
  seniorTicket: number;
  dayPass: number;
  route?: { routeID: number };
};

type DraftPrice = {
  normalTicket: string;
  studentTicket: string;
  seniorTicket: string;
  dayPass: string;
};

export function PricingBlock() {
  const [routes, setRoutes] = useState<ApiRoute[]>([]);
  const [pricesByRouteId, setPricesByRouteId] = useState<Map<number, ApiPrice>>(
    new Map(),
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState<number | null>(null);
  const [draft, setDraft] = useState<DraftPrice>({
    normalTicket: "",
    studentTicket: "",
    seniorTicket: "",
    dayPass: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [routesData, pricesData] = await Promise.all([
        fetchJson<ApiRoute[]>(`${API_BASE_URL}/api/routes`),
        fetchJson<ApiPrice[]>(`${API_BASE_URL}/api/prices`),
      ]);

      setRoutes(routesData ?? []);

      const map = new Map<number, ApiPrice>();
      (pricesData ?? []).forEach((p) => {
        if (p.route?.routeID) map.set(p.route.routeID, p);
      });
      setPricesByRouteId(map);
    } catch (e) {
      setErrorMessage(
        e instanceof Error ? e.message : "Nie udało się pobrać cen.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openEdit = (routeId: number) => {
    const price = pricesByRouteId.get(routeId);
    setEditingRouteId(routeId);
    setDraft({
      normalTicket: price ? String(price.normalTicket) : "",
      studentTicket: price ? String(price.studentTicket) : "",
      seniorTicket: price ? String(price.seniorTicket) : "",
      dayPass: price ? String(price.dayPass) : "",
    });
    setIsDialogOpen(true);
  };

  const toNumber = (s: string) => {
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  };

  const savePrice = async () => {
    if (!editingRouteId) return;

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const existing = pricesByRouteId.get(editingRouteId);

      const payload = {
        normalTicket: toNumber(draft.normalTicket),
        studentTicket: toNumber(draft.studentTicket),
        seniorTicket: toNumber(draft.seniorTicket),
        dayPass: toNumber(draft.dayPass),
        routeId: editingRouteId,
      };

      if (existing) {
        await fetchJson<ApiPrice>(
          `${API_BASE_URL}/api/routes/prices/${existing.priceID}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          },
        );
      } else {
        await fetchJson<ApiPrice>(`${API_BASE_URL}/api/prices`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      await load();
      setIsDialogOpen(false);
    } catch (e) {
      setErrorMessage(
        e instanceof Error ? e.message : "Nie udało się zapisać ceny.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-900/50 border dark:border-slate-700">
      <CardHeader className="border-b dark:border-slate-700 pb-6">
        <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold">
          Ustaw Ceny
        </CardTitle>
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
                  Trasa
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Akcje
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-center">
                  Normalny
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-center">
                  Student
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-center">
                  Senior
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-center">
                  Dzienny
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {routes.map((route) => {
                const price = pricesByRouteId.get(route.routeID);
                return (
                  <TableRow
                    key={route.routeID}
                    className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                  >
                    <TableCell className="font-semibold text-gray-900 dark:text-white py-4">
                      {route.name}
                    </TableCell>
                    <TableCell className="py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(route.routeID)}
                        disabled={isLoading}
                        className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        Edytuj
                      </Button>
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white font-medium text-center py-4">
                      {price ? `${price.normalTicket.toFixed(2)} zł` : "—"}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white font-medium text-center py-4">
                      {price ? `${price.studentTicket.toFixed(2)} zł` : "—"}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white font-medium text-center py-4">
                      {price ? `${price.seniorTicket.toFixed(2)} zł` : "—"}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white font-medium text-center py-4">
                      {price ? `${price.dayPass.toFixed(2)} zł` : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}

              {!isLoading && routes.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
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
        <DialogContent className="bg-white dark:bg-slate-800 border dark:border-slate-700 max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Edytuj ceny
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Normalny
              </label>
              <Input
                value={draft.normalTicket}
                onChange={(e) =>
                  setDraft({ ...draft, normalTicket: e.target.value })
                }
                placeholder="np. 45"
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Student
              </label>
              <Input
                value={draft.studentTicket}
                onChange={(e) =>
                  setDraft({ ...draft, studentTicket: e.target.value })
                }
                placeholder="np. 22.5"
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Senior
              </label>
              <Input
                value={draft.seniorTicket}
                onChange={(e) =>
                  setDraft({ ...draft, seniorTicket: e.target.value })
                }
                placeholder="np. 22.5"
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Bilet dzienny
              </label>
              <Input
                value={draft.dayPass}
                onChange={(e) =>
                  setDraft({ ...draft, dayPass: e.target.value })
                }
                placeholder="np. 100"
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t dark:border-slate-700">
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
              }}
              className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300"
              disabled={isLoading}
            >
              Anuluj
            </Button>
            <Button
              onClick={savePrice}
              disabled={isLoading || !editingRouteId}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Zapisywanie..." : "Zapisz"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
