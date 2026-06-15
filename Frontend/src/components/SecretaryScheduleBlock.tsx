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
import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";

interface ApiSecretary {
  userID: number;
  position: string;
  login: string;
  role: string;
  status: string;
  profile?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

const fetchJson = async <T,>(url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return null as T;
  }

  const text = await response.text();
  if (!text || text.trim().length === 0) {
    return null as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    // If backend returns non-JSON for 200 responses.
    return null as T;
  }
};

export function SecretaryScheduleBlock() {
  const [secretaries, setSecretaries] = useState<ApiSecretary[]>([]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSecretaryId, setSelectedSecretaryId] = useState<string>("");
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    shiftStartTime: "",
    shiftEndTime: "",
  });


  const loadSecretaries = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchJson<ApiSecretary[]>(
        `${API_BASE_URL}/api/owner/secretary`,
      );
      setSecretaries(data ?? []);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Nie udało się pobrać listy sekretariatu.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSecretaries();
  }, [loadSecretaries]);

  const handleUpdateSchedule = async () => {
    if (!selectedSecretaryId) return;
    if (!formData.fromDate || !formData.toDate) return;
    if (!formData.shiftStartTime || !formData.shiftEndTime) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await fetchJson<void>(
        `${API_BASE_URL}/api/owner/secretary/${selectedSecretaryId}/schedule`,
        {
          method: "PUT",
          body: JSON.stringify({
            fromDate: formData.fromDate,
            toDate: formData.toDate,
            shiftStartTime: formData.shiftStartTime,
            shiftEndTime: formData.shiftEndTime,
          }),
        },
      );

      // For now the table does not show detailed schedule entries; close dialog.
      setFormData({
        fromDate: "",
        toDate: "",
        shiftStartTime: "",
        shiftEndTime: "",
      });
      setSelectedSecretaryId("");
      setIsDialogOpen(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Nie udało się zaktualizować grafiku.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Card className="bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-900/50 border dark:border-slate-700">
      <CardHeader className="border-b dark:border-slate-700 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold">
            Ustaw Grafik Pracy Sekretariatu
          </CardTitle>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Dodaj Sekretarkę
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
            {errorMessage}
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
              {secretaries.map((secretary) => {
                const name = secretary.profile?.firstName
                  ? `${secretary.profile.firstName} ${secretary.profile.lastName ?? ""}`.trim()
                  : `Sekretarz ${secretary.userID}`;

                return (
                  <TableRow
                    key={secretary.userID}
                    className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                  >
                    <TableCell className="font-semibold text-gray-900 dark:text-white py-4">
                      {name}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                      {secretary.profile?.email ?? "—"}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                      {"—"}
                    </TableCell>


                    <TableCell className="text-gray-600 dark:text-gray-400 py-4">
                      {secretary.profile?.phone ?? "—"}
                    </TableCell>
                    <TableCell className="py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSecretaryId(secretary.userID.toString());
                          setIsDialogOpen(true);
                        }}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-900 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-slate-700 dark:hover:text-blue-300"
                      >
                        Edytuj Grafik
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}

              {!isLoading && secretaries.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    Brak sekretariatu do wyświetlenia
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white dark:bg-slate-800 border dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Ustaw grafik sekretarki
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sekretarka
              </label>
              <select
                value={selectedSecretaryId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedSecretaryId(id);
                  setFormData((prev) => ({
                    ...prev,
                  }));

                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                <option value="">Wybierz sekretarkę</option>
                {secretaries.map((s) => {
                  const name = s.profile?.firstName
                    ? `${s.profile.firstName} ${s.profile.lastName ?? ""}`.trim()
                    : `Sekretarka ${s.userID}`;
                  return (
                    <option key={s.userID} value={s.userID.toString()}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data od
                </label>
                <input
                  type="date"
                  value={formData.fromDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, fromDate: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data do
                </label>
                <input
                  type="date"
                  value={formData.toDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, toDate: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Godzina start
                  </label>
                  <input
                    type="time"
                    value={formData.shiftStartTime}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, shiftStartTime: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Godzina koniec
                  </label>
                  <input
                    type="time"
                    value={formData.shiftEndTime}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, shiftEndTime: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                  />
                </div>
              </div>
            </div>

          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300"
            >
              Anuluj
            </Button>
            <Button
              onClick={handleUpdateSchedule}
              disabled={isLoading || !selectedSecretaryId}
              className="bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-600 dark:focus:ring-blue-400/50"
            >
              {isLoading ? "Zapisywanie..." : "Dodaj"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
