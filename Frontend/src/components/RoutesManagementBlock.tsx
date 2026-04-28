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

export function RoutesManagementBlock() {
  // Mock data for routes management
  const routes = [
    {
      id: 1,
      number: "1",
      name: "Kraków - Warszawa",
      distance: "280 km",
      frequency: "Co 2 godziny",
      stops: 8,
      status: "Aktywna",
    },
    {
      id: 2,
      number: "2",
      name: "Warszawa - Gdańsk",
      distance: "340 km",
      frequency: "Co 3 godziny",
      stops: 6,
      status: "Aktywna",
    },
    {
      id: 3,
      number: "3",
      name: "Kraków - Gdańsk",
      distance: "620 km",
      frequency: "Codziennie",
      stops: 12,
      status: "Nieaktywna",
    },
  ];

  const getStatusBadgeColor = (status: string) => {
    return status === "Aktywna"
      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
  };

  return (
    <Card className="shadow-md dark:shadow-slate-900/50 border dark:border-slate-700">
      <CardHeader className="border-b dark:border-slate-700 pb-6">
        <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold">
          Ustaw Trasy
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="w-full overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b dark:border-slate-700">
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Linia
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Nazwa Trasy
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Dystans
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Częstotliwość
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-center">
                  Przystanków
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Status
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Akcje
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow
                  key={route.id}
                  className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                >
                  <TableCell className="font-bold text-blue-600 dark:text-blue-400 py-4">
                    {route.number}
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900 dark:text-white py-4">
                    {route.name}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                    {route.distance}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                    {route.frequency}
                  </TableCell>
                  <TableCell className="text-gray-900 dark:text-white font-medium text-center py-4">
                    {route.stops}
                  </TableCell>
                  <TableCell className="py-4">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${getStatusBadgeColor(
                        route.status,
                      )}`}
                    >
                      {route.status}
                    </span>
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
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
