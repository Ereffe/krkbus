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
    <Card className="shadow-md dark:shadow-slate-900/50 border dark:border-slate-700">
      <CardHeader className="border-b dark:border-slate-700 pb-6">
        <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold">
          Przeglądaj Raporty
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="w-full overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b dark:border-slate-700">
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Tytuł
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Data
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
              {reports.map((report) => (
                <TableRow
                  key={report.id}
                  className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                >
                  <TableCell className="font-semibold text-gray-900 dark:text-white py-4">
                    {report.title}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                    {report.date}
                  </TableCell>
                  <TableCell className="py-4">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        report.status === "Gotowy"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                          : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                      }`}
                    >
                      {report.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      Pobierz
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
