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
import { useState } from "react";

export function DriverScheduleBlock() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Mock data for drivers
  const drivers = [
    { id: 1, name: "Jan Kowalski", schedule: "Poniedziałek - Piątek" },
    { id: 2, name: "Anna Nowak", schedule: "Wtorek - Sobota" },
    { id: 3, name: "Piotr Wiśniewski", schedule: "Środa - Niedziela" },
  ];

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
                    key={driver.id}
                    className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                  >
                    <TableCell className="font-semibold text-gray-900 dark:text-white py-4">
                      {driver.name}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                      {driver.schedule}
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
        </div>
      </CardContent>
    </Card>
  );
}
