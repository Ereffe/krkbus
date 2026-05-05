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

export function PricingBlock() {
  // Mock data for pricing
  const routePricing = [
    {
      id: 1,
      route: "Kraków - Warszawa",
      normalTicket: 45.0,
      studentTicket: 22.5,
      seniorTicket: 22.5,
      distance: "280 km",
    },
    {
      id: 2,
      route: "Warszawa - Gdańsk",
      normalTicket: 55.0,
      studentTicket: 27.5,
      seniorTicket: 27.5,
      distance: "340 km",
    },
    {
      id: 3,
      route: "Kraków - Gdańsk",
      normalTicket: 95.0,
      studentTicket: 47.5,
      seniorTicket: 47.5,
      distance: "620 km",
    },
  ];

  return (
    <Card className="shadow-md dark:shadow-slate-900/50 border dark:border-slate-700">
      <CardHeader className="border-b dark:border-slate-700 pb-6">
        <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold">
          Ustaw Ceny
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="w-full overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b dark:border-slate-700">
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Trasa
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Dystans
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-center">
                  Normalny
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-center">
                  Student
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-center">
                  Senior
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Akcje
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routePricing.map((pricing) => (
                <TableRow
                  key={pricing.id}
                  className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                >
                  <TableCell className="font-semibold text-gray-900 dark:text-white py-4">
                    {pricing.route}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                    {pricing.distance}
                  </TableCell>
                  <TableCell className="text-gray-900 dark:text-white font-medium text-center py-4">
                    {pricing.normalTicket.toFixed(2)} zł
                  </TableCell>
                  <TableCell className="text-gray-900 dark:text-white font-medium text-center py-4">
                    {pricing.studentTicket.toFixed(2)} zł
                  </TableCell>
                  <TableCell className="text-gray-900 dark:text-white font-medium text-center py-4">
                    {pricing.seniorTicket.toFixed(2)} zł
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
