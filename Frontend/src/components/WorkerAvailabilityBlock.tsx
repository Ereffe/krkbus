import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useCallback, useEffect } from "react";
import { Plus, CheckCircle2, XCircle } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

interface ApiAvailability {
    id: number;
    fromDate: string;
    toDate: string;
    status: "AVAILABLE" | "UNAVAILABLE";
    reason?: string;
}

export function WorkerAvailabilityBlock() {
    const [availabilities, setAvailabilities] = useState<ApiAvailability[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [draft, setDraft] = useState({
        fromDate: "",
        toDate: "",
        status: "AVAILABLE",
        reason: "",
    });

    const loadAvailabilities = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/api/worker/availability`, {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            if (res.ok) {
                const data = await res.json();
                setAvailabilities(data ?? []);
            }
        } catch (e) {
            setErrorMessage("Błąd pobierania terminów.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAvailabilities();
    }, [loadAvailabilities]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!draft.fromDate || !draft.toDate) return;

        setIsLoading(true);
        setErrorMessage(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/api/worker/availability`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(draft),
            });

            if (!res.ok) throw new Error("Nie udało się dodać terminu");

            await loadAvailabilities();
            setDraft({ fromDate: "", toDate: "", status: "AVAILABLE", reason: "" });
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Wystąpił błąd");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-900/50 border dark:border-slate-700">
            <CardHeader className="border-b dark:border-slate-700 pb-6">
                <CardTitle className="text-gray-900 dark:text-white text-2xl font-bold">
                    Zgłoś swoją dostępność
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Formularz dodawania */}
                <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-1 bg-gray-50 dark:bg-slate-700/30 p-5 rounded-xl border border-gray-200 dark:border-slate-700">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Nowy termin</h3>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                            <select
                                value={draft.status}
                                onChange={(e) => setDraft({ ...draft, status: e.target.value as "AVAILABLE" | "UNAVAILABLE" })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                            >
                                <option value="AVAILABLE">✅ Dostępny</option>
                                <option value="UNAVAILABLE">❌ Niedostępny (Urlop / L4)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Od</label>
                            <Input type="date" value={draft.fromDate} onChange={(e) => setDraft({ ...draft, fromDate: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Do</label>
                            <Input type="date" value={draft.toDate} onChange={(e) => setDraft({ ...draft, toDate: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Powód / Notatka (opcjonalnie)</label>
                            <Input type="text" placeholder="np. Urlop wypoczynkowy" value={draft.reason} onChange={(e) => setDraft({ ...draft, reason: e.target.value })} />
                        </div>
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Zgłoś termin
                    </Button>
                    {errorMessage && <p className="text-sm text-red-600 mt-2">{errorMessage}</p>}
                </form>

                {/* Tabela zgłoszonych terminów */}
                <div className="lg:col-span-2 overflow-x-auto">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow className="border-b dark:border-slate-700">
                                <TableHead className="text-gray-900 dark:text-white font-semibold">Status</TableHead>
                                <TableHead className="text-gray-900 dark:text-white font-semibold">Data od</TableHead>
                                <TableHead className="text-gray-900 dark:text-white font-semibold">Data do</TableHead>
                                <TableHead className="text-gray-900 dark:text-white font-semibold">Notatka</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {availabilities.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-8 text-center text-gray-500 dark:text-gray-400">Brak zgłoszonych terminów.</TableCell>
                                </TableRow>
                            ) : (
                                availabilities.map((a) => (
                                    <TableRow key={a.id} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                        <TableCell className="py-4">
                                            {a.status === "AVAILABLE" ? (
                                                <span className="flex items-center text-green-600 dark:text-green-400"><CheckCircle2 className="w-4 h-4 mr-2" /> Dostępny</span>
                                            ) : (
                                                <span className="flex items-center text-red-600 dark:text-red-400"><XCircle className="w-4 h-4 mr-2" /> Niedostępny</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-600 dark:text-gray-300">{a.fromDate}</TableCell>
                                        <TableCell className="text-gray-600 dark:text-gray-300">{a.toDate}</TableCell>
                                        <TableCell className="text-gray-600 dark:text-gray-300">{a.reason || "—"}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}