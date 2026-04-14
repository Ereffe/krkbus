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
    <Card className="border-l-4 border-l-blue-500 shadow-lg h-full">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
        <CardTitle className="text-blue-900">Ustal Grafik Kierowców</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50 hover:bg-blue-50">
                  <TableHead className="text-blue-900 font-semibold">
                    Kierowca
                  </TableHead>
                  <TableHead className="text-blue-900 font-semibold">
                    Aktualny Grafik
                  </TableHead>
                  <TableHead className="text-blue-900 font-semibold">
                    Akcje
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => (
                  <TableRow key={driver.id} className="hover:bg-blue-50">
                    <TableCell className="font-semibold text-gray-900">
                      {driver.name}
                    </TableCell>
                    <TableCell>{driver.schedule}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
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
