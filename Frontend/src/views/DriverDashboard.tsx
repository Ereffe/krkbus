import { Layout } from "@/components/Layout";
import { mockDrivers, mockDriverSchedules } from "@/data/mockDrivers";
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
import { useState } from "react";

export function DriverDashboard() {
  const [selectedDriver, setSelectedDriver] = useState(mockDrivers[0]);

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

  const driverSchedules = mockDriverSchedules.filter(
    (s) => s.driverId === selectedDriver.id,
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
                    {mockDrivers.length}
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
                      mockDrivers.filter((d) => d.currentStatus === "on-duty")
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
                      mockDrivers.filter((d) => d.currentStatus === "available")
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
                  {mockDrivers.map((driver) => (
                    <button
                      key={driver.id}
                      onClick={() => setSelectedDriver(driver)}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        selectedDriver.id === driver.id
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
                            {driver.rating}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
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
                          {selectedDriver.yearsOfExperience}
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
                          {selectedDriver.totalHours}
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
