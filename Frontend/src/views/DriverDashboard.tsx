import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Clock, Star, Award, AlertCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface ApiDriver {
  userID: number;
  position: string;
  login: string;
  role: string;
  status: string;
  profile?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

interface ApiScheduleEntry {
  scheduleID: number;
  date: string;
  shiftStartTime: string;
  shiftEndTime: string;
  employee?: { userID: number };
  employeeId?: number;
  trip?: { tripID?: number; route?: { routeID?: number } };
  tripId?: number;
}

interface UiDriver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  assignedRoutes: string[];
  currentStatus: "available" | "on-duty" | "break" | "off-duty";
  totalHours: number;
  yearsOfExperience: number;
  rating: number;
  joiningDate: string;
}

interface UiDriverSchedule {
  driverId: string;
  date: string;
  startTime: string;
  endTime: string;
  routeId: string;
  status: "completed" | "in-progress" | "scheduled" | "cancelled";
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

export function DriverDashboard() {
  const [drivers, setDrivers] = useState<UiDriver[]>([]);
  const [schedules, setSchedules] = useState<UiDriverSchedule[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<UiDriver | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-duty":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300";
      case "available":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300";
      case "break":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300";
      case "off-duty":
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "on-duty":
        return "Na służbie";
      case "available":
        return "Dostępny";
      case "break":
        return "Przerwa";
      case "off-duty":
        return "Wolny";
      default:
        return status;
    }
  };

  const mapDriver = (driver: ApiDriver): UiDriver => {
    const name = driver.profile?.firstName
      ? `${driver.profile.firstName} ${driver.profile.lastName ?? ""}`.trim()
      : `Kierowca ${driver.userID}`;
    return {
      id: driver.userID.toString(),
      name,
      email: driver.profile?.email ?? "—",
      phone: driver.profile?.phone ?? "—",
      licenseNumber: "—",
      assignedRoutes: [],
      currentStatus: "available",
      totalHours: 0,
      yearsOfExperience: 0,
      rating: 0,
      joiningDate: new Date().toISOString().split("T")[0],
    };
  };

  const mapSchedule = (entry: ApiScheduleEntry): UiDriverSchedule => {
    const driverId =
      entry.employee?.userID?.toString() ??
      entry.employeeId?.toString() ??
      "0";
    const routeId =
      entry.trip?.route?.routeID?.toString() ?? entry.tripId?.toString() ?? "—";

    return {
      driverId,
      date: entry.date,
      startTime: toTimeLabel(entry.shiftStartTime),
      endTime: toTimeLabel(entry.shiftEndTime),
      routeId,
      status: "scheduled",
    };
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [driversData, schedulesData] = await Promise.all([
        fetchJson<ApiDriver[]>(`${API_BASE_URL}/api/drivers`),
        fetchJson<ApiScheduleEntry[]>(`${API_BASE_URL}/api/schedules`),
      ]);

      const mappedSchedules = (schedulesData ?? []).map(mapSchedule);
      const onDutyDrivers = new Set(
        mappedSchedules
          .filter(
            (schedule) =>
              schedule.date === new Date().toISOString().split("T")[0],
          )
          .map((schedule) => schedule.driverId),
      );

      const mappedDrivers = (driversData ?? []).map((driver) => ({
        ...mapDriver(driver),
        currentStatus: onDutyDrivers.has(driver.userID.toString())
          ? ("on-duty" as const)
          : ("available" as const),
      }));

      setDrivers(mappedDrivers);
      setSchedules(mappedSchedules);
      setSelectedDriver(mappedDrivers[0] ?? null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Nie udało się pobrać danych kierowców.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const driverSchedules = useMemo(
    () =>
      selectedDriver
        ? schedules.filter((s) => s.driverId === selectedDriver.id)
        : [],
    [schedules, selectedDriver],
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Zarządzanie kierowcami
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Monitoruj status i harmonogramy kierowców
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-slate-800 border dark:border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Łączna liczba kierowców
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {drivers.length}
                  </p>
                </div>
                <Users className="w-12 h-12 text-blue-600 dark:text-blue-400 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border dark:border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Na służbie
                  </p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {
                      drivers.filter((d) => d.currentStatus === "on-duty")
                        .length
                    }
                  </p>
                </div>
                <Clock className="w-12 h-12 text-green-600 dark:text-green-400 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border dark:border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Dostępni
                  </p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {
                      drivers.filter((d) => d.currentStatus === "available")
                        .length
                    }
                  </p>
                </div>
                <Award className="w-12 h-12 text-blue-600 dark:text-blue-400 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Drivers List */}
          <div className="lg:col-span-1">
            <Card className="bg-white dark:bg-slate-800 border dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Lista kierowców
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {drivers.map((driver) => (
                    <button
                      key={driver.id}
                      onClick={() => setSelectedDriver(driver)}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        selectedDriver?.id === driver.id
                          ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-600"
                          : "bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600"
                      }`}
                    >
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {driver.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {driver.email}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                            driver.currentStatus,
                          )}`}
                        >
                          {getStatusLabel(driver.currentStatus)}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {driver.rating || "—"}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                  {!isLoading && drivers.length === 0 && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Brak kierowców do wyświetlenia
                    </p>
                  )}
                  {errorMessage && (
                    <p className="text-sm text-red-600 dark:text-red-300">
                      {errorMessage}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Driver Details and Schedule */}
          <div className="lg:col-span-2 space-y-6">
            {/* Driver Details */}
            <Card className="bg-white dark:bg-slate-800 border dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Szczegóły kierowcy
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDriver ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Imię i nazwisko
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedDriver.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Status
                        </p>
                        <span
                          className={`inline-block text-sm px-3 py-1 rounded-full ${getStatusColor(
                            selectedDriver.currentStatus,
                          )}`}
                        >
                          {getStatusLabel(selectedDriver.currentStatus)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Email
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedDriver.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Telefon
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedDriver.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Numer prawa jazdy
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedDriver.licenseNumber}
                        </p>
                      </div>
                    </div>

                    <div className="border-t dark:border-slate-700 pt-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Doświadczenie
                          </p>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {selectedDriver.yearsOfExperience || "—"}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            lat
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Godzin pracy
                          </p>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {selectedDriver.totalHours || "—"}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            h
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Data zatrudnienia
                          </p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {new Date(
                              selectedDriver.joiningDate,
                            ).toLocaleDateString("pl-PL")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {selectedDriver.assignedRoutes.length > 0 && (
                      <div className="border-t dark:border-slate-700 pt-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Przypisane trasy
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedDriver.assignedRoutes.map((routeId) => (
                            <span
                              key={routeId}
                              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-sm font-semibold"
                            >
                              {routeId}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Brak danych kierowcy do wyświetlenia
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Driver Schedule */}
            <Card className="bg-white dark:bg-slate-800 border dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Harmonogram
                </CardTitle>
              </CardHeader>
              <CardContent>
                {driverSchedules.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-slate-700">
                          <TableHead className="text-gray-900 dark:text-gray-300">
                            Data
                          </TableHead>
                          <TableHead className="text-gray-900 dark:text-gray-300">
                            Godziny
                          </TableHead>
                          <TableHead className="text-gray-900 dark:text-gray-300">
                            Trasa
                          </TableHead>
                          <TableHead className="text-gray-900 dark:text-gray-300">
                            Status
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {driverSchedules.map((schedule, idx) => (
                          <TableRow
                            key={idx}
                            className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                          >
                            <TableCell className="text-gray-900 dark:text-white">
                              {new Date(schedule.date).toLocaleDateString(
                                "pl-PL",
                              )}
                            </TableCell>
                            <TableCell className="text-gray-900 dark:text-white">
                              {schedule.startTime} - {schedule.endTime}
                            </TableCell>
                            <TableCell className="text-gray-900 dark:text-white font-semibold">
                              {schedule.routeId}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  schedule.status === "completed"
                                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                                    : schedule.status === "in-progress"
                                      ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
                                      : schedule.status === "scheduled"
                                        ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                                }`}
                              >
                                {schedule.status === "completed"
                                  ? "Ukończone"
                                  : schedule.status === "in-progress"
                                    ? "W trakcie"
                                    : schedule.status === "scheduled"
                                      ? "Zaplanowane"
                                      : "Anulowane"}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <AlertCircle className="w-5 h-5 text-gray-400 mr-2" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Brak zaplanowanych tras
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
