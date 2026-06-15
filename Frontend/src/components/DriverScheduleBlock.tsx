import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
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
import { useCallback, useEffect, useMemo, useState } from "react";

interface ApiDriver {
  id: number;
  firstName: string | null;
  lastName: string | null;
  position: string;
}

interface ApiTrip {
  tripID: number;
  departureTime: string;
  arrivalTime: string;
  route?: { routeID: number; name?: string };
}

interface ApiScheduleEntry {
  scheduleID: number;
  date: string;
  shiftStartTime: string;
  shiftEndTime: string;
  employee?: { userID: number };
  employeeId?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

const fetchJson = async <T,>(url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

const toTimeLabel = (value?: string) => value?.slice(0, 5) ?? "—";

export function DriverScheduleBlock() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [drivers, setDrivers] = useState<ApiDriver[]>([]);
  const [schedules, setSchedules] = useState<ApiScheduleEntry[]>([]);
  const [trips, setTrips] = useState<ApiTrip[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [formData, setFormData] = useState({
    shiftStartTime: "",
    shiftEndTime: "",
    tripId: "",
  });

  const selectedDate = (date ?? new Date()).toISOString().split("T")[0];

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [driversData, schedulesData, tripsData] = await Promise.all([
        fetchJson<ApiDriver[]>(`${API_BASE_URL}/api/drivers`),
        fetchJson<ApiScheduleEntry[]>(`${API_BASE_URL}/api/schedules`).catch(() => [] as ApiScheduleEntry[]),

        fetchJson<ApiTrip[]>(`${API_BASE_URL}/trips`).catch(() => [] as ApiTrip[]),
      ]);
      setDrivers(driversData ?? []);
      setSchedules(schedulesData ?? []);
      setTrips(tripsData ?? []);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Nie udało się pobrać grafiku kierowców.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const schedulesByDriver = useMemo(() => {
    const entries = schedules.filter((entry) => entry.date === selectedDate);
    const map = new Map<string, ApiScheduleEntry[]>();
    entries.forEach((entry) => {
      const driverId =
        entry.employee?.userID?.toString() ??
        entry.employeeId?.toString() ??
        "0";
      const list = map.get(driverId) ?? [];
      list.push(entry);
      map.set(driverId, list);
    });
    return map;
  }, [schedules, selectedDate]);

  const tripsForSelectedDate = useMemo(() => {
    return trips.filter((t) => t.departureTime?.startsWith(selectedDate));
  }, [trips, selectedDate]);

  const openDialog = (driverId: string) => {
    setSelectedDriverId(driverId);
    setFormData({
      shiftStartTime: "",
      shiftEndTime: "",
      tripId: "",
    });
    setIsDialogOpen(true);
  };

  const handleSaveSchedule = async () => {
    if (!selectedDriverId || !formData.shiftStartTime || !formData.shiftEndTime) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await fetchJson<ApiScheduleEntry>(`${API_BASE_URL}/api/schedules`, {
        method: "POST",
        body: JSON.stringify({
          date: selectedDate,
          shiftStartTime: formData.shiftStartTime,
          shiftEndTime: formData.shiftEndTime,
          employeeId: parseInt(selectedDriverId),
          tripId: formData.tripId ? parseInt(formData.tripId) : null,
        }),
      });
      await loadData();
      setIsDialogOpen(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Nie udało się zapisać grafiku.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-900/50 border dark:border-slate-700 h-full">
      <CardHeader className="border-b dark:border-slate-700 pb-6">
        <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold">
          Ustal Grafik Kierowców
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border dark:border-slate-600"
            />
          </div>
          <div className="w-full overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b dark:border-slate-700">
                  <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                    Kierowca
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                    Aktualny Grafik
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                    Akcje
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => {
                  const name =
                    driver.firstName && driver.lastName
                      ? `${driver.firstName} ${driver.lastName}`
                      : `Kierowca ${driver.id}`;

                  return (
                    <TableRow
                      key={driver.id}
                      className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                    >
                      <TableCell className="font-semibold text-gray-900 dark:text-white py-4">
                        {name}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                        {(() => {
                          const driverIdStr = String(driver.id);
                          const driverSchedules = schedulesByDriver.get(driverIdStr) ?? [];
                          return driverSchedules.length > 0
                            ? driverSchedules
                              .map(
                                (entry) =>
                                  `${toTimeLabel(entry.shiftStartTime)}-${toTimeLabel(entry.shiftEndTime)}`,
                              )
                              .join(", ")
                            : "Brak grafiku na ten dzień";
                        })()}
                      </TableCell>
                      <TableCell className="py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDialog(String(driver.id))}
                          className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          Dodaj zmianę
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!isLoading && drivers.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="py-6 text-center text-gray-500 dark:text-gray-400"
                    >
                      Brak kierowców do wyświetlenia
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {errorMessage && (
            <p className="text-sm text-red-600 dark:text-red-300">
              {errorMessage}
            </p>
          )}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white dark:bg-slate-800 border dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Dodaj zmianę na dzień {selectedDate}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Godzina start
                </label>
                <input
                  type="time"
                  value={formData.shiftStartTime}
                  onChange={(e) =>
                    setFormData({ ...formData, shiftStartTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Godzina koniec
                </label>
                <input
                  type="time"
                  value={formData.shiftEndTime}
                  onChange={(e) =>
                    setFormData({ ...formData, shiftEndTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Wycieczka (opcjonalnie)
              </label>
              <select
                value={formData.tripId}
                onChange={(e) =>
                  setFormData({ ...formData, tripId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                <option value="">Wybierz wycieczkę...</option>
                {tripsForSelectedDate.map((t) => (
                  <option key={t.tripID} value={t.tripID.toString()}>
                    Trasa: {t.route?.name ?? t.route?.routeID} ({t.departureTime.split('T')[1].slice(0, 5)})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Pokazane są tylko wycieczki dla wybranego dnia.
              </p>
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
              onClick={handleSaveSchedule}
              disabled={isLoading || !formData.shiftStartTime || !formData.shiftEndTime}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
            >
              {isLoading ? "Zapisywanie..." : "Zapisz"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
