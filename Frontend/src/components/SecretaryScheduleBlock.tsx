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

export function SecretaryScheduleBlock() {
  // Mock data for secretary schedules
  const secretaries = [
    {
      id: 1,
      name: "Maria Kowalska",
      email: "maria@example.com",
      schedule: "Poniedziałek - Piątek 8:00-16:00",
      phone: "555-0001",
    },
    {
      id: 2,
      name: "Zofia Nowak",
      email: "zofia@example.com",
      schedule: "Poniedziałek - Piątek 16:00-22:00",
      phone: "555-0002",
    },
    {
      id: 3,
      name: "Barbara Wiśniewski",
      email: "barbara@example.com",
      schedule: "Sobota - Niedziela 8:00-16:00",
      phone: "555-0003",
    },
  ];

  return (
    <Card className="shadow-md dark:shadow-slate-900/50 border dark:border-slate-700">
      <CardHeader className="border-b dark:border-slate-700 pb-6">
        <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold">
          Ustaw Grafik Pracy Sekretariatu
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="w-full overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b dark:border-slate-700">
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Imię i Nazwisko
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Email
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Aktualny Grafik
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Telefon
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Akcje
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {secretaries.map((secretary) => (
                <TableRow
                  key={secretary.id}
                  className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                >
                  <TableCell className="font-semibold text-gray-900 dark:text-white py-4">
                    {secretary.name}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                    {secretary.email}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                    {secretary.schedule}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                    {secretary.phone}
                  </TableCell>
                  <TableCell className="py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      Edytuj Grafik
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
