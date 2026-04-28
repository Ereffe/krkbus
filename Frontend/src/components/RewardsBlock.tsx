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

export function RewardsBlock() {
  // Mock data for rewards
  const rewards = [
    {
      id: 1,
      name: "Bilet 50% taniej",
      pointsCost: 500,
      category: "discount",
      available: 150,
    },
    {
      id: 2,
      name: "Bilet bezpłatny",
      pointsCost: 1000,
      category: "ticket",
      available: 50,
    },
    {
      id: 3,
      name: "T-shirt KKBus",
      pointsCost: 300,
      category: "merchandise",
      available: 80,
    },
  ];

  return (
    <Card className="shadow-md dark:shadow-slate-900/50 border dark:border-slate-700">
      <CardHeader className="border-b dark:border-slate-700 pb-6">
        <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold">
          Ustaw Nagrody Za Punkty
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="w-full overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b dark:border-slate-700">
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Nazwa Nagrody
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Kategoria
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Koszty Punktów
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Dostępne
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white font-semibold text-left">
                  Akcje
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rewards.map((reward) => (
                <TableRow
                  key={reward.id}
                  className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                >
                  <TableCell className="font-semibold text-gray-900 dark:text-white py-4">
                    {reward.name}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                    {reward.category}
                  </TableCell>
                  <TableCell className="text-gray-900 dark:text-white font-medium py-4">
                    {reward.pointsCost} pkt
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                    {reward.available}
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
