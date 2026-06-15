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
import { useCallback, useEffect, useMemo, useState } from "react";
import { useT } from "@/i18n";

interface ApiRoute {
  routeID: number;
  name: string;
}

interface ApiReservation {
  id: number;
  passenger: string;
  seat: string;
  routeId: string;
  date: string;
}

interface UiTripRow {
  id: number;
  passenger: string;
  seat: string;
  routeId: string;
  date: string;
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

export function ReservationsBlock() {
  const t = useT();

  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [routes, setRoutes] = useState<ApiRoute[]>([]);
  const [reservations, setReservations] = useState<UiTripRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [routesData, reservationsData] = await Promise.all([
        fetchJson<ApiRoute[]>(`${API_BASE_URL}/api/routes`),
        fetchJson<ApiReservation[]>(`${API_BASE_URL}/api/reservations`),
      ]);

      setRoutes(routesData ?? []);

      const mappedReservations = (reservationsData ?? []).map((res) => ({
        id: res.id,
        passenger: res.passenger,
        seat: res.seat,
        routeId: res.routeId,
        date: res.date,
      }));
      setReservations(mappedReservations);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : t("app.secretary.reservations.fetchError");
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredReservations = useMemo(
    () =>
      selectedRoute
        ? reservations.filter((res) => res.routeId === selectedRoute)
        : reservations,
    [selectedRoute, reservations],
  );

  return (
    <Card className="bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-900/50 border dark:border-slate-700">
      <CardHeader className="border-b dark:border-slate-700 pb-6">
        <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold">
          {t("app.secretary.reservations.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedRoute("")}
            className={`px-4 py-2 rounded-full font-medium transition-all ${selectedRoute === ""
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
          >
            {t("app.secretary.reservations.all")}
          </button>
          {routes.map((route) => (
            <button
              key={route.routeID}
              onClick={() => setSelectedRoute(route.routeID.toString())}
              className={`px-4 py-2 rounded-full font-medium transition-all ${selectedRoute === route.routeID.toString()
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
            >
              {route.name}
            </button>
          ))}
        </div>
        <div className="w-full overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b dark:border-slate-700">
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  {t("app.secretary.reservations.passenger")}
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  {t("app.secretary.reservations.seat")}
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  {t("app.secretary.reservations.route")}
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  {t("app.secretary.reservations.date")}
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  {t("app.secretary.reservations.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.map((reservation) => (
                <TableRow
                  key={reservation.id}
                  className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                >
                  <TableCell className="text-gray-900 dark:text-white py-4">
                    {reservation.passenger}
                  </TableCell>
                  <TableCell className="font-semibold text-blue-600 dark:text-blue-400 py-4">
                    {reservation.seat}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                    {routes.find(
                      (r) => r.routeID.toString() === reservation.routeId,
                    )?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                    {reservation.date}
                  </TableCell>
                  <TableCell className="py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      {t("common.details")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && filteredReservations.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    {t("app.secretary.reservations.noReservations")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {errorMessage && (
          <p className="text-sm text-red-600 dark:text-red-300 mt-4">
            {errorMessage}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
