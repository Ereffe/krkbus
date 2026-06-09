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
import { useCallback, useEffect, useMemo, useState } from "react";

interface ApiDriver {
  employeeNumber: number;
  position: string;
}

interface ApiScheduleEntry {
  scheduleID: number;
  date: string;
  shiftStartTime: string;
  shiftEndTime: string;
  employee?: { employeeNumber: number };
  employeeId?: number;
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

const toTimeLabel = (value?: string) => value?.slice(0, 5) ?? "—";

export function DriverScheduleBlock() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [drivers, setDrivers] = useState<ApiDriver[]>([]);
  const [schedules, setSchedules] = useState<ApiScheduleEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedDate = (date ?? new Date()).toISOString().split("T")[0];

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [driversData, schedulesData] = await Promise.all([
        fetchJson<ApiDriver[]>(`${API_BASE_URL}/api/drivers`),
        fetchJson<ApiScheduleEntry[]>(`${API_BASE_URL}/api/schedules`),
      ]);
      setDrivers(driversData ?? []);
      setSchedules(schedulesData ?? []);
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
        entry.employee?.employeeNumber?.toString() ??
        entry.employeeId?.toString() ??
        "0";
      const list = map.get(driverId) ?? [];
      list.push(entry);
      map.set(driverId, list);
    });
    return map;
  }, [schedules, selectedDate]);

  return (
    <Card className="shadow-md dark:shadow-slate-900/50 border dark:border-slate-700 h-full">
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
                {drivers.map((driver) => (
                  <TableRow
                    key={driver.employeeNumber}
                    className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                  >
                    <TableCell className="font-semibold text-gray-900 dark:text-white py-4">
                      Kierowca {driver.employeeNumber}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                      {schedulesByDriver.get(driver.employeeNumber.toString())
                        ? schedulesByDriver
                            .get(driver.employeeNumber.toString())
                            ?.map(
                              (entry) =>
                                `${toTimeLabel(entry.shiftStartTime)}-${toTimeLabel(entry.shiftEndTime)}`,
                            )
                            .join(", ")
                        : "Brak grafiku"}
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
    </Card>
  );
}
