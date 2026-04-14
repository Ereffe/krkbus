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

export function ReportsBlock() {
  // Mock data for reports
  const reports = [
    {
      id: 1,
      title: "Raport sprzedaży miesięczny",
      date: "2023-10-01",
      status: "Gotowy",
    },
    {
      id: 2,
      title: "Raport pasażerów",
      date: "2023-10-05",
      status: "W trakcie",
    },
    { id: 3, title: "Raport finansowy", date: "2023-10-10", status: "Gotowy" },
  ];

  return (
    <Card className="border-l-4 border-l-blue-500 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
        <CardTitle className="text-blue-900">Przeglądaj Raporty</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50 hover:bg-blue-50">
              <TableHead className="text-blue-900 font-semibold">
                Tytuł
              </TableHead>
              <TableHead className="text-blue-900 font-semibold">
                Data
              </TableHead>
              <TableHead className="text-blue-900 font-semibold">
                Status
              </TableHead>
              <TableHead className="text-blue-900 font-semibold">
                Akcje
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id} className="hover:bg-blue-50">
                <TableCell className="font-semibold text-gray-900">
                  {report.title}
                </TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      report.status === "Gotowy"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {report.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                  >
                    Pobierz
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
