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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { fetchJson } from "@/lib/api";

type EmployeeRole = "ADMIN" | "SECRETARY" | "DRIVER";
type EmployeeStatus = "ACTIVE" | "INACTIVE";

interface EmployeeAccount {
  id: number;
  login: string;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  role: EmployeeRole;
  status: EmployeeStatus;
  position: string;
}

const statusToPl = (status: EmployeeStatus) => {
  switch (status) {
    case "ACTIVE":
      return "Aktywny";
    case "INACTIVE":
      return "Nieaktywny";
    default:
      return status;
  }
};

export function AccountsBlock() {
  const [accounts, setAccounts] = useState<EmployeeAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [createFormData, setCreateFormData] = useState({
    login: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "DRIVER" as EmployeeRole,
    position: "Kierowca",
    status: "Aktywny" as "Aktywny" | "Nieaktywny",
  });

  // Minimalna edycja: role/status + dane profilu
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<EmployeeAccount | null>(null);

  const [manageFormData, setManageFormData] = useState({
    role: "DRIVER" as EmployeeRole,
    status: "ACTIVE" as EmployeeStatus,
    position: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const loadAccounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchJson<EmployeeAccount[]>("/api/admin/users/employees");
      setAccounts(data);
    } catch (e: any) {
      setError(e?.message ?? "Nie udało się pobrać kont");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const roleBadge = useMemo(() => {
    const getRoleBadgeColor = (role: EmployeeRole) => {
      switch (role) {
        case "ADMIN":
          return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
        case "SECRETARY":
          return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400";
        case "DRIVER":
          return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400";
        default:
          return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
      }
    };

    const getRoleLabel = (role: EmployeeRole) => {
      const labels: Record<EmployeeRole, string> = {
        ADMIN: "Właściciel",
        SECRETARY: "Sekretarka",
        DRIVER: "Kierowca",
      };
      return labels[role] ?? role;
    };

    return { getRoleBadgeColor, getRoleLabel };
  }, []);

  const openManageDialog = (acc: EmployeeAccount) => {
    setSelectedAccount(acc);
    setManageFormData({
      role: acc.role,
      status: acc.status,
      position: acc.position ?? "",
      firstName: acc.firstName ?? "",
      lastName: acc.lastName ?? "",
      email: acc.email ?? "",
      phone: acc.phone ?? "",
    });
    setIsManageDialogOpen(true);
  };

  const handleCreate = async () => {
    try {
      const backendStatus: EmployeeStatus =
        createFormData.status === "Aktywny" ? "ACTIVE" : "INACTIVE";

      await fetchJson<void>("/api/admin/users/employee", {
        method: "POST",
        body: JSON.stringify({
          login: createFormData.login,
          password: createFormData.password,
          firstName: createFormData.firstName,
          lastName: createFormData.lastName,
          email: createFormData.email,
          phone: createFormData.phone,
          role: createFormData.role,
          position: createFormData.position,
          status: backendStatus,
        }),
      });

      setIsCreateDialogOpen(false);
      setCreateFormData({
        login: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "DRIVER",
        position: "Kierowca",
        status: "Aktywny",
      });

      await loadAccounts();
    } catch (e: any) {
      setError(e?.message ?? "Nie udało się utworzyć konta");
    }
  };

  const handleManageSave = async () => {
    if (!selectedAccount) return;
    try {
      await fetchJson<void>(`/api/admin/users/employees/${selectedAccount.id}`, {
        method: "PUT",
        body: JSON.stringify({
          role: manageFormData.role,
          status: manageFormData.status,
          position: manageFormData.position,
          firstName: manageFormData.firstName,
          lastName: manageFormData.lastName,
          email: manageFormData.email,
          phone: manageFormData.phone,
        }),
      });

      setIsManageDialogOpen(false);
      setSelectedAccount(null);
      await loadAccounts();
    } catch (e: any) {
      setError(e?.message ?? "Nie udało się zapisać zmian");
    }
  };

  const handleDelete = async () => {
    if (!selectedAccount) return;
    try {
      await fetchJson<void>(`/api/admin/users/employees/${selectedAccount.id}`, {
        method: "DELETE",
      });

      setIsManageDialogOpen(false);
      setSelectedAccount(null);
      await loadAccounts();
    } catch (e: any) {
      setError(e?.message ?? "Nie udało się usunąć konta");
    }
  };

  return (
    <Card className="shadow-md dark:shadow-slate-900/50 border dark:border-slate-700">
      <CardHeader className="border-b dark:border-slate-700 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold">
            Zarządzaj Kontami (pracownicy)
          </CardTitle>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Dodaj Konto
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {error && (
          <div className="mb-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        )}

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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-gray-500">
                    Ładowanie...
                  </TableCell>
                </TableRow>
              ) : (
                accounts.map((account) => (
                  <TableRow
                    key={account.id}
                    className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                  >
                    <TableCell className="font-semibold text-gray-900 dark:text-white py-4">
                      {(account.firstName ?? "") + " " + (account.lastName ?? "")}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                      {account.email}
                    </TableCell>
                    <TableCell className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${roleBadge.getRoleBadgeColor(account.role)}`}
                      >
                        {roleBadge.getRoleLabel(account.role)}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${account.status === "ACTIVE"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                          }`}
                      >
                        {statusToPl(account.status)}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300"
                        onClick={() => openManageDialog(account)}
                      >
                        Zarządzaj
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Create dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-white dark:bg-slate-800 border dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Dodaj Nowe Konto (pracownik)
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Login
                </label>
                <input
                  type="text"
                  value={createFormData.login}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, login: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hasło
                </label>
                <input
                  type="password"
                  value={createFormData.password}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      password: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Imię
                </label>
                <input
                  type="text"
                  value={createFormData.firstName}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      firstName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nazwisko
                </label>
                <input
                  type="text"
                  value={createFormData.lastName}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      lastName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={createFormData.email}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Telefon
                </label>
                <input
                  type="text"
                  value={createFormData.phone}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rola
                </label>
                <select
                  value={createFormData.role}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      role: e.target.value as EmployeeRole,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                >
                  <option value="ADMIN">Właściciel</option>
                  <option value="SECRETARY">Sekretarka</option>
                  <option value="DRIVER">Kierowca</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={createFormData.status}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      status: e.target.value as "Aktywny" | "Nieaktywny",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                >
                  <option value="Aktywny">Aktywny</option>
                  <option value="Nieaktywny">Nieaktywny</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pozycja (np. Kierowca/Sekretarka/Właściciel)
              </label>
              <input
                type="text"
                value={createFormData.position}
                onChange={(e) =>
                  setCreateFormData({ ...createFormData, position: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300"
            >
              Anuluj
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
            >
              Dodaj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage dialog */}
      <Dialog
        open={isManageDialogOpen}
        onOpenChange={(v) => {
          setIsManageDialogOpen(v);
          if (!v) setSelectedAccount(null);
        }}
      >
        <DialogContent className="bg-white dark:bg-slate-800 border dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Zarządzaj kontem
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Imię
                </label>
                <input
                  type="text"
                  value={manageFormData.firstName}
                  onChange={(e) =>
                    setManageFormData({
                      ...manageFormData,
                      firstName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nazwisko
                </label>
                <input
                  type="text"
                  value={manageFormData.lastName}
                  onChange={(e) =>
                    setManageFormData({
                      ...manageFormData,
                      lastName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={manageFormData.email}
                  onChange={(e) =>
                    setManageFormData({ ...manageFormData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Telefon
                </label>
                <input
                  type="text"
                  value={manageFormData.phone}
                  onChange={(e) =>
                    setManageFormData({ ...manageFormData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rola
                </label>
                <select
                  value={manageFormData.role}
                  onChange={(e) =>
                    setManageFormData({
                      ...manageFormData,
                      role: e.target.value as EmployeeRole,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                >
                  <option value="ADMIN">Właściciel</option>
                  <option value="SECRETARY">Sekretarka</option>
                  <option value="DRIVER">Kierowca</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={manageFormData.status}
                  onChange={(e) =>
                    setManageFormData({
                      ...manageFormData,
                      status: e.target.value as EmployeeStatus,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                >
                  <option value="ACTIVE">Aktywny</option>
                  <option value="INACTIVE">Nieaktywny</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pozycja
              </label>
              <input
                type="text"
                value={manageFormData.position}
                onChange={(e) =>
                  setManageFormData({
                    ...manageFormData,
                    position: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsManageDialogOpen(false)}
              className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300"
            >
              Zamknij
            </Button>

            <Button
              variant="outline"
              onClick={handleDelete}
              className="border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700"
            >
              Usuń
            </Button>

            <Button
              onClick={handleManageSave}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
            >
              Zapisz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

