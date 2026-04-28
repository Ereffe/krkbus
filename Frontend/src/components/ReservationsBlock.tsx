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
import { useState } from "react";

export function ReservationsBlock() {
  const [selectedRoute, setSelectedRoute] = useState<string>("");

  // Mock data for routes
  const routes = [
    { id: "krk-waw", name: "Kraków - Warszawa" },
    { id: "waw-gda", name: "Warszawa - Gdańsk" },
    { id: "krk-gda", name: "Kraków - Gdańsk" },
  ];

  // Mock data for reservations
  const reservations = [
    {
      id: 1,
      passenger: "Jan Kowalski",
      seat: "A1",
      route: "krk-waw",
      date: "2023-10-15",
    },
    {
      id: 2,
      passenger: "Anna Nowak",
      seat: "B2",
      route: "waw-gda",
      date: "2023-10-16",
    },
    {
      id: 3,
      passenger: "Piotr Wiśniewski",
      seat: "C3",
      route: "krk-gda",
      date: "2023-10-17",
    },
  ];

  const filteredReservations = selectedRoute
    ? reservations.filter((res) => res.route === selectedRoute)
    : reservations;

  return (
    <Card className="shadow-md dark:shadow-slate-900/50 border dark:border-slate-700">
      <CardHeader className="border-b dark:border-slate-700 pb-6">
        <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold">
          Przeglądaj Rezerwacje Miejsc
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedRoute("")}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedRoute === ""
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
            }`}
          >
            Wszystkie
          </button>
          {routes.map((route) => (
            <button
              key={route.id}
              onClick={() => setSelectedRoute(route.id)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedRoute === route.id
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
                  Pasażer
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Miejsce
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Trasa
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Data
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Akcje
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
                    {routes.find((r) => r.id === reservation.route)?.name}
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
                      Szczegóły
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
