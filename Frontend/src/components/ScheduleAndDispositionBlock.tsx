import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ScheduleAndDispositionBlock() {
  const [disposition, setDisposition] = useState("");

  // Mock data for work schedule
  const schedule = [
    {
      day: "Poniedziałek",
      start: "08:00",
      end: "16:00",
      route: "Kraków - Warszawa",
    },
    { day: "Wtorek", start: "08:00", end: "16:00", route: "Warszawa - Gdańsk" },
    { day: "Środa", start: "10:00", end: "18:00", route: "Gdańsk - Kraków" },
    {
      day: "Czwartek",
      start: "08:00",
      end: "16:00",
      route: "Kraków - Warszawa",
    },
    {
      day: "Piątek",
      start: "08:00",
      end: "16:00",
      route: "Warszawa - Wrocław",
    },
  ];

  const handleDispositionSubmit = () => {
    if (disposition.trim()) {
      alert(`Dyspozycja wysłana: ${disposition}`);
      setDisposition("");
    }
  };

  return (
    <Card className="border-l-4 border-l-purple-500 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent">
        <CardTitle className="text-purple-900">
          Grafik Pracy & Dyspozycje
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <div className="space-y-6">
          {/* Schedule Table */}
          <div>
            <h3 className="text-sm font-semibold text-purple-900 mb-3">
              Twój Grafik
            </h3>
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-purple-50 hover:bg-purple-50">
                    <TableHead className="text-purple-900 font-semibold">
                      Dzień
                    </TableHead>
                    <TableHead className="text-purple-900 font-semibold">
                      Początek
                    </TableHead>
                    <TableHead className="text-purple-900 font-semibold">
                      Koniec
                    </TableHead>
                    <TableHead className="text-purple-900 font-semibold">
                      Trasa
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedule.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{item.day}</TableCell>
                      <TableCell>{item.start}</TableCell>
                      <TableCell>{item.end}</TableCell>
                      <TableCell>{item.route}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Disposition Section */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold text-purple-900 mb-3">
              Prześlij Dyspozycję
            </h3>
            <div className="space-y-3">
              <textarea
                value={disposition}
                onChange={(e) => setDisposition(e.target.value)}
                placeholder="Np. niedostępny w poniedziałek, chory itp..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={4}
              />
              <Button
                onClick={handleDispositionSubmit}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Wyślij Dyspozycję
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
