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

export function AccountsBlock() {
  // Mock data for user accounts
  const accounts = [
    {
      id: 1,
      name: "Jan Kowalski",
      email: "jan.kowalski@example.com",
      role: "user",
      status: "Aktywny",
    },
    {
      id: 2,
      name: "Anna Nowak",
      email: "anna.nowak@example.com",
      role: "secretary",
      status: "Aktywny",
    },
    {
      id: 3,
      name: "Piotr Wiśniewski",
      email: "piotr.wisniewski@example.com",
      role: "user",
      status: "Nieaktywny",
    },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "user":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400";
      case "secretary":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400";
      case "owner":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: { [key: string]: string } = {
      user: "Użytkownik",
      secretary: "Sekretarka",
      owner: "Właściciel",
    };
    return labels[role] || role;
  };

  return (
    <Card className="shadow-md dark:shadow-slate-900/50 border dark:border-slate-700">
      <CardHeader className="border-b dark:border-slate-700 pb-6">
        <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold">
          Zarządzaj Kontami
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
                  Rola
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
              {accounts.map((account) => (
                <TableRow
                  key={account.id}
                  className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                >
                  <TableCell className="font-semibold text-gray-900 dark:text-white py-4">
                    {account.name}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                    {account.email}
                  </TableCell>
                  <TableCell className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(account.role)}`}
                    >
                      {getRoleLabel(account.role)}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        account.status === "Aktywny"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {account.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      Zarządzaj
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
