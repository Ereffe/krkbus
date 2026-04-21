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

export function TripDataBlock() {
  // Mock data for trips
  const trips = [
    {
      id: 1,
      route: "Kraków - Warszawa",
      departure: "08:00",
      arrival: "11:30",
      distance: "290 km",
      status: "Zaplanowany",
    },
    {
      id: 2,
      route: "Warszawa - Gdańsk",
      departure: "14:00",
      arrival: "18:45",
      distance: "350 km",
      status: "W trakcie",
    },
    {
      id: 3,
      route: "Gdańsk - Kraków",
      departure: "20:00",
      arrival: "00:30",
      distance: "400 km",
      status: "Zaplanowany",
    },
  ];

  return (
    <Card className="border-l-4 border-l-green-500 shadow-lg h-full">
      <CardHeader className="bg-gradient-to-r from-green-50 to-transparent">
        <CardTitle className="text-green-900">
          Sprawdzaj Dane o Przejazdach
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <div className="w-full overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-green-50 hover:bg-green-50">
                <TableHead className="text-green-900 font-semibold">
                  Trasa
                </TableHead>
                <TableHead className="text-green-900 font-semibold">
                  Wyjazd
                </TableHead>
                <TableHead className="text-green-900 font-semibold">
                  Przyjazd
                </TableHead>
                <TableHead className="text-green-900 font-semibold">
                  Dystans
                </TableHead>
                <TableHead className="text-green-900 font-semibold">
                  Status
                </TableHead>
                <TableHead className="text-green-900 font-semibold">
                  Akcje
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell className="font-medium">{trip.route}</TableCell>
                  <TableCell>{trip.departure}</TableCell>
                  <TableCell>{trip.arrival}</TableCell>
                  <TableCell>{trip.distance}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        trip.status === "W trakcie"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {trip.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
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
