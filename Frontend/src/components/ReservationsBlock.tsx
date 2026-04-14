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
    <Card className="border-l-4 border-l-blue-500 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
        <CardTitle className="text-blue-900">
          Przeglądaj Rezerwacje Miejsc
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={selectedRoute === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedRoute("")}
            className={
              selectedRoute === "" ? "bg-blue-600 hover:bg-blue-700" : ""
            }
          >
            Wszystkie
          </Button>
          {routes.map((route) => (
            <Button
              key={route.id}
              variant={selectedRoute === route.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRoute(route.id)}
              className={
                selectedRoute === route.id
                  ? "bg-blue-600 hover:bg-blue-700"
                  : ""
              }
            >
              {route.name}
            </Button>
          ))}
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50 hover:bg-blue-50">
              <TableHead className="text-blue-900 font-semibold">
                Pasażer
              </TableHead>
              <TableHead className="text-blue-900 font-semibold">
                Miejsce
              </TableHead>
              <TableHead className="text-blue-900 font-semibold">
                Trasa
              </TableHead>
              <TableHead className="text-blue-900 font-semibold">
                Data
              </TableHead>
              <TableHead className="text-blue-900 font-semibold">
                Akcje
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReservations.map((reservation) => (
              <TableRow key={reservation.id} className="hover:bg-blue-50">
                <TableCell>{reservation.passenger}</TableCell>
                <TableCell className="font-semibold text-blue-600">
                  {reservation.seat}
                </TableCell>
                <TableCell>
                  {routes.find((r) => r.id === reservation.route)?.name}
                </TableCell>
                <TableCell>{reservation.date}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                  >
                    Szczegóły
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
