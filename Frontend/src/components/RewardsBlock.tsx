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

interface Reward {
  id: number;
  name: string;
  pointsCost: number;
  category: string;
  available: number;
}

interface ApiReward {
  rewardID: number;
  name: string;
  pointCost: number;
  availableQuantity: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

const fetchJson = async <T,>(url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
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

  return (await response.json()) as T;
};

export function RewardsBlock() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    pointsCost: "",
    category: "discount",
    available: "",
  });

  const mapApiReward = (reward: ApiReward): Reward => ({
    id: reward.rewardID,
    name: reward.name,
    pointsCost: reward.pointCost,
    category: "discount",
    available: reward.availableQuantity,
  });

  const loadRewards = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchJson<ApiReward[]>(`${API_BASE_URL}/api/rewards`);
      setRewards((data ?? []).map(mapApiReward));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Nie udało się pobrać nagród.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRewards();
  }, [loadRewards]);

  const handleAddReward = async () => {
    if (formData.name && formData.pointsCost && formData.available) {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const createdReward = await fetchJson<ApiReward>(
          `${API_BASE_URL}/api/rewards`,
          {
            method: "POST",
            body: JSON.stringify({
              name: formData.name,
              pointCost: parseInt(formData.pointsCost),
              availableQuantity: parseInt(formData.available),
              clientId: null,
            }),
          },
        );
        setRewards((prev) => [...prev, mapApiReward(createdReward)]);
        setFormData({
          name: "",
          pointsCost: "",
          category: "discount",
          available: "",
        });
        setIsDialogOpen(false);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Nie udało się dodać nagrody.";
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-900/50 border dark:border-slate-700">
      <CardHeader className="border-b dark:border-slate-700 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold">
            Ustaw Nagrody Za Punkty
          </CardTitle>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Dodaj Nagrodę
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
              {!isLoading && rewards.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    Brak nagród do wyświetlenia
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
              Dodaj Nową Nagrodę
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nazwa Nagrody
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                placeholder="np. Bilet 50% taniej"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kategoria
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              >
                <option value="discount">Zniżka</option>
                <option value="ticket">Bilet</option>
                <option value="merchandise">Produkt</option>
                <option value="experience">Doświadczenie</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Koszt Punktów
              </label>
              <input
                type="number"
                value={formData.pointsCost}
                onChange={(e) =>
                  setFormData({ ...formData, pointsCost: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                placeholder="np. 500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dostępne Sztuki
              </label>
              <input
                type="number"
                value={formData.available}
                onChange={(e) =>
                  setFormData({ ...formData, available: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                placeholder="np. 150"
              />
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
              onClick={handleAddReward}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
            >
              {isLoading ? "Zapisywanie..." : "Dodaj"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
