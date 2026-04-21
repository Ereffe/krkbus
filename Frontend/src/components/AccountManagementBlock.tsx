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

export function AccountManagementBlock() {
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      name: "Anna Kowalska",
      email: "anna@krkbus.pl",
      role: "Sekretarka",
      status: "Aktywny",
    },
    {
      id: 2,
      name: "Jan Nowak",
      email: "jan@krkbus.pl",
      role: "Kierowca",
      status: "Aktywny",
    },
    {
      id: 3,
      name: "Maria Wiśniewska",
      email: "maria@krkbus.pl",
      role: "Kierowca",
      status: "Nieaktywny",
    },
    {
      id: 4,
      name: "Piotr Zielinski",
      email: "piotr@krkbus.pl",
      role: "Sekretarka",
      status: "Aktywny",
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    email: "",
    role: "Kierowca",
  });

  const handleAddAccount = () => {
    if (newAccount.name && newAccount.email && newAccount.role) {
      setAccounts([
        ...accounts,
        {
          id: accounts.length + 1,
          name: newAccount.name,
          email: newAccount.email,
          role: newAccount.role,
          status: "Aktywny",
        },
      ]);
      setNewAccount({ name: "", email: "", role: "Kierowca" });
      setIsEditing(false);
    }
  };

  const handleToggleStatus = (id: number) => {
    setAccounts(
      accounts.map((account) =>
        account.id === id
          ? {
              ...account,
              status: account.status === "Aktywny" ? "Nieaktywny" : "Aktywny",
            }
          : account,
      ),
    );
  };

  const handleRemoveAccount = (id: number) => {
    setAccounts(accounts.filter((account) => account.id !== id));
  };

  return (
    <Card className="border-l-4 border-l-rose-500 shadow-lg w-full">
      <CardHeader className="bg-gradient-to-r from-rose-50 to-transparent p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl text-rose-900">
          Zarządzaj Kontami
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full p-4 md:p-6 flex flex-col min-h-0">
        <div className="space-y-4 flex-1 overflow-y-auto">
          <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
            <Table className="w-full text-sm md:text-base">
              <TableHeader>
                <TableRow className="bg-rose-50 hover:bg-rose-50">
                  <TableHead className="text-rose-900 font-semibold text-xs md:text-sm">
                    Imię i Nazwisko
                  </TableHead>
                  <TableHead className="text-rose-900 font-semibold text-xs md:text-sm hidden lg:table-cell">
                    Email
                  </TableHead>
                  <TableHead className="text-rose-900 font-semibold text-xs md:text-sm hidden md:table-cell">
                    Rola
                  </TableHead>
                  <TableHead className="text-rose-900 font-semibold text-xs md:text-sm">
                    Status
                  </TableHead>
                  <TableHead className="text-rose-900 font-semibold text-xs md:text-sm">
                    Akcje
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id} className="text-xs md:text-sm">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{account.name}</span>
                        <span className="lg:hidden text-gray-500 text-xs">
                          {account.email}
                        </span>
                        <span className="md:hidden text-gray-500 text-xs">
                          {account.role}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs md:text-sm">
                      {account.email}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {account.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          account.status === "Aktywny"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {account.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 md:gap-2 flex-col sm:flex-row">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
                          onClick={() => handleToggleStatus(account.id)}
                        >
                          {account.status === "Aktywny" ? "Dezakt." : "Akt."}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
                          onClick={() => handleRemoveAccount(account.id)}
                        >
                          Usuń
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Add New Account */}
          <div className="border-t pt-4">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full bg-rose-600 hover:bg-rose-700"
              >
                + Dodaj Nowe Konto
              </Button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Imię i Nazwisko"
                  value={newAccount.name}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, name: e.target.value })
                  }
                  className="w-full px-3 py-2 md:p-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newAccount.email}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, email: e.target.value })
                  }
                  className="w-full px-3 py-2 md:p-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <select
                  value={newAccount.role}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, role: e.target.value })
                  }
                  className="w-full px-3 py-2 md:p-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Kierowca">Kierowca</option>
                  <option value="Sekretarka">Sekretarka</option>
                </select>
                <div className="flex gap-2 flex-col sm:flex-row">
                  <Button
                    onClick={handleAddAccount}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-sm md:text-base py-2 md:py-2.5"
                  >
                    Dodaj
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setNewAccount({ name: "", email: "", role: "Kierowca" });
                    }}
                    variant="outline"
                    className="flex-1 text-sm md:text-base py-2 md:py-2.5"
                  >
                    Anuluj
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
