import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useT } from "@/i18n";

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
  totalHours: number;
  yearsOfExperience: number;
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

export function DriverPortal() {
  const t = useT();

  const [drivers, setDrivers] = useState<UiDriver[]>([]);
  const [schedules, setSchedules] = useState<UiDriverSchedule[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [availability, setAvailability] = useState<"available" | "unavailable">(
    "available",
  );
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const mapDriver = (driver: ApiDriver): UiDriver => {
    const name = driver.profile?.firstName
      ? `${driver.profile.firstName} ${driver.profile.lastName ?? ""}`.trim()
      : `${t("app.driver.driverLabel")} ${driver.userID}`;
    return {
      id: driver.userID.toString(),
      name,
      email: driver.profile?.email ?? "—",
      phone: driver.profile?.phone ?? "—",
      licenseNumber: "—",
      totalHours: 0,
      yearsOfExperience: 0,
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
    setErrorMessage(null);
    try {
      const [driversData, schedulesData] = await Promise.all([
        fetchJson<ApiDriver[]>(`${API_BASE_URL}/api/drivers`),
        fetchJson<ApiScheduleEntry[]>(`${API_BASE_URL}/api/schedules`),
      ]);
      setDrivers((driversData ?? []).map(mapDriver));
      setSchedules((schedulesData ?? []).map(mapSchedule));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : t("app.driver.error.fetchData");
      setErrorMessage(message);
    } finally {
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const currentDriver = drivers[0];
  const driverSchedules = useMemo(
    () =>
      currentDriver
        ? schedules.filter((s) => s.driverId === currentDriver.id)
        : [],
    [currentDriver, schedules],
  );

  const todaysTrips = driverSchedules.filter((s) => s.date === selectedDate);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300";
      case "in-progress":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300";
      case "scheduled":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return t("app.driver.status.completed");
      case "in-progress":
        return t("app.driver.status.inProgress");
      case "scheduled":
        return t("app.driver.status.scheduled");
      case "cancelled":
        return t("app.driver.status.cancelled");
      default:
        return status;
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header with Welcome */}
        <div className="bg-linear-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 rounded-lg shadow-lg p-8 text-white">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {t("app.driver.welcome")}, {currentDriver ? currentDriver.name : t("app.driver.driverPlaceholder")}!
            </h1>
            <p className="text-blue-100">
              {t("app.driver.subtitle")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Driver Info & Availability */}
          <div className="space-y-6">
            {/* Personal Data */}
            <Card className="bg-white dark:bg-slate-800 border dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t("app.driver.myData")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentDriver ? (
                  <>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase">
                        {t("app.driver.fullName")}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {currentDriver.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {t("app.driver.email")}
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white break-all">
                          {currentDriver.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {t("app.driver.phone")}
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {currentDriver.phone}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase">
                        {t("app.driver.licenseNumber")}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {currentDriver.licenseNumber}
                      </p>
                    </div>

                    <div className="border-t dark:border-slate-700 pt-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase mb-2">
                        {t("app.driver.experience")}
                      </p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {currentDriver.yearsOfExperience || "—"} {t("app.driver.years")}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("app.driver.totalHours")} {currentDriver.totalHours || "—"} {t("app.driver.workHours")}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t("app.driver.noData")}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Availability Status */}
            <Card className="bg-white dark:bg-slate-800 border dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {t("app.driver.availability")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {t("app.driver.currentStatus")}
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${availability === "available"
                          ? "bg-green-500"
                          : "bg-red-500"
                        }`}
                    />
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {availability === "available"
                        ? t("app.driver.available")
                        : t("app.driver.unavailable")}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => setAvailability("available")}
                    className={`w-full py-2 rounded-lg font-semibold transition ${availability === "available"
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-200 dark:bg-slate-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-500"
                      }`}
                  >
                    <CheckCircle className="w-4 h-4 mr-2 inline" />
                    {t("app.driver.available")}
                  </Button>
                  <Button
                    onClick={() => setAvailability("unavailable")}
                    className={`w-full py-2 rounded-lg font-semibold transition ${availability === "unavailable"
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-gray-200 dark:bg-slate-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-500"
                      }`}
                  >
                    <AlertCircle className="w-4 h-4 mr-2 inline" />
                    {t("app.driver.unavailable")}
                  </Button>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  ℹ️ {t("app.driver.availabilityInfo")}
                </p>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="bg-white dark:bg-slate-800 border dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  {t("app.driver.statistics")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t("app.driver.routesToday")}
                  </span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {todaysTrips.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t("app.driver.completed")}
                  </span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {
                      driverSchedules.filter((s) => s.status === "completed")
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t("app.driver.inProgress")}
                  </span>
                  <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {
                      driverSchedules.filter((s) => s.status === "in-progress")
                        .length
                    }
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Schedule & Trips */}
          <div className="lg:col-span-2 space-y-6">
            {/* Schedule Calendar */}
            <Card className="bg-white dark:bg-slate-800 border dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {t("app.driver.chooseDate")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-blue-600 dark:focus:border-blue-400 focus:outline-none"
                />
              </CardContent>
            </Card>

            {/* Today's/Selected Date Trips */}
            <Card className="bg-white dark:bg-slate-800 border dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {t("app.driver.routesOn")} {new Date(selectedDate).toLocaleDateString("pl-PL")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todaysTrips.length > 0 ? (
                  <div className="space-y-4">
                    {todaysTrips.map((trip, idx) => (
                      <div
                        key={idx}
                        className="p-4 border-l-4 border-blue-600 dark:border-blue-400 bg-gray-50 dark:bg-slate-700 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {t("app.driver.route")} {trip.routeId}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {trip.startTime} - {trip.endTime}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                              trip.status,
                            )}`}
                          >
                            {getStatusLabel(trip.status)}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          {trip.status === "scheduled" && (
                            <>
                              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2">
                                {t("app.driver.accept")}
                              </Button>
                              <Button className="flex-1 bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500 text-gray-900 dark:text-white text-sm py-2">
                                {t("app.driver.decline")}
                              </Button>
                            </>
                          )}
                          {trip.status === "in-progress" && (
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2">
                              {t("app.driver.finishRoute")}
                            </Button>
                          )}
                          {trip.status === "completed" && (
                            <Button
                              disabled
                              className="w-full bg-green-200 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm py-2"
                            >
                              {t("app.driver.status.completed")}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {t("app.driver.noRoutesOnDate")}
                    </p>
                  </div>
                )}
                {errorMessage && (
                  <p className="mt-4 text-sm text-red-600 dark:text-red-300">
                    {errorMessage}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* All Trips Table */}
            <Card className="bg-white dark:bg-slate-800 border dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {t("app.driver.allScheduledRoutes")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-slate-700">
                        <TableHead className="text-gray-900 dark:text-gray-300">
                          {t("app.driver.date")}
                        </TableHead>
                        <TableHead className="text-gray-900 dark:text-gray-300">
                          {t("app.driver.hours")}
                        </TableHead>
                        <TableHead className="text-gray-900 dark:text-gray-300">
                          {t("app.driver.routeLabel")}
                        </TableHead>
                        <TableHead className="text-gray-900 dark:text-gray-300">
                          {t("app.driver.statusLabel")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {driverSchedules.map((trip, idx) => (
                        <TableRow
                          key={idx}
                          className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                        >
                          <TableCell className="text-gray-900 dark:text-white">
                            {new Date(trip.date).toLocaleDateString("pl-PL")}
                          </TableCell>
                          <TableCell className="text-gray-900 dark:text-white">
                            {trip.startTime} - {trip.endTime}
                          </TableCell>
                          <TableCell className="text-gray-900 dark:text-white font-semibold">
                            {trip.routeId}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                                trip.status,
                              )}`}
                            >
                              {getStatusLabel(trip.status)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
